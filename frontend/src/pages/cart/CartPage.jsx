import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../store/slices/cartSlice";
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, loading } = useSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const result = await dispatch(updateCartItem({ cartItemId, quantity }));
    if (updateCartItem.fulfilled.match(result)) {
      toast.success("Cart updated");
    }
  };

  const handleRemove = async (cartItemId) => {
    const result = await dispatch(removeFromCart(cartItemId));
    if (removeFromCart.fulfilled.match(result)) {
      toast.success("Item removed");
    }
  };

  const handleClearCart = async () => {
    const result = await dispatch(clearCart());
    if (clearCart.fulfilled.match(result)) {
      toast.success("Cart cleared");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <ShoppingCart size={80} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-600">Your cart is empty</h2>
        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-3 md:p-4"
            >
              <div className="flex gap-3 items-start">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <ShoppingBag size={24} className="text-gray-400" />
                  )}
                </div>

                {/* Product Info + Controls */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                      {item.productName}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-400 hover:text-red-600 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-indigo-600 font-bold text-sm md:text-base mt-0.5">
                    ₹{item.productPrice.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-l-lg"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-2 md:px-3 font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-bold text-gray-800 text-sm md:text-base">
                      ₹{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items ({totalItems})</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-600">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className="block text-center text-indigo-600 mt-3 hover:underline text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
