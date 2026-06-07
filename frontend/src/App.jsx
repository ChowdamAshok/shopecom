import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AnalyticsPage from './pages/admin/AnalyticsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Main Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/product/ProductsPage'
import ProductDetailPage from './pages/product/ProductDetailPage'
import CartPage from './pages/cart/CartPage'
import OrdersPage from './pages/order/OrdersPage'
import CheckoutPage from './pages/order/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from './pages/ProfilePage'
import OrderTrackingPage from './pages/order/OrderTrackingPage'
import AdminPage from './pages/admin/AdminPage'

// Layout & AI
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AIChatbot from './components/common/AIChatbot'
import BackToTop from './components/common/BackToTop'

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:orderId/track" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <AIChatbot />
      <BackToTop />
    </div>
  )
}

// 404 Page
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you are looking for doesn't exist.</p>
      <a href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
        Go Home
      </a>
    </div>
  )
}

export default App