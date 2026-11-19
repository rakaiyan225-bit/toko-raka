import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: '⊞', label: 'Dashboard', path: '/admin' },
  { icon: '📦', label: 'Produk', path: '/admin/produk' },
  { icon: '📋', label: 'Pesanan', path: '/admin/pesanan' },
  { icon: '👤', label: 'Pelanggan', path: '/admin/pelanggan' },
  { icon: '🏷', label: 'Promo', path: '/admin/promo' },
  { icon: '📊', label: 'Laporan', path: '/admin/laporan' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar-dark-green">
      {/* Brand Header with Circular Embroidered Logo */}
      <div className="sidebar-brand-header">
        <NavLink to="/admin" className="sidebar-brand-link">
          <img
            src="/assets/logo.jpg"
            alt="CLOVER LADS CLUB"
            className="sidebar-patch-logo"
          />
          <div className="sidebar-brand-name">
            <h2>CLOVER</h2>
            <p>LADSCLUB</p>
          </div>
        </NavLink>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-vertical-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `sidebar-nav-pill-item ${isActive ? 'active-pill' : ''}`
            }
          >
            <span className="sidebar-menu-icon">{item.icon}</span>
            <span className="sidebar-menu-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile Footer */}
      <div className="sidebar-bottom-profile">
        <div className="profile-user-info-row">
          <div className="sidebar-avatar-circle">👤</div>
          <div className="sidebar-user-text">
            <h5>Admin •</h5>
            <p>admin@cloverladsclub.com</p>
          </div>
          <button
            className="sidebar-logout-icon-btn"
            title="Keluar ke Halaman User"
            onClick={() => navigate('/')}
          >
            ↪
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
