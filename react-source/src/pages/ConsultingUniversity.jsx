import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import consultingDetails from '../data/consultingDetails';
import SEOHead from '../components/SEOHead';

const ConsultingUniversity = () => {
  const { language, t } = useLanguage();
  const data = consultingDetails.university;
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead title="대학 컨설팅" description="대학 맞춤형 IT 컨설팅 및 교육 혁신 서비스" path="/consulting/university" />
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
                  <linearGradient id="uniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--primary-blue-light)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M100 30 L170 65 L100 100 L30 65 Z" fill="url(#uniGrad)" opacity="0.4" />
                <path d="M50 75 L50 120 C65 140 135 140 150 120 L150 75" strokeWidth="2" fill="none" opacity="0.5" style={{ stroke: 'var(--primary-blue)' }} />
                <rect x="60" y="110" width="80" height="50" rx="4" fill="url(#uniGrad)" opacity="0.2" />
                <line x1="170" y1="65" x2="170" y2="130" strokeWidth="2" opacity="0.5" style={{ stroke: 'var(--primary-blue)' }} />
                <circle cx="170" cy="135" r="6" fill="url(#uniGrad)" opacity="0.6" />
              </svg>
            </div>
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
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
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
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
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

export default ConsultingUniversity;
