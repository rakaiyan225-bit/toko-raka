import axios from 'axios';

// Di production Vercel, REACT_APP_API_URL harus diset ke URL backend
// Contoh: https://clover-ladsclub-backend.vercel.app
// Di development lokal, proxy package.json mengarahkan ke localhost:5000
const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
