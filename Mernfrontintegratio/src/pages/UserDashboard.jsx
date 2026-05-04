// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  User, Heart, MapPin, Package, Edit2, 
  Save, X, Plus, Trash2 
} from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', pincode: '', phone: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    await Promise.all([
      fetchOrders(),
      fetchProfile(),
      fetchAddresses(),
      fetchWishlist()
    ]);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/users/my-orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      const data = await response.json();
      setProfile(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/users/addresses');
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/users/wishlist');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (response.ok) {
        setProfile(editForm);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addAddress = async () => {
    try {
      const response = await fetch('/api/users/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      if (response.ok) {
        fetchAddresses();
        setNewAddress({ street: '', city: '', state: '', pincode: '', phone: '' });
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const deleteAddress = async (addressId) => {
    if (window.confirm('Delete this address?')) {
      try {
        const response = await fetch(`/api/users/addresses/${addressId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchAddresses();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/users/wishlist/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
          <p className="mt-2">Manage your orders, profile, addresses, and wishlist from here.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                <Package size={18} /> My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                <User size={18} /> Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'addresses' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                <MapPin size={18} /> Manage Addresses
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'wishlist' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                <Heart size={18} /> Wishlist
              </button>
            </nav>
          </div>
        </div>

        {/* My Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">You haven't placed any orders yet</p>
                  <a href="/products" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Start Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-3 mt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Edit2 size={16} /> Edit
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={updateProfile} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1">
                      <Save size={16} /> Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
                  <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              
              {/* Add New Address Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Add New Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <button onClick={addAddress} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1">
                    <Plus size={16} /> Add Address
                  </button>
                </div>
              </div>

              {/* Addresses List */}
              {addresses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No saved addresses yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address._id} className="border rounded-lg p-4 relative">
                      <button
                        onClick={() => deleteAddress(address._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                      <p><strong>{address.street}</strong></p>
                      <p>{address.city}, {address.state}</p>
                      <p>Pincode: {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                  <a href="/products" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Browse Products
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <div key={product._id} className="border rounded-lg overflow-hidden group">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}