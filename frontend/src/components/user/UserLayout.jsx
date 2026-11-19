import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../styles/user.css';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
