// models/MainCategory.js
const mongoose = require('mongoose');

const mainCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  apparelTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApparelType' }]
});

module.exports = mongoose.model('MainCategory', mainCategorySchema);
