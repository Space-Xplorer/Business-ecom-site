const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Order = require("../models/order"); // ✅ REQUIRED
const { isAdmin } = require("../middlewares");
require("../passport-config");

router.get("/", isAdmin, async (req, res) => {
  try {
    const [totalOrders, deliveredOrders, pendingOrders, cancelledOrders, recentOrders] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
      Order.find().sort({ placedAt: -1 }).limit(5)
    ]);

    res.render("admin/stats", {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      orders: recentOrders
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to load dashboard stats.");
    res.redirect("/admin/dashboard");
  }
});

module.exports = router