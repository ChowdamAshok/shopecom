import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
  searchProducts,
} from "../../store/slices/productSlice";
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
  Loader,
} from "lucide-react";
import { groqApi } from "../../api/groqApi";
import { productApi } from "../../api/productApi";
import toast from "react-hot-toast";

function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, totalPages, currentPage, loading } =
    useSelector((state) => state.product);

  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [availability, setAvailability] = useState("all");

  const selectedCategory = searchParams.get("categoryId") ?? "";

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      dispatch(fetchProductsByCategory({ categoryId, page: 0 }));
    } else {
      dispatch(fetchProducts({ page: 0, sortBy, sortDir }));
    }
  }, [searchParams, dispatch, sortBy, sortDir]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setIsAiSearch(false);
      dispatch(searchProducts({ keyword, page: 0 }));
      setSearchParams({});
    }
  };

  const handleAiSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Enter a search query first");
      return;
    }
    setAiSearchLoading(true);
    setIsAiSearch(true);
    try {
      const allProducts = await productApi.getAll(0, 100);
      const productList = allProducts.data.data.content;
      const matchedIds = await groqApi.smartSearch(keyword, productList);
      const matchedProducts = productList.filter((p) =>
        matchedIds.includes(p.id),
      );
      if (matchedProducts.length === 0) {
        toast.error("No matching products found");
      } else {
        toast.success(`Found ${matchedProducts.length} products!`);
      }
      dispatch({
        type: "product/fetchAll/fulfilled",
        payload: {
          content: matchedProducts,
          totalPages: 1,
          totalElements: matchedProducts.length,
          pageNumber: 0,
        },
      });
    } catch {
      toast.error("AI search failed, try normal search");
    } finally {
      setAiSearchLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setKeyword("");
    setIsAiSearch(false);
    if (categoryId) {
      setSearchParams({ categoryId });
      dispatch(fetchProductsByCategory({ categoryId, page: 0 }));
    } else {
      setSearchParams({});
      dispatch(fetchProducts({ page: 0, sortBy, sortDir }));
    }
  };

  const handlePageChange = (page) => {
    if (selectedCategory) {
      dispatch(fetchProductsByCategory({ categoryId: selectedCategory, page }));
    } else if (keyword) {
      dispatch(searchProducts({ keyword, page }));
    } else {
      dispatch(fetchProducts({ page, sortBy, sortDir }));
    }
  };

  const handleSortChange = (newSortBy, newSortDir) => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    dispatch(
      fetchProducts({ page: 0, sortBy: newSortBy, sortDir: newSortDir }),
    );
  };

  const handleClearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt");
    setSortDir("desc");
    setKeyword("");
    setIsAiSearch(false);
    setAvailability('all')
    setSearchParams({});
    dispatch(fetchProducts({ page: 0 }));
  };

  const filteredProducts = products.filter((product) => {
    const min = priceRange.min ? parseFloat(priceRange.min) : 0;
    const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const priceMatch = product.price >= min && product.price <= max;
    const stockMatch =
      availability === "all"
        ? true
        : availability === "instock"
          ? product.stock > 0
          : availability === "outofstock"
            ? product.stock === 0
            : true;
    return priceMatch && stockMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 flex-1 md:flex-none"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search or ask AI..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={handleAiSearch}
              disabled={aiSearchLoading}
              className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {aiSearchLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              <span className="hidden md:inline">AI</span>
            </button>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition ${
              showFilters
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Filters & Sort</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X size={14} /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { label: "Under ₹500", min: 0, max: 500 },
                  { label: "₹500-₹2000", min: 500, max: 2000 },
                  { label: "₹2000-₹10000", min: 2000, max: 10000 },
                  { label: "Above ₹10000", min: 10000, max: "" },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      setPriceRange({ min: range.min, max: range.max })
                    }
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "Newest First",
                    sortBy: "createdAt",
                    sortDir: "desc",
                  },
                  {
                    label: "Oldest First",
                    sortBy: "createdAt",
                    sortDir: "asc",
                  },
                  {
                    label: "Price: Low to High",
                    sortBy: "price",
                    sortDir: "asc",
                  },
                  {
                    label: "Price: High to Low",
                    sortBy: "price",
                    sortDir: "desc",
                  },
                  { label: "Name: A to Z", sortBy: "name", sortDir: "asc" },
                ].map((option) => (
                  <label
                    key={option.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={
                        sortBy === option.sortBy && sortDir === option.sortDir
                      }
                      onChange={() =>
                        handleSortChange(option.sortBy, option.sortDir)
                      }
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { label: "All Products", value: "all" },
                  { label: "In Stock Only", value: "instock" },
                  { label: "Out of Stock", value: "outofstock" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="stock"
                      checked={availability === option.value}
                      onChange={() => setAvailability(option.value)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar - Categories */}
        <div className="hidden md:block w-48 shrink-0">
          <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleCategoryChange("")}
                className={`text-left w-full px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === ""
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryChange(String(cat.id))}
                  className={`text-left w-full px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === String(cat.id)
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm">
              {filteredProducts.length} products found
              {isAiSearch && (
                <span className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  AI Search
                </span>
              )}
            </p>
          </div>

          {loading || aiSearchLoading ? (
            <div className="text-center py-20 text-gray-500">
              {aiSearchLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader size={32} className="animate-spin text-indigo-600" />
                  <p>AI is searching for you...</p>
                </div>
              ) : (
                "Loading products..."
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="bg-gray-100 h-48 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag size={40} className="text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-indigo-600 font-bold mt-1">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {product.categoryName}
                      </p>
                      <p
                        className={`text-xs mt-1 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && !isAiSearch && (
                <div className="flex justify-center items-center gap-3 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`w-9 h-9 rounded-lg font-medium ${
                        currentPage === i
                          ? "bg-indigo-600 text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
