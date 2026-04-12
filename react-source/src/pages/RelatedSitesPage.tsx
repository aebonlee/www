import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const EDU_HUB_URL = 'https://edu-hub.dreamitbiz.com';

const siteGroups = [
  {
    label: { ko: 'Hub 사이트', en: 'Hub Sites' },
    desc: { ko: '분야별 통합 교육 허브 포털', en: 'Integrated education hub portals by field' },
    sites: [
      { name: 'edu-hub', url: 'https://edu-hub.dreamitbiz.com', emoji: '🎓', ko: '교육 통합 허브 — 전체 교육 사이트를 한곳에서 관리·수강하는 메인 포털', en: 'Education Hub — Main portal to manage and access all education sites' },
      { name: 'ai-hub', url: 'https://ai-hub.dreamitbiz.com', emoji: '🤖', ko: 'AI 교육 허브 — AI·머신러닝·딥러닝 관련 교육 콘텐츠 통합 포털', en: 'AI Hub — Integrated portal for AI, ML, and deep learning education' },
      { name: 'biz-hub', url: 'https://biz-hub.dreamitbiz.com', emoji: '💼', ko: '비즈니스 허브 — 디지털 비즈니스·마케팅·브랜딩 교육 통합 포털', en: 'Business Hub — Digital business, marketing, and branding education portal' },
      { name: 'cs-hub', url: 'https://cs-hub.dreamitbiz.com', emoji: '💻', ko: 'CS 허브 — 컴퓨터과학·알고리즘·자료구조 등 CS 교육 통합 포털', en: 'CS Hub — Computer science, algorithms, and data structures education portal' },
      { name: 'basic-hub', url: 'https://basic-hub.dreamitbiz.com', emoji: '📚', ko: '기초 허브 — IT 입문자를 위한 기초 교육 통합 포털', en: 'Basic Hub — Foundational IT education portal for beginners' },
      { name: 'exam-hub', url: 'https://exam-hub.dreamitbiz.com', emoji: '📝', ko: '시험 허브 — IT 자격증·시험 준비를 위한 통합 학습 포털', en: 'Exam Hub — Integrated study portal for IT certifications and exams' },
      { name: 'career-hub', url: 'https://carrer-hub.dreamitbiz.com', emoji: '🚀', ko: '커리어 허브 — 취업·이직·경력 개발을 위한 통합 포털', en: 'Career Hub — Integrated portal for job search and career development' },
    ],
  },
  {
    label: { ko: '프로그래밍 교육', en: 'Programming Education' },
    desc: { ko: '언어별 프로그래밍 학습 사이트', en: 'Programming learning sites by language' },
    sites: [
      { name: 'coding', url: 'https://coding.dreamitbiz.com', emoji: '👨‍💻', ko: '코딩 종합 — 프로그래밍 기초부터 실전 프로젝트까지 단계별 학습', en: 'Coding Comprehensive — Step-by-step learning from basics to real projects' },
      { name: 'python-study', url: 'https://python-study.dreamitbiz.com', emoji: '🐍', ko: 'Python 학습 — 데이터 분석, 자동화, 웹 개발을 위한 파이썬 교육', en: 'Python Study — Python for data analysis, automation, and web development' },
      { name: 'java-study', url: 'https://java-study.dreamitbiz.com', emoji: '☕', ko: 'Java 학습 — 객체지향 프로그래밍과 Spring 기반 백엔드 개발 교육', en: 'Java Study — OOP and Spring-based backend development education' },
      { name: 'c-study', url: 'https://c-study.dreamitbiz.com', emoji: '⚙️', ko: 'C/C++ 학습 — 시스템 프로그래밍과 임베디드 개발을 위한 C 언어 교육', en: 'C/C++ Study — C language for system programming and embedded development' },
      { name: 'reactstudy', url: 'https://reactstudy.dreamitbiz.com', emoji: '⚛️', ko: 'React 학습 — 모던 프론트엔드 개발을 위한 React/TypeScript 교육', en: 'React Study — React/TypeScript for modern frontend development' },
      { name: 'html', url: 'https://html.dreamitbiz.com', emoji: '🌐', ko: 'HTML/CSS 학습 — 웹 퍼블리싱 기초, HTML5·CSS3·반응형 웹 디자인', en: 'HTML/CSS Study — Web publishing basics, HTML5, CSS3, responsive design' },
    ],
  },
  {
    label: { ko: 'IT/CS 교육', en: 'IT/CS Education' },
    desc: { ko: '컴퓨터 과학 및 IT 인프라 학습', en: 'Computer science and IT infrastructure learning' },
    sites: [
      { name: 'algorithm', url: 'https://algorithm.dreamitbiz.com', emoji: '🧮', ko: '알고리즘 — 코딩 테스트 대비, 정렬·탐색·그래프 등 핵심 알고리즘 학습', en: 'Algorithm — Core algorithms for coding tests: sorting, searching, graphs' },
      { name: 'data-structure', url: 'https://data-structure.dreamitbiz.com', emoji: '🗂️', ko: '자료구조 — 배열, 스택, 큐, 트리, 해시 등 자료구조 이론과 구현', en: 'Data Structure — Arrays, stacks, queues, trees, hash tables theory & implementation' },
      { name: 'linux-study', url: 'https://linux-study.dreamitbiz.com', emoji: '🐧', ko: 'Linux 학습 — 리눅스 명령어, 서버 관리, 쉘 스크립트 실습 교육', en: 'Linux Study — Linux commands, server management, and shell scripting' },
      { name: 'db-study', url: 'https://db-study.dreamitbiz.com', emoji: '🗄️', ko: 'DB 학습 — SQL, 데이터 모델링, RDBMS/NoSQL 데이터베이스 설계와 운영', en: 'DB Study — SQL, data modeling, RDBMS/NoSQL database design and operations' },
      { name: 'software', url: 'https://software.dreamitbiz.com', emoji: '📦', ko: '소프트웨어 공학 — 개발 방법론, 설계 패턴, 프로젝트 관리 교육', en: 'Software Engineering — Development methodologies, design patterns, project management' },
      { name: 'webstudy', url: 'https://webstudy.dreamitbiz.com', emoji: '🕸️', ko: '웹 기술 학습 — 풀스택 웹 개발, REST API, 클라우드 배포 교육', en: 'Web Study — Full-stack web dev, REST APIs, and cloud deployment' },
      { name: 'koreatech', url: 'https://koreatech.dreamitbiz.com', emoji: '🇰🇷', ko: '한국 IT 기술 — 국내 IT 산업 트렌드와 기술 교육 콘텐츠', en: 'Korea Tech — Korean IT industry trends and technology education' },
    ],
  },
  {
    label: { ko: 'AI 교육', en: 'AI Education' },
    desc: { ko: 'AI 도구 활용 및 생성형 AI 학습', en: 'AI tools and generative AI learning' },
    sites: [
      { name: 'ai-prompt', url: 'https://ai-prompt.dreamitbiz.com', emoji: '💬', ko: 'AI 프롬프트 — ChatGPT, Claude 등 생성형 AI 프롬프트 엔지니어링 교육', en: 'AI Prompt — Prompt engineering for ChatGPT, Claude, and generative AI' },
      { name: 'ai-data', url: 'https://ai-data.dreamitbiz.com', emoji: '📊', ko: 'AI 데이터 — 데이터 수집·전처리·분석, 머신러닝 모델 학습 교육', en: 'AI Data — Data collection, preprocessing, analysis, and ML model training' },
      { name: 'ai-media', url: 'https://ai-media.dreamitbiz.com', emoji: '🎬', ko: 'AI 미디어 — AI 이미지·영상·음악 생성 도구 활용 교육', en: 'AI Media — AI image, video, and music generation tools education' },
      { name: 'claude', url: 'https://claude.dreamitbiz.com', emoji: '🧠', ko: 'Claude 활용 — Anthropic Claude AI 활용법, 코딩 보조, 업무 자동화', en: 'Claude Usage — Anthropic Claude AI for coding assistance and automation' },
      { name: 'chatgpt', url: 'https://chatgpt.dreamitbiz.com', emoji: '💡', ko: 'ChatGPT 활용 — OpenAI ChatGPT 실무 활용, GPTs 제작, API 연동', en: 'ChatGPT Usage — Practical ChatGPT, GPTs creation, and API integration' },
      { name: 'gemini', url: 'https://gemini.dreamitbiz.com', emoji: '♊', ko: 'Gemini 활용 — Google Gemini AI 활용법과 Google Workspace 연동', en: 'Gemini Usage — Google Gemini AI and Google Workspace integration' },
      { name: 'genspark', url: 'https://genspark.dreamitbiz.com', emoji: '✨', ko: 'GenSpark — AI 검색·요약·리서치 도구 활용 교육', en: 'GenSpark — AI search, summarization, and research tools education' },
    ],
  },
  {
    label: { ko: '비즈니스/LMS', en: 'Business/LMS' },
    desc: { ko: '디지털 비즈니스와 온라인 교육 플랫폼', en: 'Digital business and online education platforms' },
    sites: [
      { name: 'digitalbiz', url: 'https://digitalbiz.dreamitbiz.com', emoji: '📱', ko: '디지털 비즈니스 — 디지털 전환, e-커머스, 온라인 비즈니스 전략 교육', en: 'Digital Biz — Digital transformation, e-commerce, and online business strategy' },
      { name: 'marketing', url: 'https://marketing.dreamitbiz.com', emoji: '📣', ko: '마케팅 — 디지털 마케팅, SNS 마케팅, 콘텐츠 마케팅 전략 교육', en: 'Marketing — Digital marketing, SNS marketing, and content strategy education' },
      { name: 'uxdesign', url: 'https://uxdesign.dreamitbiz.com', emoji: '🎨', ko: 'UX 디자인 — 사용자 경험 설계, UI/UX 디자인 원칙과 실습 교육', en: 'UX Design — User experience design, UI/UX principles and hands-on practice' },
      { name: 'self-branding', url: 'https://self-branding.dreamitbiz.com', emoji: '🏷️', ko: '셀프 브랜딩 — 퍼스널 브랜딩, 포트폴리오 구축, 온라인 존재감 강화', en: 'Self Branding — Personal branding, portfolio building, online presence' },
    ],
  },
  {
    label: { ko: '어학 교육', en: 'Language Learning' },
    desc: { ko: 'IT 분야 외국어 학습', en: 'Foreign language learning for IT professionals' },
    sites: [
      { name: 'english', url: 'https://english.dreamitbiz.com', emoji: '🇺🇸', ko: '영어 학습 — IT 영어, 비즈니스 영어, 기술 문서 읽기 교육', en: 'English Study — IT English, business English, and technical documentation' },
      { name: 'japanese', url: 'https://japanese.dreamitbiz.com', emoji: '🇯🇵', ko: '일본어 학습 — IT 일본어, 비즈니스 일본어, JLPT 대비 교육', en: 'Japanese Study — IT Japanese, business Japanese, and JLPT preparation' },
      { name: 'korean', url: 'https://korean.dreamitbiz.com', emoji: '🇰🇷', ko: '한국어 학습 — 외국인을 위한 한국어 교육과 TOPIK 시험 대비', en: 'Korean Study — Korean language education and TOPIK exam preparation' },
    ],
  },
  {
    label: { ko: '자격증', en: 'Certifications' },
    desc: { ko: 'IT 국가 자격증 시험 대비', en: 'IT national certification exam preparation' },
    sites: [
      { name: 'eip', url: 'https://eip.dreamitbiz.com', emoji: '🏅', ko: '정보처리기사 — 필기·실기 기출 문제 풀이, 핵심 이론 정리, 합격 전략', en: 'EIP — Engineer Information Processing: past exams, theory, exam strategy' },
      { name: 'sqld', url: 'https://sqld.dreamitbiz.com', emoji: '🎯', ko: 'SQLD — SQL 개발자 자격증 준비, SQL 문법, 데이터 모델링 학습', en: 'SQLD — SQL Developer certification: SQL syntax and data modeling' },
    ],
  },
  {
    label: { ko: 'AI 도구', en: 'AI Tools' },
    desc: { ko: 'AI 에이전트 및 업무 자동화 도구', en: 'AI agents and workflow automation tools' },
    sites: [
      { name: 'aI-agents', url: 'https://ai-agents.dreamitbiz.com', emoji: '🤖', ko: 'AI 에이전트 — AI 에이전트 구축, 자동화 워크플로우 설계와 운영 교육', en: 'AI Agents — Building AI agents, automation workflow design and operations' },
      { name: 'autowork', url: 'https://autowork.dreamitbiz.com', emoji: '⚡', ko: '업무 자동화 — RPA, 노코드/로코드 도구를 활용한 업무 자동화 교육', en: 'AutoWork — RPA and no-code/low-code tools for workflow automation' },
      { name: 'fine-tuning', url: 'https://fine-tuning.dreamitbiz.com', emoji: '🔧', ko: '파인튜닝 — LLM 파인튜닝, 커스텀 모델 학습, AI 모델 최적화 교육', en: 'Fine-tuning — LLM fine-tuning, custom model training, AI optimization' },
    ],
  },
  {
    label: { ko: '핵심 플랫폼', en: 'Core Platforms' },
    desc: { ko: 'DreamIT 주요 서비스 플랫폼', en: 'DreamIT core service platforms' },
    sites: [
      { name: 'competency', url: 'https://competency.dreamitbiz.com', emoji: '📋', ko: '역량 평가 — 직무 역량 진단, AHP 기반 역량 분석과 맞춤 교육 추천', en: 'Competency — Job competency assessment, AHP-based analysis and training recommendations' },
      { name: 'career', url: 'https://career.dreamitbiz.com', emoji: '💼', ko: '커리어 — 경력 개발 로드맵, 이력서·포트폴리오 작성 가이드', en: 'Career — Career roadmap, resume and portfolio writing guides' },
      { name: 'allthat', url: 'https://allthat.dreamitbiz.com', emoji: '🌟', ko: '올댓 — DreamIT 전체 서비스 통합 포털, 원스톱 교육 쇼핑', en: 'AllThat — DreamIT integrated service portal, one-stop education shopping' },
      { name: 'papers', url: 'https://papers.dreamitbiz.com', emoji: '📄', ko: '페이퍼스 — 학술 논문·보고서·교안 작성 도구와 템플릿 제공', en: 'Papers — Academic papers, reports, and lesson plan tools with templates' },
      { name: 'ahp_basic', url: 'https://ahp-basic.dreamitbiz.com', emoji: '📐', ko: 'AHP 기초 — AHP 의사결정 분석 기법 학습과 실습 도구', en: 'AHP Basic — AHP decision analysis learning and practice tools' },
      { name: 'teaching', url: 'https://teaching.dreamitbiz.com', emoji: '👨‍🏫', ko: '교수법 — 효과적인 교수·학습 방법론, 강의 설계, 교안 작성 교육', en: 'Teaching — Effective teaching methods, lecture design, and lesson planning' },
      { name: 'planning', url: 'https://planning.dreamitbiz.com', emoji: '📅', ko: '기획 — IT 프로젝트 기획, 사업 계획서 작성, 전략 수립 교육', en: 'Planning — IT project planning, business proposals, and strategy education' },
    ],
  },
  {
    label: { ko: '출판/문서', en: 'Publishing/Docs' },
    desc: { ko: '전자출판 및 문서 관리 플랫폼', en: 'E-publishing and document management platforms' },
    sites: [
      { name: 'books', url: 'https://books.dreamitbiz.com', emoji: '📖', ko: '도서 — IT 전문 서적, 교육 교재 온라인 열람 및 구매 플랫폼', en: 'Books — IT books and educational materials online reading and purchase' },
      { name: 'docs', url: 'https://docs.dreamitbiz.com', emoji: '📑', ko: '문서 — 기술 문서, 매뉴얼, 교육 자료 관리 및 공유 플랫폼', en: 'Docs — Technical documents, manuals, and educational materials sharing' },
      { name: 'reserve', url: 'https://reserve.dreamitbiz.com', emoji: '🔖', ko: '예약 — 교육 과정·강의실·컨설팅 예약 시스템', en: 'Reserve — Course, classroom, and consulting reservation system' },
      { name: 'openclaw', url: 'https://openclaw.dreamitbiz.com', emoji: '⚖️', ko: '오픈클로 — 오픈소스 라이선스, 저작권, IT 법률 정보 교육', en: 'OpenClaw — Open source licensing, copyright, and IT legal education' },
      { name: 'presentation', url: 'https://presentation.dreamitbiz.com', emoji: '🎤', ko: '프레젠테이션 — 발표 기법, 슬라이드 디자인, 스피치 스킬 교육', en: 'Presentation — Presentation skills, slide design, and speech training' },
    ],
  },
  {
    label: { ko: '로봇/IoT/BI', en: 'Robot/IoT/BI' },
    desc: { ko: '로봇 공학, IoT, 비즈니스 인텔리전스', en: 'Robotics, IoT, and business intelligence' },
    sites: [
      { name: 'pbirobot', url: 'https://pbirobot.dreamitbiz.com', emoji: '🦾', ko: 'PBI 로봇 — Power BI 기반 로봇·IoT 데이터 시각화 및 분석 교육', en: 'PBI Robot — Power BI based robot/IoT data visualization and analytics' },
      { name: 'pbi', url: 'https://pbi.dreamitbiz.com', emoji: '📈', ko: 'Power BI — Microsoft Power BI 대시보드 제작, DAX, 데이터 분석 교육', en: 'Power BI — Microsoft Power BI dashboards, DAX, and data analytics' },
      { name: 'koreait', url: 'https://koreait.dreamitbiz.com', emoji: '🏢', ko: 'Korea IT — 국내 IT 기업·산업 동향, 채용 정보, 기술 트렌드 소개', en: 'Korea IT — Korean IT industry trends, hiring info, and tech trends' },
    ],
  },
  {
    label: { ko: '커리어/취업', en: 'Career/Jobs' },
    desc: { ko: 'IT 취업 및 경력 개발 지원', en: 'IT career and job development support' },
    sites: [
      { name: 'jobpath', url: 'https://jobpath.dreamitbiz.com', emoji: '🛤️', ko: '잡패스 — IT 직무별 커리어 로드맵, 필요 역량, 학습 경로 안내', en: 'JobPath — IT career roadmaps by role, required skills, and learning paths' },
      { name: 'instructor', url: 'https://instructor.dreamitbiz.com', emoji: '🎓', ko: '강사 — DreamIT 강사 프로필, 전문 분야, 강의 이력 소개', en: 'Instructor — DreamIT instructor profiles, expertise, and lecture history' },
    ],
  },
  {
    label: { ko: '포트폴리오/개인', en: 'Portfolio/Personal' },
    desc: { ko: '개인 포트폴리오 사이트', en: 'Personal portfolio sites' },
    sites: [
      { name: 'aebon', url: 'https://aebon.dreamitbiz.com', emoji: '👤', ko: 'Aebon — 대표 이에본 박사 개인 포트폴리오 및 연구 활동 소개', en: 'Aebon — Dr. Aebon Lee\'s personal portfolio and research activities' },
      { name: 'jdy', url: 'https://jdy.dreamitbiz.com', emoji: '👤', ko: 'JDY — 개인 포트폴리오 사이트', en: 'JDY — Personal portfolio site' },
      { name: 'wonjunjang', url: 'https://wonjunjang.dreamitbiz.com', emoji: '👤', ko: '원준장 — 개인 포트폴리오 사이트', en: 'Wonjunjang — Personal portfolio site' },
      { name: 'hohai', url: 'https://hohai.dreamitbiz.com', emoji: '👤', ko: '호하이 — 개인 포트폴리오 사이트', en: 'Hohai — Personal portfolio site' },
    ],
  },
];

