import React, { useState } from 'react';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const barData = [
  { month: 'Jan', height: 18, sales: 'Rp4.2M' },
  { month: 'Hab', height: 25, sales: 'Rp5.1M' },
  { month: 'Aab', height: 32, sales: 'Rp5.8M' },
  { month: 'Sag', height: 38, sales: 'Rp6.4M' },
  { month: 'Mun', height: 46, sales: 'Rp7.2M' },
  { month: 'Dev', height: 55, sales: 'Rp8.0M' },
  { month: 'Jad', height: 68, sales: 'Rp9.5M' },
  { month: 'Am', height: 75, sales: 'Rp10.2M' },
  { month: 'Hap', height: 82, sales: 'Rp11.0M' },
  { month: 'Flev', height: 88, sales: 'Rp11.8M' },
  { month: 'Sep', height: 96, sales: 'Rp12.4M' },
  { month: 'Sep', height: 100, sales: 'Rp12.45M' },
];

const topProducts = [
  {
    id: 1,
    name: 'Hoodie Hitam Clover Club',
    category: 'Kategori: Hoodie',
    sold: '120 terjual',
    revenue: 5400000,
    icon: '🧥',
  },
  {
    id: 2,
    name: 'Kaos Oversize Hitam',
    category: 'Kategori: Kaos',
    sold: '98 terjual',
    revenue: 2940000,
    icon: '👕',
  },
  {
    id: 3,
    name: 'Kaos Putih Basic',
    category: 'Kategori: Kaos',
    sold: '85 terjual',
    revenue: 2125000,
    icon: '👕',
  },
];

