import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    axios.get("http://localhost:8080/user/status", { withCredentials: true })
      .then(res => {
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        } else {
          navigate('/login');
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const totalAmount = getTotalAmount();
  const shippingCost = totalAmount > 1000 ? 0 : 50; // Free shipping above ₹1000
  const finalAmount = totalAmount + shippingCost;

  const handlePayment = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setLoading(true);
    try {
      // Create order in backend first
      const orderData = {
        items: cartItems.map(item => ({
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        totalAmount: finalAmount
      };

      const orderResponse = await axios.post("http://localhost:8080/api/orders/create", orderData, {
        withCredentials: true
      });

      const { orderId } = orderResponse.data;

      // Create Razorpay order
      const res = await axios.post("http://localhost:8080/api/payment/create-order", {
        amount: finalAmount,
        orderId
      }, { withCredentials: true });

      const { id: order_id, amount: orderAmount } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_agHUCXSuZ9wOR8",
        amount: orderAmount,
        currency: "INR",
        name: "Erimuga E-Store",
        description: `Order #${orderId}`,
        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              clearCart();
              alert("✅ Payment Successful! Your order has been placed.");
              navigate('/profile');
            } else {
              alert("❌ Signature verification failed!");
            }
          } catch (error) {
            console.error(error);
            alert("❌ Error verifying payment");
          }
        },
        prefill: {
          name: user?.firstName || user?.username || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#F26A1B",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Error processing order: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#F26A1B]">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  {item.img && <img src={item.img} alt={item.name} className="h-12 w-12 object-cover rounded" />}
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                  readOnly
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-[#F26A1B] text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
