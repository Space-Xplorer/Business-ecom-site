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

// Create new order
// router.post("/create", isAuthenticated, async (req, res) => {
//   try {
//     const { items, shippingAddress, totalAmount, notes } = req.body;
    
//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Order must contain at least one item" });
//     }

//     if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
//       return res.status(400).json({ message: "Complete shipping address is required" });
//     }

//     const order = new Order({
//       userId: req.user._id,
//       items: items.map(item => ({
//         productName: item.productName,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       shippingAddress,
//       totalAmount,
//       notes,
//       payment: {
//         amount: totalAmount,
//         status: 'pending'
//       }
//     });

//     await order.save();
    
//     res.status(201).json({ 
//       message: "Order created successfully", 
//       orderId: order.orderId,
//       order 
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Failed to create order", error: error.message });
//   }
// });

router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, payment } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }
    const populatedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error('Product not found: ' + item.productId);
      return {
        productId: item.productId,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity
      };
    }));
    const userId = req.user._id;
    const orderId = `${userId}-${Date.now()}`;
    let paymentInfo = {
      method: payment?.method || 'razorpay',
      amount: totalAmount,
      status: 'pending'
    };
    if (paymentInfo.method === 'cod') {
      paymentInfo.status = 'pending';
    }
    const newOrder = new Order({
      orderId,
      userId,
      items: populatedItems,
      totalAmount,
      shippingAddress,
      payment: paymentInfo
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user's orders
router.get("/my-orders", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get specific order by ID
router.get("/:orderId", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId, 
      userId: req.user._id 
    }).populate('userId', 'firstName lastName email');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Update order status (admin only)
router.put("/:orderId/status", async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Update payment status
router.put("/:orderId/payment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { 
        'payment.razorpayOrderId': razorpayOrderId,
        'payment.razorpayPaymentId': razorpayPaymentId,
        'payment.status': status,
        status: status === 'paid' ? 'confirmed' : 'pending',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Payment status updated successfully", order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});

// Cart API
router.get('/cart', isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(cart || { userId: req.user._id, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

router.post('/cart', isAuthenticated, async (req, res) => {
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

router.put('/cart', isAuthenticated, async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
    cart.items = items;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

router.delete('/cart', isAuthenticated, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;