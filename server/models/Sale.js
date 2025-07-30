// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  client: { type: String },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);

