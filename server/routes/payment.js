const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// router.post("/create-order", async (req, res) => {
//   const { amount, orderId } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: orderId || "order_rcptid_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Order creation failed", error: err });
//   }
// });

// // Verify payment (optional for security)
// router.post("/verify", (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     // Update order payment status
//     if (orderId) {
//       const Order = require("../models/order");
//       Order.findOneAndUpdate(
//         { orderId },
//         { 
//           'payment.razorpayOrderId': razorpay_order_id,
//           'payment.razorpayPaymentId': razorpay_payment_id,
//           'payment.status': 'paid',
//           status: 'confirmed',
//           updatedAt: new Date()
//         }
//       ).catch(err => console.error("Error updating order:", err));
//     }
    
//     return res.status(200).json({ success: true, message: "Payment verified" });
//   } else {
//     return res.status(400).json({ success: false, message: "Invalid signature" });
//   }
// });

// router.post("/orders", async (req, res) => {
//   const { amount, orderId } = req.body;
//   try {
//     const options = {
//       amount: amount, // already in paise from frontend
//       currency: "INR",
//       receipt: orderId || "order_rcptid_" + Date.now(),
//     };
//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Order creation failed", error: err });
//   }
// });

router.post('/orders', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount, // amount in paise (₹100 = 10000)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Razorpay order creation failed', error: err });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'Paid'
    });
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: 'Signature verification failed' });
  }
});

module.exports = router;
