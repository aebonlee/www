import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Particle animation
    const particles = document.getElementById('particles');
    if (particles) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 30}s`;
        particles.appendChild(particle);
      }
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="particles" id="particles"></div>
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
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              드림아이티비즈가 제공하는 전문 IT 서비스
            </p>
          </div>
          <div className="services-grid">
            <Link to="/services/web-development" className="service-card" data-aos="fade-up">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3>웹개발</h3>
              <p>반응형 웹사이트부터 복잡한 웹 애플리케이션까지</p>
              <ul className="service-features">
                <li>맞춤형 웹사이트</li>
                <li>반응형 디자인</li>
                <li>E-커머스 플랫폼</li>
              </ul>
            </Link>

            <Link to="/services/web-hosting" className="service-card" data-aos="fade-up" data-aos-delay="100">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3>웹호스팅</h3>
              <p>안정적이고 빠른 웹호스팅 서비스</p>
              <ul className="service-features">
                <li>고성능 서버</li>
                <li>24/7 모니터링</li>
                <li>데이터 백업</li>
              </ul>
            </Link>

            <Link to="/services/design" className="service-card" data-aos="fade-up" data-aos-delay="200">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <h3>디자인</h3>
              <p>브랜드 아이덴티티부터 UI/UX까지</p>
              <ul className="service-features">
                <li>브랜드 디자인</li>
                <li>UI/UX 디자인</li>
                <li>편집 디자인</li>
              </ul>
            </Link>

            <Link to="/services/consulting" className="service-card" data-aos="fade-up">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>기업컨설팅</h3>
              <p>디지털 전환을 위한 맞춤 컨설팅</p>
              <ul className="service-features">
                <li>IT 전략 수립</li>
                <li>프로세스 개선</li>
                <li>기술 도입 지원</li>
              </ul>
            </Link>

            <Link to="/services/education" className="service-card" data-aos="fade-up" data-aos-delay="100">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <h3>기업 맞춤 강의</h3>
              <p>실무 중심의 IT 교육 프로그램</p>
              <ul className="service-features">
                <li>맞춤형 커리큘럼</li>
                <li>실습 중심 교육</li>
                <li>온/오프라인 강의</li>
              </ul>
            </Link>

            <Link to="/services/publishing" className="service-card" data-aos="fade-up" data-aos-delay="200">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3>출판사업</h3>
              <p>IT 전문 서적 및 교육 콘텐츠 제작</p>
              <ul className="service-features">
                <li>IT 전문 서적</li>
                <li>교육 콘텐츠 제작</li>
                <li>전자책 제작</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Portfolio</h2>
            <p className="section-subtitle">성공적으로 완수한 프로젝트를 소개합니다</p>
          </div>
          <div className="portfolio-grid">
            <Link to="/portfolio#sejong" className="portfolio-card" data-aos="fade-up">
              <div className="portfolio-image">
                <img src="/assets/images/portfolio/sejong-cec.png" alt="세종대학교 미래교육원" />
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
                <img src="/assets/images/portfolio/chinju-100th.png" alt="진주교육대학교 100주년" />
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
                <div className="image-placeholder"></div>
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
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">고객 후기</h2>
            <p className="section-subtitle">드림아이티비즈와 함께한 고객들의 생생한 후기</p>
          </div>
          <div className="reviews-grid">
            {[
              { name: '김민수', company: '세종대학교 미래교육원', rating: 5, text: '미래교육원 웹사이트를 완벽하게 구현해주셨습니다. 사용자 경험이 뛰어나고 관리가 편리합니다.' },
              { name: '박지영', company: '진주교육대학교', rating: 5, text: '100주년 기념 사이트를 정말 아름답게 제작해주셨어요. 타임라인 디자인이 인상적이었습니다.' },
              { name: '이상훈', company: 'ABC기업', rating: 5, text: '기업 웹사이트 리뉴얼 프로젝트를 진행했는데, 기대 이상의 결과물이 나왔습니다.' },
              { name: '최윤아', company: 'XYZ스타트업', rating: 5, text: '호스팅 서비스가 안정적이고 속도도 빠릅니다. 24/7 지원도 훌륭해요.' },
              { name: '정수현', company: 'DEF컨설팅', rating: 5, text: 'IT 컨설팅을 받았는데, 실무적이고 구체적인 솔루션을 제시해주셔서 큰 도움이 되었습니다.' },
              { name: '강동원', company: 'GHI교육원', rating: 5, text: '맞춤형 IT 교육 프로그램이 직원들에게 큰 도움이 되었습니다. 실습 중심 교육이 효과적이었어요.' }
            ].map((review, index) => (
              <div key={index} className="review-card" data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content" data-aos="fade-up">
            <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
            <p>드림아이티비즈와 함께 비즈니스의 미래를 만들어가세요</p>
            <Link to="/contact" className="btn btn-primary-large">
              무료 상담 신청
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
