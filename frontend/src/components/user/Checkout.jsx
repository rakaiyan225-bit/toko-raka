import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
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
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    if (saved.length > 0) {
      setItems(saved);
    }
  }, []);

  const shippingCost = 15000;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalPayment = subtotal + shippingCost;

  const firstItem = items[0] || defaultCheckoutItem;

  const handleWhatsAppClick = () => {
    const autoMessage = `Halo Min, saya mau konfirmasi pesanan ${firstItem.name}, bayar via ${selectedMethod}, total ${formatPrice(totalPayment)}.`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(autoMessage)}`;
    window.open(waUrl, '_blank');
  };

  const autoFilledText = `Halo Min, saya mau konfirmasi pesanan ${firstItem.name}, bayar via ${selectedMethod}, total ${formatPrice(totalPayment)}.`;

  return (
    <div className="checkout-dark-theme-wrapper">
      <div className="checkout-container-box">
        {/* Header Pill */}
        <div className="checkout-pill-header">
          <button className="back-btn-arrow" onClick={() => navigate(-1)} title="Kembali">
            ←
          </button>
          <div className="checkout-header-title">
            <span>☘️</span>
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
                  {item.image ? (
                    <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} />
                  ) : (
                    <span style={{ fontSize: '32px' }}>🧥</span>
                  )}
                </div>

                <div className="checkout-prod-info">
                  <h4>{item.name}</h4>
                  <p className="qty-text">x{item.quantity}</p>
                  <p className="size-text">Ukuran: {item.size || 'M'}</p>
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

        {/* 2. Pilih Metode Pembayaran */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>💳</span> 2. Pilih Metode Pembayaran
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

        {/* 3. Konfirmasi & Bayar via WhatsApp */}
        <section className="checkout-dark-section">
          <h3 className="checkout-dark-section-title">
            <span>💬</span> 3. Konfirmasi & Bayar via WhatsApp
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
          CLOVER LADSCLUB • Aman • Cepat • Terpercaya ☘️
        </div>
      </div>
    </div>
  );
};

export default Checkout;
