import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// User components
import UserLayout from './components/user/UserLayout';
import Home from './components/user/Home';
import ProductDetail from './components/user/ProductDetail';
import Cart from './components/user/Cart';
import Checkout from './components/user/Checkout';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import Orders from './components/admin/Orders';
import Customers from './components/admin/Customers';
import Promo from './components/admin/Promo';
import Laporan from './components/admin/Laporan';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Admin Routes (/admin prefix) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produk" element={<Products />} />
            <Route path="pesanan" element={<Orders />} />
            <Route path="pelanggan" element={<Customers />} />
            <Route path="promo" element={<Promo />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
