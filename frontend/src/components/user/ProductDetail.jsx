import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const hardcodedProducts = [
  { _id: '1', name: 'Kaos Oversize Hitam Clover', price: 89000, category: 'Kaos', rating: 4.8, sold: 1200, image: '', description: 'Kaos oversize premium dengan bahan cotton combed 30s. Nyaman dipakai sehari-hari, cocok untuk gaya streetwear.', sizes: ['S', 'M', 'L', 'XL'] },
  { _id: '2', name: 'Kaos Putih Basic Ladsclub', price: 75000, category: 'Kaos', rating: 4.9, sold: 980, image: '', description: 'Kaos basic putih dengan logo Clover Ladsclub. Bahan premium cotton combed 24s.', sizes: ['S', 'M', 'L', 'XL'] },
  { _id: '3', name: 'Hoodie Hitam Clover Club', price: 199000, category: 'Hoodie', rating: 4.7, sold: 2100, image: '', description: 'Hoodie hitam premium dengan bahan fleece tebal. Desain minimalis dengan logo Clover di dada.', sizes: ['S', 'M', 'L', 'XL'] },
  { _id: '4', name: 'Hoodie Putih Clover Ladsclub', price: 199000, category: 'Hoodie', rating: 4.8, sold: 1500, image: '', description: 'Hoodie putih clean look dari Clover Ladsclub. Cocok untuk tampilan kasual.', sizes: ['S', 'M', 'L', 'XL'] },
  { _id: '5', name: 'Hoodie Clover Black', price: 289000, category: 'Hoodie', rating: 4.9, sold: 850, image: '', description: 'Hoodie premium edisi spesial dengan bordir logo Clover. Limited edition.', sizes: ['S', 'M', 'L', 'XL'] },
  { _id: '6', name: 'Jaket Bomber Clover', price: 350000, category: 'Jaket', rating: 4.6, sold: 600, image: '', description: 'Jaket bomber dengan bahan parasut premium. Tahan air dan nyaman dipakai.', sizes: ['S', 'M', 'L', 'XL'] },
];

const formatPrice = (price) => {
  return 'Rp' + price.toLocaleString('id-ID').replace(/,/g, '.');
};

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch {
        const found = hardcodedProducts.find(p => p._id === id);
        setProduct(found || hardcodedProducts[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id && item.size === selectedSize);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: quantity
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produk ditambahkan ke keranjang! 🛒');
  };

  const buyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Memuat produk...</div>;
  }

  if (!product) {
    return <div className="loading">Produk tidak ditemukan.</div>;
  }

  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-detail-image">
          {product.image ? (
            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} />
          ) : (
            <div className="image-placeholder large">
              <span>👕</span>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>

          <div className="detail-rating">
            {renderStars(product.rating || 0)}
            <span className="rating-num">{product.rating || 0}</span>
            <span className="sold-count">| {product.sold || 0} terjual</span>
          </div>

          <div className="detail-description">
            <h3>Deskripsi Produk</h3>
            <p>{product.description || 'Produk berkualitas tinggi dari CLOVER LADSCLUB. Nyaman dipakai untuk aktivitas sehari-hari.'}</p>
          </div>

          <div className="detail-size">
            <h3>Pilih Ukuran</h3>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-quantity">
            <h3>Jumlah</h3>
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-outline btn-lg" onClick={addToCart}>
              Tambah Keranjang
            </button>
            <button className="btn btn-primary btn-lg" onClick={buyNow}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
