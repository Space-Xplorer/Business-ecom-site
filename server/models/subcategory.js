// models/Subcategory.js
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  apparelType: { type: mongoose.Schema.Types.ObjectId, ref: 'ApparelType', required: true }
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
