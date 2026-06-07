import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = 'llama-3.3-70b-versatile';

export const groqApi = {

  // AI Chatbot
  chat: async (messages, systemPrompt) => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  },

  // AI Review Summarizer
  summarizeReviews: async (reviews, productName) => {
    const reviewText = reviews
      .map((r) => `Rating: ${r.rating}/5 - ${r.comment || 'No comment'}`)
      .join('\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes product reviews. Always respond in JSON format only.',
        },
        {
          role: 'user',
          content: `Summarize these reviews for "${productName}" in JSON format with keys: "summary" (2 sentences), "pros" (array of 3 max), "cons" (array of 3 max), "verdict" (one word: Excellent/Good/Average/Poor).\n\nReviews:\n${reviewText}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  },

  // AI Description Generator
  generateDescription: async (productName, category, price) => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce copywriter. Write compelling product descriptions.',
        },
        {
          role: 'user',
          content: `Write a compelling 2-3 sentence product description for: "${productName}" in category "${category}" priced at ₹${price}. Make it engaging and highlight key benefits. No bullet points.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });
    return response.choices[0].message.content;
  },

  // AI Smart Search
  smartSearch: async (query, products) => {
    const productList = products
      .slice(0, 50)
      .map((p) => `ID:${p.id} Name:${p.name} Price:₹${p.price} Category:${p.categoryName}`)
      .join('\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a product search assistant. Return only a JSON array of product IDs that match the query. No explanation.',
        },
        {
          role: 'user',
          content: `Query: "${query}"\n\nProducts:\n${productList}\n\nReturn JSON array of matching product IDs like: [1, 2, 3]`,
        },
      ],
      max_tokens: 100,
      temperature: 0.1,
    });
    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean);
  },

  // AI Recommendations
  getRecommendations: async (currentProduct, allProducts) => {
    const productList = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, 30)
      .map((p) => `ID:${p.id} Name:${p.name} Price:₹${p.price} Category:${p.categoryName}`)
      .join('\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a product recommendation engine. Return only a JSON array of product IDs.',
        },
        {
          role: 'user',
          content: `Current product: "${currentProduct.name}" (${currentProduct.categoryName})\n\nAvailable products:\n${productList}\n\nReturn 4 most relevant product IDs as JSON array: [1, 2, 3, 4]`,
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    });
    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean);
  },
};