const RelatedSitesPage = () => {
  const { t, language } = useLanguage();
  useAOS();

  const rs = t('relatedSites') as any;

  return (
    <>
      <SEOHead
        title={rs.pageTitle}
        description={rs.pageSubtitle}
        path="/related-sites"
      />

      {/* Hero */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{rs.pageTitle}</h1>
          <p className="page-description">{rs.pageSubtitle}</p>
        </div>
      </section>

      {/* Site Groups */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          {siteGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 56 }} data-aos="fade-up" data-aos-delay={gi * 60}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {language === 'ko' ? group.label.ko : group.label.en}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20 }}>
                {language === 'ko' ? group.desc.ko : group.desc.en}
              </p>
              <div className="rs-site-grid">
                {group.sites.map((site) => (
                  <a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rs-site-card"
                  >
                    <div className="rs-site-emoji">{site.emoji}</div>
                    <div className="rs-site-info">
                      <div className="rs-site-name">{site.name}</div>
                      <div className="rs-site-desc">{language === 'ko' ? site.ko : site.en}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* ━━━ Separator ━━━ */}
          <hr style={{ border: 'none', borderTop: '2px solid var(--border-light)', margin: '48px 0' }} />

          {/* A. 사이트 분양 안내 */}
          <div className="rs-info-section" style={{ borderTop: 'none' }} data-aos="fade-up">
            <h2>
              <span className="rs-icon">🏢</span>
              {rs.franchiseTitle}
            </h2>
            <p className="rs-info-desc">{rs.franchiseDesc}</p>

            <div className="rs-info-features">
              <h3>{rs.franchiseTarget}</h3>
              <ul>
                {rs.franchiseTargetList?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rs-info-features">
              <h3>{rs.franchiseIncludes}</h3>
              <ul>
                {rs.franchiseIncludesList?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              {rs.franchiseProcess}
            </h3>
            <div className="rs-process-steps">
              {rs.franchiseSteps?.map((step: string, i: number) => (
                <span className="rs-step" key={i}>
                  <span className="rs-step-num">{i + 1}</span>
                  <span className="rs-step-text">{step}</span>
                  {i < (rs.franchiseSteps?.length ?? 0) - 1 && <span className="rs-step-arrow">→</span>}
                </span>
              ))}
            </div>

            <a href={EDU_HUB_URL} target="_blank" rel="noopener noreferrer" className="rs-cta-btn">
              {rs.franchiseApply} →
            </a>
          </div>

          {/* B. 비용 안내 */}
          <div className="rs-info-section" data-aos="fade-up">
            <h2>
              <span className="rs-icon">💰</span>
              {rs.pricingTitle}
            </h2>

            <div className="rs-pricing-grid">
              {rs.plans?.map((plan: any, i: number) => (
                <div
                  key={i}
                  className={`rs-pricing-card${plan.recommended ? ' recommended' : ''}`}
                >
                  {plan.recommended && (
                    <span className="rs-pricing-badge">{rs.recommended}</span>
                  )}
                  <div className="rs-pricing-name">{plan.name}</div>
                  <div className="rs-pricing-price">{plan.price}</div>
                  <div className="rs-pricing-sites">{plan.sites}</div>
                  <ul className="rs-pricing-features">
                    {plan.features?.map((f: string, fi: number) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                  <a href={EDU_HUB_URL} target="_blank" rel="noopener noreferrer" className="rs-cta-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    {rs.pricingApply}
                  </a>
                </div>
              ))}
            </div>
            <p className="rs-pricing-annual">{rs.pricingAnnual}</p>
          </div>

          {/* C. 쿠폰 발행 안내 */}
          <div className="rs-info-section" data-aos="fade-up">
            <h2>
              <span className="rs-icon">🎟️</span>
              {rs.couponTitle}
            </h2>

            <div className="rs-coupon-grid">
              {rs.coupons?.map((coupon: any, i: number) => (
                <div key={i} className="rs-coupon-card">
                  <div className="rs-coupon-icon">{i === 0 ? '🏷️' : '🆓'}</div>
                  <div className="rs-coupon-name">{coupon.name}</div>
                  <div className="rs-coupon-desc">{coupon.desc}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              {rs.couponProcess}
            </h3>
            <div className="rs-process-steps">
              {rs.couponSteps?.map((step: string, i: number) => (
                <span className="rs-step" key={i}>
                  <span className="rs-step-num">{i + 1}</span>
                  <span className="rs-step-text">{step}</span>
                  {i < (rs.couponSteps?.length ?? 0) - 1 && <span className="rs-step-arrow">→</span>}
                </span>
              ))}
            </div>

            <a href={EDU_HUB_URL} target="_blank" rel="noopener noreferrer" className="rs-cta-btn">
              {rs.couponApply} →
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default RelatedSitesPage;
