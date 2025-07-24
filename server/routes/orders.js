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

// In routes/orders.js

router.post('/create', isAuthenticated, async (req, res) => {
  try {
    // ... other code
    
    const populatedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error('Product not found: ' + item.productId);
      return {
        productId: item.productId,
        productName: product.name,
        price: product.price, // ✅ Corrected from productPrice to price
        quantity: item.quantity
      };
    }));

    // ... rest of the code
    const newOrder = new Order({
      orderId,
      userId,
      items: populatedItems, // Now this array has the correct field names
      totalAmount,
      shippingAddress,
      payment: paymentInfo
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    // The console.warn on line 56 from your error log will now be inside this catch block
    console.error('Error creating order:', error);
    // Correctly send the error message back in the response
    res.status(400).json({ message: 'Error creating order', error: error.message });
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

module.exports = router;

