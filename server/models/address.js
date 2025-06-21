const addressSchema = new Schema({
  addressType: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model("Address", addressSchema);
