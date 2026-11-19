import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AuthModal from './AuthModal';

const hardcodedProducts = [];

const categories = [
  { name: 'Kaos', icon: '👕' },
  { name: 'Hoodie', icon: '🧥' },
  { name: 'Jaket', icon: '🥋' },
  { name: 'Kemeja', icon: '👔' },
  { name: 'T-Shirt', icon: '👚' },
  { name: 'Celana', icon: '👖' },
  { name: 'Aksesori', icon: '🧢' },
];

const getProductImage = (img) => {
  if (!img) return '/assets/prod-1.jpg';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
    return img;
  }
  return `/uploads/${img}`;
};

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const Home = () => {
  const [products, setProducts] = useState(hardcodedProducts);
  const [activeCategory, setActiveCategory] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let remoteList = [];
      try {
        const res = await axios.get('/api/products');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          remoteList = res.data.data;
        }
      } catch {}

      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem('clover_custom_products') || '[]');
      } catch {}

      const map = new Map();
      remoteList.forEach((p) => map.set(p._id, p));
      localList.forEach((p) => {
        if (!map.has(p._id) || (!map.get(p._id).image && p.image)) {
          map.set(p._id, p);
        }
      });

      const merged = Array.from(map.values());
      if (merged.length > 0) {
        setProducts(merged);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: 'M',
        quantity: 1,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} berhasil ditambahkan ke keranjang! 🛒`);
  };

  const buyNow = (product) => {
    const cart = [
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: 'M',
        quantity: 1,
      },
    ];
    localStorage.setItem('cart', JSON.stringify(cart));

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('🔒 Silakan login atau daftar akun terlebih dahulu untuk melanjutkan pembelian!');
      setIsAuthOpen(true);
      return;
    }
    navigate('/checkout');
  };

  const searchQuery = searchParams.get('search') || '';
  const filteredProducts = products.filter((p) => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="home-page">
      {/* Promo Banner with Image 2 (Graffiti Artwork) as Background */}
      <section className="promo-banner-section">
        <div className="promo-banner-container">
          <div className="user-promo-banner">
            {/* Orange Corner Tag: PROMO 50% OFF */}
            <div className="promo-top-badge">
              <span className="badge-promo-text">PROMO</span>
              <span className="badge-discount-text">50% OFF</span>
            </div>

            {/* Left Content */}
            <div className="promo-left-details">
              <h1 className="promo-main-title">
                PROMO 9.9<br />
                FLASH SALE
              </h1>
              <p className="promo-tagline">Diskon hingga 50% + Gratis Ongkir!</p>
              <p className="promo-schedule">Hanya 9–11 Sept</p>
              <a href="#produk-rekomendasi" className="btn-promo-buy-now">
                BELI SEKARANG
              </a>
            </div>

            {/* Floating Kategori Card on the Right */}
            <div className="banner-kategori-card">
              <h3 className="kategori-card-heading">Kategori</h3>
              <div className="kategori-boxes-row">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`kategori-box-btn ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                    title={`Filter ${cat.name}`}
                  >
                    <span className="kategori-box-icon">{cat.icon}</span>
                    <span className="kategori-box-label">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk Rekomendasi Section */}
      <section className="products-section" id="produk-rekomendasi">
        <div className="section-header">
          <h2>Produk Rekomendasi</h2>
          <button
            type="button"
            className="see-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveCategory('')}
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '0.75rem' }}>🛍️</span>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Belum Ada Produk di Katalog</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Buka panel admin untuk menambahkan produk baru.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-image-link">
                  <div className="product-image">
                    <img
                      src={getProductImage(product.image)}
                      alt={product.name}
                    />
                  </div>
                </Link>

                <div className="product-info">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="product-name">{product.name}</h3>
                  </Link>

                  <p className="product-price">{formatPrice(product.price)}</p>

                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-num">{product.rating || 5.0}</span>
                    <span style={{ color: '#94a3b8', margin: '0 4px' }}>|</span>
                    <span className="sold-count">{product.sold || 0} terjual</span>
                  </div>

                  <div className="product-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => addToCart(product)}
                    >
                      Tambah Keranjang
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => buyNow(product)}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onAuthChange={(userData) => {
          setCurrentUser(userData);
          if (userData) {
            setIsAuthOpen(false);
            navigate('/checkout');
          }
        }}
      />
    </div>
  );
};

export default Home;
