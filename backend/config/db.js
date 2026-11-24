const mongoose = require('mongoose');
const dns = require('dns');

// Gunakan Google DNS & Cloudflare DNS untuk resolve mongodb+srv SRV record
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    // Validasi URI kosong
    if (!uri) {
      console.error('❌ [MongoDB] MONGODB_URI tidak ditemukan di file .env');
      console.info('ℹ️  Tambahkan MONGODB_URI di backend/.env');
      return;
    }

    // Validasi format URI yang tidak lengkap (hostname generik tanpa cluster ID)
    // Format salah: @cluster.mongodb.net  → seharusnya: @cluster0.xxxxx.mongodb.net
    const invalidHostPattern = /mongodb\+srv:\/\/[^@]+@cluster\.mongodb\.net/;
    if (invalidHostPattern.test(uri) || uri.includes('user:password@')) {
      console.error('❌ [MongoDB] MONGODB_URI di .env tidak lengkap!');
      console.error('');
      console.error('   URI saat ini:');
      console.error(`   ${uri}`);
      console.error('');
      console.error('   ⚠️  Hostname "@cluster.mongodb.net" SALAH — kurang Cluster ID unik.');
      console.error('   ✅  Format yang benar:');
      console.error('       mongodb+srv://USERNAME:PASSWORD@cluster0.XXXXX.mongodb.net/DB_NAME?retryWrites=true&w=majority');
      console.error('');
      console.error('   📋 Cara mendapatkan URI yang benar:');
      console.error('   1. Login ke https://cloud.mongodb.com');
      console.error('   2. Klik tombol [Connect] pada cluster Anda');
      console.error('   3. Pilih "Drivers" → Node.js');
      console.error('   4. Salin connection string (contoh: cluster0.ab12c.mongodb.net)');
      console.error('   5. Update MONGODB_URI di backend/.env');
      console.error('');
      return;
    }

    // Coba konek ke MongoDB Atlas
    console.log('🔄 [MongoDB] Menghubungkan ke MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ [MongoDB] Berhasil terhubung ke: ${conn.connection.host}`);
    console.log(`✅ [MongoDB] Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [MongoDB] Koneksi gagal: ${error.message}`);
    console.error('');
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('   ⚠️  Hostname tidak ditemukan — cek kembali cluster ID di URI MongoDB Atlas Anda.');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('   ⚠️  Username/password salah — cek kredensial di MongoDB Atlas → Database Access.');
    } else if (error.message.includes('IP') || error.message.includes('network')) {
      console.error('   ⚠️  IP tidak diizinkan — tambahkan 0.0.0.0/0 di MongoDB Atlas → Network Access.');
    }
    console.error('   Server tetap berjalan tanpa database.');
  }
};

module.exports = connectDB;
