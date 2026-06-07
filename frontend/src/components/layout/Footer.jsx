import { Link } from 'react-router-dom'
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 min-h-[300px]">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={24} className="text-indigo-400" />
              <span className="text-xl font-bold text-white">ShopEcom</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop shop for the latest trends at unbeatable prices.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-400" />
                <span>support@shopecom.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-indigo-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-400" />
                <span>Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Cart', to: '/cart' },
                { label: 'Orders', to: '/orders' },
                { label: 'Wishlist', to: '/wishlist' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-indigo-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'Profile', to: '/profile' },
                { label: 'Track Order', to: '/orders' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-indigo-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold mb-4">Policies</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Return Policy',
                'Shipping Policy',
                'FAQ',
              ].map((item) => (
                <li key={item}>
                  <span className="hover:text-indigo-400 transition cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 ShopEcom. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with ❤️ in India</span>
            <span>•</span>
            <span>Powered by AI 🤖</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer