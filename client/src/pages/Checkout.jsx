// import React, { useState, useEffect } from 'react';
// import { useCart } from '../components/CartContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import '../styles/Checkout.css';

// const Checkout = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState({
//     street: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     country: 'India'
//   });

//   const { cartItems, getTotalAmount, clearCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is authenticated
//     axios.get("http://localhost:8080/user/status", { withCredentials: true })
//       .then(res => {
//         if (res.data.isAuthenticated) {
//           setUser(res.data.user);
//         } else {
//           navigate('/login');
//         }
//       })
//       .catch(() => navigate('/login'));
//   }, [navigate]);

//   useEffect(() => {
//     // Redirect if cart is empty
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems, navigate]);

//   const totalAmount = getTotalAmount();
//   const shippingCost = totalAmount > 1000 ? 0 : 50;
//   const finalAmount = totalAmount + shippingCost;

//   const handlePayment = async () => {
//     if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
//       alert('Please fill in all shipping address fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Create order in backend
//       const orderData = {
//         userId: user._id,
//         items: cartItems,
//         shippingAddress,
//         totalAmount: finalAmount,
//       };

//       const orderRes = await axios.post('http://localhost:8080/api/orders/create', orderData, {
//         withCredentials: true,
//       });

//       // Initiate Razorpay checkout
//       const paymentRes = await axios.post('http://localhost:8080/api/payment/orders', {
//         amount: finalAmount * 100,
//       });

//       const options = {
//         key: 'rzp_test_agHUCXSuZ9wOR8', // Replace with your Razorpay key
//         amount: paymentRes.data.amount,
//         currency: 'INR',
//         name: 'Clothing Store',
//         description: 'Order Payment',
//         order_id: paymentRes.data.id,
//         handler: async function (response) {
//           // Capture payment
//           const verifyRes = await axios.post(
//             'http://localhost:8080/api/payment/verify',
//             {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderId: orderRes.data._id,
//             },
//             { withCredentials: true }
//           );

//           if (verifyRes.data.success) {
//             alert('Payment Successful!');
//             clearCart();
//             navigate('/orders');
//           } else {
//             alert('Payment Verification Failed');
//           }
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//           contact: user.phone || '9999999999',
//         },
//         notes: {
//           address: `${shippingAddress.street}, ${shippingAddress.city}`,
//         },
//         theme: {
//           color: '#000',
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error(error);
//       alert('Something went wrong during payment!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <h2>Checkout</h2>
//       <div className="checkout-content">
//         <div className="address-form">
//           <h3>Shipping Address</h3>
//           <input
//             type="text"
//             placeholder="Street"
//             value={shippingAddress.street}
//             onChange={(e) =>
//               setShippingAddress({ ...shippingAddress, street: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="City"
//             value={shippingAddress.city}
//             onChange={(e) =>
//               setShippingAddress({ ...shippingAddress, city: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="State"
//             value={shippingAddress.state}
//             onChange={(e) =>
//               setShippingAddress({ ...shippingAddress, state: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Postal Code"
//             value={shippingAddress.postalCode}
//             onChange={(e) =>
//               setShippingAddress({
//                 ...shippingAddress,
//                 postalCode: e.target.value,
//               })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Country"
//             value={shippingAddress.country}
//             readOnly
//           />
//         </div>

//         <div className="order-summary">
//           <h3>Order Summary</h3>
//           {cartItems.map((item, index) => (
//             <div key={index} className="summary-item">
//               <p>{item.name} x {item.quantity}</p>
//               <p>₹{item.price * item.quantity}</p>
//             </div>
//           ))}
//           <hr />
//           <div className="summary-item">
//             <strong>Subtotal:</strong>
//             <span>₹{totalAmount}</span>
//           </div>
//           <div className="summary-item">
//             <strong>Shipping:</strong>
//             <span>₹{shippingCost}</span>
//           </div>
//           <div className="summary-item total">
//             <strong>Total:</strong>
//             <span>₹{finalAmount}</span>
//           </div>
//           <button className="checkout-btn" onClick={handlePayment} disabled={loading}>
//             {loading ? 'Processing...' : 'Pay Now'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
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
  const shippingCost = totalAmount > 1000 ? 0 : 50;
  const finalAmount = totalAmount + shippingCost;

  const handlePayment = async () => {
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

      const orderRes = await axios.post('http://localhost:8080/api/orders/create', orderData, {
        withCredentials: true,
      });

      // Initiate Razorpay checkout
      const paymentRes = await axios.post('http://localhost:8080/api/payment/creat-order', {
        amount: finalAmount * 100,
      });

      const options = {
        key: 'rzp_test_agHUCXSuZ9wOR8', // Replace with your Razorpay key
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
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Checkout</h2>
        <div className="bg-white shadow-lg rounded-lg md:grid md:grid-cols-2 md:gap-8 p-8">
          <div className="address-form">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, street: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, state: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <button
              className="w-full mt-8 bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;