const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const User = require('./models/User');

const connectDB = require('./config/db');

const clearAllData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Menghapus semua data...');
    
    const deletedProducts = await Product.deleteMany({});
    console.log(`   ✅ ${deletedProducts.deletedCount} produk dihapus`);
    
    const deletedCustomers = await Customer.deleteMany({});
    console.log(`   ✅ ${deletedCustomers.deletedCount} pelanggan dihapus`);
    
    const deletedOrders = await Order.deleteMany({});
    console.log(`   ✅ ${deletedOrders.deletedCount} pesanan dihapus`);
    
    const deletedUsers = await User.deleteMany({});
    console.log(`   ✅ ${deletedUsers.deletedCount} akun user dihapus`);

    console.log('');
    console.log('🎉 Semua data berhasil dihapus! Database bersih.');
    console.log('   Toko siap diisi data baru melalui admin panel.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

clearAllData();
