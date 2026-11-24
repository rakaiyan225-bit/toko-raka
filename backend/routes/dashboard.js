const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// GET /stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalCustomers = await Customer.countDocuments();

      const diprosesCount = await Order.countDocuments({ status: 'Diproses' });
      const dikirimCount = await Order.countDocuments({ status: 'Dikirim' });
      const selesaiCount = await Order.countDocuments({ status: 'Selesai' });

      const salesAgg = await Order.aggregate([
        { $match: { status: { $ne: 'Dibatalkan' } } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
      ]);
      const totalSales = salesAgg.length > 0 ? salesAgg[0].totalSales : 0;

      return res.json({
        success: true,
        data: {
          totalSales,
          totalOrders,
          totalProducts,
          totalCustomers,
          orderCounts: {
            diproses: diprosesCount,
            dikirim: dikirimCount,
            selesai: selesaiCount,
          },
        },
      });
    }
  } catch (error) {
    console.warn('[Dashboard Stats] Using fallback data:', error.message);
  }

  // Fallback data when DB is empty or disconnected
  res.json({
    success: true,
    data: {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
    },
  });
});

// GET /sales-chart - Monthly sales data for chart (Jan-Sep)
router.get('/sales-chart', async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];

  try {
    if (mongoose.connection.readyState === 1) {
      const currentYear = new Date().getFullYear();
      const salesData = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'Dibatalkan' },
            createdAt: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            total: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const chartData = months.map((month, index) => {
        const found = salesData.find((s) => s._id === index + 1);
        return {
          month,
          sales: found ? found.total : 0,
        };
      });

      return res.json({ success: true, data: chartData });
    }
  } catch (error) {
    console.warn('[Dashboard Chart] Using fallback data:', error.message);
  }

  // Fallback empty chart
  const fallbackChart = months.map((month) => ({ month, sales: 0 }));
  res.json({ success: true, data: fallbackChart });
});

// GET /recent-orders - Last 10 orders
router.get('/recent-orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find()
        .populate('items.product', 'name image price')
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json({ success: true, data: orders });
    }
  } catch (error) {
    console.warn('[Recent Orders] Using fallback data:', error.message);
  }

  // Fallback empty orders
  res.json({ success: true, data: [] });
});

module.exports = router;
