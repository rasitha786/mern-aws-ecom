import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) { navigate("/login"); return; }
    setProfile({ name: user.name || "", email: user.email || "" });
    const savedAddresses = JSON.parse(localStorage.getItem("addresses") || "[]");
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setAddresses(savedAddresses);
    setWishlist(savedWishlist);
    // ✅ Fetch real orders from backend
    fetchOrders();
  }, []);

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const saveProfile = () => {
    const updated = { ...user, name: profile.name, email: profile.email };
    localStorage.setItem("user", JSON.stringify(updated));
    setEditingProfile(false);
    alert("✅ Profile updated!");
  };

  const addAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      alert("Please fill all required fields!"); return;
    }
    const updated = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddress({ fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setShowAddAddress(false);
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(p => p._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-100 text-yellow-700";
      case "Shipped":    return "bg-blue-100 text-blue-700";
      case "Delivered":  return "bg-green-100 text-green-700";
      case "Cancelled":  return "bg-red-100 text-red-700";
      default:           return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return "⏳";
      case "Shipped":    return "🚚";
      case "Delivered":  return "✅";
      case "Cancelled":  return "❌";
      default:           return "📦";
    }
  };

  const tabs = [
    { id: "orders",    label: "📦 My Orders" },
    { id: "profile",   label: "👤 Profile" },
    { id: "addresses", label: "📍 Addresses" },
    { id: "wishlist",  label: "❤️ Wishlist" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Account</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Link to="/" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">← Back to Store</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                  {user?.role || "user"}
                </span>
              </div>

              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{orders.length}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-pink-600">{wishlist.length}</p>
                  <p className="text-xs text-gray-500">Wishlist</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-600">{addresses.length}</p>
                  <p className="text-xs text-gray-500">Addresses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* ✅ Orders Tab — fetches from backend */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Orders</h3>
                  <button onClick={fetchOrders} className="text-sm text-blue-600 hover:underline">🔄 Refresh</button>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h4>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet. Start shopping!</p>
                    <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                      Shop Now →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order ID</p>
                            <p className="font-mono text-sm font-medium text-gray-700">#{order._id?.slice(-10).toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Placed on</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)} {order.orderStatus}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Total</p>
                            <p className="font-bold text-blue-600 text-lg">₹{order.totalAmount}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                              <p className="font-bold text-gray-700">₹{item.quantity * item.price}</p>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Address */}
                        {order.shippingAddress && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">📍 Delivering to</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.fullName} — {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                          </div>
                        )}

                        {/* Payment */}
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                          <span>💳 {order.paymentMethod}</span>
                          <span className={order.paymentStatus === "Paid" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                            {order.paymentStatus === "Paid" ? "✅ Paid" : "⏳ " + order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Profile</h3>
                  <button onClick={() => setEditingProfile(!editingProfile)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${editingProfile ? "bg-gray-100 text-gray-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    {editingProfile ? "Cancel" : "✏️ Edit Profile"}
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {editingProfile ? (
                        <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profile.name}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      {editingProfile ? (
                        <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profile.email}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">{user?.role || "user"}</span>
                    </div>
                  </div>
                  {editingProfile && (
                    <button onClick={saveProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Addresses</h3>
                  <button onClick={() => setShowAddAddress(!showAddAddress)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    + Add Address
                  </button>
                </div>

                {showAddAddress && (
                  <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4">New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "fullName", label: "Full Name", placeholder: "Your full name" },
                        { key: "phone", label: "Phone Number", placeholder: "+91 9876543210" },
                        { key: "street", label: "Street Address", placeholder: "123 Main Street" },
                        { key: "city", label: "City", placeholder: "Chennai" },
                        { key: "state", label: "State", placeholder: "Tamil Nadu" },
                        { key: "pincode", label: "Pincode", placeholder: "600001" },
                      ].map(f => (
                        <div key={f.key} className={f.key === "street" ? "md:col-span-2" : ""}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                          <input type="text" placeholder={f.placeholder} value={newAddress[f.key]}
                            onChange={e => setNewAddress({ ...newAddress, [f.key]: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={addAddress} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Save Address</button>
                      <button onClick={() => setShowAddAddress(false)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📍</div>
                    <p className="text-gray-500">No addresses saved yet. Add your first address!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Home</span>
                          <button onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:text-red-700 text-sm">🗑️ Delete</button>
                        </div>
                        <p className="font-medium text-gray-900">{addr.fullName}</p>
                        <p className="text-gray-600">{addr.street}</p>
                        <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                        {addr.phone && <p className="text-gray-500 text-sm mt-1">📞 {addr.phone}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Wishlist ({wishlist.length})</h3>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">❤️</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h4>
                    <p className="text-gray-500 mb-6">Save products you love to your wishlist!</p>
                    <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                      Browse Products →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map(p => (
                      <div key={p._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 truncate">{p.name}</h4>
                          <p className="text-blue-600 font-bold text-lg">₹{p.price}</p>
                          <div className="flex gap-2 mt-3">
                            <Link to={`/product/${p._id}`} className="flex-1 bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">View</Link>
                            <button onClick={() => removeFromWishlist(p._id)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors">🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}