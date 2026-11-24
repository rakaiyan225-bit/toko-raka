import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToastContainer, { showToast } from './Toast';
import OrderModal from './OrderModal';

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

const getProductImage = (img) => {
  if (!img) return '/assets/prod-1.jpg';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
    return img;
  }
  return `/uploads/${img}`;
};

const WHATSAPP_NUMBER = '6289513785705'; // Ganti dengan nomor WA toko

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        if (res.data && res.data.success && res.data.data) {
          const prod = res.data.data;
          if (prod.isActive === false) {
            setProduct(null);
            setLoading(false);
            return;
          }
          setProduct(prod);
          setLoading(false);
          return;
        } else if (res.data && res.data._id) {
          if (res.data.isActive === false) {
            setProduct(null);
            setLoading(false);
            return;
          }
          setProduct(res.data);
          setLoading(false);
          return;
        }
      } catch (e) { }

      try {
        const local = JSON.parse(localStorage.getItem('clover_custom_products') || '[]');
        const found = local.find(p => p._id === id);
        if (found) {
          if (found.isActive === false) {
            setProduct(null);
            setLoading(false);
            return;
          }
          setProduct(found);
          setLoading(false);
          return;
        }
      } catch (e) { }

      const found = hardcodedProducts.find(p => p._id === id);
      setProduct(found || null);
      setLoading(false);
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
    showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const buyViaWhatsApp = () => {
    if (!product) return;
    setIsOrderModalOpen(true);
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
          <img src={getProductImage(product.image)} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>

          <div className="detail-rating">
            {renderStars(product.rating || 0)}
            <span className="rating-num">{product.rating || 0}</span>
            <span className="sold-count">| {product.sold >= 1000 ? (product.sold / 1000).toFixed(1) + 'rb' : product.sold || 0} terjual</span>
          </div>

          <div className="detail-size">
            <h3>Ukuran:</h3>
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
            <h3>Jumlah:</h3>
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
            <button className="btn btn-whatsapp btn-lg" onClick={buyViaWhatsApp}>
              <span style={{ marginRight: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              Beli Sekarang via WhatsApp
            </button>
            <button className="btn btn-outline btn-lg" onClick={addToCart}>
              Tambah Keranjang
            </button>
          </div>

          <div className="detail-description">
            <h3>Deskripsi Produk:</h3>
            <p>{product.description || 'Produk berkualitas tinggi dari CLOVER LADSCLUB. Nyaman dipakai untuk aktivitas sehari-hari.'}</p>
          </div>
        </div>
      </div>

      {product && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          items={[
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              size: selectedSize,
              quantity: quantity,
            },
          ]}
          totalAmount={product.price * quantity}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
