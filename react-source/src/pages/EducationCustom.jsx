import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import educationDetails from '../data/educationDetails';

const EducationCustom = () => {
  const { language, t } = useLanguage();
  const data = educationDetails.custom;
  const isEn = language === 'en';
  useAOS();

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
                  <linearGradient id="eduGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--primary-blue-light)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="40" y="50" width="120" height="90" rx="8" fill="url(#eduGrad)" opacity="0.3" />
                <path d="M100 70 L140 90 L100 110 L60 90 Z" fill="url(#eduGrad)" opacity="0.6" />
                <path d="M70 95 L70 120 C80 130 120 130 130 120 L130 95" style={{ stroke: 'var(--primary-blue)' }} strokeWidth="2" fill="none" opacity="0.5" />
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

export default EducationCustom;
