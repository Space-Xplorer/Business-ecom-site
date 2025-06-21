const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new mongoose.Schema({
  email: String,
  username: String,
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    default: "admin"
  }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);
