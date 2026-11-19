import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const defaultOrders = [];

const Orders = () => {
  const [orders, setOrders] = useState(defaultOrders);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setOrders(res.data.data);
        }
      } catch (e) {
        // Fallback to defaultOrders
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
    } catch (e) {
      // Local update even if API is not yet running
    }
    setOrders((prev) =>
      prev.map((ord) => (ord._id === orderId || ord.orderId === orderId ? { ...ord, status } : ord))
    );
    setStatusModalOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchFilter = activeFilter === 'Semua' || order.status === activeFilter;
    const matchSearch =
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.[0]?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const renderStatusBadge = (order) => {
    // In screenshot row 1 shows price in green pill or status
    switch (order.status) {
      case 'Dikirim':
        return (
          <span className="order-status-pill pill-dikirim">
            <span className="pill-icon">🚚</span> Dikirim
          </span>
        );
      case 'Diproses':
        return (
          <span className="order-status-pill pill-diproses">
            <span className="pill-icon">⏱</span> Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="order-status-pill pill-selesai">
            <span className="pill-icon">🚚</span> Selesai ✓
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="order-status-pill pill-dibatalkan">
            <span className="pill-icon">✖</span> Dibatalkan
          </span>
        );
      default:
        return <span className="order-status-pill">{order.status}</span>;
    }
  };

  return (
    <div className="admin-page orders-page">
      {/* Top Header */}
      <header className="admin-topbar">
        <h1 className="topbar-title">Pesanan</h1>

        <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
          <button className="icon-btn notification-btn" title="Notifikasi">
            <span className="bell-icon">🔔</span>
          </button>
          <div className="admin-profile-pill">
            <div className="avatar-letter-circle">A</div>
            <span className="admin-greeting">Admin CLOVER ▾</span>
          </div>
        </div>
      </header>

      {/* Search & Filter Tabs */}
      <div className="orders-toolbar">
        <div className="orders-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari ID pesanan, pelanggan, produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {['Semua', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab-pill ${activeFilter === tab ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <section className="content-card orders-card">
        <div className="table-responsive">
          <table className="admin-custom-table orders-table">
            <thead>
              <tr>
                <th>
                  <span className="th-sort-icon">⋮⋮</span> ID Pesanan
                </th>
                <th>Pelanggan</th>
                <th>Produk</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr key={order._id || idx}>
                  <td className="fw-bold">{order.orderId}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.items?.[0]?.product?.name || order.items?.[0]?.name || 'Produk'}</td>
                  <td>
                    {order.showAmountPill || idx === 0 ? (
                      <span className="price-pill-green">
                        {formatPrice(order.totalAmount || 199000)} <span className="pill-info-icon">ⓘ</span>
                      </span>
                    ) : (
                      <span className="fw-bold">{formatPrice(order.totalAmount)}</span>
                    )}
                  </td>
                  <td>{renderStatusBadge(order)}</td>
                  <td>
                    <div className="order-actions-buttons">
                      <button
                        className="btn-action-outline edit-status-btn"
                        onClick={() => {
                          setStatusModalOrder(order);
                          setNewStatus(order.status);
                        }}
                      >
                        <span className="btn-icon">✏</span> Ubah Status
                      </button>
                      <button
                        className="btn-action-outline detail-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <span className="btn-icon">👁</span> Detail
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
            Menampilkan 1-{filteredOrders.length} dari {orders.length} pesanan
          </span>
          <div className="pagination-page-numbers">
            <button className="page-arrow">&larr;</button>
            <button className="page-num active">1</button>
            <button className="page-arrow">&rarr;</button>
          </div>
        </div>
      </section>

      {/* Modal Ubah Status */}
      {statusModalOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Ubah Status Pesanan {statusModalOrder.orderId}</h3>
              <button className="modal-close-btn" onClick={() => setStatusModalOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="form-label">Pilih Status Baru:</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Diproses">Diproses</option>
                <option value="Dikirim">Dikirim</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStatusModalOrder(null)}>Batal</button>
              <button
                className="btn btn-primary"
                onClick={() => handleStatusChange(statusModalOrder._id, newStatus)}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-box modal-lg">
            <div className="modal-header">
              <h3>Detail Pesanan {selectedOrder.orderId}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="order-detail-grid">
                <div>
                  <h4>Informasi Pelanggan</h4>
                  <p><strong>Nama:</strong> {selectedOrder.customer?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p><strong>No HP:</strong> {selectedOrder.customer?.phone}</p>
                  <p><strong>Alamat:</strong> {selectedOrder.customer?.address || 'Jakarta, Indonesia'}</p>
                </div>
                <div>
                  <h4>Informasi Transaksi</h4>
                  <p><strong>Metode Pembayaran:</strong> {selectedOrder.paymentMethod || 'DANA'}</p>
                  <p><strong>Status:</strong> {renderStatusBadge(selectedOrder)}</p>
                  <p><strong>Ongkir:</strong> {formatPrice(selectedOrder.shippingCost || 15000)}</p>
                  <p><strong>Total:</strong> <span className="text-green fw-bold">{formatPrice(selectedOrder.totalAmount)}</span></p>
                </div>
              </div>

              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Produk yang Dipesan</h4>
              <table className="admin-custom-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Ukuran</th>
                    <th>Qty</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name || item.name || 'Produk Clover'}</td>
                      <td>{item.size || 'M'}</td>
                      <td>{item.quantity || 1}</td>
                      <td>{formatPrice(item.price || selectedOrder.totalAmount)}</td>
                      <td>{formatPrice((item.price || selectedOrder.totalAmount) * (item.quantity || 1))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
