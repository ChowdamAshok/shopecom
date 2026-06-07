import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import { ArrowLeft, Package, CheckCircle, Truck, Home, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { status: 'PENDING', label: 'Order Placed', icon: <Clock size={20} />, desc: 'Your order has been placed' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle size={20} />, desc: 'Your order has been confirmed' },
  { status: 'PROCESSING', label: 'Processing', icon: <Package size={20} />, desc: 'Your order is being processed' },
  { status: 'SHIPPED', label: 'Shipped', icon: <Truck size={20} />, desc: 'Your order is on the way' },
  { status: 'DELIVERED', label: 'Delivered', icon: <Home size={20} />, desc: 'Your order has been delivered' },
]

function OrderTrackingPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    try {
      const response = await orderApi.getOrderById(orderId)
      setOrder(response.data.data)
    } catch {
      toast.error('Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrder()
  }, [fetchOrder])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading order...</div>
      </div>
    )
  }

  if (!order) return null

  const isCancelled = order.status === 'CANCELLED'
  const currentStepIndex = steps.findIndex((s) => s.status === order.status)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft size={20} /> Back to Orders
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Track Order</h1>
            <p className="text-indigo-600 font-medium">{order.orderNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isCancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {order.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Order Status</h2>

        {isCancelled ? (
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
            <XCircle size={40} className="text-red-500" />
            <div>
              <p className="font-bold text-red-600">Order Cancelled</p>
              <p className="text-red-400 text-sm">Your order has been cancelled</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const isLast = index === steps.length - 1

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Icon & Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isCompleted
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                      {step.icon}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-12 mt-1 ${
                        index < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                      {step.desc}
                    </p>
                    {isCurrent && (
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium mt-1 inline-block">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
              </div>
              <p className="font-bold text-indigo-600">₹{item.subtotal.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-3 border-t">
          <span>Total</span>
          <span className="text-indigo-600">₹{order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Delivery Details</h2>
        <div className="flex flex-col gap-2 text-sm">
          <p><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-500">{order.shippingAddress}</span></p>
          <p><span className="font-medium text-gray-700">Payment:</span> <span className="text-gray-500">{order.paymentMethod?.replace(/_/g, ' ')}</span></p>
          <p><span className="font-medium text-gray-700">Payment Status:</span> <span className={`font-medium ${order.paymentStatus === 'SUCCESS' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentStatus}</span></p>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage