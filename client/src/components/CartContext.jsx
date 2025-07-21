import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
        updateCartCount(items);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Update cart count
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // Save cart to localStorage
  const saveCartToStorage = (items) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
      updateCartCount(items);
      // Dispatch custom event for other components
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
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
          id: product.id || product.name,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: quantity
        };
        updatedItems = [...prevItems, newItem];
      }

      saveCartToStorage(updatedItems);
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
      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setCartCount(0);
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