const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");
const Product= require("../models/product")
const Cart = require('../models/cart');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  next();
};

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(cart || { userId: req.user._id, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = new Cart({ userId: req.user._id, items });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save cart' });
  }
});

router.put('/', isAuthenticated, async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    cart.items = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    await cart.save();
    
    const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(updatedCart);

  } catch (err) {
    console.error("Cart update error:", err); 
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

router.delete('/', isAuthenticated, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});


module.exports = router;