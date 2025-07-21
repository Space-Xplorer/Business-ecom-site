import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingBag, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setForm(user);
    axios.get("http://localhost:8080/api/orders/my-orders", { withCredentials: true })
      .then(res => {
        setOrders(res.data);
        setOrdersLoading(false);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders.");
        setOrdersLoading(false);
        setLoading(false);
      });
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:8080/user/profile", form, { withCredentials: true });
      setUser(res.data.user);
      setForm(res.data.user);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="text-center py-8">Loading profile...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#F26A1B] text-center">My Account</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-[#F26A1B] text-[#F26A1B]' 
              : 'border-transparent text-gray-600 hover:text-[#F26A1B]'
          }`}
        >
          <FaUser className="inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'orders' 
              ? 'border-[#F26A1B] text-[#F26A1B]' 
              : 'border-transparent text-gray-600 hover:text-[#F26A1B]'
          }`}
        >
          <FaShoppingBag className="inline mr-2" />
          My Orders ({orders.length})
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">First Name</label>
                  <input 
                    name="firstName" 
                    value={form.firstName || ''} 
                    onChange={handleChange} 
                    className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" 
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Last Name</label>
                  <input 
                    name="lastName" 
                    value={form.lastName || ''} 
                    onChange={handleChange} 
                    className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Email</label>
                <input 
                  name="email" 
                  value={form.email || ''} 
                  onChange={handleChange} 
                  className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg bg-gray-100" 
                  disabled 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Phone</label>
                <input 
                  name="phone" 
                  value={form.phone || ''} 
                  onChange={handleChange} 
                  className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" 
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  type="submit" 
                  className="bg-[#F26A1B] text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="bg-gray-300 text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-400 transition" 
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-semibold text-gray-700">First Name:</span>
                  <p className="text-lg">{user.firstName || <span className="text-gray-400">Not set</span>}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-semibold text-gray-700">Last Name:</span>
                  <p className="text-lg">{user.lastName || <span className="text-gray-400">Not set</span>}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Email:</span>
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Phone:</span>
                <p className="text-lg">{user.phone || <span className="text-gray-400">Not set</span>}</p>
              </div>
              <button 
                className="bg-[#F26A1B] text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition" 
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
          {ordersLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
              <a href="/products" className="bg-[#F26A1B] text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Order #{order.orderId}</h3>
                      <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-[#F26A1B]">₹{order.totalAmount}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{item.productName} × {item.quantity}</span>
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div className="text-sm text-gray-600">
                        <p className="font-semibold">Shipping Address:</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-600">Payment: </span>
                      <span className={`font-semibold ${order.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                      </span>
                    </div>
                    {order.payment.razorpayPaymentId && (
                      <div className="text-xs text-gray-500">
                        Payment ID: {order.payment.razorpayPaymentId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 