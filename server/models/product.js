const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainCategory: { type: String, required: true },
  apparelType: { type: String, required: true },
  subcategories: [String],
  sizesAvailable: [String],
  price: { type: Number, required: true },
  colors: [String],
  description: { type: String },
  stock: {type:Number, required:true},
  photos: [String],
  productCode: { type: String, unique: true } // <- New field
});


module.exports = mongoose.model('Product', productSchema);