import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
            src="/assets/logo-2.jpg"
            alt="CLOVER LADS CLUB"
            className="brand-logo-img"
          />
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

          <Link
            to="/admin"
            className="nav-action-link"
            title="Buka Admin Panel (/admin)"
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Saya</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
