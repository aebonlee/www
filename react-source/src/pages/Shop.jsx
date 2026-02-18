import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import useAOS from '../hooks/useAOS';
import publishingDetails from '../data/publishingDetails';
import educationDetails from '../data/educationDetails';

const allProducts = [
  ...publishingDetails.book.products.map(p => ({ ...p, category: 'book' })),
  ...publishingDetails.ebook.products.map(p => ({ ...p, category: 'ebook' })),
  ...publishingDetails.periodical.products.map(p => ({ ...p, category: 'periodical' })),
  ...educationDetails.classroom.courses.map(p => ({ ...p, category: 'course' }))
];

const Shop = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const isEn = language === 'en';
  const [filter, setFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = filter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === filter);

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
    addItem({
      id: product.id,
      title: product.title,
      titleEn: product.titleEn,
      price: product.price,
      category: product.category
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
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
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('shop.title')}</h1>
          <p className="page-description">{t('shop.subtitle')}</p>
        </div>
      </section>

      <section className="shop-section">
        <div className="container">
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

          {filtered.length === 0 ? (
            <p className="shop-empty">{t('shop.noProducts')}</p>
          ) : (
            <div className="shop-grid">
              {filtered.map((product, i) => (
                <div key={product.id} className="product-card" data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="product-thumbnail">
                    {getCategoryIcon(product.category)}
                  </div>
                  <div className="product-info">
                    <span className="product-category-badge">{t(`shop.${product.category}`)}</span>
                    <h3 className="product-title">{isEn ? product.titleEn : product.title}</h3>
                    <p className="product-description">
                      {isEn ? (product.descriptionEn || '') : (product.description || '')}
                    </p>
                    <div className="product-bottom">
                      <span className="product-price">{formatPrice(product.price)}</span>
                      <button
                        className={`add-to-cart-btn ${addedId === product.id ? 'added' : ''}`}
                        onClick={() => handleAddToCart(product)}
                      >
                        {addedId === product.id ? t('shop.addedToCart') : t('shop.addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;
