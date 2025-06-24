// models/ApparelType.js
const mongoose = require('mongoose');

const apparelTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'MainCategory', required: true },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
});

module.exports = mongoose.model('ApparelType', apparelTypeSchema);
