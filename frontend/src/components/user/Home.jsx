import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

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
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} className="product-image-link">
                <div className="product-image">
                  <img
                    src={
                      product.image
                        ? product.image.startsWith('http') || product.image.startsWith('/')
                          ? product.image
                          : `http://localhost:5000${product.image}`
                        : '/assets/prod-1.jpg'
                    }
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
