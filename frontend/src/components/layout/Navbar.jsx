import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Menu,
  X,
  LayoutDashboard,
  Heart,
  TrendingUp,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { logout } from "../../store/slices/authSlice";
import { productApi } from "../../api/productApi";
import toast from "react-hot-toast";

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await productApi.search(query, 0, 5);
        setSuggestions(response.data.data.content);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (product) => {
    setQuery("");
    setShowSuggestions(false);
    navigate(`/products/${product.id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${query}`);
      setQuery("");
    }
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      <form onSubmit={handleSearch} className="flex items-center relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search products..."
          className="border border-gray-200 rounded-full px-4 py-2 text-sm w-[320px] xl:w-107 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-3 text-gray-400 hover:text-indigo-600"
        >
          <Search size={16} />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          )}
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-indigo-50 transition text-left"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag size={14} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-indigo-600">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 text-left border-t"
          >
            See all results for &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600 shrink-0"
        >
          ShopEcom
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-shrink-0">
  <SearchBar />
</div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <Link
            to="/products"
            className="text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base"
          >
            Products
          </Link>

          {user && (
            <Link
              to="/orders"
              className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm lg:text-base"
            >
              <Package size={16} /> Orders
            </Link>
          )}

          {user && (
            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm lg:text-base"
            >
              <Heart size={16} /> Wishlist
            </Link>
          )}

          {user?.role === "ROLE_ADMIN" && (
            <Link
              to="/admin"
              className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm lg:text-base"
            >
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          {user?.role === "ROLE_ADMIN" && (
            <Link
              to="/analytics"
              className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm lg:text-base"
            >
              <TrendingUp size={16} /> Analytics
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-indigo-600"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm lg:text-base"
              >
                <User size={16} />{" "}
                <span className="hidden lg:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm lg:text-base"
              >
                <LogOut size={16} />{" "}
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm lg:text-base"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex xl:hidden items-center gap-5 ml-auto">
          <Link to="/cart" className="relative text-gray-600">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {menuOpen && (
        <div className="md:hidden px-4 py-2 border-t border-gray-100">
          <input
            placeholder="Search products..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                window.location.href = `/products?search=${e.target.value}`;
                setMenuOpen(false);
              }
            }}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="xl:hidden bg-white border-t px-4 py-4 flex flex-col gap-2 shadow-lg">
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 font-medium py-1"
          >
            Products
          </Link>
          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 font-medium py-1"
              >
                Orders
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 font-medium py-1"
              >
                Wishlist
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 font-medium py-1"
              >
                Profile
              </Link>
              {user?.role === "ROLE_ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 font-medium py-1"
                >
                  Admin Dashboard
                </Link>
              )}
              {user?.role === "ROLE_ADMIN" && (
                <Link
                  to="/analytics"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 font-medium py-1"
                >
                  Analytics
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium text-left py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 font-medium py-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 font-medium py-1"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
