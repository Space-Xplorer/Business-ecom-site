import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext';

const Cart = () => {
  const [user, setUser] = useState(null);
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();

  useEffect(() => {
    fetch('http://localhost:8080/user/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.isAuthenticated ? data.user : null));
  }, []);

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const totalAmount = getTotalAmount();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaShoppingCart /> Shopping Cart</h2>
      {!user && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
          Please <Link to="/login" className="underline text-[#F26A1B]">log in</Link> to save your cart and checkout.
        </div>
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id || item.name} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                {item.img && <img src={item.img} alt={item.name} className="h-16 w-16 object-cover rounded" />}
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  <p className="text-gray-800 font-bold">Subtotal: ₹{item.price * item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleQuantityChange(item.id || item.name, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id || item.name, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                <button onClick={() => removeFromCart(item.id || item.name)} className="ml-4 text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">Total: ₹{totalAmount}</h3>
            <Link to="/checkout" className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-semibold shadow">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
