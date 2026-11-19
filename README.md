# ☘️ CLOVER LADSCLUB - Fashion Streetwear E-Commerce

Aplikasi web toko baju **CLOVER LADSCLUB** berbasis MERN Stack (MongoDB Atlas, Express.js, React.js, Node.js). Desain antarmuka dibuat presisi mengikuti mockup gambar yang diberikan:

1. **Halaman User / Pembeli** (`/`):
   - **Navbar**: Logo Clover Ladsclub, kotak pencarian dengan fitur navigasi `/admin`, ikon Keranjang belanja, dan Akun Saya.
   - **Hero Banner**: Promo 9.9 Flash Sale (diskon 50% + Gratis Ongkir), tombol "BELI SEKARANG", badge promo, dan navigasi Kategori (Kaos, Hoodie, Jaket, Kemeja, T-Shirt, Celana, Aksesori).
   - **Produk Rekomendasi**: Menampilkan produk streetwear (*Kaos Oversize Hitam, Kaos Putih Basic, Hoodie Hitam Clover Club, Hoodie Putih Clover Ladsclub*) lengkap dengan harga Rp, rating bintang, jumlah terjual, tombol "Tambah Keranjang", dan "Beli Sekarang".
   - **Detail Produk** (`/product/:id`): Pilihan ukuran (S, M, L, XL), pemilih kuantitas, deskripsi produk, tombol Tambah Keranjang & Beli Sekarang.
   - **Keranjang Belanja** (`/cart`): Daftar produk yang dipilih, hitung otomatis subtotal, ongkir Rp15.000, tombol lanjut ke checkout.
   - **Footer**: 4 kolom informasi layanan pelanggan, tentang Clover Ladsclub, dan metode pembayaran/ekspedisi (VISA, Mastercard, GoPay, Shopee, JNE).

2. **Halaman Checkout - Bayar via WA** (`/checkout`):
   - **Tema Gelap (Dark Mode)** presisi sesuai Gambar 1.
   - **Header**: `← ☘️ CHECKOUT - BAYAR VIA WA`
   - **1. Ringkasan Pesanan**: Thumbnail produk (*Hoodie Clover Black* x1, Ukuran: M, Rp289.000, Ongkir Rp15.000, Total Pembayaran Rp304.000).
   - **2. Pilih Metode Pembayaran**: Opsi pembayaran interaktif dengan radio button (DANA, OVO, GoPay, ShopeePay, Transfer Bank, COD).
   - **3. Konfirmasi & Bayar via WhatsApp**: Tombol hijau besar `💬 LANJUT KE WHATSAPP`, box info pesan otomatis terisi, dan catatan keamanan transaksi.

3. **Halaman Admin** (`/admin`):
   - **Akses Admin**: Sesuai permintaan, halaman admin dibedakan dengan menambahkan `/admin` pada bagian pencarian (atau akses langsung ke route `/admin`).
   - **Sidebar Hijau Tua**: Menu Dashboard, Produk, Pesanan, Pelanggan, Promo, Laporan dengan active pill hijau mint dan info admin Clover di bagian bawah.
   - **Dashboard Admin** (`/admin`):
     - 4 Kartu Statistik: Total Penjualan (Rp12.450.000), Pesanan (342), Produk (48), Pelanggan (1.250).
     - Grafik Penjualan (Jan - Sep) dengan garis SVG tren naik.
     - Ringkasan Status Pesanan (Diproses: 28, Dikirim: 120, Selesai: 194).
     - Tabel Pesanan Terbaru dengan status pill warna-warni dan pagination.
   - **Manajemen Pesanan** (`/admin/pesanan`): Filter status, Ubah Status modal, Detail Pesanan modal.
   - **Manajemen Pelanggan** (`/admin/pelanggan`): 3 Kartu Statistik, Tabel Pelanggan dengan avatar inisial warna-warni, Modal Tambah & Detail.
   - **Manajemen Produk** (`/admin/produk`): CRUD Produk lengkap (Tambah, Edit, Hapus).
   - **Promo & Laporan** (`/admin/promo` & `/admin/laporan`).

---

## ☁️ Panduan Hosting ke Vercel (Gratis & Cepat)

Proyek ini sudah dilengkapi konfigurasi otomatis untuk Vercel:
- **`vercel.json` di root**: Menggabungkan Express backend (`/api/*`) dan React frontend menjadi **1 Project Vercel** tanpa masalah CORS.
- **`api/index.js`**: Serverless function handler untuk Express.
- **`frontend/vercel.json`**: SPA fallback routing untuk React Router.
- **`backend/vercel.json`**: Serverless config jika ingin di-deploy terpisah.

---

### Cara 1: Deploy Menjadi 1 Project Vercel (Sangat Direkomendasikan ⭐)
Dengan cara ini, frontend dan backend berjalan di **satu domain Vercel yang sama** (contoh: `clover-ladsclub.vercel.app`). Tidak perlu mengatur domain terpisah atau CORS!

#### Langkah-langkah:
1. **Push proyek ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit Clover Ladsclub"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/toko-raka.git
   git push -u origin main
   ```

2. **Import ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login (bisa via GitHub).
   - Klik **"Add New..."** lalu pilih **"Project"**.
   - Pilih repository GitHub `toko-raka` yang baru Anda buat, lalu klik **"Import"**.

3. **Setting Environment Variables di Vercel**:
   - Di bagian **Environment Variables**, tambahkan:
     - **Key**: `MONGODB_URI`
     - **Value**: Connection string MongoDB Atlas Anda (misal: `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/clover_ladsclub?retryWrites=true&w=majority`)
   - Biarkan setting lainnya default (Vercel otomatis mendeteksi konfigurasi dari `vercel.json`).

4. **Klik Deploy**:
   - Klik tombol **"Deploy"**. Vercel akan otomatis meng-compile React dan membungkus Express menjadi Serverless Function.
   - Website langsung aktif dan siap digunakan!

---

### Cara 2: Deploy Menjadi 2 Project Terpisah di Vercel

Jika Anda ingin memisahkan backend dan frontend di URL yang berbeda:

#### 1. Deploy Backend:
- Di Vercel dashboard, klik **"Add New..."** -> **"Project"**.
- Pilih repository `toko-raka`.
- Di bagian **Root Directory**, klik **Edit** dan pilih folder `backend`.
- Tambahkan Environment Variable:
  - `MONGODB_URI`: Connection string MongoDB Atlas Anda.
- Klik **Deploy**. Anda akan mendapatkan URL Backend (contoh: `https://clover-backend.vercel.app`).

#### 2. Deploy Frontend:
- Di Vercel dashboard, klik **"Add New..."** -> **"Project"**.
- Pilih repository `toko-raka` yang sama.
- Di bagian **Root Directory**, klik **Edit** dan pilih folder `frontend`.
- Di bagian **Environment Variables**, tambahkan:
  - **Key**: `REACT_APP_API_URL`
  - **Value**: URL Backend Anda dari langkah 1 (contoh: `https://clover-backend.vercel.app`).
- Klik **Deploy**. Anda akan mendapatkan URL Frontend (contoh: `https://clover-store.vercel.app`).

---

## 💻 Menjalankan di Komputer Lokal (Localhost)

1. **Jalankan Backend**:
   - Klik ganda file `run-backend.bat` atau via terminal:
     ```bash
     cd backend
     npm start
     ```
   - Berjalan di `http://localhost:5000`.

2. **Jalankan Frontend**:
   - Klik ganda file `run-frontend.bat` atau via terminal:
     ```bash
     cd frontend
     npm start
     ```
   - Otomatis membuka `http://localhost:3000`.
