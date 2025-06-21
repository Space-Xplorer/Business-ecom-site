const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: { type: String, unique: true, required: true },

  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // price at time of order
    variant: {
      size: String,
      color: String
    }
  }],

  // Reference to separate address collection
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true
  },

  payment: {
    method: { type: String, enum: ['credit_card', 'upi', 'net_banking', 'cod'], required: true },
    transactionId: { type: String },
    status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
    amount: { type: Number, required: true }
  },

  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  totalAmount: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
