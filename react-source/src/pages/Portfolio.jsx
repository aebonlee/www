import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import SEOHead from '../components/SEOHead';

const Portfolio = () => {
  const location = useLocation();
  useAOS();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <SEOHead title="포트폴리오" description="드림아이티비즈 프로젝트 포트폴리오 - 웹개발, 디자인, 컨설팅 성과" path="/portfolio" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Portfolio</h1>
          <p className="page-description">드림아이티비즈가 성공적으로 완수한 프로젝트를 소개합니다</p>
        </div>
      </section>

      {/* Sejong University */}
      <section id="sejong" className="project-section featured-project">
        <div className="container">
          <div className="project-content">
            <div className="project-info" data-aos="fade-right">
              <span className="project-badge">Featured Project</span>
              <h2 className="project-title">세종대학교 미래교육원</h2>
              <p className="project-description">
                세종대학교 미래교육원의 공식 웹사이트 구축 프로젝트입니다.
                교육과정 소개, 학점은행제, 직업교육, 비학위과정, 캠퍼스 뉴스 등
                다양한 교육 프로그램 정보를 체계적으로 전달합니다.
              </p>
              <div className="project-details">
                <div className="detail-item">
                  <h4>클라이언트</h4>
                  <p>세종대학교 미래교육원</p>
                </div>
                <div className="detail-item">
                  <h4>서비스</h4>
                  <p>웹개발, UI/UX 디자인, 웹호스팅</p>
                </div>
                <div className="detail-item">
                  <h4>기술 스택</h4>
                  <p>HTML5, CSS3, JavaScript, 반응형 디자인</p>
                </div>
                <div className="detail-item">
                  <h4>웹사이트</h4>
                  <p>
                    <a href="https://cec.sejong.ac.kr" target="_blank" rel="noopener noreferrer">
                      cec.sejong.ac.kr
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="project-visual" data-aos="fade-left">
              <div className="project-image-main">
                <a href="https://cec.sejong.ac.kr" target="_blank" rel="noopener noreferrer">
                  <img src="./assets/images/portfolio/sejong-cec.png" alt="세종대학교 미래교육원" loading="lazy" style={{ objectPosition: 'top' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chinju University */}
      <section id="chinju" className="project-section featured-project" style={{ background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="project-content">
            <div className="project-info" data-aos="fade-right">
              <span className="project-badge">Featured Project</span>
              <h2 className="project-title">진주교육대학교<br />100주년 기념 사이트</h2>
              <p className="project-description">
                진주교육대학교 개교 100주년을 기념하는 특별한 웹사이트입니다.
                1923년부터 현재까지의 역사를 타임라인 형태로 구현하고,
                100주년 기념 행사와 관련 콘텐츠를 제공합니다.
              </p>
              <div className="project-details">
                <div className="detail-item">
                  <h4>클라이언트</h4>
                  <p>진주교육대학교</p>
                </div>
                <div className="detail-item">
                  <h4>서비스</h4>
                  <p>웹개발, UI/UX 디자인, 반응형 퍼블리싱</p>
                </div>
                <div className="detail-item">
                  <h4>기술 스택</h4>
                  <p>HTML5, CSS3, JavaScript, Gnuboard</p>
                </div>
                <div className="detail-item">
                  <h4>웹사이트</h4>
                  <p>
                    <a href="http://cue100th.com/" target="_blank" rel="noopener noreferrer">
                      cue100th.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="project-visual" data-aos="fade-left">
              <div className="project-image-main">
                <a href="http://cue100th.com/" target="_blank" rel="noopener noreferrer">
                  <img src="./assets/images/portfolio/chinju-100th.png" alt="진주교육대학교 100주년" loading="lazy" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects */}
      <section id="projects" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">기타 프로젝트</h2>
            <p className="section-subtitle">다양한 분야의 성공적인 프로젝트들</p>
          </div>
          <div className="portfolio-grid">
            {[
              { title: '중소기업 웹사이트 리뉴얼', tag: '웹개발', desc: '기존 웹사이트의 디자인과 기능을 전면 개편한 리뉴얼 프로젝트' },
              { title: 'E-커머스 쇼핑몰 구축', tag: '웹개발 · 호스팅', desc: '상품 관리, 결제 시스템이 포함된 온라인 쇼핑몰 구축' },
              { title: '기업 브랜딩 프로젝트', tag: '디자인', desc: 'CI/BI 디자인부터 브랜드 가이드라인까지 통합 브랜딩' },
              { title: 'IT 교육 프로그램 운영', tag: '교육', desc: '기업 직원 대상 웹 개발 및 데이터 분석 교육 프로그램 운영' },
              { title: 'IT 전략 컨설팅', tag: '컨설팅', desc: '디지털 전환을 위한 IT 인프라 분석 및 전략 수립' },
              { title: 'IT 전문 서적 출판', tag: '출판', desc: '프로그래밍 및 IT 활용 교육 서적 기획 및 출판' }
            ].map((project, i) => (
              <div key={i} className="portfolio-card" data-aos="fade-up" data-aos-delay={i * 50}>
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <span className="placeholder-text">{project.tag.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-tag">{project.tag}</div>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
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

export default Portfolio;
