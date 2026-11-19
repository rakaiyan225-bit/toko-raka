import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const getProductImage = (img) => {
  if (!img) return null;
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
    return img;
  }
  return `/uploads/${img}`;
};

const defaultCheckoutItem = {
  name: 'Hoodie Clover Black',
  price: 289000,
  quantity: 1,
  size: 'M',
  image: '',
};

const paymentOptions = [
  { id: 'DANA', title: 'DANA', subtitle: 'Dompet Digital', icon: '💳' },
  { id: 'OVO', title: 'OVO', subtitle: '', icon: '🟣' },
  { id: 'GoPay', title: 'GoPay', subtitle: '', icon: '🟢' },
  { id: 'ShopeePay', title: 'ShopeePay', subtitle: '', icon: '🟠' },
  { id: 'Transfer Bank', title: 'Transfer Bank', subtitle: '', icon: '🏛️' },
  { id: 'COD', title: 'COD Bayar di Tempat (Cash on Delivery)', subtitle: '', icon: '🚚' },
];

const Checkout = () => {
  const [items, setItems] = useState([defaultCheckoutItem]);
  const [selectedMethod, setSelectedMethod] = useState('DANA');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    if (saved.length > 0) {
      setItems(saved);
    }
    const loggedIn = JSON.parse(localStorage.getItem('user') || 'null');
    if (loggedIn) {
      if (loggedIn.name) setCustomerName(loggedIn.name);
      if (loggedIn.phone) setCustomerPhone(loggedIn.phone);
    }
  }, []);

  const shippingCost = 15000;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalPayment = subtotal + shippingCost;

  const updateItemSize = (index, newSize) => {
    const updated = [...items];
    updated[index].size = newSize;
    setItems(updated);
    try {
      localStorage.setItem('cart', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleWhatsAppClick = async () => {
    if (!customerName.trim()) {
      alert('Silakan isi Nama Lengkap Penerima terlebih dahulu!');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Silakan isi Nomor WhatsApp Penerima terlebih dahulu!');
      return;
    }
    if (!customerAddress.trim()) {
      alert('Silakan isi Alamat Lengkap Pengiriman terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#CLD${randomNum}`;

    const orderPayload = {
      orderId,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        email: '-',
      },
      items: items.map((it) => ({
        product: it._id,
        name: it.name,
        size: it.size || 'M',
        quantity: it.quantity || 1,
        price: it.price,
      })),
      totalAmount: totalPayment,
      shippingCost,
      paymentMethod: selectedMethod,
      status: 'Diproses',
      createdAt: new Date().toISOString(),
    };

    // 1. Simpan ke backend API
    try {
      await axios.post('/api/orders', orderPayload);
    } catch (err) {
      console.warn('API save order error, fallback local:', err);
    }

    // 2. Simpan ke local cache agar langsung muncul di admin
    try {
      const existingOrders = JSON.parse(localStorage.getItem('clover_custom_orders') || '[]');
      const updatedOrders = [orderPayload, ...existingOrders.filter((o) => o.orderId !== orderId)];
      localStorage.setItem('clover_custom_orders', JSON.stringify(updatedOrders));

      // Simpan juga ke daftar pelanggan
      const existingCusts = JSON.parse(localStorage.getItem('clover_custom_customers') || '[]');
      const existingCustIdx = existingCusts.findIndex(
        (c) => c.phone === customerPhone.trim() || c.name.toLowerCase() === customerName.trim().toLowerCase()
      );
      if (existingCustIdx !== -1) {
        existingCusts[existingCustIdx].totalOrders += 1;
        existingCusts[existingCustIdx].totalSpent += totalPayment;
      } else {
        existingCusts.unshift({
          _id: 'cust_' + Date.now(),
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: '-',
          totalOrders: 1,
          totalSpent: totalPayment,
          status: 'Aktif',
          createdAt: new Date().toISOString(),
        });
      }
      localStorage.setItem('clover_custom_customers', JSON.stringify(existingCusts));

      // Kosongkan keranjang
      localStorage.removeItem('cart');
    } catch (e) {}

    // 3. Format pesan WhatsApp
    const itemSummaries = items
      .map((it) => `- ${it.name} (Ukuran: ${it.size || 'M'}, Qty: ${it.quantity})`)
      .join('\n');
    const autoMessage = `Halo Min, saya mau konfirmasi pesanan CLOVER LADSCLUB:\n\n*ID Pesanan:* ${orderId}\n*Nama:* ${customerName.trim()}\n*No. HP:* ${customerPhone.trim()}\n*Alamat:* ${customerAddress.trim()}\n\n*Pesanan:*\n${itemSummaries}\n\n*Total Bayar:* ${formatPrice(totalPayment)}\n*Metode Pembayaran:* ${selectedMethod}\n\nMohon diproses ya Min, terima kasih! ☘️`;
    const waUrl = `https://wa.me/6289513785705?text=${encodeURIComponent(autoMessage)}`;

    setIsSubmitting(false);
    window.open(waUrl, '_blank');
    alert(`✅ Pesanan Anda berhasil dicatat dengan ID ${orderId}! Mengarahkan ke WhatsApp admin...`);
  };

  const autoFilledText = `Halo Min, saya mau konfirmasi pesanan CLOVER LADSCLUB:\n${items.map((it) => `- ${it.name} [Ukuran: ${it.size || 'M'}, Qty: ${it.quantity}]`).join('\n')}\nTotal: ${formatPrice(totalPayment)} via ${selectedMethod}`;

  return (
    <div className="checkout-dark-theme-wrapper">
      <div className="checkout-container-box">
        {/* Header Pill */}
        <div className="checkout-pill-header">
          <button className="back-btn-arrow" onClick={() => navigate(-1)} title="Kembali">
            ←
          </button>
          <div className="checkout-header-title">
            <img
              src="/assets/logo.jpg"
              alt="CLOVER LADS CLUB"
              className="checkout-header-patch"
            />
            <span>CHECKOUT - BAYAR VIA WA</span>
          </div>
        </div>

        {/* 1. Ringkasan Pesanan */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>🛍️</span> 1. Ringkasan Pesanan
          </h3>

          <div className="checkout-dark-card">
            {items.map((item, index) => (
              <div key={index} className="checkout-order-item-row">
                <div className="checkout-prod-thumb">
                  {getProductImage(item.image) ? (
                    <img src={getProductImage(item.image)} alt={item.name} />
                  ) : (
                    <span style={{ fontSize: '32px' }}>🧥</span>
                  )}
                </div>

                <div className="checkout-prod-info">
                  <h4>{item.name}</h4>
                  <p className="qty-text">x{item.quantity}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Ukuran:</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => updateItemSize(index, sz)}
                          style={{
                            padding: '2px 7px',
                            fontSize: '11px',
                            fontWeight: (item.size || 'M') === sz ? '700' : '500',
                            borderRadius: '4px',
                            border: (item.size || 'M') === sz ? '1.5px solid #22c55e' : '1px solid #475569',
                            background: (item.size || 'M') === sz ? '#15803d' : '#1e293b',
                            color: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="checkout-prod-prices">
                  <div className="checkout-item-main-price">{formatPrice(item.price)}</div>
                  {index === 0 && (
                    <div className="checkout-item-ongkir">
                      Ongkir <span>{formatPrice(shippingCost)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="checkout-divider"></div>

            <div className="checkout-total-row">
              <span className="checkout-total-label">Total Pembayaran</span>
              <span className="checkout-total-value">{formatPrice(totalPayment)}</span>
            </div>
          </div>
        </section>

        {/* 2. Data Penerima & Pengiriman */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>📍</span> 2. Data Penerima &amp; Pengiriman
          </h3>

          <div className="checkout-dark-card" style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                Nama Lengkap Penerima <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Raka Pratama"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                Nomor WhatsApp Aktif <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 089513785705"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                Alamat Lengkap Pengiriman <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows="3"
                required
                placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota/kabupaten, kode pos"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </section>

        {/* 3. Pilih Metode Pembayaran */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>💳</span> 3. Pilih Metode Pembayaran
          </h3>

          <div className="payment-methods-dark-list">
            {paymentOptions.map((opt) => (
              <div
                key={opt.id}
                className={`payment-dark-option ${selectedMethod === opt.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(opt.id)}
              >
                <div className="payment-radio-circle">
                  {selectedMethod === opt.id && <div className="payment-radio-circle-inner" />}
                </div>

                <span className="payment-badge-icon">{opt.icon}</span>

                <div>
                  <span className="payment-brand-title">{opt.title}</span>
                  {opt.subtitle && <span className="payment-brand-subtitle">{opt.subtitle}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Konfirmasi & Bayar via WhatsApp */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>💬</span> 4. Konfirmasi &amp; Bayar via WhatsApp
          </h3>

          <button className="btn-whatsapp-giant" onClick={handleWhatsAppClick}>
            <span style={{ fontSize: '24px' }}>💬</span> LANJUT KE WHATSAPP
          </button>

          <div className="wa-bubble-preview-box">
            <span className="info-symbol">ⓘ</span>
            <div>
              Pesan otomatis terisi: "{autoFilledText}"
            </div>
          </div>

          <div className="checkout-note-footer">
            <span className="info-symbol">ⓘ</span>
            <div>
              Catatan: Setelah klik, kamu akan diarahkan ke WhatsApp admin untuk kirim bukti pembayaran. Tidak perlu nomor telepon pribadi, transaksi aman &amp; terverifikasi.
            </div>
          </div>
        </section>

        {/* Footer Brand */}
        <div className="checkout-trust-bottom">
          <img
            src="/assets/logo.jpg"
            alt="CLOVER LADS CLUB"
            className="checkout-footer-patch"
          />
          <span>CLOVER LADSCLUB • Aman • Cepat • Terpercaya</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
