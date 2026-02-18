import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';

const Education = () => {
  const { t } = useLanguage();
  useAOS();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('education.title')}</h1>
          <p className="page-description">{t('education.subtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="category-grid">
            <Link to="/education/custom" className="category-card" data-aos="fade-up">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3>{t('education.customTitle')}</h3>
              <p>{t('education.customDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>

            <Link to="/education/classroom" className="category-card" data-aos="fade-up" data-aos-delay="100">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>{t('education.classroomTitle')}<span className="coming-soon-badge">{t('education.comingSoon')}</span></h3>
              <p>{t('education.classroomDesc')}</p>
              <span className="card-arrow">{t('common.learnMore')} →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Education;
