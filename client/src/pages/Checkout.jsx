import React, { useState, useEffect } from 'react';
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

  const { cartItems, getTotalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate, user]);

  const totalAmount = getTotalAmount();
  const shippingCost = totalAmount > 1000 ? 0 : 50;
  const finalAmount = totalAmount + shippingCost;

  const handlePayment = async () => {
    if (!user) return navigate('/login');
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setLoading(true);
    try {
      // Create order in backend
      const orderData = {
        userId: user._id,
        items: cartItems,
        shippingAddress,
        totalAmount: finalAmount,
      };

      const orderRes = await axios.post('http://localhost:8080/api/orders', orderData, {
        withCredentials: true,
      });

      // Initiate Razorpay checkout
      const paymentRes = await axios.post('http://localhost:8080/api/payment/orders', {
        amount: finalAmount * 100,
      });

      const options = {
        key: 'rzp_test_yourkey', // Replace with your Razorpay key
        amount: paymentRes.data.amount,
        currency: 'INR',
        name: 'Clothing Store',
        description: 'Order Payment',
        order_id: paymentRes.data.id,
        handler: async function (response) {
          // Capture payment
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
            alert('Payment Successful!');
            clearCart();
            navigate('/orders');
          } else {
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999',
        },
        notes: {
          address: `${shippingAddress.street}, ${shippingAddress.city}`,
        },
        theme: {
          color: '#000',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <div className="address-form">
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, street: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, state: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                postalCode: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Country"
            value={shippingAddress.country}
            readOnly
          />
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="summary-item">
              <p>{item.name} x {item.quantity}</p>
              <p>₹{item.price * item.quantity}</p>
            </div>
          ))}
          <hr />
          <div className="summary-item">
            <strong>Subtotal:</strong>
            <span>₹{totalAmount}</span>
          </div>
          <div className="summary-item">
            <strong>Shipping:</strong>
            <span>₹{shippingCost}</span>
          </div>
          <div className="summary-item total">
            <strong>Total:</strong>
            <span>₹{finalAmount}</span>
          </div>
          <button className="checkout-btn" onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
