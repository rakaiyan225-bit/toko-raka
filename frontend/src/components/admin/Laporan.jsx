import React from 'react';

const Laporan = () => {
  return (
    <div className="admin-page laporan-page">
      <header className="admin-topbar">
        <div className="topbar-title-group">
          <h1 className="topbar-title">Laporan Penjualan</h1>
          <span className="topbar-subtext">Statistik performa bisnis Clover Ladsclub</span>
        </div>
        <button className="btn-add-primary">📥 Unduh Laporan (PDF/Excel)</button>
      </header>

      <section className="stats-row three-cards">
        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">📈</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Pendapatan Bersih Bulan Ini</p>
            <h2 className="stat-value">Rp12.450.000</h2>
            <p className="stat-growth positive">↑ 12.5% peningkatan</p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">👕</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Produk Terlaris</p>
            <h2 className="stat-value" style={{ fontSize: '18px', marginTop: '6px' }}>Hoodie Hitam Clover</h2>
            <p className="stat-subdetail">2.100 item terjual</p>
          </div>
        </div>

        <div className="admin-stat-card card-centered">
          <div className="stat-card-circle-icon icon-light-green">
            <span className="stat-symbol">⭐</span>
          </div>
          <div className="stat-card-details">
            <p className="stat-label">Kepuasan Pelanggan</p>
            <h2 className="stat-value">4.9 / 5.0</h2>
            <p className="stat-growth positive">98% ulasan positif</p>
          </div>
        </div>
      </section>

      <section className="content-card">
        <h3 className="card-title mb-4">Ringkasan Penjualan Bulanan (2026)</h3>
        <div className="table-responsive">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Total Transaksi</th>
                <th>Produk Terjual</th>
                <th>Total Pendapatan</th>
                <th>Pertumbuhan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { bulan: 'September', transaksi: 342, produk: 412, total: 'Rp12.450.000', growth: '+12.5%' },
                { bulan: 'Agustus', transaksi: 295, produk: 360, total: 'Rp9.800.000', growth: '+8.3%' },
                { bulan: 'Juli', transaksi: 240, produk: 280, total: 'Rp7.400.000', growth: '+5.7%' },
                { bulan: 'Juni', transaksi: 255, produk: 310, total: 'Rp7.900.000', growth: '+14.5%' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="fw-bold">{row.bulan}</td>
                  <td>{row.transaksi} pesanan</td>
                  <td>{row.produk} pcs</td>
                  <td className="fw-bold text-green">{row.total}</td>
                  <td>
                    <span className="status-pill-aktif">{row.growth}</span>
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
