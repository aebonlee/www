import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import useCountUp from '../hooks/useCountUp';
import HeroCarousel from '../components/HeroCarousel';
import CTA from '../components/CTA';
import SEOHead from '../components/SEOHead';

const Home = () => {
  const { t } = useLanguage();
  useAOS();

  const stat1 = useCountUp(50, 2000);
  const stat2 = useCountUp(98, 2000);
  const stat3 = useCountUp(22, 2000);

  return (
    <>
      <SEOHead
        description="혁신적인 IT 솔루션으로 비즈니스의 미래를 만듭니다. 웹개발, 웹호스팅, 디자인, 컨설팅, 교육, 출판 서비스"
        path="/"
      />
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('sections.ourServices')}</h2>
            <p className="section-subtitle">{t('sections.servicesSubtitle')}</p>
          </div>
          <div className="services-grid">
            {[
              { path: '/services/web-development', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>, tKey: 'webDev' },
              { path: '/services/web-hosting', icon: <><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /></>, tKey: 'webHosting' },
              { path: '/services/design', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></>, tKey: 'design' },
              { path: '/consulting', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, tKey: 'consulting' },
              { path: '/education', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>, tKey: 'education' },
              { path: '/publishing', icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>, tKey: 'publishing' }
            ].map((service, i) => (
              <Link key={i} to={service.path} className="service-card" data-aos="fade-up" data-aos-delay={Math.floor(i / 3) === 0 ? i * 100 : (i - 3) * 100}>
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{service.icon}</svg>
                </div>
                <h3>{t(`homeServices.${service.tKey}.title`)}</h3>
                <p>{t(`homeServices.${service.tKey}.desc`)}</p>
                <ul className="service-features">
                  {[1, 2, 3].map((n) => <li key={n}>{t(`homeServices.${service.tKey}.f${n}`)}</li>)}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Stats Section */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
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
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('sections.portfolio')}</h2>
            <p className="section-subtitle">{t('sections.portfolioSubtitle')}</p>
          </div>
          <div className="portfolio-grid">
            <Link to="/portfolio#sejong" className="portfolio-card" data-aos="fade-up">
              <div className="portfolio-image">
                <img src="./assets/images/portfolio/sejong-cec.png" alt="세종대학교 미래교육원" loading="lazy" style={{ objectPosition: 'top' }} />
              </div>
              <div className="portfolio-content">
                <div className="portfolio-tag">웹개발 · 디자인</div>
                <h3>세종대학교 미래교육원</h3>
                <p>cec.sejong.ac.kr - 미래교육원 공식 웹사이트 구축 프로젝트</p>
                <span className="detail-link">자세히 보기 →</span>
              </div>
            </Link>

            <Link to="/portfolio#chinju" className="portfolio-card" data-aos="fade-up" data-aos-delay="100">
              <div className="portfolio-image">
                <img src="./assets/images/portfolio/chinju-100th.png" alt="진주교육대학교 100주년" loading="lazy" />
              </div>
              <div className="portfolio-content">
                <div className="portfolio-tag">웹개발 · 디자인</div>
                <h3>진주교육대학교 100주년</h3>
                <p>cue100th.com - 100주년 기념 사이트 구축</p>
                <span className="detail-link">자세히 보기 →</span>
              </div>
            </Link>

            <Link to="/portfolio" className="portfolio-card" data-aos="fade-up" data-aos-delay="200">
              <div className="portfolio-image">
                <div className="image-placeholder">
                  <span className="placeholder-text">More</span>
                </div>
              </div>
              <div className="portfolio-content">
                <div className="portfolio-tag">웹개발 · 호스팅</div>
                <h3>더 많은 프로젝트</h3>
                <p>드림아이티비즈의 다양한 프로젝트를 확인하세요</p>
                <span className="detail-link">전체 보기 →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('sections.reviews')}</h2>
            <p className="section-subtitle">{t('sections.reviewsSubtitle')}</p>
          </div>
          <div className="reviews-grid">
            {[
              { name: '김○수', company: '세종대학교 미래교육원', text: '미래교육원 웹사이트를 완벽하게 구현해주셨습니다. 사용자 경험이 뛰어나고 관리가 편리합니다.' },
              { name: '박○영', company: '진주교육대학교', text: '100주년 기념 사이트를 정말 아름답게 제작해주셨어요. 타임라인 디자인이 인상적이었습니다.' },
              { name: '이○훈', company: 'ABC기업', text: '기업 웹사이트 리뉴얼 프로젝트를 진행했는데, 기대 이상의 결과물이 나왔습니다.' },
              { name: '최○아', company: 'XYZ스타트업', text: '호스팅 서비스가 안정적이고 속도도 빠릅니다. 24/7 지원도 훌륭해요.' },
              { name: '정○현', company: 'DEF컨설팅', text: 'IT 컨설팅을 받았는데, 실무적이고 구체적인 솔루션을 제시해주셔서 큰 도움이 되었습니다.' },
              { name: '강○원', company: 'GHI교육원', text: '맞춤형 IT 교육 프로그램이 직원들에게 큰 도움이 되었습니다. 실습 중심 교육이 효과적이었어요.' }
            ].map((review, i) => (
              <div key={i} className="review-card" data-aos="fade-up" data-aos-delay={i * 50}>
                <div className="review-rating">{'★'.repeat(5)}</div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <p className="author-name">{review.name}</p>
                  <p className="author-company">{review.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Home;
