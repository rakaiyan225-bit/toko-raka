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

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [recentOrders, setRecentOrders] = useState(defaultRecentOrders);
  const [orderCounts, setOrderCounts] = useState({ diproses: 0, dikirim: 0, selesai: 0 });
  const [monthlySalesData, setMonthlySalesData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      let remoteOrders = [];
      try {
        const statsRes = await axios.get('/api/dashboard/stats');
        if (statsRes.data && statsRes.data.success && statsRes.data.data) {
          setStats(statsRes.data.data);
          if (statsRes.data.data.orderCounts) {
            setOrderCounts(statsRes.data.data.orderCounts);
          }
        }
      } catch (e) {}

      try {
        const ordersRes = await axios.get('/api/orders');
        if (ordersRes.data && ordersRes.data.success && Array.isArray(ordersRes.data.data)) {
          remoteOrders = ordersRes.data.data;
        }
      } catch (e) {}

      let localOrders = [];
      try {
        localOrders = JSON.parse(localStorage.getItem('clover_custom_orders') || '[]');
      } catch (e) {}

      let localProducts = [];
      try {
        localProducts = JSON.parse(localStorage.getItem('clover_custom_products') || '[]');
      } catch (e) {}

      let localCusts = [];
      try {
        localCusts = JSON.parse(localStorage.getItem('clover_custom_customers') || '[]');
      } catch (e) {}

      // Gabungkan orders unik
      const orderMap = new Map();
      remoteOrders.forEach((o) => orderMap.set(o.orderId || o._id, o));
      localOrders.forEach((o) => {
        const key = o.orderId || o._id;
        if (!orderMap.has(key)) orderMap.set(key, o);
      });
      const allOrders = Array.from(orderMap.values());

      // Hitung order status counts
      const diproses = allOrders.filter((o) => !o.status || o.status === 'Diproses').length;
      const dikirim = allOrders.filter((o) => o.status === 'Dikirim').length;
      const selesai = allOrders.filter((o) => o.status === 'Selesai').length;
      setOrderCounts({ diproses, dikirim, selesai });

      // Hitung total sales & stats
      const totalSales = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setStats({
        totalSales,
        totalOrders: allOrders.length,
        totalProducts: localProducts.length,
        totalCustomers: localCusts.length,
        orderCounts: { diproses, dikirim, selesai },
      });

      // Hitung penjualan per bulan (Jan - Sep)
      const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      allOrders.forEach((o) => {
        if (o.status !== 'Dibatalkan') {
          const d = new Date(o.createdAt || Date.now());
          const m = d.getMonth();
          if (m >= 0 && m < 9) {
            monthly[m] += o.totalAmount || 0;
          }
        }
      });
      setMonthlySalesData(monthly);

      // Recent orders mapping
      const mapped = allOrders.slice(0, 5).map((o) => ({
        orderId: o.orderId,
        customerName: o.customer?.name || 'Pelanggan',
        productName: o.items?.[0]?.name || o.items?.[0]?.product?.name || 'Produk Clover',
        total: o.totalAmount || 0,
        status: o.status || 'Diproses',
      }));
      setRecentOrders(mapped);
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

  const maxSale = Math.max(...monthlySalesData, 0);
  const chartPoints = monthNames.map((m, idx) => {
    const val = monthlySalesData[idx] || 0;
    const x = 45 + idx * 58;
    const y = maxSale > 0 ? 140 - (val / maxSale) * 105 : 140;
    return { month: m, value: val, x, y };
  });

  const getSmoothSvgPath = (pts) => {
    if (!pts || pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = getSmoothSvgPath(chartPoints);
  const areaPath = chartPoints.length > 0 ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} 150 L ${chartPoints[0].x} 150 Z` : '';

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
              <p className="card-subtitle-green">
                {stats.totalSales > 0
                  ? `Total Penjualan: ${formatPrice(stats.totalSales)} • ${stats.totalOrders} Pesanan`
                  : 'Belum ada data penjualan'}
              </p>
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
              <line x1="30" y1="35" x2="520" y2="35" stroke="#f0f2f5" strokeWidth="1" />
              <line x1="30" y1="75" x2="520" y2="75" stroke="#f0f2f5" strokeWidth="1" />
              <line x1="30" y1="115" x2="520" y2="115" stroke="#f0f2f5" strokeWidth="1" />

              {/* Gradient Area under curve */}
              {areaPath && (
                <path d={areaPath} fill="url(#chartGradient)" />
              )}

              {/* Line path */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {chartPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#15803d"
                  strokeWidth="2.5"
                >
                  <title>{pt.month}: {formatPrice(pt.value)}</title>
                </circle>
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
              <span className="summary-tag badge-orange">Diproses</span>
              <span className="summary-text">Pesanan Diproses: <strong>{orderCounts.diproses}</strong></span>
            </div>
            <div className="summary-badge-item">
              <span className="summary-tag badge-blue">Dikirim</span>
              <span className="summary-text">Pesanan Dikirim: <strong>{orderCounts.dikirim}</strong></span>
            </div>
            <div className="summary-badge-item">
              <span className="summary-tag badge-green">Selesai</span>
              <span className="summary-text">Pesanan Selesai: <strong>{orderCounts.selesai}</strong></span>
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
