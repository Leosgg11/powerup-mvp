const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
