import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/getproduct`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API}/api/deleteProduct/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok || res.status === 204) {
        setProducts(products.filter(p => p._id !== id));
        alert("✅ Product deleted!");
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      alert("❌ Connection error");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/updateProduct/${editProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editProduct)
      });
      if (res.ok) {
        alert("✅ Product updated!");
        setEditProduct(null);
        fetchProducts();
      } else {
        alert("❌ Failed to update");
      }
    } catch (err) {
      alert("❌ Connection error");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const categories = [...new Set(products.map(p => p.category))];

  const stats = [
    { label: "Total Products", value: products.length, icon: "📦", color: "bg-blue-500" },
    { label: "Categories", value: categories.length, icon: "🏷️", color: "bg-purple-500" },
    { label: "Total Stock", value: totalStock, icon: "🏪", color: "bg-green-500" },
    { label: "Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: "💰", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">← Back to Store</Link>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">● Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm w-fit">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "products", label: "📦 Products" },
            { id: "add", label: "➕ Add Product" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <div className={`${s.color} w-10 h-10 rounded-full flex items-center justify-center opacity-20`}></div>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{s.label}</p>
                  <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Products by Category</h3>
                <div className="space-y-4">
                  {categories.map(cat => {
                    const count = products.filter(p => p.category === cat).length;
                    const pct = Math.round((count / products.length) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium capitalize text-gray-700">{cat}</span>
                          <span className="text-gray-500">{count} products ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-sm text-gray-500">₹{p.price} • Stock: {p.stock || 0}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">{p.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">All Products ({products.length})</h3>
              <button onClick={() => setActiveTab("add")} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                + Add Product
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-3">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-gray-900">{p.name}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{p.description?.slice(0, 40)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">₹{p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${(p.stock || 0) > 10 ? "bg-green-100 text-green-700" : (p.stock || 0) > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {p.stock || 0} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setEditProduct(p)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">✏️ Edit</button>
                            <button onClick={() => deleteProduct(p._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">🗑️ Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === "add" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h3>
              <AddProductForm token={token} onSuccess={() => { fetchProducts(); setActiveTab("products"); }} />
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h3>
            <form onSubmit={updateProduct} className="space-y-4">
              {["name", "description", "price", "image", "stock"].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  {field === "description" ? (
                    <textarea
                      value={editProduct[field] || ""}
                      onChange={e => setEditProduct({ ...editProduct, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="3"
                    />
                  ) : (
                    <input
                      type={field === "price" || field === "stock" ? "number" : "text"}
                      value={editProduct[field] || ""}
                      onChange={e => setEditProduct({ ...editProduct, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AddProductForm({ token, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", category: "electronics", stock: "", brand: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/postProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
      });
      if (res.ok || res.status === 201) {
        alert("✅ Product added successfully!");
        setForm({ name: "", description: "", price: "", image: "", category: "electronics", stock: "", brand: "" });
        onSuccess();
      } else {
        const data = await res.json();
        alert(`❌ ${data.message || "Failed to add product"}`);
      }
    } catch (err) {
      alert("❌ Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: "name", label: "Product Name", type: "text", placeholder: "Enter product name" },
        { key: "price", label: "Price (₹)", type: "number", placeholder: "0.00" },
        { key: "stock", label: "Stock Quantity", type: "number", placeholder: "0" },
        { key: "brand", label: "Brand (Optional)", type: "text", placeholder: "Brand name" },
        { key: "image", label: "Image URL", type: "text", placeholder: "https://..." },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required={f.key !== "brand"} />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Product description" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          {["electronics", "clothing", "home", "books", "beauty", "sports", "toys", "food", "other"].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}