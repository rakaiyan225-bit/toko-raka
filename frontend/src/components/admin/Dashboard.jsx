import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultStats = {
  totalSales: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
};

const defaultRecentOrders = [];

const chartPoints = [
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 0 },
  { month: 'Mar', value: 0 },
  { month: 'Apr', value: 0 },
  { month: 'Mei', value: 0 },
  { month: 'Jun', value: 0 },
  { month: 'Jul', value: 0 },
  { month: 'Agu', value: 0 },
  { month: 'Sep', value: 0 },
];

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [recentOrders, setRecentOrders] = useState(defaultRecentOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get('/api/dashboard/stats');
        if (statsRes.data && statsRes.data.success && statsRes.data.data) {
          setStats(statsRes.data.data);
        }
      } catch (e) {
        // Fallback to defaultStats
      }

      try {
        const ordersRes = await axios.get('/api/dashboard/recent-orders');
        if (ordersRes.data && ordersRes.data.success && Array.isArray(ordersRes.data.data)) {
          const mapped = ordersRes.data.data.map(o => ({
            orderId: o.orderId,
            customerName: o.customer?.name || 'Pelanggan',
            productName: o.items?.[0]?.product?.name || 'Produk Clover',
            total: o.totalAmount,
            status: o.status,
          }));
          if (mapped.length > 0) setRecentOrders(mapped);
        }
      } catch (e) {
        // Fallback to defaultRecentOrders
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return <span className="status-badge status-selesai">Selesai</span>;
      case 'Dikirim':
        return <span className="status-badge status-dikirim">Dikirim</span>;
      case 'Diproses':
        return <span className="status-badge status-diproses">Diproses</span>;
      default:
        return <span className="status-badge status-dibatalkan">{status}</span>;
    }
  };

  return (
    <div className="admin-page dashboard-page">
      {/* Top Header */}
      <header className="admin-topbar">
        <h1 className="topbar-title">Dashboard</h1>

        <div className="topbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari pesanan, pelanggan, produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="topbar-actions">
          <button className="icon-btn notification-btn" title="Notifikasi">
            <span className="bell-icon">🔔</span>
            <span className="badge-dot"></span>
          </button>

          <div className="admin-profile-pill">
            <div className="avatar-img-circle">👩‍💼</div>
            <span className="admin-greeting">Halo, Admin ▾</span>
          </div>

          <button className="btn-add-product" onClick={() => navigate('/admin/produk')}>
            + Tambah Produk
          </button>
        </div>
      </header>

      {/* 4 Stat Cards */}
      <section className="stats-row">
        <div className="admin-stat-card">
          <div className="stat-card-icon-box">
            <span className="stat-icon-symbol">💵</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Total Penjualan</p>
            <h2 className="stat-value">{formatPrice(stats.totalSales || 0)}</h2>
            <p className="stat-growth positive">↑ 12.5% dari bulan lalu</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-box">
            <span className="stat-icon-symbol">🛍️</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pesanan</p>
            <h2 className="stat-value">{(stats.totalOrders || 0).toLocaleString('id-ID')}</h2>
            <p className="stat-growth positive">↑ 8.2% dari bulan lalu</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-box">
            <span className="stat-icon-symbol">📦</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Produk</p>
            <h2 className="stat-value">{stats.totalProducts || 0}</h2>
            <p className="stat-growth positive">↑ 3 produk baru</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-box">
            <span className="stat-icon-symbol">👥</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pelanggan</p>
            <h2 className="stat-value">{(stats.totalCustomers || 0).toLocaleString('id-ID')}</h2>
            <p className="stat-growth positive">↑ 15 pelanggan baru</p>
          </div>
        </div>
      </section>

      {/* Middle Row: Sales Chart & Summary */}
      <section className="dashboard-middle-row">
        {/* Sales Chart Card */}
        <div className="content-card sales-chart-card">
          <div className="card-header-simple">
            <div>
              <h3 className="card-title">Grafik Penjualan</h3>
              <p className="card-subtitle-green">Belum ada data penjualan</p>
            </div>
          </div>

          <div className="chart-svg-wrapper">
            <svg viewBox="0 0 540 180" className="sales-line-chart">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="30" x2="520" y2="30" stroke="#f0f2f5" strokeWidth="1" />
              <line x1="30" y1="75" x2="520" y2="75" stroke="#f0f2f5" strokeWidth="1" />
              <line x1="30" y1="120" x2="520" y2="120" stroke="#f0f2f5" strokeWidth="1" />

              {/* Gradient Area under curve */}
              <path
                d="M 45 130 Q 95 105 105 105 T 165 110 T 225 80 T 285 95 T 345 65 T 405 85 T 465 55 T 510 30 L 510 150 L 45 150 Z"
                fill="url(#chartGradient)"
              />

              {/* Line path */}
              <path
                d="M 45 130 Q 95 105 105 105 T 165 110 T 225 80 T 285 95 T 345 65 T 405 85 T 465 55 T 510 30"
                fill="none"
                stroke="#15803d"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 45, y: 130 },
                { x: 105, y: 105 },
                { x: 165, y: 110 },
                { x: 225, y: 80 },
                { x: 285, y: 95 },
                { x: 345, y: 65 },
                { x: 405, y: 85 },
                { x: 465, y: 55 },
                { x: 510, y: 30 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#15803d"
                  strokeWidth="2.5"
                />
              ))}
            </svg>

            {/* Month labels */}
            <div className="chart-month-labels">
              {chartPoints.map((p) => (
                <span key={p.month} className="month-label">{p.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Ringkasan Summary Card */}
        <div className="content-card summary-card">
          <h3 className="card-title">Ringkasan</h3>
          <div className="summary-badges-list">
            <div className="summary-badge-item">
              <span className="summary-tag badge-orange">Selesai</span>
              <span className="summary-text">Pesanan Diproses: <strong>0</strong></span>
            </div>
            <div className="summary-badge-item">
              <span className="summary-tag badge-blue">Pesanan</span>
              <span className="summary-text">Pesanan Dikirim: <strong>0</strong></span>
            </div>
            <div className="summary-badge-item">
              <span className="summary-tag badge-green">Dikirim</span>
              <span className="summary-text">Pesanan Selesai: <strong>0</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Pesanan Terbaru Table */}
      <section className="content-card recent-orders-card">
        <h3 className="card-title mb-4">Pesanan Terbaru</h3>

        <div className="table-responsive">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Produk</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Belum ada pesanan terbaru.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold">{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.productName}</td>
                    <td className="fw-bold">{formatPrice(order.total)}</td>
                    <td>
                      <div className="action-cell-flex">
                        {getStatusBadge(order.status)}
                        <button
                          className="btn-eye-icon"
                          title="Lihat Detail"
                          onClick={() => navigate('/admin/pesanan')}
                        >
                          👁
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
          <span className="pagination-counter-text">Menampilkan {recentOrders.length} dari {recentOrders.length} pesanan</span>
          <div className="pagination-page-numbers">
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <span className="page-dots">...</span>
            <button className="page-num">&gt;</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
