import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/admin.css';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Mobile Topbar */}
      <header className="admin-mobile-header">
        <button
          className="admin-hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
        <div className="admin-mobile-brand">
          <img
            src="/assets/logo.jpg"
            alt="CLOVER LADS CLUB"
            className="admin-mobile-logo-patch"
          />
          <span>CLOVER ADMIN</span>
        </div>
        <Link to="/" className="admin-mobile-to-store-btn" title="Buka Toko User">
          🛒
        </Link>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle state */}
      <div className={`sidebar-container ${mobileOpen ? 'drawer-open' : ''}`}>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
