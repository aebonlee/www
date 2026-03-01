import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, toggleSoldOut, deleteProduct } from '../utils/productStorage';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const ProductCard = memo(({ product, index, isEn, isAdmin, addedId, getCategoryIcon, formatPrice, handleAddToCart, handleToggleSoldOut, handleDelete, t }) => (
  <div
    className={`product-card ${product.isSoldOut ? 'sold-out' : ''}`}
    data-aos="fade-up"
    data-aos-delay={index * 60}
  >
    <div className="product-thumbnail">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={isEn ? product.titleEn : product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        getCategoryIcon(product.category)
      )}
      {product.isSoldOut && (
        <span className="sold-out-badge">{t('auth.soldOut')}</span>
      )}
    </div>
    <div className="product-info">
      <span className="product-category-badge">{t(`shop.${product.category}`)}</span>
      <h3 className="product-title">{isEn ? (product.titleEn || product.title) : product.title}</h3>
      <p className="product-description">
        {isEn ? (product.descriptionEn || '') : (product.description || '')}
      </p>
      <div className="product-bottom">
        <span className="product-price">{formatPrice(product.price)}</span>
        <button
          className={`add-to-cart-btn ${addedId === (product.slug || product.id) ? 'added' : ''}`}
          onClick={() => handleAddToCart(product)}
          disabled={product.isSoldOut}
        >
          {product.isSoldOut
            ? t('auth.soldOut')
            : addedId === (product.slug || product.id)
              ? t('shop.addedToCart')
              : t('shop.addToCart')}
        </button>
      </div>
      {isAdmin && (
        <div className="product-admin-actions">
          <Link to={`/shop/product/edit/${product.id}`} className="board-btn" style={{ fontSize: '12px', padding: '4px 10px' }}>
            {t('community.edit')}
          </Link>
          <button
            className="board-btn"
            style={{ fontSize: '12px', padding: '4px 10px' }}
            onClick={() => handleToggleSoldOut(product)}
          >
            {product.isSoldOut ? '판매재개' : '품절처리'}
          </button>
          <button
            className="board-btn danger"
            style={{ fontSize: '12px', padding: '4px 10px' }}
            onClick={() => handleDelete(product)}
          >
            {t('community.delete')}
          </button>
        </div>
      )}
    </div>
  </div>
));

const Shop = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { isAdmin } = useAuth();
  const isEn = language === 'en';
  const [filter, setFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts(isAdmin);
        setProducts(data);
      } catch (err) {
        console.error('Shop load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const categories = [
    { key: 'all', label: t('shop.all') },
    { key: 'book', label: t('shop.book') },
    { key: 'ebook', label: t('shop.ebook') },
    { key: 'periodical', label: t('shop.periodical') },
    { key: 'course', label: t('shop.course') }
  ];

  const formatPrice = (price) => {
    return isEn
      ? `₩${price.toLocaleString()}`
      : `${price.toLocaleString()}${t('shop.currency')}`;
  };

  const handleAddToCart = (product) => {
    if (product.isSoldOut) return;
    addItem({
      id: product.slug || product.id,
      title: product.title,
      titleEn: product.titleEn,
      price: product.price,
      category: product.category
    });
    setAddedId(product.slug || product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleToggleSoldOut = async (product) => {
    try {
      await toggleSoldOut(product.id, !product.isSoldOut);
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, isSoldOut: !p.isSoldOut } : p
      ));
    } catch (err) {
      console.error('Toggle sold out error:', err);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(t('community.deleteConfirm'))) return;
    try {
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'book':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'ebook':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="9" y1="6" x2="15" y2="6" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="9" y1="14" x2="12" y2="14" />
          </svg>
        );
      case 'periodical':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      case 'course':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead title="스토어" description="드림아이티비즈 스토어 - IT 교재, 전자책, 교육 자료" path="/shop" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('shop.title')}</h1>
          <p className="page-description">{t('shop.subtitle')}</p>
        </div>
      </section>

      <section className="shop-section">
        <div className="container">
          {isAdmin && (
            <div className="board-actions" style={{ marginBottom: '24px' }}>
              <Link to="/shop/product/new" className="board-write-btn">{t('auth.addProduct')}</Link>
            </div>
          )}

          <div className="shop-filters" data-aos="fade-up">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`shop-filter-btn ${filter === cat.key ? 'active' : ''}`}
                onClick={() => setFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              로딩 중...
            </div>
          ) : filtered.length === 0 ? (
            <p className="shop-empty">{t('shop.noProducts')}</p>
          ) : (
            <div className="shop-grid">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.slug || product.id}
                  product={product}
                  index={i}
                  isEn={isEn}
                  isAdmin={isAdmin}
                  addedId={addedId}
                  getCategoryIcon={getCategoryIcon}
                  formatPrice={formatPrice}
                  handleAddToCart={handleAddToCart}
                  handleToggleSoldOut={handleToggleSoldOut}
                  handleDelete={handleDelete}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;
