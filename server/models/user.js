const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email" // Makes "email" the login field
});

module.exports = mongoose.model("User", userSchema);
