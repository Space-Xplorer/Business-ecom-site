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
        const cartRes = await axios.get('http://localhost:8080/api/orders/cart', { withCredentials: true });
        itemsToOrder = (cartRes.data.items || []).map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity
        }));
      } else {
        // fallback, should not happen
        itemsToOrder = cartItems.map(item => ({
          productId: item.productId || item.id,
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
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div ref={topRef}></div>
      {showMessage && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-fade-in-out ${messageType === 'success' ? 'bg-black text-[#FFD700]' : 'bg-red-600 text-white'}`}>
          {message}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Checkout</h2>
        <div className="bg-white shadow-lg rounded-lg md:grid md:grid-cols-2 md:gap-8 p-8">
          <div className="address-form">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h3>
            <div className="space-y-4 border-t pt-4">
              <input
                type="text"
                placeholder="Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.street}
                onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.city}
                onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.state}
                onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.postalCode}
                onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                value={shippingAddress.country}
                readOnly
              />
            </div>
          </div>
          <div className="order-summary mt-8 md:mt-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-gray-700">
                  <p>{item.name} x {item.quantity}</p>
                  <p>₹{item.price * item.quantity}</p>
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
              <div className="flex justify-between text-gray-900 font-bold text-lg mt-2">
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
              className="w-full mt-8 bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
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