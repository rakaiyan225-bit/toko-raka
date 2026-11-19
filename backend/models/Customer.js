const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama customer wajib diisi'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Aktif', 'Nonaktif'],
    default: 'Aktif',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Customer', customerSchema);
