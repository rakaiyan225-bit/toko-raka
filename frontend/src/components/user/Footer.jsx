import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-logo-wrapper">
            <img
              src="/assets/logo.jpg"
              alt="CLOVER LADS CLUB"
              className="footer-logo-patch"
            />
            <div className="footer-brand-text">
              <span className="footer-brand-title">CLOVER</span>
              <span className="footer-brand-subtitle">LADSCLUB</span>
            </div>
          </div>
          <p className="footer-desc">
            Fashion streetwear lokal untuk generasi aktif. Kualitas terbaik, gaya kasual.
          </p>
          <div className="footer-social">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Layanan Pelanggan</h3>
          <ul className="footer-links">
            <li><a href="#!">Pusat Bantuan</a></li>
            <li><a href="#!">Cara Belanja</a></li>
            <li><a href="#!">Pengembalian &amp; Refund</a></li>
            <li><a href="#!">Kontak Kami</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">CLOVER LADSCLUB</h3>
          <ul className="footer-links">
            <li><a href="#!">Tentang Kami</a></li>
            <li><a href="#!">Karir</a></li>
            <li><a href="#!">Blog</a></li>
            <li><a href="#!">Syarat &amp; Ketentuan</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Pembayaran &amp; Pengiriman</h3>
          <div className="payment-icons">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">GoPay</span>
            <span className="payment-badge">Shopee</span>
            <span className="payment-badge">JNE</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CLOVER LADS CLUB. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
};

export default Footer;
