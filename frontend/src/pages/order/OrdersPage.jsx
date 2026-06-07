import { useEffect, useState, useCallback } from 'react'
import { orderApi } from '../../api/orderApi'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      const response = await orderApi.getMyOrders()
      setOrders(response.data.data.content)
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

 useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [fetchOrders])

  const handleCancel = async (orderId) => {
    try {
      await orderApi.cancelOrder(orderId)
      toast.success('Order cancelled successfully')
      fetchOrders()
    } catch {
      toast.error('Failed to cancel order')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Package size={80} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-600">No orders yet</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-800">{order.orderNumber}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-bold text-indigo-600">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
                {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            {expandedOrder === order.id && (
              <div className="border-t px-5 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-gray-800">₹{item.subtotal.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                  <p><span className="font-medium">Shipping:</span> {order.shippingAddress}</p>
                  <p><span className="font-medium">Payment:</span> {order.paymentMethod?.replace('_', ' ')}</p>
                  <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
                  {order.notes && <p><span className="font-medium">Notes:</span> {order.notes}</p>}
                </div>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="self-start bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage