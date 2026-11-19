import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: '⌂', label: 'Dashboard', path: '/admin' },
  { icon: '📦', label: 'Produk', path: '/admin/produk' },
  { icon: '📋', label: 'Pesanan', path: '/admin/pesanan' },
  { icon: '👥', label: 'Pelanggan', path: '/admin/pelanggan' },
  { icon: '🏷', label: 'Promo', path: '/admin/promo' },
  { icon: '📊', label: 'Laporan', path: '/admin/laporan' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar-dark-green">
      {/* Brand Logo */}
      <div className="sidebar-brand-header">
        <div className="sidebar-clover-badge">☘️</div>
        <div className="sidebar-brand-name">
          <h2>CLOVER</h2>
          <p>LADSCLUB</p>
        </div>
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
        <div className="sidebar-avatar-circle">AC</div>
        <div className="sidebar-user-text">
          <h5>Admin CLOVER</h5>
          <p>admin@clover.co.id</p>
        </div>
        <button
          className="sidebar-logout-button"
          title="Keluar ke Halaman User"
          onClick={() => navigate('/')}
        >
          <span>🚪 Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
