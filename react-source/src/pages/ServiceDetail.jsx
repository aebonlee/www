import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import serviceDetails from '../data/serviceDetails';

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const service = serviceDetails[serviceType];

  useAOS();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceType]);

  // Redirect legacy education/publishing URLs to new routes
  if (serviceType === 'education') {
    return <Navigate to="/education" replace />;
  }
  if (serviceType === 'publishing') {
    return <Navigate to="/publishing" replace />;
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{service.title}</h1>
          <p className="page-description">{service.subtitle}</p>
        </div>
      </section>

      {/* Overview */}
      <section className="service-detail-overview">
        <div className="container">
          <div className="service-overview-grid">
            <div className="service-overview-text" data-aos="fade-right">
              <h2>서비스 개요</h2>
              {service.overview.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            <div className="service-overview-image" data-aos="fade-left">
              <svg viewBox="0 0 200 200" fill="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--primary-blue-light)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="40" y="50" width="120" height="90" rx="8" fill="url(#grad1)" opacity="0.3" />
                <rect x="50" y="60" width="100" height="70" rx="4" fill="url(#grad1)" opacity="0.5" />
                <circle cx="60" cy="70" r="3" style={{ fill: 'var(--primary-blue)' }} />
                <circle cx="70" cy="70" r="3" style={{ fill: 'var(--primary-blue)' }} />
                <circle cx="80" cy="70" r="3" style={{ fill: 'var(--primary-blue)' }} />
                <rect x="60" y="85" width="80" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.6" />
                <rect x="60" y="95" width="60" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.4" />
                <rect x="60" y="105" width="70" height="4" rx="2" style={{ fill: 'var(--primary-blue)' }} opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {service.features && (
        <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">주요 기능</h2>
              <p className="section-subtitle">{service.title} 서비스의 핵심 기능을 소개합니다</p>
            </div>
            <div className="feature-grid">
              {service.features.map((feature, i) => (
                <div key={i} className="feature-card" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Design Services (design only) */}
      {service.designServices && (
        <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">서비스 영역</h2>
              <p className="section-subtitle">디자인과 디지털 콘텐츠를 통합 제공합니다</p>
            </div>
            <div className="design-grid">
              {service.designServices.map((item, i) => (
                <div key={i} className="design-card" data-aos="fade-up" data-aos-delay={i * 100}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing (web-hosting only) */}
      {service.pricing && (
        <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">요금제</h2>
              <p className="section-subtitle">비즈니스에 맞는 최적의 플랜을 선택하세요</p>
            </div>
            <div className="pricing-grid">
              {service.pricing.map((plan, i) => (
                <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`} data-aos="fade-up" data-aos-delay={i * 100}>
                  <h3>{plan.plan}</h3>
                  <div className="pricing-price">{plan.price}</div>
                  <div className="pricing-period">/ {plan.period}</div>
                  <ul className="pricing-features">
                    {plan.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                    문의하기
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack (web-development only) */}
      {service.techStack && (
        <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">기술 스택</h2>
              <p className="section-subtitle">다양한 최신 기술을 활용합니다</p>
            </div>
            <div className="tech-grid">
              {service.techStack.map((tech, i) => (
                <div key={i} className="tech-card" data-aos="fade-up" data-aos-delay={i * 100}>
                  <h4>{tech.category}</h4>
                  <p>{tech.items.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Design Tools (design only) */}
      {service.tools && (
        <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">제작 도구</h2>
              <p className="section-subtitle">전문 크리에이티브 도구를 활용합니다</p>
            </div>
            <div className="tech-grid">
              {service.tools.map((tool, i) => (
                <div key={i} className="tech-card" data-aos="fade-up" data-aos-delay={i * 50}>
                  <h4>{tool}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process && (
        <section style={{ padding: '80px 0', background: service.techStack || service.tools ? 'var(--bg-light-gray)' : 'var(--bg-white)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{serviceType === 'design' ? '제작 프로세스' : '진행 프로세스'}</h2>
              <p className="section-subtitle">체계적인 프로세스로 프로젝트를 진행합니다</p>
            </div>
            <div className="process-grid" style={service.process.length === 5 ? { gridTemplateColumns: `repeat(5, 1fr)` } : undefined}>
              {service.process.map((step, i) => (
                <div key={i} className="process-step" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="process-number">{step.step}</div>
                  <h4>{step.title}</h4>
                  <p>{step.description.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA title={service.ctaTitle} subtitle={service.ctaSubtitle} buttonText="문의하기" />
    </>
  );
};

export default ServiceDetail;
