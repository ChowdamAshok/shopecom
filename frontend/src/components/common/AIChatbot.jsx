import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { groqApi } from '../../api/groqApi'
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react'

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI shopping assistant. I can help you find products, track orders, and answer questions. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useSelector((state) => state.auth)
  const { products, categories } = useSelector((state) => state.product)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const systemPrompt = `You are a helpful AI shopping assistant for ShopEcom, an Indian e-commerce platform.

Current user: ${user ? user.name : 'Guest'}

Available categories: ${categories.map((c) => c.name).join(', ')}

Available products (sample): ${products
    .slice(0, 20)
    .map((p) => `${p.name} (₹${p.price}, ${p.categoryName})`)
    .join(', ')}

Your responsibilities:
- Help users find products
- Answer questions about products, orders, shipping
- Give product recommendations
- Be friendly, concise, and helpful
- Always respond in 2-3 sentences max
- Use Indian context (₹ for prices, Indian cities for shipping)
- If asked about specific orders, tell them to check the Orders page

Do NOT make up products that don't exist in the list above.`

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const conversationHistory = [...messages, userMessage].slice(-10)
      const response = await groqApi.chat(conversationHistory, systemPrompt)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again!' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'What products do you have?',
    'Help me find a gift',
    'How do I track my order?',
    'What are your best deals?',
  ]

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">ShopEcom AI Assistant</p>
              <p className="text-indigo-200 text-xs">Powered by Groq Llama 3.3</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-100' : 'bg-indigo-600'
                }`}>
                  {msg.role === 'user'
                    ? <User size={14} className="text-indigo-600" />
                    : <Bot size={14} className="text-white" />
                  }
                </div>
                <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <Loader size={14} className="text-indigo-600 animate-spin" />
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot