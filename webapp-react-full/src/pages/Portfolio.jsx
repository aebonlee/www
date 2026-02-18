import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Portfolio = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Portfolio</h1>
          <p className="page-description">드림아이티비즈가 성공적으로 완수한 프로젝트를 소개합니다</p>
        </div>
      </section>

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
                  <img src="/assets/images/portfolio/sejong-cec.png" alt="세종대학교 미래교육원" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chinju" className="project-section featured-project" style={{ background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="project-content">
            <div className="project-info" data-aos="fade-right">
              <span className="project-badge">Featured Project</span>
              <h2 className="project-title">진주교육대학교 100주년 기념 사이트</h2>
              <p className="project-description">
                진주교육대학교 개교 100주년을 기념하는 특별한 웹사이트입니다.
                1923년부터 현재까지의 역사를 타임라인 형태로 구현했습니다.
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
                  <img src="/assets/images/portfolio/chinju-100th.png" alt="진주교육대학교 100주년" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">기타 프로젝트</h2>
            <p className="section-subtitle">다양한 분야의 성공적인 프로젝트들</p>
          </div>
          <div className="portfolio-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="portfolio-card" data-aos="fade-up">
                <div className="portfolio-image">
                  <div className="image-placeholder"></div>
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-tag">웹개발</div>
                  <h3>프로젝트 {item}</h3>
                  <p>프로젝트 설명이 들어갑니다</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Portfolio;
