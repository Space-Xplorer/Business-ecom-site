import React, { useState, useEffect } from 'react';

// Placeholder: In the future, cartItems should come from context or props, not hardcoded
const getInitialCart = () => {
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const Cart = () => {
  const [cartItems, setCartItems] = useState(getInitialCart());

  // Listen for cart updates from anywhere in the app
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getInitialCart());
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
      return updated;
    });
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id || item.name} className="flex items-center justify-between border-b py-4">
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => updateQuantity(item.id || item.name, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id || item.name, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
              <button onClick={() => removeItem(item.id || item.name)} className="ml-4 text-red-500 hover:underline">Remove</button>
            </div>
          </div>
        ))
      )}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold">Total: ₹{totalAmount}</h3>
        <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
