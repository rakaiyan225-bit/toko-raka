import React from 'react';

const promos = [
  {
    id: 1,
    code: 'CLOVER99',
    title: 'Flash Sale 9.9 - Diskon 50%',
    discount: '50%',
    minSpend: 150000,
    validUntil: '11 Sept 2026',
    status: 'Aktif',
    usageCount: 142,
  },
  {
    id: 2,
    code: 'ONGKIRFREE',
    title: 'Gratis Ongkir Se-Indonesia',
    discount: 'Rp15.000',
    minSpend: 100000,
    validUntil: '30 Sept 2026',
    status: 'Aktif',
    usageCount: 289,
  },
  {
    id: 3,
    code: 'NEWCLOVER',
    title: 'Voucher Pelanggan Baru 20%',
    discount: '20%',
    minSpend: 50000,
    validUntil: '31 Des 2026',
    status: 'Aktif',
    usageCount: 85,
  },
];

const Promo = () => {
  return (
    <div className="admin-page promo-page">
      <header className="admin-topbar">
        <div className="topbar-title-group">
          <h1 className="topbar-title">Promo &amp; Diskon</h1>
          <span className="topbar-subtext">Kelola voucher dan kampanye diskon toko</span>
        </div>
        <button className="btn-add-primary">+ Buat Promo Baru</button>
      </header>

      <section className="content-card">
        <h3 className="card-title mb-4">Daftar Promo Aktif</h3>
        <div className="table-responsive">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Kode Voucher</th>
                <th>Nama Promo</th>
                <th>Potongan</th>
                <th>Minimal Belanja</th>
                <th>Masa Berlaku</th>
                <th>Penggunaan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="price-pill-green" style={{ padding: '4px 10px', fontSize: '12px' }}>
                      🏷 {p.code}
                    </span>
                  </td>
                  <td className="fw-semibold">{p.title}</td>
                  <td className="fw-bold text-green">{p.discount}</td>
                  <td>Rp{p.minSpend.toLocaleString('id-ID')}</td>
                  <td>{p.validUntil}</td>
                  <td>{p.usageCount} kali</td>
                  <td>
                    <span className="status-pill-aktif">{p.status} •</span>
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

export default Promo;
