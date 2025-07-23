import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Helper
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // Load cart from localStorage or server on mount or user change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        // If localStorage cart exists, sync to server then clear localStorage
        const stored = localStorage.getItem('cartItems');
        if (stored) {
          const items = JSON.parse(stored);
          await axios.post('http://localhost:8080/api/orders/cart', { items }, { withCredentials: true });
          localStorage.removeItem('cartItems');
        }
        // Fetch cart from server
        const res = await axios.get('http://localhost:8080/api/orders/cart', { withCredentials: true });
        setCartItems(res.data.items || []);
        updateCartCount(res.data.items || []);
      } else {
        // Not logged in, use localStorage
        const stored = localStorage.getItem('cartItems');
        if (stored) {
          const items = JSON.parse(stored);
          setCartItems(items);
          updateCartCount(items);
        } else {
          setCartItems([]);
          setCartCount(0);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Save cart to localStorage or server
  const saveCart = async (items) => {
    if (user) {
      await axios.put('http://localhost:8080/api/orders/cart', { items }, { withCredentials: true });
    } else {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
    updateCartCount(items);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id || item.name === product.name);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          (item.id === product.id || item.name === product.name)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          id: product.id || product._id || product.name,
          productId: product._id || product.id || undefined,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: quantity
        };
        updatedItems = [...prevItems, newItem];
      }
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([]);
    setCartCount(0);
    if (user) {
      await axios.delete('http://localhost:8080/api/orders/cart', { withCredentials: true });
    } else {
      localStorage.removeItem('cartItems');
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Get total amount
  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};