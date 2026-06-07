import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { productApi } from "../../api/productApi";

function RelatedProducts({ categoryId, currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const response = await productApi.getByCategory(categoryId, 0, 10);
        const products = response.data.data.content.filter(
          (p) => p.id !== currentProductId,
        );
        setRelatedProducts(products.slice(0, 4));
      } catch {
        console.error("Failed to fetch related products");
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchRelated();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl h-56 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-1 overflow-hidden"
          >
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ShoppingBag size={32} className="text-gray-400" />
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 truncate text-sm">
                {product.name}
              </h3>
              <p className="text-indigo-600 font-bold mt-1 text-sm">
                ₹{product.price.toLocaleString()}
              </p>
              <p
                className={`text-xs mt-1 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