const Laporan = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('September 2024');

  const handleExportPDF = () => {
    alert('Mengunduh Laporan Penjualan (PDF)...');
  };

  const handleExportExcel = () => {
    alert('Mengunduh Laporan Penjualan (Excel)...');
  };

  return (
    <div className="admin-page laporan-page">
      {/* Top Header matching Image 5 */}
      <header className="laporan-header-row">
        <div className="laporan-title-group">
          <h1 className="laporan-main-title">Laporan</h1>
          <p className="laporan-subtitle-text">
            Analisis performa penjualan dan produk toko
          </p>
        </div>

        {/* Toolbar: Period Dropdown & Export Buttons */}
        <div className="laporan-toolbar-actions">
          <div className="period-dropdown-select-box">
            <span className="cal-icon">📅</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-native-select"
            >
              <option value="September 2024">Periode: September 2024</option>
              <option value="Agustus 2024">Periode: Agustus 2024</option>
              <option value="Juli 2024">Periode: Juli 2024</option>
              <option value="Tahun 2024">Periode: Sepanjang 2024</option>
            </select>
            <span className="dropdown-caret">⌵</span>
          </div>

          <button className="btn-export-pdf" onClick={handleExportPDF}>
            <span className="export-icon">📥</span> Export PDF
          </button>

          <button className="btn-export-excel" onClick={handleExportExcel}>
            <span className="export-icon">📥</span> Export Excel
          </button>
        </div>
      </header>

      {/* 4 Stat Cards in a row */}
      <section className="laporan-stats-row">
        {/* Card 1: Total Penjualan */}
        <div className="laporan-stat-card">
          <div className="laporan-stat-icon-circle">
            <span className="laporan-icon-svg">📈</span>
          </div>
          <div className="laporan-stat-info">
            <p className="laporan-stat-label">Total Penjualan</p>
            <h3 className="laporan-stat-val">Rp12.450.000</h3>
            <p className="laporan-stat-subgreen">+12% dari Agustus</p>
          </div>
        </div>

        {/* Card 2: Pesanan */}
        <div className="laporan-stat-card">
          <div className="laporan-stat-icon-circle">
            <span className="laporan-icon-svg">🛒</span>
          </div>
          <div className="laporan-stat-info">
            <p className="laporan-stat-label">Pesanan</p>
            <h3 className="laporan-stat-val">342</h3>
            <p className="laporan-stat-subgreen">+28 Pesanan</p>
          </div>
        </div>

        {/* Card 3: Produk Terjual */}
        <div className="laporan-stat-card">
          <div className="laporan-stat-icon-circle">
            <span className="laporan-icon-svg">📦</span>
          </div>
          <div className="laporan-stat-info">
            <p className="laporan-stat-label">Produk Terjual</p>
            <h3 className="laporan-stat-val">512</h3>
            <p className="laporan-stat-subgreen">+45 Produk</p>
          </div>
        </div>

        {/* Card 4: Rata-rata Pesanan */}
        <div className="laporan-stat-card">
          <div className="laporan-stat-icon-circle">
            <span className="laporan-icon-svg">〰</span>
          </div>
          <div className="laporan-stat-info">
            <p className="laporan-stat-label">Rata-rata Pesanan</p>
            <h3 className="laporan-stat-val">Rp150.000</h3>
            <p className="laporan-stat-subgreen">+5% dari Agustus</p>
          </div>
        </div>
      </section>

      {/* Middle Section: Bar Chart & Pie Chart */}
      <section className="laporan-middle-grid">
        {/* Left: Bar Chart */}
        <div className="laporan-content-card">
          <h3 className="laporan-card-title">Grafik Penjualan (Jan - Sep 2024)</h3>

          <div className="laporan-bar-chart-container">
            <div className="bar-chart-axis-line"></div>
            <div className="bar-chart-bars-flex">
              {barData.map((bar, idx) => (
                <div key={idx} className="bar-column-item">
                  <div
                    className="bar-vertical-fill"
                    style={{ height: `${bar.height}%` }}
                    title={`${bar.month}: ${bar.sales}`}
                  ></div>
                  <span className="bar-month-text">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="laporan-chart-footnote">
            Tren penjualan meningkat konsisten selama 9 bulan terakhir
          </p>
        </div>

        {/* Right: Pie Chart Kategori Terlaris */}
        <div className="laporan-content-card">
          <h3 className="laporan-card-title">Kategori Produk Terlaris</h3>

          <div className="pie-chart-wrapper-flex">
            {/* SVG Donut / Pie Chart */}
            <div className="pie-svg-box">
              <svg viewBox="0 0 100 100" className="donut-pie-svg">
                {/* Hoodie: 45% (#15803d) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#15803d"
                  strokeWidth="30"
                  strokeDasharray="98.96 219.9"
                  strokeDashoffset="0"
                />
                {/* Kaos: 35% (#86efac) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#86efac"
                  strokeWidth="30"
                  strokeDasharray="76.96 219.9"
                  strokeDashoffset="-98.96"
                />
                {/* Lainnya: 20% (#cbd5e1) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#cbd5e1"
                  strokeWidth="30"
                  strokeDasharray="43.98 219.9"
                  strokeDashoffset="-175.92"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="pie-legend-col">
              <div className="legend-item-row">
                <span className="legend-dot dot-dark-green"></span>
                <span className="legend-text">Hoodie 45%</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-dot dot-light-green"></span>
                <span className="legend-text">Kaos 35%</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-dot dot-gray"></span>
                <span className="legend-text">Lainnya 20%</span>
              </div>
            </div>
          </div>

          {/* Carousel dots below */}
          <div className="carousel-dots-indicator">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      {/* Bottom Section: Produk Terlaris Table */}
      <section className="laporan-content-card table-card-section">
        <div className="laporan-card-header-flex">
          <h3 className="laporan-card-title">Produk Terlaris</h3>
          <a href="#all" className="link-lihat-semua">
            Lihat Semua &gt;
          </a>
        </div>

        <div className="table-responsive">
          <table className="laporan-products-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>
                  <span className="th-icon-box">🧥</span> Produk
                </th>
                <th style={{ width: '25%' }}>Total Terjual</th>
                <th style={{ width: '30%' }}>Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="prod-row-flex">
                      <div className="prod-row-thumb-box">
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                      </div>
                      <div>
                        <div className="prod-row-title">{item.name}</div>
                        <div className="prod-row-category">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-total-sold">{item.sold}</span>
                  </td>
                  <td>
                    <span className="text-revenue-bold">
                      {formatPrice(item.revenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Laporan;
