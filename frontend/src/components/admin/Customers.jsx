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
      let remoteList = [];
      try {
        const res = await axios.get('/api/customers');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          remoteList = res.data.data;
        }
      } catch (e) {}

      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem('clover_custom_customers') || '[]');
      } catch (e) {}

      // Ambil juga customer dari pesanan
      try {
        const localOrders = JSON.parse(localStorage.getItem('clover_custom_orders') || '[]');
        localOrders.forEach((ord) => {
          if (ord.customer && ord.customer.name) {
            const exists = localList.some(
              (c) => c.phone === ord.customer.phone || c.name.toLowerCase() === ord.customer.name.toLowerCase()
            );
            if (!exists) {
              localList.push({
                _id: 'cust_' + ord.orderId,
                name: ord.customer.name,
                email: ord.customer.email || '-',
                phone: ord.customer.phone || '-',
                totalOrders: 1,
                totalSpent: ord.totalAmount || 0,
                status: 'Aktif',
              });
            }
          }
        });
      } catch (e) {}

      // Ambil juga user yang terdaftar di akun pengguna
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (loggedInUser && loggedInUser.email) {
          const exists = localList.some(
            (c) => c.email && c.email.toLowerCase() === loggedInUser.email.toLowerCase()
          );
          if (!exists) {
            localList.unshift({
              _id: loggedInUser.id || 'cust_' + Date.now(),
              name: loggedInUser.name || loggedInUser.email.split('@')[0],
              email: loggedInUser.email,
              phone: loggedInUser.phone || '-',
              totalOrders: 0,
              totalSpent: 0,
              status: 'Aktif',
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (e) {}

      const colors = ['#22c55e', '#6366f1', '#f97316', '#f43f5e', '#06b6d4', '#8b5cf6'];
      const map = new Map();
      remoteList.forEach((c) => map.set(c._id || c.email || c.name, c));
      localList.forEach((c) => {
        const key = c._id || c.email || c.name;
        if (!map.has(key)) map.set(key, c);
      });

      const merged = Array.from(map.values()).map((c, i) => ({
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

      setCustomers(merged);
    };
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Hapus pelanggan ini?')) return;
    try {
      await axios.delete(`/api/customers/${id}`);
    } catch (e) {}
    const updated = customers.filter((c) => c._id !== id);
    setCustomers(updated);
    try {
      localStorage.setItem('clover_custom_customers', JSON.stringify(updated));
    } catch (e) {}
  };

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
            <h2 className="stat-value">{customers.length}</h2>
            <p className="stat-growth positive">{customers.length > 0 ? `↗ ${customers.length} pelanggan terdata` : '↗ Belum ada data'}</p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">👤</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pelanggan Aktif</p>
            <h2 className="stat-value">{customers.filter((c) => c.status === 'Aktif').length}</h2>
            <p className="stat-subdetail">
              {customers.length > 0
                ? `${Math.round((customers.filter((c) => c.status === 'Aktif').length / customers.length) * 100)}% dari total pelanggan`
                : '0% dari total pelanggan'}
            </p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">🛒</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Total Transaksi</p>
            <h2 className="stat-value">{customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)}</h2>
            <p className="stat-growth positive">
              {customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0) > 0 ? '↗ Transaksi tercatat' : '↗ Belum ada transaksi'}
            </p>
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
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Belum ada pelanggan terdaftar.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
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
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          onClick={() => handleDeleteCustomer(cust._id)}
                          title="Hapus Pelanggan"
                        >
                          <span className="btn-icon">🗑</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
