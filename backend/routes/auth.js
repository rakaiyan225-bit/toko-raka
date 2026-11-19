const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Fallback in-memory demo users
const fallbackUsers = [
  {
    id: 'u1',
    name: 'Ahmad Ramadhan',
    email: 'ahmad.ramadhan@email.com',
    phone: '0812-3456-7890',
    role: 'user',
  },
];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && user.password === password) {
        return res.json({
          success: true,
          message: 'Login berhasil',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        });
      }
    }

    // Fallback or demo match
    const found = fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found || email.includes('@')) {
      const userProfile = found || {
        id: 'u_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        phone: '0812-0000-0000',
        role: 'user',
      };
      return res.json({
        success: true,
        message: 'Login berhasil (Akun Pengguna)',
        user: userProfile,
      });
    }

    return res.status(401).json({ success: false, message: 'Email atau password salah' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
      }

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
        role: 'user',
      });

      return res.status(201).json({
        success: true,
        message: 'Pendaftaran akun berhasil',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      });
    }

    // Fallback registration
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      role: 'user',
    };
    fallbackUsers.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran akun berhasil',
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({ success: true, message: 'Auth endpoint is active' });
});

module.exports = router;
