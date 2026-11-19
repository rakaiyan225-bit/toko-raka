import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, user, onAuthChange }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data && res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onAuthChange(res.data.user);
        setSuccessMsg('Login berhasil! Selamat datang kembali.');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.data.message || 'Login gagal.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', {
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      if (res.data && res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onAuthChange(res.data.user);
        setSuccessMsg('Pendaftaran berhasil! Akun Anda telah aktif.');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.data.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onAuthChange(null);
    setSuccessMsg('Anda telah keluar dari akun.');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-header-brand">
            <img
              src="/assets/logo.jpg"
              alt="CLOVER LADS CLUB"
              className="auth-modal-logo"
            />
            <div>
              <h3>CLOVER LADSCLUB</h3>
              <p>Akun Pengguna</p>
            </div>
          </div>
          <button className="auth-modal-close" onClick={onClose} title="Tutup">
            ✕
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && <div className="auth-alert-error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert-success">{successMsg}</div>}

        {/* Content: If already logged in */}
        {user ? (
          <div className="auth-logged-in-profile">
            <div className="auth-profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h4 className="auth-profile-name">{user.name}</h4>
            <p className="auth-profile-email">{user.email}</p>
            {user.phone && <p className="auth-profile-phone">📱 {user.phone}</p>}

            <div className="auth-profile-status-badge">
              ☘️ Member Terverifikasi
            </div>

            <div className="auth-profile-actions">
              <button
                type="button"
                className="btn-auth-logout"
                onClick={handleLogout}
              >
                🚪 Keluar dari Akun
              </button>
            </div>
          </div>
        ) : (
          /* Content: Login / Register tabs */
          <div className="auth-form-body">
            <div className="auth-tab-nav">
              <button
                type="button"
                className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                Masuk
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                Daftar Akun
              </button>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form-fields">
                <div className="auth-form-group">
                  <label>Email atau Nomor Telepon</label>
                  <input
                    type="text"
                    required
                    placeholder="nama@email.com atau 0812..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="auth-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-submit"
                >
                  {loading ? 'Memproses...' : 'Masuk Sekarang'}
                </button>

              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form-fields">
                <div className="auth-form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap Anda"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className="auth-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div className="auth-form-group">
                  <label>Nomor WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>

                <div className="auth-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Buat password aman"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-submit"
                >
                  {loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
