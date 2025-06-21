const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },

  // Replace embedded address array with references
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
