import React, { useState } from 'react';

const initialPromos = [
  {
    id: 1,
    code: 'CLOVER10',
    title: 'Kode CLOVER10',
    discount: '10%',
    description: 'Diskon 10% Semua Produk',
    validUntil: 'Berlaku sampai 30 Sep',
    isActive: true,
  },
  {
    id: 2,
    code: 'HEMAT20',
    title: 'Kode HEMAT20',
    discount: '20%',
    description: 'Diskon 20% Hoodie',
    validUntil: 'Berlaku sampai 15 Okt',
    isActive: true,
  },
  {
    id: 3,
    code: 'HEMAT20_2',
    title: 'Kode HEMAT20',
    discount: '20%',
    description: 'Diskon 20% Hoodie',
    validUntil: 'Berlaku sampai 15 Okt',
    isActive: true,
  },
  {
    id: 4,
    code: 'GRATISONGKIR',
    title: 'Kode GRATISONGKIR',
    discount: 'GRATIS',
    description: 'Gratis Ongkir Min Rp150.000',
    validUntil: 'Berakhir',
    isActive: false,
    isExpired: true,
  },
];

const Promo = () => {
  const [promos, setPromos] = useState(initialPromos);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '10%',
    description: '',
    validUntil: '',
    isActive: true,
  });

  const toggleStatus = (id) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const openAddModal = () => {
    setEditingPromo(null);
    setFormData({
      code: '',
      discount: '15%',
      description: 'Diskon produk pilihan',
      validUntil: 'Berlaku sampai 30 Nov',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingPromo(p);
    setFormData({
      code: p.code,
      discount: p.discount,
      description: p.description,
      validUntil: p.validUntil,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPromo) {
      setPromos((prev) =>
        prev.map((p) =>
          p.id === editingPromo.id
            ? {
                ...p,
                code: formData.code.toUpperCase(),
                title: `Kode ${formData.code.toUpperCase()}`,
                discount: formData.discount,
                description: formData.description,
                validUntil: formData.validUntil,
                isActive: formData.isActive,
              }
            : p
        )
      );
    } else {
      const newP = {
        id: Date.now(),
        code: formData.code.toUpperCase(),
        title: `Kode ${formData.code.toUpperCase()}`,
        discount: formData.discount,
        description: formData.description,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
      };
      setPromos([newP, ...promos]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page promo-page">
      {/* Top Header matching Image 3 */}
      <header className="promo-topbar">
        <h1 className="promo-header-title">Promo</h1>
        <button className="btn-buat-promo" onClick={openAddModal}>
          + Buat Promo
        </button>
      </header>

      {/* 2x2 Promo Cards Grid */}
      <div className="promo-cards-grid">
        {promos.map((promo) => {
          const isActuallyActive = promo.isActive && !promo.isExpired;

          return (
            <div
              key={promo.id}
              className={`promo-item-card ${!isActuallyActive ? 'card-inactive' : ''}`}
            >
              {/* Card Top Row: Tag Icon & Toggle Switch */}
              <div className="promo-card-top-row">
                <div
                  className={`promo-tag-icon-circle ${
                    isActuallyActive ? 'icon-green' : 'icon-gray'
                  }`}
                >
                  🏷
                </div>

                {!promo.isExpired && (
                  <label className="promo-toggle-switch">
                    <input
                      type="checkbox"
                      checked={promo.isActive}
                      onChange={() => toggleStatus(promo.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                )}
              </div>

              {/* Discount Value & Status Badge */}
              <div className="promo-discount-badge-row">
                <span
                  className={`promo-big-discount ${
                    isActuallyActive ? 'text-green' : 'text-gray'
                  }`}
                >
                  {promo.discount}
                </span>

                {isActuallyActive ? (
                  <span className="promo-badge-aktif">Aktif</span>
                ) : (
                  <span className="promo-badge-berakhir">
                    {promo.isExpired ? 'Berakhir' : 'Nonaktif'}
                  </span>
                )}
              </div>

              {/* Promo Info */}
              <h3 className="promo-code-title">{promo.title}</h3>
              <p className="promo-desc-text">{promo.description}</p>
              <p className="promo-validity-text">
                <span className="cal-icon">📅</span> {promo.validUntil}
              </p>

              {/* Action Buttons */}
              <div className="promo-action-buttons-row">
                <button
                  type="button"
                  className="promo-btn-outline"
                  onClick={() => openEditModal(promo)}
                >
                  ✏ Edit
                </button>
                <button
                  type="button"
                  className="promo-btn-outline"
                  onClick={() => toggleStatus(promo.id)}
                >
                  {promo.isActive ? '⏸ Nonaktifkan' : '▶ Aktifkan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Buat / Edit Promo */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingPromo ? 'Edit Promo' : 'Buat Promo Baru'}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Kode Promo (Kupon)</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: CLOVER10"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Nilai Potongan / Diskon</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: 10% atau Rp20.000 atau GRATIS"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Keterangan / Deskripsi</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Diskon 10% Semua Produk"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Masa Berlaku</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Contoh: Berlaku sampai 30 Sep"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromo ? 'Perbarui Promo' : 'Simpan Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promo;
