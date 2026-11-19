const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const User = require('../models/User');

const fallbackCustomers = [];

let inMemoryCustomers = [];

// GET / - List all customers
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { search, page = 1, limit = 50 } = req.query;
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      const customers = await Customer.find(query).sort({ createdAt: -1 });

      // Juga ambil user yang sudah register
      const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
      
      const customerMap = new Map();
      customers.forEach((c) => customerMap.set(c.email.toLowerCase(), c.toObject()));
      
      users.forEach((u) => {
        const emailKey = u.email.toLowerCase();
        if (!customerMap.has(emailKey)) {
          customerMap.set(emailKey, {
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone || '-',
            totalOrders: 0,
            totalSpent: 0,
            status: 'Aktif',
            createdAt: u.createdAt,
          });
        }
      });

      const merged = Array.from(customerMap.values());
      const filtered = search
        ? merged.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.email.toLowerCase().includes(search.toLowerCase()) ||
              (c.phone && c.phone.includes(search))
          )
        : merged;

      return res.json({
        success: true,
        data: filtered,
        pagination: {
          total: filtered.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filtered.length / parseInt(limit)) || 1,
        },
      });
    }
  } catch (err) {
    console.warn('[Customers] Using fallback data:', err.message);
  }

  let list = [...inMemoryCustomers];
  const { search } = req.query;
  if (search) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
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

// GET /:id - Single customer
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const customer = await Customer.findById(req.params.id);
      if (customer) return res.json({ success: true, data: customer });
    }
  } catch (err) {}

  const found = inMemoryCustomers.find((c) => c._id === req.params.id);
  if (found) return res.json({ success: true, data: found });
  res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
});

// POST / - Create customer
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const customer = await Customer.create(req.body);
      return res.status(201).json({ success: true, data: customer });
    }

    const newCust = {
      _id: 'cust_' + Date.now(),
      totalOrders: 0,
      totalSpent: 0,
      status: 'Aktif',
      ...req.body,
      createdAt: new Date(),
    };
    inMemoryCustomers.unshift(newCust);
    res.status(201).json({ success: true, data: newCust });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /:id - Update customer
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (customer) return res.json({ success: true, data: customer });
    }

    const idx = inMemoryCustomers.findIndex((c) => c._id === req.params.id);
    if (idx !== -1) {
      inMemoryCustomers[idx] = { ...inMemoryCustomers[idx], ...req.body };
      return res.json({ success: true, data: inMemoryCustomers[idx] });
    }

    res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete customer
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Customer.findByIdAndDelete(req.params.id);
      await User.findByIdAndDelete(req.params.id);
    }
    inMemoryCustomers = inMemoryCustomers.filter((c) => c._id !== req.params.id);
    res.json({ success: true, message: 'Pelanggan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
