// routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

// Crear una nueva venta
router.post('/', async (req, res) => {
  try {
    const { client, products } = req.body;
    const total = products.reduce((acc, p) => acc + (p.quantity * p.price), 0);

    // Descuenta el stock de cada producto vendido
    for (const p of products) {
      const prod = await Product.findById(p.productId);
      if (prod) {
        if (prod.stock < p.quantity) {
          return res.status(400).json({ error: `Stock insuficiente para ${prod.name}` });
        }
        prod.stock -= p.quantity;
        await prod.save();
      }
    }

    const newSale = new Sale({ client, products, total });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
