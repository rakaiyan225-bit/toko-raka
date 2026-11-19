import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultProducts = [
  {
    _id: '1',
    name: 'Hoodie Hitam Clover Club',
    category: 'Hoodie',
    price: 199000,
    stock: 50,
    description: 'Hoodie hitam premium dengan desain eksklusif Clover Club. Bahan fleece tebal nyaman dipakai.',
    image: '',
    imageName: 'preview.jpg',
    imageSize: '1.2MB',
    isActive: true,
  },
  {
    _id: '2',
    name: 'Kaos Oversize Hitam Clover',
    category: 'Kaos',
    price: 89000,
    stock: 120,
    description: 'Kaos oversize hitam dengan logo Clover streetwear.',
    image: '',
    imageName: 'kaos-hitam.jpg',
    imageSize: '950KB',
    isActive: true,
  },
  {
    _id: '3',
    name: 'Kaos Putih Basic Ladsclub',
    category: 'Kaos',
    price: 75000,
    stock: 85,
    description: 'Kaos basic putih bahan katun combed 24s.',
    image: '',
    imageName: 'kaos-putih.jpg',
    imageSize: '820KB',
    isActive: true,
  },
  {
    _id: '4',
    name: 'Hoodie Putih Clover Ladsclub',
    category: 'Hoodie',
    price: 199000,
    stock: 45,
    description: 'Hoodie putih dengan bordir clover hijau di dada.',
    image: '',
    imageName: 'hoodie-putih.jpg',
    imageSize: '1.1MB',
    isActive: true,
  },
];

const Products = () => {
  const [viewMode, setViewMode] = useState('form'); // 'form' (Tambah Barang) or 'list' (Daftar Produk)
  const [products, setProducts] = useState(defaultProducts);

  // Form State matching Image 4
  const [formData, setFormData] = useState({
    name: 'Hoodie Hitam Clover Club',
    category: 'Hoodie',
    price: '199000',
    stock: '50',
    description: 'Masukkan deskripsi produk...',
    isActive: true,
    imageName: 'preview.jpg',
    imageSize: '1.2MB',
    imagePreview: null,
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const res = await axios.get('/api/products');
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProducts(res.data.data);
        }
      } catch (e) {}
    };
    fetchProds();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + 'MB';
      setFormData({
        ...formData,
        imageName: file.name,
        imageSize: sizeMB,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      _id: 'prod_' + Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      isActive: formData.isActive,
      imageName: formData.imageName,
      imageSize: formData.imageSize,
      image: formData.imagePreview || '',
    };

    try {
      await axios.post('/api/products', {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        isActive: formData.isActive,
      });
    } catch (err) {}

    setProducts([newProduct, ...products]);
    setNotification('Produk berhasil disimpan ke katalog!');
    setTimeout(() => setNotification(''), 4000);
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
          <div className="admin-card-header">
            <h3>Daftar Produk ({products.length})</h3>
            <button
              className="btn-add-primary"
              onClick={() => setViewMode('form')}
            >
              + Tambah Barang Baru
            </button>
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
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="customer-avatar-name-cell">
                        <div className="product-table-thumb">
                          {p.image ? (
                            <img src={p.image} alt={p.name} />
                          ) : (
                            <span>🧥</span>
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
                      <span className={p.isActive ? 'status-pill-aktif' : 'status-badge status-dibatalkan'}>
                        {p.isActive ? 'Aktif •' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="customer-action-buttons">
                        <button
                          className="btn-action-outline-sm"
                          onClick={() => {
                            setFormData({
                              name: p.name,
                              category: p.category,
                              price: String(p.price),
                              stock: String(p.stock),
                              description: p.description || '',
                              isActive: p.isActive !== false,
                              imageName: p.imageName || 'preview.jpg',
                              imageSize: p.imageSize || '1.2MB',
                              imagePreview: p.image || null,
                            });
                            setViewMode('form');
                          }}
                        >
                          ✏ Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
