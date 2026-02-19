import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const Services = () => {
  const { t } = useLanguage();
  useAOS();

  const services = [
    {
      path: '/services/web-development',
      icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
      title: t('services.webDev'),
      description: '반응형 웹사이트부터 복잡한 웹 애플리케이션까지',
      features: ['맞춤형 웹사이트', '반응형 디자인', 'E-커머스 플랫폼']
    },
    {
      path: '/services/web-hosting',
      icon: <><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /></>,
      title: t('services.webHosting'),
      description: '안정적이고 빠른 웹호스팅 서비스',
      features: ['고성능 서버', '24/7 모니터링', '데이터 백업']
    },
    {
      path: '/services/design',
      icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></>,
      title: t('services.design'),
      description: '브랜드 디자인부터 영상·SNS 콘텐츠까지',
      features: ['브랜드 디자인', 'UI/UX 디자인', '디지털 콘텐츠']
    },
  ];

  return (
    <>
      <SEOHead title="IT 서비스" description="웹개발, 웹호스팅, 디자인 등 종합 IT 서비스" path="/services" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">IT Services</h1>
          <p className="page-description">{t('sections.servicesSubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="services-grid">
            {services.map((service, i) => (
              <Link key={i} to={service.path} className="service-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{service.icon}</svg>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
