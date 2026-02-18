import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import publishingDetails from '../data/publishingDetails';

const PublishingEbook = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const data = publishingDetails.ebook;
  const isEn = language === 'en';
  const [addedId, setAddedId] = useState(null);
  useAOS();

  const handleAddToCart = (product) => {
    addItem({ id: product.id, title: product.title, titleEn: product.titleEn, price: product.price, category: 'ebook' });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (price) => isEn ? `₩${price.toLocaleString()}` : `${price.toLocaleString()}원`;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEn ? data.titleEn : data.title}</h1>
          <p className="page-description">{isEn ? data.subtitleEn : data.subtitle}</p>
        </div>
      </section>

      {/* Overview */}
      <section className="service-detail-overview">
        <div className="container">
          <div className="service-overview-grid">
            <div className="service-overview-text" data-aos="fade-right">
              <h2>{t('common.overview')}</h2>
              {(isEn ? data.overviewEn : data.overview).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            <div className="service-overview-image" data-aos="fade-left">
              <svg viewBox="0 0 200 200" fill="none">
                <defs>
                  <linearGradient id="ebookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--primary-blue-light)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="60" y="40" width="80" height="120" rx="4" fill="url(#ebookGrad)" opacity="0.3" />
                <rect x="70" y="50" width="60" height="100" rx="2" fill="url(#ebookGrad)" opacity="0.5" />
                <rect x="80" y="65" width="40" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.6" />
                <rect x="80" y="75" width="30" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.4" />
                <rect x="80" y="85" width="35" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('publishing.supportedFormats')}</h2>
          </div>
          <div className="format-grid">
            {data.formats.map((fmt, i) => (
              <div key={i} className="format-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <h4>{fmt.title}</h4>
                <p>{isEn ? fmt.descriptionEn : fmt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('shop.title')}</h2>
          </div>
          <div className="book-grid">
            {data.products.map((product, i) => (
              <div key={i} className="book-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="book-cover">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="9" y1="6" x2="15" y2="6" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                    <line x1="9" y1="14" x2="12" y2="14" />
                  </svg>
                </div>
                <div className="book-info">
                  <h4>{isEn ? product.titleEn : product.title}</h4>
                  <p className="book-author">{isEn ? product.descriptionEn : product.description}</p>
                  <div className="book-purchase">
                    <span className="book-price">{formatPrice(product.price)}</span>
                    <button
                      className={`add-to-cart-btn small ${addedId === product.id ? 'added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedId === product.id ? t('shop.addedToCart') : t('shop.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('common.features')}</h2>
          </div>
          <div className="feature-grid">
            {data.features.map((feature, i) => (
              <div key={i} className="feature-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3>{isEn ? feature.titleEn : feature.title}</h3>
                <p>{isEn ? feature.descriptionEn : feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA title={isEn ? data.ctaTitleEn : data.ctaTitle} subtitle={isEn ? data.ctaSubtitleEn : data.ctaSubtitle} buttonText={t('common.contactUs')} />
    </>
  );
};

export default PublishingEbook;
