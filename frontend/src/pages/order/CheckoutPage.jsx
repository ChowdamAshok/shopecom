import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { orderApi } from '../../api/orderApi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'

const schema = z.object({
  shippingAddress: z.string().min(10, 'Please enter a complete address'),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH_ON_DELIVERY', 'WALLET']),
  notes: z.string().optional(),
})

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalAmount } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'UPI' },
  })

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    setLoading(true)
    try {
      await orderApi.placeOrder(data)
      toast.success('Order placed successfully!')
      navigate(`/orders`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
              <textarea
                {...register('shippingAddress')}
                rows={3}
                placeholder="Enter your full address..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.shippingAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH_ON_DELIVERY', 'WALLET'].map((method) => (
                  <label key={method} className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-indigo-500">
                    <input
                      type="radio"
                      value={method}
                      {...register('paymentMethod')}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {method.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Notes (Optional)</h2>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Any special instructions..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center shrink-0">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ShoppingBag size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">₹{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage