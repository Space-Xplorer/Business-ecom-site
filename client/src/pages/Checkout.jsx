import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../components/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/AuthContext";
// import '../styles/Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // or "error"
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const topRef = useRef(null);

  const { cartItems, getTotalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate, user]);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const totalAmount = getTotalAmount();
  const shippingCost = totalAmount > 1000 ? 0 : 50;
  const finalAmount = totalAmount + shippingCost;

  const handlePayment = async () => {
    if (!user) return navigate('/login');
    const addressToUse = shippingAddress;
    if (!addressToUse.street || !addressToUse.city || !addressToUse.state || !addressToUse.postalCode) {
      alert('Please fill in all shipping address fields');
      return;
    }
    setLoading(true);
    try {
      let itemsToOrder = [];
      if (user) {
        // Always fetch latest cart from server
        const cartRes = await axios.get('http://localhost:8080/api/cart', { withCredentials: true });
        itemsToOrder = (cartRes.data.items || []).map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity
        }));
      } else {
        // fallback, should not happen
        itemsToOrder = cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        }));
      }
      const orderData = {
        userId: user._id,
        items: itemsToOrder,
        shippingAddress: addressToUse,
        totalAmount: finalAmount,
        payment: { method: paymentMethod }
      };
      if (paymentMethod === 'cod') {
        await axios.post('http://localhost:8080/api/orders/create', orderData, { withCredentials: true });
        setMessage('Order placed! Pay on delivery.');
        setMessageType('success');
        setShowMessage(true);
        clearCart();
        setTimeout(() => {
          setShowMessage(false);
          navigate('/orders');
        }, 1500);
        return;
      }
      // Razorpay flow
      const orderRes = await axios.post('http://localhost:8080/api/orders/create', orderData, { withCredentials: true });
      const paymentRes = await axios.post('http://localhost:8080/api/payment/orders', { amount: finalAmount * 100 });
      const options = {
        key: 'rzp_test_agHUCXSuZ9wOR8',
        amount: paymentRes.data.amount,
        currency: 'INR',
        name: 'Clothing Store',
        description: 'Order Payment',
        order_id: paymentRes.data.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            'http://localhost:8080/api/payment/verify',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderRes.data._id,
            },
            { withCredentials: true }
          );
          if (verifyRes.data.success) {
            setMessage('Payment Successful!');
            setMessageType('success');
            setShowMessage(true);
            clearCart();
            setTimeout(() => {
              setShowMessage(false);
              navigate('/orders');
            }, 1500);
          } else {
            setMessage('Payment Verification Failed');
            setMessageType('error');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 1500);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999',
        },
        notes: {
          address: `${addressToUse.street}, ${addressToUse.city}`,
        },
        theme: {
          color: '#000',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage('Something went wrong during payment!');
      setMessageType('error');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10 py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <svg className="absolute top-0 left-0 w-full h-32 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#FFD700" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      <div ref={topRef}></div>
      {showMessage && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-fade-in-out ${messageType === 'success' ? 'bg-black text-[#FFD700]' : 'bg-red-600 text-white'}`}>
          {message}
        </div>
      )}
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-extrabold text-[#F26A1B] text-center mb-8 drop-shadow">Checkout</h2>
        <div className="bg-white shadow-lg rounded-lg md:grid md:grid-cols-2 md:gap-8 p-8">
          <div className="address-form">
            <h3 className="text-xl font-semibold text-black mb-6">Shipping Address</h3>
            <div className="space-y-4 border-t pt-4">
              <input
                type="text"
                placeholder="Street"
                className="w-full px-4 py-3 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={shippingAddress.street}
                onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={shippingAddress.city}
                onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-3 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={shippingAddress.state}
                onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full px-4 py-3 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={shippingAddress.postalCode}
                onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full px-4 py-3 border-2 border-[#FFD700]/40 rounded-lg bg-gray-50 cursor-not-allowed"
                value={shippingAddress.country}
                readOnly
              />
            </div>
          </div>
          <div className="order-summary mt-8 md:mt-0">
            <h3 className="text-xl font-semibold text-black mb-6">Order Summary</h3>
            <div className="space-y-4">
              {/* FIX: Use item.productId._id for the key and access item.productId.name/price for display */}
              {cartItems.map((item) => (
                <div key={item.productId._id} className="flex justify-between items-center text-gray-700">
                  <p>{item.productId.name} x {item.quantity}</p>
                  <p>₹{item.productId.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <hr className="my-6 border-gray-200" />
            <div className="space-y-2">
              <div className="flex justify-between text-gray-800">
                <strong>Subtotal:</strong>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <strong>Shipping:</strong>
                <span>₹{shippingCost}</span>
              </div>
              <div className="flex justify-between text-black font-bold text-lg mt-2">
                <strong>Total:</strong>
                <span>₹{finalAmount}</span>
              </div>
            </div>
            <div className="mt-6 mb-2">
              <label className="block mb-2 font-medium">Select Payment Method:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  Online Payment (Razorpay)
                </label>
              </div>
            </div>
            <button
              className="w-full mt-8 bg-black text-[#FFD700] font-bold py-3 rounded-lg hover:bg-[#F26A1B] hover:text-white transition shadow-lg focus:scale-95 active:scale-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;