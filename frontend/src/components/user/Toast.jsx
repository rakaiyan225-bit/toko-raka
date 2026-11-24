import React, { useEffect, useState } from 'react';

// =============================================
// Toast Notification Component
// =============================================

let toastListeners = [];
let toastId = 0;

export const showToast = (message, type = 'success', duration = 3000) => {
  const id = ++toastId;
  toastListeners.forEach((fn) => fn({ id, message, type, duration }));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 3000);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            ...(toast.type === 'success' ? styles.success : {}),
            ...(toast.type === 'error' ? styles.error : {}),
            ...(toast.type === 'info' ? styles.info : {}),
            ...(toast.type === 'warning' ? styles.warning : {}),
          }}
        >
          <span style={styles.icon}>
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
            {toast.type === 'warning' && '⚠️'}
          </span>
          <span style={styles.message}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '80px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '360px',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    animation: 'slideInRight 0.3s ease',
    backdropFilter: 'blur(8px)',
    minWidth: '260px',
  },
  success: {
    background: 'linear-gradient(135deg, #15803d, #22c55e)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  error: {
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  info: {
    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  warning: {
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  icon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  message: {
    lineHeight: '1.4',
  },
};

// Inject CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;
document.head.appendChild(style);

export default ToastContainer;
