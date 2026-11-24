import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from './Toast';

const WHATSAPP_NUMBER = '6289513785705';

const formatPrice = (price) => {
  return 'Rp' + Number(price || 0).toLocaleString('id-ID').replace(/,/g, '.');
};

const OrderModal = ({ isOpen, onClose, items = [], totalAmount = 0, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem('clover_user_info') || '{}');
        if (saved.name) setName(saved.name);
        if (saved.phone) setPhone(saved.phone);
        if (saved.address) setAddress(saved.address);
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Silakan isi Nama Lengkap Anda', 'warning');
      return;
    }
    if (!phone.trim()) {
      showToast('Silakan isi Nomor WhatsApp Anda', 'warning');
      return;
    }
    if (!address.trim()) {
      showToast('Silakan isi Alamat Lengkap Pengiriman', 'warning');
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#CLD${randomNum}`;

    const orderPayload = {
      orderId,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        email: '-',
      },
      items: items.map((it) => ({
        product: it._id || ('prod_' + Math.random().toString(36).substring(7)),
        name: it.name,
        size: it.size || 'M',
        quantity: it.quantity || 1,
        price: it.price || 0,
      })),
      totalAmount: totalAmount || items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
      shippingCost: 0,
      paymentMethod: 'WhatsApp',
      status: 'Diproses',
      createdAt: new Date().toISOString(),
    };

    // 1. Simpan ke Backend API (MongoDB)
    try {
      await axios.post('/api/orders', orderPayload);
    } catch (err) {
      console.warn('API save order fallback to local storage:', err.message);
    }

    // 2. Simpan ke Local Storage clover_custom_orders (agar langsung tampil di Admin Pesanan)
    try {
      const existingOrders = JSON.parse(localStorage.getItem('clover_custom_orders') || '[]');
      const updatedOrders = [orderPayload, ...existingOrders.filter((o) => o.orderId !== orderId)];
      localStorage.setItem('clover_custom_orders', JSON.stringify(updatedOrders));

      // Simpan/update data pelanggan
      const existingCusts = JSON.parse(localStorage.getItem('clover_custom_customers') || '[]');
      const custIdx = existingCusts.findIndex(
        (c) => c.phone === phone.trim() || c.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (custIdx !== -1) {
        existingCusts[custIdx].totalOrders = (existingCusts[custIdx].totalOrders || 0) + 1;
        existingCusts[custIdx].totalSpent = (existingCusts[custIdx].totalSpent || 0) + orderPayload.totalAmount;
      } else {
        existingCusts.unshift({
          _id: 'cust_' + Date.now(),
          name: name.trim(),
          phone: phone.trim(),
          email: '-',
          totalOrders: 1,
          totalSpent: orderPayload.totalAmount,
          status: 'Aktif',
          createdAt: new Date().toISOString(),
        });
      }
      localStorage.setItem('clover_custom_customers', JSON.stringify(existingCusts));

      // Ingat data pemesan untuk pembelian berikutnya
      localStorage.setItem('clover_user_info', JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      }));
    } catch (e) {
      console.error('Local storage error:', e);
    }

    // 3. Format pesan WhatsApp dengan data lengkap
    const itemLines = items.map(
      (it) => `- ${it.name} (Ukuran: ${it.size || 'M'}, Jumlah: ${it.quantity || 1}) = ${formatPrice((it.price || 0) * (it.quantity || 1))}`
    ).join('\n');

    const msg =
      `Halo Admin SMECHA / CLOVER LADSCLUB,\n` +
      `Saya mau konfirmasi pesanan:\n\n` +
      `*ID Pesanan:* ${orderId}\n` +
      `*Nama:* ${name.trim()}\n` +
      `*No. WhatsApp:* ${phone.trim()}\n` +
      `*Alamat:* ${address.trim()}\n\n` +
      `*Detail Pesanan:*\n${itemLines}\n\n` +
      `*Total Bayar:* ${formatPrice(orderPayload.totalAmount)}\n\n` +
      `Mohon segera diproses ya kak, terima kasih! ☘️`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    showToast(`✅ Pesanan ${orderId} berhasil dicatat! Membuka WhatsApp...`, 'success');

    setIsSubmitting(false);
    onClose();

    if (onSuccess) {
      onSuccess();
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <div>
              <h2 style={modalStyles.title}>Data Pemesan</h2>
              <p style={modalStyles.subtitle}>Isi data Anda untuk konfirmasi pesanan via WhatsApp</p>
            </div>
          </div>
          <button style={modalStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Ringkasan Pesanan Singkat */}
        <div style={modalStyles.orderPreview}>
          <div style={{ fontWeight: '700', color: '#0f3d26', marginBottom: '6px', fontSize: '13px' }}>
            📦 Produk yang Dipesan ({items.reduce((s, it) => s + (it.quantity || 1), 0)} item):
          </div>
          <div style={{ maxHeight: '110px', overflowY: 'auto' }}>
            {items.map((it, idx) => (
              <div key={idx} style={modalStyles.previewItem}>
                <span>{it.name} ({it.size || 'M'} x {it.quantity || 1})</span>
                <span style={{ fontWeight: '600' }}>{formatPrice((it.price || 0) * (it.quantity || 1))}</span>
              </div>
            ))}
          </div>
          <div style={modalStyles.totalRow}>
            <span>Total Pembayaran:</span>
            <span style={{ color: '#15803d', fontWeight: '800', fontSize: '16px' }}>{formatPrice(totalAmount)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>
              Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Raka"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>
              Nomor WhatsApp <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="tel"
              placeholder="Contoh: 089513785705"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={modalStyles.input}
              required
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>
              Alamat Lengkap Pengiriman <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              placeholder="Contoh: Jl. Sukarno Hatta No. 45, Malang, Jawa Timur"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ ...modalStyles.input, minHeight: '65px', resize: 'vertical' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={modalStyles.submitBtn}
          >
            <span style={{ fontSize: '18px' }}>💬</span>
            {isSubmitting ? 'Memproses Pesanan...' : 'Kirim Pesanan via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '16px',
    backdropFilter: 'blur(3px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '480px',
    width: '100%',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
    animation: 'modalSlideUp 0.25s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f3d26',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: '3px 0 0 0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  orderPreview: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
  },
  previewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#475569',
    padding: '3px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px dashed #cbd5e1',
    marginTop: '8px',
    paddingTop: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    marginTop: '6px',
    padding: '13px',
    backgroundColor: '#25d366',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
    transition: 'background 0.2s',
  },
};

if (typeof document !== 'undefined') {
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(modalStyle);
}

export default OrderModal;
