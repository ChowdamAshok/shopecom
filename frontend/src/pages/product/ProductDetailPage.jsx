import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../../store/slices/productSlice'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../store/slices/wishlistSlice'
import RelatedProducts from '../../components/product/RelatedProducts'
import ReviewSection from '../../components/product/ReviewSection'
import { ShoppingBag, ShoppingCart, ArrowLeft, Plus, Minus, Heart, X } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedProduct, loading } = useSelector((state) => state.product)
  const { user } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [quantity, setQuantity] = useState(1)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProductById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (user) dispatch(fetchWishlist())
  }, [dispatch, user])

  const isWishlisted = wishlistItems.some(
    (item) => item.productId === selectedProduct?.id
  )

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }
    const result = await dispatch(addToCart({ productId: selectedProduct.id, quantity }))
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!')
    } else {
      toast.error(result.payload || 'Failed to add to cart')
    }
  }

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      navigate('/login')
      return
    }
    if (isWishlisted) {
      await dispatch(removeFromWishlist(selectedProduct.id))
      toast.success('Removed from wishlist')
    } else {
      await dispatch(addToWishlist(selectedProduct.id))
      toast.success('Added to wishlist!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading product...</div>
      </div>
    )
  }

  if (!selectedProduct) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Product Image with Zoom */}
          <div
            className="bg-gray-100 rounded-2xl min-h-[400px] flex items-center justify-center cursor-zoom-in relative overflow-hidden group"
            onClick={() => selectedProduct.imageUrl && setZoomOpen(true)}
          >
            {selectedProduct.imageUrl ? (
              <>
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-2xl block"
                  width={600}
                  height={600}
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    Click to zoom
                  </span>
                </div>
              </>
            ) : (
              <ShoppingBag size={80} className="text-gray-400" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-indigo-600 text-sm font-medium">{selectedProduct.categoryName}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{selectedProduct.name}</h1>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-bold text-indigo-600">
                ₹{selectedProduct.price.toLocaleString()}
              </p>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-full border-2 transition ${
                  isWishlisted
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500'
                }`}
              >
                <Heart size={22} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            <p className="text-gray-600 text-sm md:text-base">{selectedProduct.description}</p>

            <div className={`text-sm font-medium ${selectedProduct.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {selectedProduct.stock > 0
                ? `✓ In Stock (${selectedProduct.stock} available)`
                : '✗ Out of Stock'}
            </div>

            {/* Quantity Selector */}
            {selectedProduct.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ShoppingCart size={20} />
              {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Buy Now Button */}
            {selectedProduct.stock > 0 && (
              <button
                onClick={async () => {
                  await handleAddToCart()
                  navigate('/cart')
                }}
                className="flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={selectedProduct.id} />
      </div>

      {/* Related Products */}
      <RelatedProducts
        categoryId={selectedProduct.categoryId}
        currentProductId={selectedProduct.id}
      />

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={28} />
            </button>
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-auto rounded-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage