import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import consultingDetails from '../data/consultingDetails';
import SEOHead from '../components/SEOHead';

const ConsultingBusiness = () => {
  const { language, t } = useLanguage();
  const data = consultingDetails.business;
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead title="기업 컨설팅" description="기업 맞춤형 IT 컨설팅 및 디지털 전환 서비스" path="/consulting/business" />
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
                  <linearGradient id="bizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--primary-blue-light)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="30" y="50" width="140" height="100" rx="8" fill="url(#bizGrad)" opacity="0.2" />
                <rect x="50" y="40" width="40" height="60" rx="4" fill="url(#bizGrad)" opacity="0.4" />
                <rect x="100" y="55" width="40" height="45" rx="4" fill="url(#bizGrad)" opacity="0.6" />
                <path d="M60 100 L90 80 L120 95 L150 70" strokeWidth="3" fill="none" opacity="0.8" style={{ stroke: 'var(--primary-blue)' }} />
                <circle cx="60" cy="100" r="4" style={{ fill: 'var(--primary-blue)' }} />
                <circle cx="90" cy="80" r="4" style={{ fill: 'var(--primary-blue)' }} />
                <circle cx="120" cy="95" r="4" style={{ fill: 'var(--primary-blue)' }} />
                <circle cx="150" cy="70" r="4" style={{ fill: 'var(--primary-blue)' }} />
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

export default ConsultingBusiness;
