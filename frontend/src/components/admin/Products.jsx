import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultProducts = [];

const getProductImage = (image) => {
  if (!image) return null;
  if (image.startsWith('data:') || image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }
  return `/uploads/${image}`;
};

const Products = () => {
  const [viewMode, setViewMode] = useState('list'); // 'form' (Tambah Barang) or 'list' (Daftar Produk)
  const [products, setProducts] = useState(defaultProducts);
  const [editingId, setEditingId] = useState(null);

  // Form State matching Image 4
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hoodie',
    price: '',
    stock: '',
    description: '',
    isActive: true,
    imageName: '',
    imageSize: '',
    imagePreview: null,
    image: '',
    file: null,
  });

  const [notification, setNotification] = useState('');

  // Fetch and sync products
  useEffect(() => {
    const fetchProds = async () => {
      let remoteList = [];
      try {
        const res = await axios.get('/api/products');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          remoteList = res.data.data;
        }
      } catch (e) {}

      // Ambil dari localStorage cache agar tidak hilang saat refresh
      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem('clover_custom_products') || '[]');
      } catch (e) {}

      // Gabungkan data: utamakan produk dengan gambar
      const map = new Map();
      remoteList.forEach((p) => map.set(p._id, p));
      localList.forEach((p) => {
        if (!map.has(p._id) || (!map.get(p._id).image && p.image)) {
          map.set(p._id, p);
        }
      });

      const merged = Array.from(map.values());
      if (merged.length > 0) {
        setProducts(merged);
      }
    };
    fetchProds();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + 'MB';

      // Baca sebagai Base64 agar tersimpan permanen di database dan localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageName: file.name,
          imageSize: sizeMB,
          imagePreview: reader.result,
          image: reader.result, // Data URL base64
          file: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const finalImage = formData.image || formData.imagePreview || '';

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      isActive: formData.isActive,
      image: finalImage,
    };

    let savedProduct = null;

    try {
      if (editingId) {
        const res = await axios.put(`/api/products/${editingId}`, payload);
        if (res.data && res.data.success && res.data.data) {
          savedProduct = res.data.data;
        }
      } else {
        const res = await axios.post('/api/products', payload);
        if (res.data && res.data.success && res.data.data) {
          savedProduct = res.data.data;
        }
      }
    } catch (err) {
      console.warn('API save fallback to local:', err);
    }

    if (!savedProduct) {
      savedProduct = {
        _id: editingId || 'prod_' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
    } else if (!savedProduct.image && finalImage) {
      savedProduct.image = finalImage;
    }

    let updatedProducts;
    if (editingId) {
      updatedProducts = products.map((p) => (p._id === editingId ? savedProduct : p));
    } else {
      updatedProducts = [savedProduct, ...products.filter((p) => p._id !== savedProduct._id)];
    }

    setProducts(updatedProducts);
    try {
      localStorage.setItem('clover_custom_products', JSON.stringify(updatedProducts));
    } catch (e) {}

    setNotification(editingId ? 'Produk berhasil diperbarui!' : 'Produk berhasil disimpan ke katalog!');
    setTimeout(() => setNotification(''), 4000);

    // Reset Form
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Hoodie',
      price: '',
      stock: '',
      description: '',
      isActive: true,
      imageName: '',
      imageSize: '',
      imagePreview: null,
      image: '',
      file: null,
    });
    setViewMode('list');
  };

  const handleToggleActive = async (product) => {
    const newActive = product.isActive === false ? true : false;
    const updatedProduct = { ...product, isActive: newActive };

    try {
      await axios.put(`/api/products/${product._id}`, { isActive: newActive });
    } catch (e) {}

    const updated = products.map((p) => (p._id === product._id ? updatedProduct : p));
    setProducts(updated);
    try {
      localStorage.setItem('clover_custom_products', JSON.stringify(updated));
    } catch (e) {}

    setNotification(
      `Status "${product.name}": ${newActive ? 'Aktif (Tampil di halaman user)' : 'Nonaktif (Disembunyikan dari halaman user)'}`
    );
    setTimeout(() => setNotification(''), 3500);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
    } catch (e) {}

    const filtered = products.filter((p) => p._id !== id);
    setProducts(filtered);
    try {
      localStorage.setItem('clover_custom_products', JSON.stringify(filtered));
    } catch (e) {}
    setNotification('Produk berhasil dihapus!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleClearAllTestProducts = async () => {
    if (!window.confirm('Hapus semua produk uji coba dari katalog?')) return;
    for (const p of products) {
      try {
        await axios.delete(`/api/products/${p._id}`);
      } catch (e) {}
    }
    setProducts([]);
    try {
      localStorage.removeItem('clover_custom_products');
    } catch (e) {}
    setNotification('Semua produk uji coba telah dihapus!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="admin-page tambah-barang-page">
      {/* Top Header & Breadcrumb */}
      <header className="admin-topbar-breadcrumb">
        <h1 className="topbar-title">Tambah Barang</h1>
        <div className="breadcrumb-links">
          <button
            type="button"
            className={`breadcrumb-nav-tab ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Daftar Produk
          </button>
          <span className="breadcrumb-separator">/</span>
          <button
            type="button"
            className={`breadcrumb-nav-tab ${viewMode === 'form' ? 'active' : ''}`}
            onClick={() => setViewMode('form')}
          >
            Tambah Barang
          </button>
        </div>
      </header>

      {notification && (
        <div className="alert-success-banner">
          ✓ {notification}
        </div>
      )}

      {viewMode === 'form' ? (
        /* Form Tambah Barang Matching Image 4 */
        <div className="tambah-barang-wrapper">
          {/* Header Card */}
          <div className="tambah-barang-header-card">
            <h2>Tambah Barang</h2>
            <p>Lengkapi informasi produk baru untuk ditambahkan ke katalog</p>
          </div>

          <form onSubmit={handleSaveProduct} className="tambah-barang-form-grid">
            {/* Left Column: Product Info */}
            <div className="form-left-col">
              <div className="form-group mb-4">
                <label className="form-field-label">Nama Produk</label>
                <input
                  type="text"
                  required
                  className="form-input-box"
                  placeholder="Nama produk..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-field-label">Kategori</label>
                <div className="select-dropdown-wrapper">
                  <select
                    className="form-select-box"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Hoodie">Hoodie</option>
                    <option value="Kaos">Kaos</option>
                    <option value="Jaket">Jaket</option>
                    <option value="Kemeja">Kemeja</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Celana">Celana</option>
                    <option value="Aksesori">Aksesori</option>
                  </select>
                  <span className="dropdown-arrow-icon">▼</span>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-field-label">Harga</label>
                <div className="price-input-box-wrapper">
                  <input
                    type="text"
                    required
                    className="form-input-box price-input"
                    value={
                      formData.price.startsWith('Rp')
                        ? formData.price
                        : `Rp${Number(formData.price).toLocaleString('id-ID')}`
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, price: raw });
                    }}
                  />
                  <span className="price-suffix-icon">🪙</span>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-field-label">Stok</label>
                <input
                  type="number"
                  required
                  className="form-input-box"
                  placeholder="50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-field-label">Deskripsi</label>
                <textarea
                  rows="4"
                  className="form-textarea-box"
                  placeholder="Masukkan deskripsi produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column: Upload & Actions */}
            <div className="form-right-col">
              <label className="form-field-label">Upload Foto Produk</label>

              {/* Dashed Upload Dropzone */}
              <div className="photo-upload-dashed-box">
                <div className="photo-preview-image-box">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" />
                  ) : (
                    <div className="default-hoodie-mock-illustration">
                      <span className="hoodie-emoji">🧥</span>
                      <span className="clover-emblem">☘️</span>
                    </div>
                  )}
                </div>

                <p className="photo-filename-label">
                  {formData.imageName} • {formData.imageSize}
                </p>

                <label className="btn-pilih-foto">
                  + Pilih Foto
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Row: Produk Aktif with Toggle */}
              <div className="produk-aktif-toggle-row">
                <span className="toggle-label-text">Produk Aktif</span>
                <label className="promo-toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Bottom Buttons */}
              <div className="tambah-barang-bottom-actions">
                <button
                  type="button"
                  className="btn-batal-outline"
                  onClick={() => setViewMode('list')}
                >
                  Batal
                </button>
                <button type="submit" className="btn-simpan-produk">
                  <span className="save-icon">💾</span> Simpan Produk
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* List Mode: Daftar Katalog Produk */
        <div className="content-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3>Daftar Produk ({products.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {products.length > 0 && (
                <button
                  type="button"
                  className="btn-action-outline-sm"
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                  onClick={handleClearAllTestProducts}
                  title="Hapus semua produk uji coba"
                >
                  🗑 Bersihkan Semua
                </button>
              )}
              <button
                className="btn-add-primary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    category: 'Hoodie',
                    price: '',
                    stock: '',
                    description: '',
                    isActive: true,
                    imageName: '',
                    imageSize: '',
                    imagePreview: null,
                    image: '',
                    file: null,
                  });
                  setViewMode('form');
                }}
              >
                + Tambah Barang Baru
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      Belum ada produk. Klik tombol <strong>+ Tambah Barang Baru</strong> untuk menambahkan produk.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const imgSrc = getProductImage(p.image);
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="customer-avatar-name-cell">
                            <div className="product-table-thumb" style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                              {imgSrc ? (
                                <img src={imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '20px' }}>🧥</span>
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold">{p.name}</div>
                              <div className="text-muted" style={{ fontSize: '12px' }}>{p.description?.substring(0, 40)}...</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="category-tag-pill">{p.category}</span></td>
                        <td className="fw-bold text-green">{formatPrice(p.price)}</td>
                        <td>{p.stock} pcs</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(p)}
                            className={p.isActive !== false ? 'status-pill-aktif' : 'status-badge status-dibatalkan'}
                            style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
                            title={`Klik untuk ${p.isActive !== false ? 'Nonaktifkan (sembunyikan dari user)' : 'Aktifkan (tampilkan ke user)'}`}
                          >
                            {p.isActive !== false ? 'Aktif •' : 'Nonaktif'}
                          </button>
                        </td>
                        <td>
                          <div className="customer-action-buttons">
                            <button
                              className="btn-action-outline-sm"
                              onClick={() => {
                                setEditingId(p._id);
                                setFormData({
                                  name: p.name,
                                  category: p.category || 'Hoodie',
                                  price: String(p.price || ''),
                                  stock: String(p.stock || ''),
                                  description: p.description || '',
                                  isActive: p.isActive !== false,
                                  imageName: p.imageName || 'gambar-produk.jpg',
                                  imageSize: p.imageSize || '1.0MB',
                                  imagePreview: imgSrc,
                                  image: p.image || '',
                                  file: null,
                                });
                                setViewMode('form');
                              }}
                            >
                              ✏ Edit
                            </button>
                            <button
                              className="btn-action-outline-sm"
                              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              🗑 Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
