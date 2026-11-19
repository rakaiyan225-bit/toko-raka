const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('user:password@cluster')) {
      console.warn('⚠️  [MongoDB] MONGODB_URI belum dikonfigurasi dengan kredensial MongoDB Atlas yang valid di .env');
      console.warn('ℹ️  Silakan ganti MONGODB_URI di backend/.env dengan connection string MongoDB Atlas Anda.');
      return;
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server tetap berjalan. Pastikan IP Anda diizinkan di Network Access MongoDB Atlas (0.0.0.0/0).');
  }
};

module.exports = connectDB;
