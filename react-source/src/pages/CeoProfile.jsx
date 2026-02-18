import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';

const CeoProfile = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
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
                <p className="ceo-role">{isEn ? 'CEO / Representative' : '대표이사'}</p>
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

      {/* 주요 활동 */}
      <section className="ceo-section" style={{ background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">{isEn ? 'Key Activities' : '주요 활동'}</h2>
          </div>
          <div className="ceo-activities" data-aos="fade-up">
            <div className="ceo-activity-group">
              <h4>{isEn ? 'Current Positions' : '현직'}</h4>
              <ul className="ceo-list">
                <li>{isEn ? 'Director, Korea Vocational Competency Development Center' : '(현) (구) 한국직업능력개발센터 센터장'}</li>
                <li>{isEn ? 'Adjunct Professor, AI·SW College, Hanshin University' : '(현) 한신대학교 AI·SW대학 겸임교수'}</li>
                <li>{isEn ? 'AI Innovation Technology Instructor, KOSA' : '(현) 한국소프트웨어산업협회(KOSA) AI 혁신기술 분야 강사'}</li>
                <li>{isEn ? 'Operating Professor, Credit Bank System (Data Structures, Algorithms, ICT)' : '(현) 학점은행제 컴퓨터전공 운영교수(자료구조, 알고리즘, 정보통신 등)'}</li>
                <li>
                  {isEn
                    ? 'National Judge, Korea Skills Competition (HRD Korea) — Web Design & Development: Seoul/Gyeonggi Judge, Incheon Chief Judge'
                    : '(현) 한국산업인력공단 기능경기대회 전국 심사위원 — 웹디자인 및 개발 직종: 서울·경기 심사위원, 인천지역 심사장'
                  }
                </li>
              </ul>
            </div>
            <div className="ceo-activity-group">
              <h4>{isEn ? 'Former Positions' : '전직'}</h4>
              <ul className="ceo-list">
                <li>{isEn ? 'Instructor, KOREATECH Competency Development Institute' : '(전) 한국기술교육대학교 능력개발원 교직/전공과정 강사'}</li>
                <li>{isEn ? 'Adjunct Professor & SW WarmUp Manager, Kyonggi University (SW-Centered University)' : '(전) 경기대학교(SW중심대학) 겸임교수 및 SW WarmUp 운영'}</li>
              </ul>
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

      {/* 학력 */}
      <section className="ceo-section" style={{ background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">{isEn ? 'Education' : '학력'}</h2>
          </div>
          <div className="ceo-timeline" data-aos="fade-up">
            <div className="ceo-timeline-item">
              <div className="ceo-timeline-dot"></div>
              <div className="ceo-timeline-content">
                <h4>{isEn ? 'Seoul Venture Graduate School' : '서울벤처대학원대학교'}</h4>
                <p>{isEn ? 'Ph.D. in Convergence Industry, Information Management (Feb 2026)' : '융합산업학과 정보관리 전공 박사 (2026년 2월)'}</p>
              </div>
            </div>
            <div className="ceo-timeline-item">
              <div className="ceo-timeline-dot"></div>
              <div className="ceo-timeline-content">
                <h4>{isEn ? 'Kyonggi University Graduate School' : '경기대학교 일반대학원'}</h4>
                <p>{isEn ? 'Ph.D. Program in Vocational Studies (Employment Policy / HRD), Completed (Aug 2019)' : '직업학과(고용정책/교육훈련·핵심역량 연구) 박사과정 수료 (2019.08.23)'}</p>
              </div>
            </div>
            <div className="ceo-timeline-item">
              <div className="ceo-timeline-dot"></div>
              <div className="ceo-timeline-content">
                <h4>{isEn ? 'Master of Science' : '이학석사'}</h4>
                <p>{isEn ? 'Information Science (Thesis Graduation)' : '정보과학과 (논문졸업)'}</p>
              </div>
            </div>
            <div className="ceo-timeline-item">
              <div className="ceo-timeline-dot"></div>
              <div className="ceo-timeline-content">
                <h4>{isEn ? 'Bachelor\'s Degrees' : '학사'}</h4>
                <p>{isEn
                  ? 'B.S. Computer Science (Thesis) / B.B.A. Business Administration (Thesis) / B.A. Korean Language Education as a Foreign Language'
                  : '컴퓨터과학과 이학사(논문졸업) / 경영학과 경영학사(논문졸업) / 외국어로서의 한국어학 문학사(학점졸업)'
                }</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 자격·이수 */}
      <section className="ceo-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">{isEn ? 'Certifications & Qualifications' : '자격·이수'}</h2>
          </div>
          <div className="ceo-cert-grid" data-aos="fade-up">
            <div className="ceo-cert-card">
              <div className="ceo-cert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p>{isEn ? 'Vocational Training Instructor Grade 2 (NCS 16 Areas), Ministry of Employment and Labor' : '고용노동부 직업능력개발훈련교사(NCS 16직종) 2급 향상 이수, 다분야 훈련교사 자격 보유'}</p>
            </div>
            <div className="ceo-cert-card">
              <div className="ceo-cert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p>{isEn ? 'Multiple National Technical & Certified Qualifications, Multiple Private Qualifications' : '국가기술자격 및 공인자격 다수, 민간자격 다수'}</p>
            </div>
            <div className="ceo-cert-card">
              <div className="ceo-cert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p>{isEn ? 'Lifelong Educator, Korean Language Instructor Level 2' : '평생교육사, 한국어교원 2급'}</p>
            </div>
            <div className="ceo-cert-card">
              <div className="ceo-cert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p>{isEn ? 'ISO 14001 / ISO 45001 Auditor, Startup Advisor Level 1' : 'ISO 14001 / ISO 45001 심사원(보), 창업지도사 1급'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 수상 */}
      <section className="ceo-section" style={{ background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">{isEn ? 'Awards' : '수상'}</h2>
          </div>
          <div className="ceo-awards" data-aos="fade-up">
            <div className="ceo-award-item">
              <div className="ceo-award-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div>
                <h4>{isEn ? 'Minister of Trade, Industry and Energy Award (2022)' : '산업통상자원부 장관상 (2022)'}</h4>
                <p>{isEn ? 'TBT Trade Barrier Research Project Performance' : 'TBT 무역장벽 연구프로젝트 수행'}</p>
              </div>
            </div>
            <div className="ceo-award-item">
              <div className="ceo-award-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div>
                <h4>{isEn ? 'Minister of Employment and Labor Award (2017, 2020)' : '고용노동부 장관상 (2017, 2020)'}</h4>
                <p>{isEn ? 'Merit in Vocational Education and Training' : '직업교육훈련 유공표창'}</p>
              </div>
            </div>
            <div className="ceo-award-item">
              <div className="ceo-award-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div>
                <h4>{isEn ? 'Chung-Ang University President\'s Award' : '중앙대학교 총장상'}</h4>
                <p>{isEn ? 'Excellence in Thesis (Standards Program) / Korea Standards Agency Director\'s Award (ESG Grand Prize)' : '표준고외과정 우수논문상 / 국가표준원장상(ESG 분야 최우수상)'}</p>
              </div>
            </div>
            <div className="ceo-award-item">
              <div className="ceo-award-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div>
                <h4>{isEn ? 'Korea National Open University President\'s Award (×2)' : '한국방송통신대학교 총장상 2회'}</h4>
                <p>{isEn ? 'B.A.: Merit Award / M.A.: Academic Excellence Award' : '학사: 공로상 / 석사: 성적우수상'}</p>
              </div>
            </div>
            <div className="ceo-award-item">
              <div className="ceo-award-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div>
                <h4>{isEn ? 'Innovative Korean Power Brand Grand Prize (2021)' : '혁신한국인 파워브랜드대상 (2021)'}</h4>
                <p>{isEn ? 'Human Resource Development (HRD) Category Grand Prize' : '인적자원개발(HRD) 부문 대상'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="ceo-section">
        <div className="container">
          <div className="ceo-contact-box" data-aos="fade-up">
            <h3>{isEn ? 'Contact' : '연락처'}</h3>
            <div className="ceo-contact-grid">
              <div className="ceo-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>010-3700-0629</span>
              </div>
              <div className="ceo-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>aebon@kyonggi.ac.kr</span>
              </div>
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
