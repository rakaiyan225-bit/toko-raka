import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query.toLowerCase() === '/admin' || query.toLowerCase() === 'admin') {
      navigate('/admin');
      return;
    }
    if (query) {
      navigate('/?search=' + encodeURIComponent(query));
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/assets/logo.jpg"
            alt="CLOVER LADS CLUB"
            className="brand-logo-patch"
          />
          <div className="navbar-brand-text">
            <span className="brand-title">CLOVER</span>
            <span className="brand-subtitle">LADSCLUB</span>
          </div>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Cari produk, brand, atau kategori... (ketik /admin untuk panel admin)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" title="Cari">
            🔍
          </button>
        </form>

        <div className="navbar-actions">
          <Link to="/cart" className="nav-action-link">
            <span className="nav-icon">🛒</span>
            <span className="nav-label">Keranjang</span>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          <button
            type="button"
            className="nav-action-link nav-user-btn"
            onClick={() => setIsAuthOpen(true)}
            title={currentUser ? `Akun: ${currentUser.name}` : 'Login / Masuk Akun Pengguna'}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">
              {currentUser ? currentUser.name.split(' ')[0] : 'Saya'}
            </span>
          </button>
        </div>
      </div>

      {/* User Login & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onAuthChange={setCurrentUser}
      />
    </nav>
  );
};

export default Navbar;
