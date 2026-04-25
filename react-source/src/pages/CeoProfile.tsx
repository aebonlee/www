import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import SEOHead from '../components/SEOHead';

const CeoProfile = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead title="대표 소개" description="드림아이티비즈 대표이사 소개" path="/about/ceo" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEn ? 'CEO Profile' : '대표 소개'}</h1>
          <p className="page-description">
            {isEn ? 'Meet the leader of DreamIT Biz' : '드림아이티비즈를 이끄는 사람'}
          </p>
        </div>
      </section>

      {/* 소개 */}
      <section className="ceo-intro-section">
        <div className="container">
          <div className="ceo-intro" data-aos="fade-up">
            <div className="ceo-profile-card">
              <div className="ceo-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="ceo-name-card">
                <h2>{isEn ? 'Aebon Lee' : '이애본'}</h2>
                <p className="ceo-role">{isEn ? 'CEO / Adjunct Professor' : '대표 / 한신대학교 AI·SW대학 겸임교수'}</p>
                <p className="ceo-company">DreamIT Biz</p>
              </div>
            </div>
            <div className="ceo-intro-text">
              {isEn ? (
                <p>
                  <strong>Aebon Lee</strong>, CEO of DreamIT Biz, provides <strong>practice-oriented education and consulting</strong> focused on
                  SW/Web Development, Generative AI-based Business Automation, Data Analysis &amp; Visualization, and AI Core Technology Education.
                  She designs and operates an <strong>execution-centered curriculum</strong> that connects real-world challenges faced by organizations
                  and individuals through the flow of "Business Automation → Data Analysis → Deliverables (documents, reports, proposals)."
                </p>
              ) : (
                <p>
                  드림아이티비즈(DreamIT Biz) 대표 <strong>이애본</strong>은 SW·웹 개발, 생성형 AI 기반 업무자동화,
                  데이터 분석·시각화, AI 핵심기술 교육을 중심으로 <strong>현업 적용형 교육·컨설팅</strong>을 수행하고 있습니다.
                  조직과 개인이 겪는 실무 문제를 "업무 자동화 → 데이터 분석 → 산출물(문서·보고서·기획서) 완성"까지
                  연결하는 <strong>실행 중심 커리큘럼</strong>을 설계·운영합니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 강의·컨설팅 분야 */}
      <section className="ceo-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">{isEn ? 'Education & Consulting Areas' : '강의·컨설팅 분야'}</h2>
          </div>
          <div className="ceo-expertise-grid">
            {/* 1. AI 업무자동화 */}
            <div className="ceo-expertise-card" data-aos="fade-up" data-aos-delay="0">
              <div className="ceo-expertise-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>{isEn ? 'Generative AI & Business Automation' : '생성형 AI 활용 업무자동화'}</h3>
              <ul>
                <li>{isEn ? 'ChatGPT Prompt Engineering, GPTs Development' : 'ChatGPT 프롬프트 엔지니어링, GPTs 제작'}</li>
                <li>{isEn ? 'Copilot-based Document Automation (VBA)' : 'Copilot 활용 문서작성 자동화(VBA 활용)'}</li>
                <li>{isEn ? 'AI-powered Document & Slide Creation' : '생성형 AI 도구를 활용한 문서·슬라이드 제작'}</li>
                <li>{isEn ? 'Web Promotion Pages, No-Code Automation' : '웹 홍보 페이지 제작, 노코드 기반 업무자동화'}</li>
                <li>{isEn ? 'AI API Research Assistant, Business Plan & Report Writing' : 'AI API Research Assistant, 사업계획서·결과보고서·논문 작성 지원'}</li>
              </ul>
            </div>

            {/* 2. 데이터 분석 */}
            <div className="ceo-expertise-card" data-aos="fade-up" data-aos-delay="100">
              <div className="ceo-expertise-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3>{isEn ? 'AI & Data Analysis Tools' : '인공지능·데이터 분석 도구 실무'}</h3>
              <ul>
                <li>{isEn ? 'Analysis Tool Introduction, Data Preprocessing & EDA' : '분석 도구 소개, 데이터 전처리 및 EDA'}</li>
                <li>{isEn ? 'Data Visualization' : '데이터 시각화'}</li>
                <li>{isEn ? 'Analysis Practice & Result Report Creation' : '다양한 데이터 분석 및 결과보고서 제작 실습'}</li>
              </ul>
            </div>

            {/* 3. 빅데이터 시각화 */}
            <div className="ceo-expertise-card" data-aos="fade-up" data-aos-delay="200">
              <div className="ceo-expertise-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3>{isEn ? 'Big Data Analysis & Visualization' : '빅데이터 분석 & 시각화'}</h3>
              <ul>
                <li>{isEn ? 'Data Storytelling, Chart Visualization, Interactive Dashboards' : '데이터 스토리텔링, 시각화 차트, 인터랙티브 대시보드 설계'}</li>
                <li>{isEn ? 'Tableau-based Data Cleaning, Analysis & Visualization' : 'Tableau 기반 데이터 정제·분석·시각화 원칙 및 실무 적용'}</li>
                <li>{isEn ? 'Business Intelligence Visualization & Portfolio' : '경영정보 시각화 및 포트폴리오 제작'}</li>
              </ul>
            </div>

            {/* 4. AI 핵심기술 */}
            <div className="ceo-expertise-card" data-aos="fade-up" data-aos-delay="300">
              <div className="ceo-expertise-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
                  <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
                  <circle cx="12" cy="14" r="1" />
                </svg>
              </div>
              <h3>{isEn ? 'AI Core Technology Courses' : 'AI 핵심 기술 과정'}</h3>
              <ul>
                <li>{isEn ? 'Deep Learning & PyTorch, CNN, Machine Vision, NLP' : '딥러닝과 PyTorch, CNN, 머신비전, 자연어처리'}</li>
                <li>{isEn ? 'Transformer Models, Reinforcement Learning' : 'Transformer 모델, 강화학습'}</li>
                <li>{isEn ? 'Project-based Machine Learning' : '프로젝트 실습으로 배우는 머신러닝'}</li>
              </ul>
            </div>

            {/* 5. 이미지·영상 */}
            <div className="ceo-expertise-card" data-aos="fade-up" data-aos-delay="400">
              <div className="ceo-expertise-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>{isEn ? 'Generative Image & Video Production' : '생성형 이미지·영상 제작'}</h3>
              <ul>
                <li>{isEn ? 'High-quality Image & Video with Midjourney, Stable Diffusion' : 'Midjourney, Stable Diffusion 기반 고품질 이미지·영상 제작'}</li>
                <li>{isEn ? '2D/2.5D Photorealistic Style Image Production' : '2D/2.5D 실사 스타일 이미지 제작'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title={isEn ? 'Want to collaborate with DreamIT Biz?' : '드림아이티비즈와 함께하고 싶으시다면'}
        subtitle={isEn ? 'Contact us for education and consulting inquiries' : '교육·컨설팅 문의를 남겨주세요'}
        buttonText={t('common.contactUs')}
      />
    </>
  );
};

export default CeoProfile;
