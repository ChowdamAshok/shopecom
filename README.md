<div align="center">

# 🛒 ShopEcom

### AI-Powered Full Stack E-Commerce Platform

> 👨‍💻 **Developer Portfolio:** [chowdamashok.github.io/My-Portfolio](https://chowdamashok.github.io/My-Portfolio/)

**[🌐 Live Demo](https://shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app/)** &nbsp;|&nbsp; **[👨‍💻 Portfolio](https://chowdamashok.github.io/My-Portfolio/)** &nbsp;|&nbsp; **[🚀 Backend](https://shopecom-backend.onrender.com)**

</div>

---

## 📌 Overview

**ShopEcom** is a production-grade, AI-powered e-commerce platform built with a modern full-stack architecture. It combines **Spring Boot**, **React.js**, and **Groq's Llama 3.3** to deliver an intelligent, seamless shopping experience — inspired by platforms like Flipkart and Amazon, but enhanced with cutting-edge AI capabilities.

🔗 **Live Demo:** [https://shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app/](https://shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app/)

---

## 🛠️ Tech Stack

### 🔵 Backend
| Technology | Version | Purpose |
|---|---|---|
| **Java** | 21 LTS | Core language |
| **Spring Boot** | 4.0.6 | Backend framework |
| **Spring Security** | Latest | Auth & authorization |
| **Spring Data JPA** | Latest | ORM / database layer |
| **JWT (jjwt)** | 0.11.5 | Token-based auth |
| **Lombok** | 1.18.38 | Boilerplate reduction |
| **Maven** | 3.9.x | Build tool |

### 🟢 Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 19.x | UI framework |
| **Vite** | 8.x | Build tool |
| **Redux Toolkit** | Latest | State management |
| **React Router** | Latest | Client-side routing |
| **Tailwind CSS** | 4.x | Styling |
| **Axios** | Latest | HTTP client |
| **Recharts** | Latest | Analytics charts |
| **React Hook Form + Zod** | Latest | Form validation |

### 🟣 AI & Database
| Technology | Purpose |
|---|---|
| **Groq Llama 3.3-70B** | AI chatbot, smart search, review summarizer |
| **Neon DB (PostgreSQL)** | Cloud database — free tier |

### 🟠 Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **GitHub** | Version control |

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse products with advanced filters, sorting, and pagination
- **Smart Search** — Regular and AI-powered natural language product search
- **Product Details** — High-quality images with zoom, descriptions, and stock status
- **Shopping Cart** — Real-time cart with quantity management and order summary
- **Wishlist** — Save favourite products for later
- **Related Products** — Discover similar items on every product page

### 🤖 AI Features (Powered by Groq Llama 3.3)
- **AI Shopping Chatbot** — 24/7 intelligent assistant available on every page
- **AI Smart Search** — Natural language search (e.g. *"red phone under ₹20,000"*)
- **AI Review Summarizer** — Instant pros, cons & verdict from customer reviews
- **AI Description Generator** — Auto-generate compelling product descriptions

### 🔐 User Features
- **Authentication** — JWT-based secure login & registration with refresh tokens
- **User Profile** — Edit profile, change password, manage multiple addresses
- **Order Tracking** — Visual timeline showing real-time order status
- **Order History** — Complete history with expandable order details
- **Reviews & Ratings** — Star ratings with comments; edit and delete support

### ⚙️ Admin Features
- **Order Management** — View and update order status across 7 stages
- **Product Management** — Full CRUD with image URL support
- **Category Management** — Create and manage product categories
- **Analytics Dashboard** — Revenue charts, top products, monthly trends, and order statistics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React.js Frontend                        │
│         Redux Toolkit │ Axios │ Tailwind CSS                │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────▼────────────────────────────────────┐
│                 Spring Boot Backend                         │
│    Controller → Service → Repository → JPA/Hibernate        │
│    Spring Security (JWT) │ BCrypt │ CORS                    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴──────────────────┐
         ▼                                  ▼
┌────────────────┐                ┌─────────────────┐
│   Neon DB      │                │   Groq AI API   │
│  PostgreSQL    │                │  Llama 3.3-70b  │
│  (Cloud)       │                │  (Free Tier)    │
└────────────────┘                └─────────────────┘
```

---

## 🗄️ Database Schema

**Tables:** `users`, `products`, `categories`, `orders`, `order_items`, `cart_items`, `payments`, `reviews`, `wishlists`, `addresses`

```
users
  ├── orders ──── order_items ──── products ──── categories
  │      └── payments                  └── reviews
  ├── cart_items
  ├── wishlists ──── products
  └── addresses
```

---

## 📁 Project Structure

```
shopecom/
├── backend/                              # Spring Boot Application
│   ├── src/main/java/com/ecom/backend/
│   │   ├── config/                       # Security, CORS configuration
│   │   ├── controller/                   # REST API controllers
│   │   ├── dto/
│   │   │   ├── request/                  # Request DTOs
│   │   │   └── response/                 # Response DTOs
│   │   ├── entity/                       # JPA entities
│   │   ├── enums/                        # Role, OrderStatus, etc.
│   │   ├── exception/                    # Custom exceptions
│   │   ├── repository/                   # Spring Data repositories
│   │   ├── security/
│   │   │   ├── jwt/                      # JWT utilities
│   │   │   └── filter/                   # JWT auth filter
│   │   └── service/impl/                 # Service implementations
│   ├── Dockerfile
│   └── pom.xml
│
└── frontend/                             # React Application
    ├── src/
    │   ├── api/                          # Axios instances & API calls
    │   ├── components/
    │   │   ├── common/                   # AIChatbot, BackToTop
    │   │   ├── layout/                   # Navbar, Footer
    │   │   └── product/                  # ReviewSection, RelatedProducts
    │   ├── pages/
    │   │   ├── auth/                     # Login, Register
    │   │   ├── product/                  # Products, ProductDetail
    │   │   ├── cart/                     # Cart
    │   │   ├── order/                    # Orders, Checkout, Tracking
    │   │   ├── admin/                    # Admin, Analytics
    │   │   └── ...                       # Home, Wishlist, Profile
    │   └── store/slices/                 # Redux slices
    ├── vercel.json
    └── package.json
```

---

## 🔌 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT |
| `GET` | `/api/products` | Public | Get all products |
| `GET` | `/api/products/search` | Public | Search products |
| `GET` | `/api/categories` | Public | Get categories |
| `POST` | `/api/cart` | User | Add to cart |
| `POST` | `/api/orders` | User | Place order |
| `GET` | `/api/orders` | User | Get my orders |
| `GET` | `/api/reviews/product/:id` | Public | Get reviews |
| `POST` | `/api/wishlist/:id` | User | Add to wishlist |
| `GET` | `/api/orders/all` | Admin | All orders |
| `PATCH` | `/api/orders/:id/status` | Admin | Update order status |

---

## 🔒 Security

- **JWT Authentication** — Access token (24h) + Refresh token (7 days)
- **BCrypt** — Password hashing with salt rounds
- **Role-Based Access Control** — `ROLE_USER`, `ROLE_ADMIN`, `ROLE_SELLER`
- **CORS** — Configured for production frontend URL
- **Input Validation** — Jakarta Bean Validation on all DTOs
- **Optimistic Locking** — Prevents overselling on concurrent orders
- **Soft Deletes** — Data preserved with `deleted_at` timestamp

---

## 🚀 Local Setup

### Prerequisites
```
Java 21+
Node.js 22+
Maven 3.9+
Git
```

### 1. Clone the Repository
```bash
git clone https://github.com/chowdamashok/shopecom.git
cd shopecom
```

### 2. Backend Setup

```bash
cd backend
```

Create `src/main/resources/application.properties`:
```properties
server.port=8080
spring.datasource.url=your_neon_db_url
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=your_jwt_secret
jwt.expiration=86400000
jwt.refresh-expiration=604800000
```

Run the backend:
```bash
mvn spring-boot:run
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GROQ_API_KEY=your_groq_api_key
```

Run the frontend:
```bash
npm run dev
```

### 4. Open in Browser
```
Frontend → http://localhost:5173
Backend  → http://localhost:8080
```

---

## 🌐 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | [shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app](https://shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app/) |
| Backend | Render | [shopecom-backend.onrender.com](https://shopecom-backend.onrender.com) |
| Database | Neon DB | Managed Cloud PostgreSQL |
| AI | Groq Cloud | api.groq.com |

---

## 🗺️ Pages & Routes

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Products | `/products` | Public |
| Product Detail | `/products/:id` | Public |
| Cart | `/cart` | User |
| Checkout | `/checkout` | User |
| Orders | `/orders` | User |
| Order Tracking | `/orders/:id/track` | User |
| Wishlist | `/wishlist` | User |
| Profile | `/profile` | User |
| Admin Dashboard | `/admin` | Admin |
| Analytics | `/analytics` | Admin |

---

## 🔮 Roadmap

- [ ] **Razorpay Integration** — Real payment gateway for India
- [ ] **Email Notifications** — Order confirmation & shipping updates
- [ ] **Redis Caching** — Performance optimization
- [ ] **PWA Support** — Offline mode & push notifications
- [ ] **Multi-vendor** — Seller dashboards & commission management
- [ ] **Kafka Events** — Async order processing
- [ ] **Rate Limiting** — Bucket4j API protection

---

## 👨‍💻 Developer

<div align="center">

**Chowdam Ashok**
*Full Stack Developer | Java · Spring Boot · React.js · AI Integration*

**[🌐 Portfolio](https://chowdamashok.github.io/My-Portfolio/)** &nbsp;|&nbsp; **[💻 GitHub](https://github.com/chowdamashok)**

</div>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!**

Made with ❤️ in India &nbsp;|&nbsp; Powered by AI 🤖

**[🌐 Try It Live → ShopEcom](https://shopecom-20bi88owa-chowdam-ashok-s-projects.vercel.app/)**

</div>
