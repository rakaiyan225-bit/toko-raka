import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const hardcodedProducts = [
  {
    _id: '1',
    name: 'Kaos Oversize Hitam Clover',
    price: 89000,
    category: 'Kaos',
    rating: 4.8,
    sold: '1.2rb',
    image: '',
    color: '#18181b',
    type: 'tshirt',
  },
  {
    _id: '2',
    name: 'Kaos Putih Basic Ladsclub',
    price: 75000,
    category: 'Kaos',
    rating: 4.9,
    sold: '980',
    image: '',
    color: '#ffffff',
    type: 'tshirt',
  },
  {
    _id: '3',
    name: 'Hoodie Hitam Clover Club',
    price: 199000,
    category: 'Hoodie',
    rating: 4.7,
    sold: '2.1rb',
    image: '',
    color: '#18181b',
    type: 'hoodie',
  },
  {
    _id: '4',
    name: 'Hoodie Putih Clover Ladsclub',
    price: 199000,
    category: 'Hoodie',
    rating: 4.8,
    sold: '1.5rb',
    image: '',
    color: '#ffffff',
    type: 'hoodie',
  },
];

const categories = [
  { name: 'Kaos', icon: '👕' },
  { name: 'Hoodie', icon: '🧥' },
  { name: 'Jaket', icon: '🥋' },
  { name: 'Kemeja', icon: '👔' },
  { name: 'T-Shirt', icon: '👚' },
  { name: 'Celana', icon: '👖' },
  { name: 'Aksesori', icon: '🧢' },
];

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const Home = () => {
  const [products, setProducts] = useState(hardcodedProducts);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProducts(res.data.data);
        }
      } catch {
        // Fallback to hardcoded
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
      {/* Hero Banner Section - Gambar 1 */}
      <section className="hero-banner-section">
        <div className="hero-banner-container">
          <img
            src="/assets/hero-banner.jpg"
            alt="PROMO 9.9 FLASH SALE - CLOVER LADSCLUB"
            className="hero-banner-img"
          />
        </div>
      </section>

      {/* Kategori Filter Bar */}
      <div className="home-categories-container">
        <div className="home-categories-wrapper">
          <span className="home-cat-label">Kategori:</span>
          <div className="home-categories-chips">
            <button
              type="button"
              className={`home-cat-chip ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory('')}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`home-cat-chip ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
              >
                <span className="chip-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} className="product-image-link">
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : `http://localhost:5000${product.image}`
                      }
                      alt={product.name}
                    />
                  ) : (
                    <div
                      className="image-placeholder"
                      style={{
                        backgroundColor: product.name.includes('Hitam') ? '#1e293b' : '#f8fafc',
                        color: product.name.includes('Hitam') ? '#f8fafc' : '#334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px',
                      }}
                    >
                      <span style={{ fontSize: '42px', marginBottom: '2px' }}>
                        {product.name.includes('Hoodie') ? '🧥' : '👕'}
                      </span>
                      <img
                        src="/assets/logo-2.jpg"
                        alt="CLOVER LADS CLUB"
                        style={{ height: '24px', maxWidth: '85%', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              </Link>

              <div className="product-info">
                <Link to={`/product/${product._id}`}>
                  <h3 className="product-name">{product.name}</h3>
                </Link>

                <p className="product-price">{formatPrice(product.price)}</p>

                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-num">{product.rating || 4.8}</span>
                  <span style={{ color: '#94a3b8', margin: '0 4px' }}>|</span>
                  <span className="sold-count">{product.sold || '1.2rb'} terjual</span>
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
