import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultProducts = [
  {
    _id: '1',
    name: 'Kaos Oversize Hitam Clover',
    price: 89000,
    category: 'Kaos',
    stock: 150,
    rating: 4.8,
    sold: 1200,
    image: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Kaos oversize hitam premium dengan logo Clover.',
  },
  {
    _id: '2',
    name: 'Kaos Putih Basic Ladsclub',
    price: 75000,
    category: 'Kaos',
    stock: 200,
    rating: 4.9,
    sold: 980,
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Kaos putih basic dengan desain minimalis Ladsclub.',
  },
  {
    _id: '3',
    name: 'Hoodie Hitam Clover Club',
    price: 199000,
    category: 'Hoodie',
    stock: 80,
    rating: 4.7,
    sold: 2100,
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Hoodie hitam dengan desain eksklusif Clover Club.',
  },
  {
    _id: '4',
    name: 'Hoodie Putih Clover Ladsclub',
    price: 199000,
    category: 'Hoodie',
    stock: 65,
    rating: 4.8,
    sold: 1500,
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Hoodie putih dengan branding Clover Ladsclub.',
  },
  {
    _id: '5',
    name: 'Hoodie Clover Black',
    price: 289000,
    category: 'Hoodie',
    stock: 40,
    rating: 4.9,
    sold: 850,
    image: '',
    sizes: ['M', 'L', 'XL'],
    description: 'Hoodie premium full hitam dengan embroidery Clover.',
  },
  {
    _id: '6',
    name: 'Jaket Bomber Clover',
    price: 350000,
    category: 'Jaket',
    stock: 30,
    rating: 4.6,
    sold: 600,
    image: '',
    sizes: ['M', 'L', 'XL'],
    description: 'Jaket bomber dengan bahan parasut premium.',
  },
];

const categories = ['Semua', 'Kaos', 'Hoodie', 'Jaket', 'Kemeja', 'T-Shirt', 'Celana', 'Aksesori'];

const Products = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Kaos',
    stock: '',
    description: '',
    sizes: 'S, M, L, XL',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setProducts(res.data.data);
      }
    } catch (e) {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'Kaos',
      stock: '',
      description: '',
      sizes: 'S, M, L, XL',
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      description: p.description || '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || 'S, M, L, XL',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
    } catch (e) {}
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sizes: formData.sizes.split(',').map((s) => s.trim()),
    };

    if (editingProduct) {
      try {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
      } catch (e) {}
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? { ...p, ...payload } : p))
      );
    } else {
      const newP = {
        _id: Date.now().toString(),
        ...payload,
        rating: 5.0,
        sold: 0,
        image: '',
      };
      try {
        await axios.post('/api/products', payload);
      } catch (e) {}
      setProducts([newP, ...products]);
    }
    setShowModal(false);
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="admin-page products-page">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="topbar-title-group">
          <h1 className="topbar-title">Produk</h1>
          <span className="topbar-subtext">Total {products.length} produk</span>
        </div>

        <div className="topbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn-add-primary" onClick={openAddModal}>
          + Tambah Produk
        </button>
      </header>

      {/* Category Pills */}
      <div className="status-filter-pills mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <section className="admin-product-cards-grid">
        {filtered.map((prod) => (
          <div key={prod._id} className="admin-product-item-card">
            <div className="prod-card-thumb">
              {prod.image ? (
                <img
                  src={prod.image.startsWith('http') ? prod.image : `http://localhost:5000${prod.image}`}
                  alt={prod.name}
                />
              ) : (
                <div className="thumb-placeholder-box">
                  <span className="thumb-placeholder-icon">👕</span>
                </div>
              )}
              <span className="prod-badge-category">{prod.category}</span>
            </div>

            <div className="prod-card-body">
              <h4 className="prod-card-title">{prod.name}</h4>
              <p className="prod-card-price">{formatPrice(prod.price)}</p>

              <div className="prod-card-stats-row">
                <span>Stok: <strong>{prod.stock || 50}</strong></span>
                <span>Terjual: <strong>{prod.sold || 0}</strong></span>
                <span>⭐ {prod.rating || 5.0}</span>
              </div>

              <div className="prod-card-actions">
                <button
                  className="btn-action-outline edit-btn"
                  onClick={() => openEditModal(prod)}
                >
                  ✏ Edit
                </button>
                <button
                  className="btn-action-outline delete-btn"
                  onClick={() => handleDelete(prod._id)}
                >
                  🗑 Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Modal Add / Edit Product */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box modal-lg">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Nama Produk</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Hoodie Clover Black"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row-2 mb-3">
                  <div className="form-group">
                    <label className="form-label">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      placeholder="199000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Kaos">Kaos</option>
                      <option value="Hoodie">Hoodie</option>
                      <option value="Jaket">Jaket</option>
                      <option value="Kemeja">Kemeja</option>
                      <option value="T-Shirt">T-Shirt</option>
                      <option value="Celana">Celana</option>
                      <option value="Aksesori">Aksesori</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2 mb-3">
                  <div className="form-group">
                    <label className="form-label">Stok</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      placeholder="50"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ukuran (pisahkan dengan koma)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="S, M, L, XL"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Deskripsi produk streetwear..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
