const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama produk wajib diisi'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Harga produk wajib diisi'],
    min: 0,
  },
  category: {
    type: String,
    enum: ['Kaos', 'Hoodie', 'Jaket', 'Kemeja', 'T-Shirt', 'Celana', 'Aksesori'],
  },
  image: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
