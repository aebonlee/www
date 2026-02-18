import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import useCountUp from '../hooks/useCountUp';
import Particles from '../components/Particles';
import ScrollIndicator from '../components/ScrollIndicator';
import CTA from '../components/CTA';

const Home = () => {
  const { t } = useLanguage();
  useAOS();

  const stat1 = useCountUp(50, 2000);
  const stat2 = useCountUp(98, 2000);
  const stat3 = useCountUp(5, 2000);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <Particles count={30} />
        </div>
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">
              <span className="title-line">{t('hero.title1')}</span>
              <span className="title-line">
                {t('hero.title2')} <span className="highlight">{t('hero.titleHighlight')}</span>{t('hero.title3')}
              </span>
            </h2>
            <p className="hero-description">
              {t('hero.description').split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">
                {t('hero.viewServices')}
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                {t('hero.contact')}
              </Link>
            </div>
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">드림아이티비즈가 제공하는 전문 IT 서비스</p>
          </div>
          <div className="services-grid">
            {[
              { path: '/services/web-development', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>, title: '웹개발', desc: '반응형 웹사이트부터 복잡한 웹 애플리케이션까지', features: ['맞춤형 웹사이트', '반응형 디자인', 'E-커머스 플랫폼'] },
              { path: '/services/web-hosting', icon: <><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /></>, title: '웹호스팅', desc: '안정적이고 빠른 웹호스팅 서비스', features: ['고성능 서버', '24/7 모니터링', '데이터 백업'] },
              { path: '/services/design', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></>, title: '디자인', desc: '브랜드 아이덴티티부터 UI/UX까지', features: ['브랜드 디자인', 'UI/UX 디자인', '편집 디자인'] },
              { path: '/consulting', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, title: '컨설팅', desc: '기업·대학·교육기관 맞춤 컨설팅', features: ['기업 컨설팅', '대학 컨설팅', '교육기관 컨설팅'] },
              { path: '/education', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>, title: '교육', desc: '맞춤 강의와 온라인 강의실', features: ['맞춤형 커리큘럼', '실습 중심 교육', '온라인 강의실'] },
              { path: '/publishing', icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>, title: '출판', desc: '전자출판, 간행물, 도서 출판', features: ['전자출판', '간행물', '도서 출판'] }
            ].map((service, i) => (
              <Link key={i} to={service.path} className="service-card" data-aos="fade-up" data-aos-delay={Math.floor(i / 3) === 0 ? i * 100 : (i - 3) * 100}>
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{service.icon}</svg>
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul className="service-features">
                  {service.features.map((f, j) => <li key={j}>{f}</li>)}
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
            <h2 className="section-title">Portfolio</h2>
            <p className="section-subtitle">성공적으로 완수한 프로젝트를 소개합니다</p>
          </div>
          <div className="portfolio-grid">
            <Link to="/portfolio#sejong" className="portfolio-card" data-aos="fade-up">
              <div className="portfolio-image">
                <img src="./assets/images/portfolio/sejong-cec.png" alt="세종대학교 미래교육원" />
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
                <img src="./assets/images/portfolio/chinju-100th.png" alt="진주교육대학교 100주년" />
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
            <h2 className="section-title">고객 후기</h2>
            <p className="section-subtitle">드림아이티비즈와 함께한 고객들의 생생한 후기</p>
          </div>
          <div className="reviews-grid">
            {[
              { name: '김민수', company: '세종대학교 미래교육원', text: '미래교육원 웹사이트를 완벽하게 구현해주셨습니다. 사용자 경험이 뛰어나고 관리가 편리합니다.' },
              { name: '박지영', company: '진주교육대학교', text: '100주년 기념 사이트를 정말 아름답게 제작해주셨어요. 타임라인 디자인이 인상적이었습니다.' },
              { name: '이상훈', company: 'ABC기업', text: '기업 웹사이트 리뉴얼 프로젝트를 진행했는데, 기대 이상의 결과물이 나왔습니다.' },
              { name: '최윤아', company: 'XYZ스타트업', text: '호스팅 서비스가 안정적이고 속도도 빠릅니다. 24/7 지원도 훌륭해요.' },
              { name: '정수현', company: 'DEF컨설팅', text: 'IT 컨설팅을 받았는데, 실무적이고 구체적인 솔루션을 제시해주셔서 큰 도움이 되었습니다.' },
              { name: '강동원', company: 'GHI교육원', text: '맞춤형 IT 교육 프로그램이 직원들에게 큰 도움이 되었습니다. 실습 중심 교육이 효과적이었어요.' }
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
