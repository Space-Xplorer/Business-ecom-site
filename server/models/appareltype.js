// models/ApparelType.js
const mongoose = require('mongoose');

const apparelTypeSchema = new mongoose.Schema({
  name: String,
  mainCategory: {
    type: String, // <--- Change from ObjectId to String
    enum: ['Men', 'Women', 'Kids', 'All', 'General'], // Optional: enforce allowed values
    required: true
  },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
});


module.exports = mongoose.model('ApparelType', apparelTypeSchema);
