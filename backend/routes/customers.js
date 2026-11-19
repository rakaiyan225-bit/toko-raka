const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

const fallbackCustomers = [
  {
    _id: 'cust_1',
    name: 'Ahmad Ramadhan',
    email: 'ahmad.ramadhan@email.com',
    phone: '0812-3456-7890',
    totalOrders: 12,
    totalSpent: 2450000,
    status: 'Aktif',
  },
  {
    _id: 'cust_2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    phone: '0813-9876-5432',
    totalOrders: 8,
    totalSpent: 1820000,
    status: 'Aktif',
  },
  {
    _id: 'cust_3',
    name: 'Dimas Pratama',
    email: 'dimas.pratama@email.com',
    phone: '0814-2234-5566',
    totalOrders: 5,
    totalSpent: 950000,
    status: 'Aktif',
  },
  {
    _id: 'cust_4',
    name: 'Rina Amelia',
    email: 'rina.amelia@email.com',
    phone: '0815-6677-8899',
    totalOrders: 15,
    totalSpent: 3120000,
    status: 'Aktif',
  },
];

let inMemoryCustomers = [...fallbackCustomers];

// GET / - List all customers
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { search, page = 1, limit = 10 } = req.query;
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Customer.countDocuments(query);
      const customers = await Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: customers,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
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

module.exports = router;
