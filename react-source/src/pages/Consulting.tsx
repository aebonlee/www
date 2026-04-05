import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const Consulting = () => {
  const { t } = useLanguage();
  useAOS();

  return (
    <>
      <SEOHead title="컨설팅" description="기업, 대학, 교육기관 맞춤 IT 컨설팅 서비스" path="/consulting" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('consulting.title')}</h1>
          <p className="page-description">{t('consulting.subtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="category-grid three-col">
            <Link to="/consulting/business" className="category-card" data-aos="fade-up">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="12.01" />
                </svg>
              </div>
              <h3>{t('consulting.business')}</h3>
              <p>{t('consulting.businessDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>

            <Link to="/consulting/university" className="category-card" data-aos="fade-up" data-aos-delay="100">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3>{t('consulting.university')}</h3>
              <p>{t('consulting.universityDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>

            <Link to="/consulting/institution" className="category-card" data-aos="fade-up" data-aos-delay="200">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>{t('consulting.institution')}</h3>
              <p>{t('consulting.institutionDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Consulting;
