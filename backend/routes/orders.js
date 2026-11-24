const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

const fallbackOrders = [];

let inMemoryOrders = [];

// GET / - List all orders
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { status, search, page = 1, limit = 10 } = req.query;
      const query = {};
      if (status && status !== 'Semua') query.status = status;
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'customer.name': { $regex: search, $options: 'i' } },
        ];
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .populate('items.product', 'name image price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    }
  } catch (err) {
    console.warn('[Orders] Using fallback data:', err.message);
  }

  let list = [...inMemoryOrders];
  const { status, search } = req.query;
  if (status && status !== 'Semua') list = list.filter((o) => o.status === status);
  if (search) {
    list = list.filter(
      (o) =>
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    success: true,
    data: list,
    pagination: {
      total: list.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  });
});

// GET /:id - Single order
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id).populate('items.product');
      if (order) return res.json({ success: true, data: order });
    }
  } catch (err) {}

  const found = inMemoryOrders.find((o) => o._id === req.params.id || o.orderId === req.params.id);
  if (found) return res.json({ success: true, data: found });
  res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
});

// POST / - Create order
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.create(req.body);
      return res.status(201).json({ success: true, data: order });
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderId: req.body.orderId || ('#CLD' + randomNum),
      ...req.body,
      status: req.body.status || 'Diproses',
      createdAt: new Date(),
    };
    inMemoryOrders.unshift(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (order) return res.json({ success: true, data: order });
    }

    const idx = inMemoryOrders.findIndex(
      (o) => o._id === req.params.id || o.orderId === req.params.id
    );
    if (idx !== -1) {
      inMemoryOrders[idx].status = status;
      return res.json({ success: true, data: inMemoryOrders[idx] });
    }

    res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Order.findByIdAndDelete(req.params.id);
    }
    inMemoryOrders = inMemoryOrders.filter((o) => o._id !== req.params.id && o.orderId !== req.params.id);
    res.json({ success: true, message: 'Pesanan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
