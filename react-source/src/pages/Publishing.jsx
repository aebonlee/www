import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';

const Publishing = () => {
  const { t } = useLanguage();
  useAOS();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('publishing.title')}</h1>
          <p className="page-description">{t('publishing.subtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="category-grid three-col">
            <Link to="/publishing/ebook" className="category-card" data-aos="fade-up">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>{t('publishing.ebookTitle')}</h3>
              <p>{t('publishing.ebookDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>

            <Link to="/publishing/periodical" className="category-card" data-aos="fade-up" data-aos-delay="100">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>{t('publishing.periodicalTitle')}</h3>
              <p>{t('publishing.periodicalDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>

            <Link to="/publishing/book" className="category-card" data-aos="fade-up" data-aos-delay="200">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3>{t('publishing.bookTitle')}</h3>
              <p>{t('publishing.bookDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Publishing;
