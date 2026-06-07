import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'
import { Heart, ShoppingCart, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function WishlistPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.wishlist)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleRemove = async (productId) => {
    const result = await dispatch(removeFromWishlist(productId))
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.success('Removed from wishlist')
    }
  }

  const handleAddToCart = async (productId) => {
    const result = await dispatch(addToCart({ productId, quantity: 1 }))
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading wishlist...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Heart size={80} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-600">Your wishlist is empty</h2>
        <Link to="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        My Wishlist ({items.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
            <Link to={`/products/${item.productId}`}>
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag size={40} className="text-gray-400" />
                )}
              </div>
            </Link>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate">{item.productName}</h3>
              <p className="text-indigo-600 font-bold mt-1">₹{item.productPrice.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">{item.categoryName}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(item.productId)}
                  className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage