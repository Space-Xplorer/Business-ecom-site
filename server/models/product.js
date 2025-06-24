const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainCategory: { type: String, required: true },
  apparelType: { type: String, required: true },
  subcategories: { type: String, required: true },
  sizesAvailable: [String],
  price: { type: Number, required: true },
  colors: [String],
  description: { type: String },
  stock: { type: Number, required: true }, // only one stock field
  photos: [String],
  productCode: { type: String, unique: true }
});

module.exports = mongoose.model('Product', productSchema);
