const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const upload = require('../middleware/upload');

const fallbackProducts = [
  {
    _id: 'prod1',
    name: 'Kaos Oversize Hitam Clover',
    description: 'Kaos oversize hitam premium dengan logo Clover. Bahan cotton combed 30s yang nyaman dipakai sehari-hari.',
    price: 89000,
    category: 'Kaos',
    image: '',
    stock: 150,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    sold: 1200,
    isActive: true,
  },
  {
    _id: 'prod2',
    name: 'Kaos Putih Basic Ladsclub',
    description: 'Kaos putih basic dengan desain minimalis Ladsclub. Bahan cotton combed 24s premium.',
    price: 75000,
    category: 'Kaos',
    image: '',
    stock: 200,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    sold: 980,
    isActive: true,
  },
  {
    _id: 'prod3',
    name: 'Hoodie Hitam Clover Club',
    description: 'Hoodie hitam dengan desain eksklusif Clover Club. Bahan fleece tebal premium.',
    price: 199000,
    category: 'Hoodie',
    image: '',
    stock: 80,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    sold: 2100,
    isActive: true,
  },
  {
    _id: 'prod4',
    name: 'Hoodie Putih Clover Ladsclub',
    description: 'Hoodie putih dengan branding Clover Ladsclub. Bahan baby terry yang lembut.',
    price: 199000,
    category: 'Hoodie',
    image: '',
    stock: 65,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    sold: 1500,
    isActive: true,
  },
  {
    _id: 'prod5',
    name: 'Hoodie Clover Black',
    description: 'Hoodie premium full hitam dengan embroidery Clover. Edisi terbatas.',
    price: 289000,
    category: 'Hoodie',
    image: '',
    stock: 40,
    sizes: ['M', 'L', 'XL'],
    rating: 4.9,
    sold: 850,
    isActive: true,
  },
  {
    _id: 'prod6',
    name: 'Jaket Bomber Clover',
    description: 'Jaket bomber dengan desain Clover. Bahan parasut premium anti air.',
    price: 350000,
    category: 'Jaket',
    image: '',
    stock: 30,
    sizes: ['M', 'L', 'XL'],
    rating: 4.6,
    sold: 600,
    isActive: true,
  },
];

let inMemoryProducts = [...fallbackProducts];

// GET / - List all products
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { category, search, page = 1, limit = 10 } = req.query;
      const query = {};
      if (category && category !== 'Semua') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    }
  } catch (err) {
    console.warn('[Products] DB query error, using in-memory data:', err.message);
  }

  // Fallback in-memory response
  let list = [...inMemoryProducts];
  const { category, search } = req.query;
  if (category && category !== 'Semua') list = list.filter((p) => p.category === category);
  if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

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

// GET /:id - Single product
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json({ success: true, data: product });
    }
  } catch (err) {}

  const found = inMemoryProducts.find((p) => p._id === req.params.id);
  if (found) return res.json({ success: true, data: found });
  res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
});

// POST / - Create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) productData.image = `/uploads/${req.file.filename}`;
    if (productData.sizes && typeof productData.sizes === 'string') {
      productData.sizes = productData.sizes.split(',').map((s) => s.trim());
    }

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(productData);
      return res.status(201).json({ success: true, data: product });
    }

    const newProd = {
      _id: 'prod_' + Date.now(),
      ...productData,
      rating: 5.0,
      sold: 0,
      createdAt: new Date(),
    };
    inMemoryProducts.unshift(newProd);
    res.status(201).json({ success: true, data: newProd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /:id - Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    if (updateData.sizes && typeof updateData.sizes === 'string') {
      updateData.sizes = updateData.sizes.split(',').map((s) => s.trim());
    }

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (product) return res.json({ success: true, data: product });
    }

    const idx = inMemoryProducts.findIndex((p) => p._id === req.params.id);
    if (idx !== -1) {
      inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updateData };
      return res.json({ success: true, data: inMemoryProducts[idx] });
    }

    res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Product.findByIdAndDelete(req.params.id);
    }
    inMemoryProducts = inMemoryProducts.filter((p) => p._id !== req.params.id);
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
