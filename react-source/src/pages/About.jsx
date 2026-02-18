import useAOS from '../hooks/useAOS';
import useCountUp from '../hooks/useCountUp';
import CTA from '../components/CTA';

const About = () => {
  useAOS();
  const stat1 = useCountUp(50, 2000);
  const stat2 = useCountUp(98, 2000);
  const stat3 = useCountUp(22, 2000);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-description">드림아이티비즈를 소개합니다</p>
        </div>
      </section>

      {/* Company Overview */}
      <section id="company" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="about-wrapper">
            <div className="about-content" data-aos="fade-right">
              <h2 className="section-title" style={{ textAlign: 'left' }}>회사 개요</h2>
              <p className="about-description">
                드림아이티비즈(DreamIT Biz)는 2003년 드림아이티(DreamIT)로 창업한 이래,
                20년 이상의 IT 정보통신 분야 경험을 보유한 전문 기업입니다.
                웹개발, 웹호스팅, 디자인, 기업컨설팅, 교육, 출판 등 다양한 IT 서비스를
                제공하며, 고객의 비즈니스 성장을 돕고 있습니다.
              </p>
              <p className="about-description">
                PDA용 e-Learning, 모바일 방송 학습 솔루션, RFID 기반 위치정보 시스템 등
                다수의 산학연 공동기술개발 컨소시엄 사업을 수행한 기술력을 바탕으로,
                2020년 재창업하여 고객의 디지털 전환을 지원하고 있습니다.
              </p>
              <p className="about-description">
                세종대학교 미래교육원, 진주교육대학교 등 교육 기관과 다수의 기업 프로젝트를
                성공적으로 수행한 경험을 바탕으로, 신뢰할 수 있는 IT 파트너로 자리매김하고 있습니다.
              </p>
              <div className="about-stats">
                <div className="stat-item" ref={stat1.ref}>
                  <span className="stat-number">{stat1.count}+</span>
                  <span className="stat-label">완료 프로젝트</span>
                </div>
                <div className="stat-item" ref={stat2.ref}>
                  <span className="stat-number">{stat2.count}%</span>
                  <span className="stat-label">고객 만족도</span>
                </div>
                <div className="stat-item" ref={stat3.ref}>
                  <span className="stat-number">{stat3.count}+</span>
                  <span className="stat-label">년 경력</span>
                </div>
              </div>
            </div>
            <div className="about-image" data-aos="fade-left">
              <div className="image-placeholder">
                <svg viewBox="0 0 400 300" fill="none">
                  <defs>
                    <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0066CC', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#3385D6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" rx="16" fill="url(#aboutGrad)" opacity="0.1" />
                  <rect x="60" y="80" width="120" height="140" rx="8" fill="url(#aboutGrad)" opacity="0.3" />
                  <rect x="220" y="60" width="120" height="140" rx="8" fill="url(#aboutGrad)" opacity="0.2" />
                  <circle cx="120" cy="120" r="30" fill="#0066CC" opacity="0.3" />
                  <circle cx="280" cy="100" r="25" fill="#0066CC" opacity="0.2" />
                  <rect x="80" y="170" width="80" height="6" rx="3" fill="#0066CC" opacity="0.4" />
                  <rect x="80" y="185" width="60" height="6" rx="3" fill="#0066CC" opacity="0.3" />
                  <rect x="240" y="155" width="80" height="6" rx="3" fill="#0066CC" opacity="0.4" />
                  <rect x="240" y="170" width="60" height="6" rx="3" fill="#0066CC" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">비전 & 미션</h2>
            <p className="section-subtitle">드림아이티비즈가 추구하는 가치</p>
          </div>
          <div className="vision-grid">
            <div className="vision-card" data-aos="fade-up">
              <h3>비전 (Vision)</h3>
              <p>
                혁신적인 IT 솔루션으로 모든 비즈니스의 디지털 전환을 이끄는
                대한민국 대표 IT 파트너가 되겠습니다.
              </p>
            </div>
            <div className="vision-card" data-aos="fade-up" data-aos-delay="100">
              <h3>미션 (Mission)</h3>
              <p>
                고객의 비즈니스 목표를 이해하고, 최적의 기술 솔루션을 제공하여
                지속 가능한 성장을 함께 만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">핵심 가치</h2>
            <p className="section-subtitle">드림아이티비즈를 이끄는 세 가지 가치</p>
          </div>
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up">
              <div className="value-icon">💡</div>
              <h3>혁신 (Innovation)</h3>
              <p>최신 기술 트렌드를 연구하고 적용하여, 고객에게 항상 최고의 솔루션을 제안합니다.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon">🤝</div>
              <h3>신뢰 (Trust)</h3>
              <p>투명한 커뮤니케이션과 약속 이행으로 고객과의 신뢰를 최우선으로 합니다.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">🚀</div>
              <h3>성장 (Growth)</h3>
              <p>고객의 비즈니스 성장이 곧 우리의 성장이라는 마음으로 함께합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default About;
