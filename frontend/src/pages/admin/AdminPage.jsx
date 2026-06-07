import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'
import { Package, ChevronDown, ChevronUp, Plus, X } from 'lucide-react'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

const allStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  categoryId: '',
}

function AdminPage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') navigate('/')
  }, [user, navigate])

  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/orders/all?page=0&size=100')
      setOrders(response.data.data.content)
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/categories')
      setCategories(response.data.data)
    } catch {
      toast.error('Failed to fetch categories')
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/products?page=0&size=100')
      setProducts(response.data.data.content)
    } catch {
      toast.error('Failed to fetch products')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllOrders()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [fetchAllOrders, fetchCategories, fetchProducts])

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/api/orders/${orderId}/status?status=${status}`)
      toast.success(`Order updated to ${status}`)
      fetchAllOrders()
    } catch {
      toast.error('Failed to update order status')
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await axiosInstance.put(`/api/products/${editingProduct.id}`, {
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          categoryId: parseInt(productForm.categoryId),
        })
        toast.success('Product updated!')
      } else {
        await axiosInstance.post('/api/products', {
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          categoryId: parseInt(productForm.categoryId),
        })
        toast.success('Product added!')
      }
      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm(emptyProduct)
      fetchProducts()
    } catch {
      toast.error('Failed to save product')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
    })
    setShowProductForm(true)
    setActiveTab('products')
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axiosInstance.delete(`/api/products/${id}`)
      toast.success('Product deleted!')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/api/categories', categoryForm)
      toast.success('Category added!')
      setShowCategoryForm(false)
      setCategoryForm({ name: '', description: '' })
      fetchCategories()
    } catch {
      toast.error('Failed to add category')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage your store</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((status) => (
          <div key={status} className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {orders.filter((o) => o.status === status).length}
            </p>
            <p className="text-gray-500 text-sm mt-1">{status}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['orders', 'products', 'categories'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium capitalize transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Package size={60} className="mx-auto text-gray-300 mb-3" />
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div
                  className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-800">{order.orderNumber}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-indigo-600">₹{order.totalAmount.toLocaleString()}</span>
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t px-5 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">₹{item.subtotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm flex flex-col gap-1">
                      <p><span className="font-medium">Shipping:</span> {order.shippingAddress}</p>
                      <p><span className="font-medium">Payment:</span> {order.paymentMethod?.replace('_', ' ')} — {order.paymentStatus}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700 self-center">Update Status:</span>
                      {allStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(order.id, status)}
                          disabled={order.status === status}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                            ${order.status === status
                              ? 'bg-indigo-600 text-white border-indigo-600 cursor-not-allowed'
                              : 'border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
            <button
              onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(emptyProduct) }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowProductForm(false)}>
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. iPhone 15 Pro"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 99999"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {productForm.imageUrl && (
                    <img src={productForm.imageUrl} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gray-100 h-40 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={40} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-indigo-600 font-bold">₹{product.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                  <p className="text-gray-400 text-xs">{product.categoryName}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-1 rounded-lg text-sm font-medium hover:bg-indigo-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-50 text-red-500 py-1 rounded-lg text-sm font-medium hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Categories ({categories.length})</h2>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Category
            </button>
          </div>

          {showCategoryForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Category</h3>
              <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Electronics"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Category description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                    Add Category
                  </button>
                  <button type="button" onClick={() => setShowCategoryForm(false)} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{cat.description || 'No description'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage