const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: { type: String, unique: true, required: true, default: () => 'ORD' + Date.now() },

  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // price at time of order
  }],

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
  },

  payment: {
    method: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
    transactionId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
    amount: { type: Number, required: true }
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  totalAmount: { type: Number, required: true },
  
  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
