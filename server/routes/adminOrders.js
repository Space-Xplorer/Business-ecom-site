const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { isAdmin } = require("../middlewares");

// Get all orders (admin)
router.get("/", isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get order statistics
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.find({})
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ message: "Failed to fetch order statistics" });
  }
});

// Get specific order details (admin)
router.get("/:orderId", isAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('userId', 'firstName lastName email phone');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Update order status (admin)
router.put("/:orderId/status", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Add notes to order (admin)
router.put("/:orderId/notes", isAdmin, async (req, res) => {
  try {
    const { notes } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { notes, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order notes updated successfully", order });
  } catch (error) {
    console.error("Error updating order notes:", error);
    res.status(500).json({ message: "Failed to update order notes" });
  }
});

module.exports = router;