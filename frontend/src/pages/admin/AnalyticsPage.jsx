import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axios'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function AnalyticsPage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') navigate('/')
  }, [user, navigate])

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axiosInstance.get('/api/orders/all?page=0&size=1000'),
        axiosInstance.get('/api/products?page=0&size=100'),
      ])
      setOrders(ordersRes.data.data.content)
      setProducts(productsRes.data.data.content)
    } catch {
      toast.error('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

  // Orders by status for pie chart
  const ordersByStatus = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => ({
    name: status,
    value: orders.filter((o) => o.status === status).length,
  })).filter((s) => s.value > 0)

  // Monthly revenue for line chart
  const monthlyData = () => {
    const months = {}
    orders.forEach((order) => {
      if (order.status === 'CANCELLED') return
      const date = new Date(order.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { month: label, revenue: 0, orders: 0 }
      months[key].revenue += order.totalAmount
      months[key].orders += 1
    })
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month))
  }

  // Top products by orders
  const topProducts = () => {
    const productCount = {}
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!productCount[item.productName]) {
          productCount[item.productName] = { name: item.productName, orders: 0, revenue: 0 }
        }
        productCount[item.productName].orders += item.quantity
        productCount[item.productName].revenue += item.subtotal
      })
    })
    return Object.values(productCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
      <p className="text-gray-500 mb-8">Store performance overview</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'text-green-600 bg-green-100' },
          { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag size={24} />, color: 'text-indigo-600 bg-indigo-100' },
          { label: 'Total Products', value: totalProducts, icon: <TrendingUp size={24} />, color: 'text-purple-600 bg-purple-100' },
          { label: 'Pending Orders', value: pendingOrders, icon: <Users size={24} />, color: 'text-yellow-600 bg-yellow-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue & Orders</h2>
        {monthlyData().length === 0 ? (
          <p className="text-gray-400 text-center py-8">No data available yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="revenue" />
              <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Orders by Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Orders by Status</h2>
          {ordersByStatus.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ordersByStatus.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h2>
          {topProducts().length === 0 ? (
            <p className="text-gray-400 text-center py-8">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="orders" fill="#6366f1" radius={[0, 4, 4, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue by Product Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Product Revenue Summary</h2>
        {topProducts().length === 0 ? (
          <p className="text-gray-400 text-center py-8">No data available yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Units Sold</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts().map((product, index) => (
                  <tr key={product.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{product.orders}</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-600">₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage