import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultCustomers = [];

const Customers = () => {
  const [customers, setCustomers] = useState(defaultCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Aktif',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/customers');
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const colors = ['#22c55e', '#6366f1', '#f97316', '#f43f5e', '#06b6d4', '#8b5cf6'];
          const mapped = res.data.data.map((c, i) => ({
            ...c,
            initials: c.name
              ? c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'PL',
            avatarBg: colors[i % colors.length],
          }));
          setCustomers(mapped);
        }
      } catch (e) {
        // Fallback to defaultCustomers
      }
    };
    fetchCustomers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newCust = {
      _id: Date.now().toString(),
      initials: formData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
      avatarBg: '#10b981',
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '-',
      totalOrders: 0,
      totalSpent: 0,
      status: formData.status,
    };

    try {
      await axios.post('/api/customers', formData);
    } catch (err) {
      // Local fallback
    }

    setCustomers([newCust, ...customers]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', status: 'Aktif' });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="admin-page customers-page">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="topbar-title-group">
          <h1 className="topbar-title">Pelanggan</h1>
          <span className="topbar-subtext">Total {customers.length} pelanggan</span>
        </div>

        <div className="topbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn-add-primary" onClick={() => setShowAddModal(true)}>
          + Tambah Pelanggan
        </button>
      </header>

      {/* 3 Stat Cards */}
      <section className="stats-row three-cards">
        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">👤<sup>+</sup></span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pelanggan Baru</p>
            <h2 className="stat-value">0</h2>
            <p className="stat-growth positive">↗ Belum ada data</p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">👤</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pelanggan Aktif</p>
            <h2 className="stat-value">0</h2>
            <p className="stat-subdetail">0% dari total pelanggan</p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">🛒</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Total Transaksi</p>
            <h2 className="stat-value">0</h2>
            <p className="stat-growth positive">↗ Belum ada transaksi</p>
          </div>
        </div>
      </section>

      {/* Customers Table Card */}
      <section className="content-card customers-card">
        <h3 className="card-title mb-4">Daftar Pelanggan</h3>

        <div className="table-responsive">
          <table className="admin-custom-table customers-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Total Pesanan</th>
                <th>Total Belanja</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust._id}>
                  <td>
                    <div className="customer-avatar-name-cell">
                      <div
                        className="customer-initials-badge"
                        style={{ backgroundColor: cust.avatarBg }}
                      >
                        {cust.initials}
                      </div>
                      <span className="fw-semibold">{cust.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{cust.email}</td>
                  <td>{cust.phone}</td>
                  <td className="text-center">{cust.totalOrders}</td>
                  <td className="fw-semibold">{formatPrice(cust.totalSpent)}</td>
                  <td>
                    <span className="status-pill-aktif">
                      {cust.status} •
                    </span>
                  </td>
                  <td>
                    <div className="customer-action-buttons">
                      <button
                        className="btn-action-outline-sm"
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        <span className="btn-icon">👁</span> Lihat
                      </button>
                      <button
                        className="btn-action-outline-sm"
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        <span className="btn-icon">✏</span> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer-pagination">
          <span className="pagination-counter-text">
            Menampilkan {filteredCustomers.length} dari {customers.length} pelanggan
          </span>
          <div className="pagination-page-numbers">
            <button className="page-nav-btn">Sebelumnya</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <span className="page-dots">...</span>
            <button className="page-num">63</button>
            <button className="page-nav-btn">Selanjutnya</button>
          </div>
        </div>
      </section>

      {/* Modal Tambah Pelanggan */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Tambah Pelanggan Baru</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Raka Pratama"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Alamat Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="raka@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail / Edit Pelanggan */}
      {selectedCustomer && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Profil Pelanggan: {selectedCustomer.name}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  className="customer-initials-badge large"
                  style={{ backgroundColor: selectedCustomer.avatarBg, width: '56px', height: '56px', fontSize: '20px' }}
                >
                  {selectedCustomer.initials}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{selectedCustomer.name}</h4>
                  <p className="text-muted" style={{ margin: '2px 0 0 0' }}>{selectedCustomer.email}</p>
                </div>
              </div>
              <p><strong>Nomor WhatsApp:</strong> {selectedCustomer.phone}</p>
              <p><strong>Total Pesanan:</strong> {selectedCustomer.totalOrders} kali</p>
              <p><strong>Total Belanja:</strong> <span className="text-green fw-bold">{formatPrice(selectedCustomer.totalSpent)}</span></p>
              <p><strong>Status:</strong> <span className="status-pill-aktif">{selectedCustomer.status} •</span></p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedCustomer(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
