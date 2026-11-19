import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
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
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + shipping;

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
      <h1 className="cart-title">Keranjang Belanja</h1>

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
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
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
                <p className="cart-item-price">{formatPrice(item.price)}</p>
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
              </div>

              <div className="cart-item-total">
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>

              <button
                className="cart-item-remove"
                onClick={() => removeItem(index)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Ringkasan Pesanan</h3>
          <div className="summary-row">
            <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} produk)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Ongkos Kirim</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user') || 'null');
              if (!user) {
                alert('🔒 Silakan login atau daftar akun terlebih dahulu untuk melanjutkan checkout!');
                setIsAuthOpen(true);
                return;
              }
              navigate('/checkout');
            }}
          >
            Lanjut ke Checkout
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onAuthChange={(userData) => {
          setCurrentUser(userData);
          if (userData) {
            setIsAuthOpen(false);
            navigate('/checkout');
          }
        }}
      />
    </div>
  );
};

export default Cart;
