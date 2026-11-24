import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToastContainer, { showToast } from './Toast';
import OrderModal from './OrderModal';

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

const WHATSAPP_NUMBER = '6289513785705'; // Ganti dengan nomor WA toko

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newCart = [...cartItems];
    newCart[index].quantity = newQty;
    updateCart(newCart);
  };

  const updateSize = (index, newSize) => {
    const newCart = [...cartItems];
    newCart[index].size = newSize;
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const removedName = cartItems[index]?.name || 'Produk';
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
    showToast(`${removedName} dihapus dari keranjang`, 'error');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const orderViaWhatsApp = () => {
    if (cartItems.length === 0) return;
    setIsOrderModalOpen(true);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Keranjang Belanja Kosong</h2>
        <p>Belum ada produk di keranjang kamu.</p>
        <Link to="/" className="btn btn-primary">Mulai Belanja</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="cart-title">Keranjang Belanja ({cartItems.reduce((s, i) => s + i.quantity, 0)})</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-image">
                {getProductImage(item.image) ? (
                  <img src={getProductImage(item.image)} alt={item.name} />
                ) : (
                  <div className="image-placeholder small">
                    <span>👕</span>
                  </div>
                )}
              </div>

              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <div className="cart-item-size-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Ukuran:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => updateSize(index, sz)}
                        style={{
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: (item.size || 'M') === sz ? '700' : '500',
                          borderRadius: '4px',
                          border: (item.size || 'M') === sz ? '1.5px solid #15803d' : '1px solid #cbd5e1',
                          background: (item.size || 'M') === sz ? '#dcfce7' : '#ffffff',
                          color: (item.size || 'M') === sz ? '#15803d' : '#475569',
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

              <div className="cart-item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="btn-hapus"
                  onClick={() => removeItem(index)}
                  style={{
                    marginLeft: '8px',
                    padding: '4px 10px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  🗑 Hapus
                </button>
              </div>

              <div className="cart-item-total">
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Ringkasan Belanja</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Ongkir</span>
            <span style={{ color: '#16a34a', fontWeight: '600' }}>Gratis</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            className="btn btn-whatsapp btn-block"
            onClick={orderViaWhatsApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pesan via WhatsApp
          </button>

          <button
            className="btn btn-outline btn-block"
            onClick={() => navigate('/')}
          >
            Lanjut Belanja
          </button>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        items={cartItems}
        totalAmount={total}
        onSuccess={() => {
          localStorage.removeItem('cart');
          setCartItems([]);
        }}
      />

      <ToastContainer />
    </div>
  );
};

export default Cart;
