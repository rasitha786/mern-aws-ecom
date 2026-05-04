// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    description: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch products
      const productsRes = await fetch('http://localhost:5000/api/products');
      const productsData = await productsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);

      // Fetch orders (only if admin)
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productData,
          price: Number(productData.price),
          stock: Number(productData.stock)
        })
      });
      
      if (response.ok) {
        alert('Product added successfully!');
        setShowProductForm(false);
        setProductData({ name: '', price: '', category: '', stock: '', image: '', description: '' });
        fetchAllData(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding product. Make sure backend is running.');
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productData,
          price: Number(productData.price),
          stock: Number(productData.stock)
        })
      });
      
      if (response.ok) {
        alert('Product updated successfully!');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductData({ name: '', price: '', category: '', stock: '', image: '', description: '' });
        fetchAllData();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          alert('Product deleted successfully!');
          fetchAllData();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
      }
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert('Order status updated!');
        fetchAllData();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating order status');
    }
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your store efficiently</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                {totalOrders === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Will show when orders are placed</p>
                )}
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                {totalOrders === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No orders placed yet</p>
                )}
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Products</p>
                <p className="text-2xl font-bold text-purple-600">{totalProducts}</p>
                {totalProducts === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Add your first product</p>
                )}
              </div>
              <div className="text-3xl">🛍️</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'orders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'products'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Products
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">All Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Once customers place orders, they will appear here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 text-sm font-mono">#{order._id?.slice(-8)}</td>
                          <td className="px-6 py-4 text-sm">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-4 text-sm font-medium">₹{order.total}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => alert(`Order details:\nCustomer: ${order.user?.name}\nTotal: ₹${order.total}\nStatus: ${order.status}`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductData({ name: '', price: '', category: '', stock: '', image: '', description: '' });
                  setShowProductForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add New Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productData.name}
                        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={productData.price}
                        onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={productData.category}
                        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={productData.stock}
                        onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={productData.image}
                        onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                      />
                      <textarea
                        placeholder="Description"
                        value={productData.description}
                        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        rows="3"
                      />
                      <div className="flex gap-2 pt-3">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                          {editingProduct ? 'Update' : 'Add'} Product
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-3 text-center py-12 bg-white rounded-lg">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Click "Add New Product" to add your first product
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/300'} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600">₹{product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                      <p className="text-sm text-gray-500">Category: {product.category}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setProductData(product);
                            setShowProductForm(true);
                          }}
                          className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}