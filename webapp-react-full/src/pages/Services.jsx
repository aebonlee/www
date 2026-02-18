import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      path: '/services/web-development',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      title: '웹개발',
      description: '반응형 웹사이트부터 복잡한 웹 애플리케이션까지',
      features: ['맞춤형 웹사이트', '반응형 디자인', 'E-커머스 플랫폼']
    },
    {
      path: '/services/web-hosting',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        </svg>
      ),
      title: '웹호스팅',
      description: '안정적이고 빠른 웹호스팅 서비스',
      features: ['고성능 서버', '24/7 모니터링', '데이터 백업']
    },
    {
      path: '/services/design',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        </svg>
      ),
      title: '디자인',
      description: '브랜드 아이덴티티부터 UI/UX까지',
      features: ['브랜드 디자인', 'UI/UX 디자인', '편집 디자인']
    },
    {
      path: '/services/consulting',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      title: '기업컨설팅',
      description: '디지털 전환을 위한 맞춤 컨설팅',
      features: ['IT 전략 수립', '프로세스 개선', '기술 도입 지원']
    },
    {
      path: '/services/education',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      ),
      title: '기업 맞춤 강의',
      description: '실무 중심의 IT 교육 프로그램',
      features: ['맞춤형 커리큘럼', '실습 중심 교육', '온/오프라인 강의']
    },
    {
      path: '/services/publishing',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      title: '출판사업',
      description: 'IT 전문 서적 및 교육 콘텐츠 제작',
      features: ['IT 전문 서적', '교육 콘텐츠 제작', '전자책 제작']
    }
  ];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-description">드림아이티비즈가 제공하는 전문 IT 서비스</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.path}
                className="service-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="service-icon">{service.icon}</div>
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
