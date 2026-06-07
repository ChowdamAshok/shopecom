import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  Users,
  Star,
  Award,
} from "lucide-react";

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-64">
      <div className="skeleton h-36 sm:h-44 md:h-48 w-full" />
      <div className="p-3 md:p-4 flex flex-col gap-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  );
}

function HomePage() {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Amazing Products
            <span className="block text-yellow-300">At Unbeatable Prices</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Shop from thousands of quality products with secure payments, fast
            delivery, and exclusive member discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-50 transition inline-flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition inline-flex items-center justify-center"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Truck size={24} />,
              title: "Free Shipping",
              desc: "On orders over ₹999",
            },
            {
              icon: <Shield size={24} />,
              title: "Secure Payment",
              desc: "100% secure",
            },
            {
              icon: <Headphones size={24} />,
              title: "24/7 Support",
              desc: "Always here",
            },
            {
              icon: <ShoppingBag size={24} />,
              title: "Easy Returns",
              desc: "30 day policy",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-3 md:p-4"
            >
              <div className="text-indigo-600 mb-2 p-2 bg-indigo-50 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-14 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {loading
              ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?categoryId=${category.id}`}
                    className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-md will-change-transform"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <ShoppingBag size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-xs md:text-sm truncate">
                      {category.name}
                    </h3>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 md:py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {loading
              ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              : products.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden group will-change-transform"
                  >
                    <div className="bg-gray-100 h-36 sm:h-44 md:h-48 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <ShoppingBag size={40} className="text-gray-400" />
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-gray-800 truncate text-sm md:text-base">
                        {product.name}
                      </h3>
                      <p className="text-indigo-600 font-bold mt-1 text-sm md:text-base">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {product.categoryName}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link
              to="/products"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="mx-auto text-indigo-600 mb-2" size={36} />
              <h3 className="text-3xl font-bold text-gray-800">10K+</h3>
              <p className="text-gray-500">Happy Customers</p>
            </div>

            <div className="text-center">
              <ShoppingBag className="mx-auto text-indigo-600 mb-2" size={36} />
              <h3 className="text-3xl font-bold text-gray-800">500+</h3>
              <p className="text-gray-500">Products</p>
            </div>

            <div className="text-center">
              <Award className="mx-auto text-indigo-600 mb-2" size={36} />
              <h3 className="text-3xl font-bold text-gray-800">50+</h3>
              <p className="text-gray-500">Categories</p>
            </div>

            <div className="text-center">
              <Star className="mx-auto text-indigo-600 mb-2" size={36} />
              <h3 className="text-3xl font-bold text-gray-800">4.9★</h3>
              <p className="text-gray-500">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-10 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Get the Best Deals!
            </h2>
            <p className="text-indigo-100">
              Sign up and get exclusive offers on your first order.
            </p>
          </div>
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition shrink-0"
          >
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
