import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import publishingDetails from '../data/publishingDetails';

const PublishingBook = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const data = publishingDetails.book;
  const isEn = language === 'en';
  const [addedId, setAddedId] = useState(null);
  useAOS();

  const handleAddToCart = (book) => {
    addItem({ id: book.id, title: book.title, titleEn: book.titleEn, price: book.price, category: 'book' });
    setAddedId(book.id);
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
                  <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0066CC', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3385D6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M60 40 L100 50 L100 160 L60 150 Z" fill="url(#bookGrad)" opacity="0.3" />
                <path d="M140 40 L100 50 L100 160 L140 150 Z" fill="url(#bookGrad)" opacity="0.4" />
                <rect x="70" y="70" width="25" height="4" rx="2" fill="#0066CC" opacity="0.5" />
                <rect x="70" y="80" width="20" height="3" rx="1" fill="#0066CC" opacity="0.3" />
                <rect x="105" y="70" width="25" height="4" rx="2" fill="#0066CC" opacity="0.5" />
                <rect x="105" y="80" width="20" height="3" rx="1" fill="#0066CC" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Book List */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('publishing.bookList')}</h2>
          </div>
          <div className="book-grid">
            {data.products.map((book, i) => (
              <div key={i} className="book-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="book-cover">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div className="book-info">
                  <h4>{isEn ? book.titleEn : book.title}</h4>
                  <p className="book-author">{isEn ? book.authorEn : book.author}</p>
                  <span className="book-category">{isEn ? book.categoryEn : book.category}</span>
                  <div className="book-purchase">
                    <span className="book-price">{formatPrice(book.price)}</span>
                    <button
                      className={`add-to-cart-btn small ${addedId === book.id ? 'added' : ''}`}
                      onClick={() => handleAddToCart(book)}
                    >
                      {addedId === book.id ? (t('shop.addedToCart')) : (t('shop.addToCart'))}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
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

      {/* Process */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('common.process')}</h2>
          </div>
          <div className="process-grid">
            {data.process.map((step, i) => (
              <div key={i} className="process-step" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="process-number">{step.step}</div>
                <h4>{isEn ? step.titleEn : step.title}</h4>
                <p>{(isEn ? step.descriptionEn : step.description).split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA title={isEn ? data.ctaTitleEn : data.ctaTitle} subtitle={isEn ? data.ctaSubtitleEn : data.ctaSubtitle} buttonText={t('common.contactUs')} />
    </>
  );
};

export default PublishingBook;
