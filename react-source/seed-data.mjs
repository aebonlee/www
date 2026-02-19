/**
 * Supabase 블로그/갤러리 시드 데이터 삽입 스크립트
 * 실행: node seed-data.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmgdztsgjvzcyxyayaj.supabase.co';
const supabaseAnonKey = 'sb_publishable_vYCKlU2lbPkXpUDj1sILow_DskJCRVS';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const blogPosts = [
  {
    category: '교육', category_en: 'Education',
    title: '효과적인 기업 IT 교육 설계 방법론',
    title_en: 'Effective Corporate IT Training Design Methodology',
    excerpt: '기업 맞춤 IT 교육의 효과를 극대화하는 커리큘럼 설계 방법론을 소개합니다.',
    excerpt_en: 'Introducing curriculum design methodologies that maximize the effectiveness of corporate IT training.',
    content: '기업 IT 교육의 성공은 체계적인 커리큘럼 설계에서 시작됩니다.\n\n1. 교육 니즈 분석\n현업 담당자 인터뷰와 스킬 갭 분석을 통해 실제 필요한 역량을 파악합니다.\n\n2. 학습 목표 설정\nSMART 원칙에 따라 구체적이고 측정 가능한 학습 목표를 수립합니다.\n\n3. 실무 중심 커리큘럼\n이론보다 실습 비중을 높이고, 실제 업무 시나리오를 교육에 반영합니다.\n\n4. 단계별 진행\n기초 → 중급 → 심화 과정으로 단계적으로 역량을 쌓아갑니다.\n\n5. 효과 측정\n교육 전후 평가를 통해 성과를 측정하고 지속적으로 개선합니다.',
    content_en: 'The success of corporate IT training starts with systematic curriculum design.\n\n1. Training Needs Analysis\nIdentify actual required competencies through interviews and skill gap analysis.\n\n2. Learning Objectives\nEstablish specific and measurable learning objectives following SMART principles.\n\n3. Practice-Oriented Curriculum\nIncrease the proportion of hands-on practice and reflect real work scenarios.\n\n4. Step-by-Step Progression\nBuild competencies gradually from basic to intermediate to advanced.\n\n5. Effectiveness Measurement\nMeasure outcomes through pre and post assessments and continuously improve.',
    icon: '📚', date: '2025-12-10'
  },
  {
    category: '컨설팅', category_en: 'Consulting',
    title: '중소기업 디지털 전환 성공 사례',
    title_en: 'SME Digital Transformation Success Stories',
    excerpt: '드림아이티비즈가 함께한 중소기업 디지털 전환 성공 사례를 공유합니다.',
    excerpt_en: 'Sharing digital transformation success stories with DreamIT Biz.',
    content: '디지털 전환은 더 이상 선택이 아닌 필수입니다.\n\n드림아이티비즈와 함께한 3개 기업의 디지털 전환 사례를 소개합니다.\n\n사례 1: 제조업 A사\n- 레거시 시스템을 클라우드로 마이그레이션\n- 생산 데이터 실시간 모니터링 구축\n- 결과: 생산성 30% 향상\n\n사례 2: 유통업 B사\n- 오프라인 매장의 온라인 쇼핑몰 구축\n- 재고 관리 자동화 시스템 도입\n- 결과: 매출 45% 증가\n\n사례 3: 서비스업 C사\n- 고객 관리 시스템(CRM) 커스터마이징\n- AI 챗봇 도입으로 고객 응대 자동화\n- 결과: 고객 만족도 25% 상승',
    content_en: 'Digital transformation is no longer optional but essential.\n\nHere are 3 digital transformation cases with DreamIT Biz.\n\nCase 1: Manufacturing Company A\n- Migrated legacy systems to the cloud\n- Built real-time production data monitoring\n- Result: 30% productivity increase\n\nCase 2: Distribution Company B\n- Built an online shopping mall for offline stores\n- Introduced inventory management automation\n- Result: 45% revenue increase\n\nCase 3: Service Company C\n- Customized CRM system\n- Introduced AI chatbot for customer service\n- Result: 25% increase in customer satisfaction',
    icon: '💼', date: '2025-12-20'
  },
  {
    category: '호스팅', category_en: 'Hosting',
    title: '클라우드 네이티브 호스팅의 장점',
    title_en: 'Advantages of Cloud-Native Hosting',
    excerpt: '클라우드 네이티브 호스팅이 기존 호스팅 대비 어떤 이점을 제공하는지 비교 분석합니다.',
    excerpt_en: 'Comparing cloud-native hosting advantages over traditional hosting.',
    content: '클라우드 네이티브 호스팅은 전통적인 웹호스팅의 한계를 극복합니다.\n\n확장성(Scalability)\n트래픽 증가에 따라 자동으로 리소스가 확장되어 갑작스러운 트래픽 폭증에도 안정적입니다.\n\n가용성(Availability)\n멀티 리전 배포로 99.99% 가용성을 보장하며, 장애 발생 시 자동 복구됩니다.\n\n비용 효율\n사용한 만큼만 과금되는 종량제 모델로 초기 투자 비용 없이 시작할 수 있습니다.\n\n보안\n자동 SSL, DDoS 방어, 정기 보안 업데이트가 기본 제공됩니다.\n\n개발자 경험\nCI/CD 파이프라인, 원클릭 배포, 롤백 등 개발 편의 기능이 풍부합니다.',
    content_en: 'Cloud-native hosting overcomes the limitations of traditional web hosting.\n\nScalability\nResources scale automatically with traffic increases, ensuring stability during sudden spikes.\n\nAvailability\nMulti-region deployment ensures 99.99% availability with automatic failover.\n\nCost Efficiency\nPay-as-you-go model allows starting without initial investment.\n\nSecurity\nAutomatic SSL, DDoS protection, and regular security updates are included.\n\nDeveloper Experience\nRich development features including CI/CD pipelines, one-click deployment, and rollback.',
    icon: '☁️', date: '2026-01-05'
  },
  {
    category: '디자인', category_en: 'Design',
    title: 'UI/UX 디자인 트렌드 2026',
    title_en: 'UI/UX Design Trends 2026',
    excerpt: '미니멀리즘에서 뉴모피즘까지, 2026년 주목해야 할 UI/UX 디자인 트렌드를 소개합니다.',
    excerpt_en: 'From minimalism to neumorphism, introducing UI/UX design trends to watch in 2026.',
    content: '2026년 UI/UX 디자인의 핵심 키워드는 "개인화"와 "접근성"입니다.\n\n1. AI 기반 적응형 UI\n사용자 행동 패턴을 학습하여 인터페이스가 자동으로 최적화됩니다.\n\n2. 마이크로 인터랙션\n섬세한 애니메이션과 피드백으로 사용자 경험을 풍부하게 합니다.\n\n3. 다크모드 기본 지원\n다크모드는 이제 옵션이 아닌 기본 기능입니다.\n\n4. 접근성 우선 디자인\nWCAG 2.2 기준을 충족하는 포용적 디자인이 필수입니다.\n\n5. 3D & 몰입형 경험\nWebGL과 Three.js를 활용한 3D 요소가 웹에서도 보편화됩니다.',
    content_en: '2026 UI/UX design key themes are "personalization" and "accessibility".\n\n1. AI-Powered Adaptive UI\nInterfaces automatically optimize by learning user behavior patterns.\n\n2. Micro-interactions\nSubtle animations and feedback enrich user experience.\n\n3. Dark Mode as Default\nDark mode is now a default feature, not an option.\n\n4. Accessibility-First Design\nInclusive design meeting WCAG 2.2 standards is essential.\n\n5. 3D & Immersive Experiences\n3D elements using WebGL and Three.js become common on the web.',
    icon: '🎨', date: '2026-01-15'
  },
  {
    category: '기술', category_en: 'Tech',
    title: 'React 19의 새로운 기능과 마이그레이션 가이드',
    title_en: 'React 19 New Features and Migration Guide',
    excerpt: 'React 19의 주요 변경사항과 기존 프로젝트를 안전하게 마이그레이션하는 방법을 알아봅니다.',
    excerpt_en: 'Learn about major changes in React 19 and how to safely migrate existing projects.',
    content: 'React 19가 드디어 안정 버전으로 출시되었습니다.\n\nReact Compiler\n기존에 useMemo, useCallback으로 수동 최적화하던 작업을 컴파일러가 자동으로 처리합니다.\n\nActions\nform 태그의 action 속성에 함수를 전달하여 폼 제출을 처리합니다.\nuseActionState 훅으로 진행 상태와 에러를 관리합니다.\n\nuse() API\nPromise를 컴포넌트에서 직접 읽을 수 있으며, Suspense와 자연스럽게 통합됩니다.\n\nServer Components\nRSC가 정식으로 안정화되었습니다.\n\n마이그레이션 가이드\n1. React 18의 Strict Mode 경고를 먼저 모두 해결\n2. deprecated API 사용 제거\n3. 점진적으로 새 기능 적용',
    content_en: 'React 19 has finally been released as a stable version.\n\nReact Compiler\nThe compiler automatically handles optimizations previously done manually with useMemo and useCallback.\n\nActions\nPass functions to the form tag action attribute to handle submissions.\nManage progress state and errors with the useActionState hook.\n\nuse() API\nRead Promises directly in components, naturally integrating with Suspense.\n\nServer Components\nRSC has been officially stabilized.\n\nMigration Guide\n1. First resolve all Strict Mode warnings in React 18\n2. Remove deprecated API usage\n3. Gradually apply new features',
    icon: '⚛️', date: '2026-01-25'
  },
  {
    category: 'IT 트렌드', category_en: 'IT Trends',
    title: '2026 웹 개발 트렌드: AI와 함께하는 개발',
    title_en: '2026 Web Development Trends: Development with AI',
    excerpt: '2026년 웹 개발의 핵심 트렌드는 AI 기반 코드 생성, 서버리스 아키텍처, 그리고 WebAssembly의 확산입니다.',
    excerpt_en: 'Key 2026 web development trends include AI-based code generation, serverless architecture, and WebAssembly.',
    content: '2026년 웹 개발은 AI와의 협업이 핵심입니다.\n\n1. AI 기반 코드 생성\nGitHub Copilot, Claude Code 등 AI 코딩 도구가 개발 생산성을 혁신적으로 높이고 있습니다.\n\n2. 서버리스 아키텍처\nVercel, Cloudflare Workers 등 엣지 컴퓨팅 기반 서버리스 플랫폼이 주류가 되었습니다.\n\n3. WebAssembly\n브라우저에서 네이티브에 가까운 성능을 제공하며, Rust/Go 등으로 작성한 코드를 웹에서 실행합니다.\n\n4. 풀스택 타입 안전성\ntRPC, Prisma 등으로 프론트엔드부터 백엔드까지 완전한 타입 안전성을 확보합니다.\n\n5. AI 네이티브 애플리케이션\nAI가 단순 도구가 아닌 애플리케이션의 핵심 기능으로 통합됩니다.',
    content_en: 'AI collaboration is at the heart of 2026 web development.\n\n1. AI-Based Code Generation\nAI coding tools like GitHub Copilot and Claude Code are revolutionizing development productivity.\n\n2. Serverless Architecture\nEdge computing-based serverless platforms like Vercel and Cloudflare Workers have become mainstream.\n\n3. WebAssembly\nProvides near-native performance in browsers, running Rust/Go code on the web.\n\n4. Full-Stack Type Safety\nAchieve complete type safety from frontend to backend with tRPC, Prisma, etc.\n\n5. AI-Native Applications\nAI is integrated as a core application feature, not just a tool.',
    icon: '🌐', date: '2026-02-10'
  }
];

const galleryItems = [
  {
    title: '세종대 미래교육원 웹사이트', title_en: 'Sejong Univ. Future Education Center Website',
    category: 'project', image_url: '',
    description: '세종대학교 미래교육원 공식 웹사이트 개발 프로젝트',
    description_en: 'Sejong University Future Education Center official website development',
    date: '2025-06-15'
  },
  {
    title: '진주교대 100주년 기념 사이트', title_en: 'Jinju National Univ. of Education 100th Anniversary',
    category: 'project', image_url: '',
    description: '진주교육대학교 100주년 기념 특별 웹사이트',
    description_en: 'Jinju National University of Education 100th anniversary special website',
    date: '2025-08-20'
  },
  {
    title: '드림아이티비즈 워크숍', title_en: 'DreamIT Biz Workshop',
    category: 'education', image_url: '',
    description: '2025 하반기 기업 맞춤 교육 워크숍 현장',
    description_en: '2025 H2 Corporate custom training workshop',
    date: '2025-10-10'
  },
  {
    title: '사무실 전경', title_en: 'Office Overview',
    category: 'office', image_url: '',
    description: '드림아이티비즈 본사 사무실',
    description_en: 'DreamIT Biz headquarters office',
    date: '2025-11-01'
  },
  {
    title: '연말 송년 행사', title_en: 'Year-End Party',
    category: 'event', image_url: '',
    description: '2025년 연말 송년 행사 및 시상식',
    description_en: '2025 year-end party and awards ceremony',
    date: '2025-12-22'
  },
  {
    title: 'Python 데이터 분석 교육', title_en: 'Python Data Analysis Training',
    category: 'education', image_url: '',
    description: 'Python 데이터 분석 실무 교육 과정',
    description_en: 'Python data analysis practical training course',
    date: '2026-01-15'
  },
  {
    title: 'E-커머스 플랫폼 리뉴얼', title_en: 'E-Commerce Platform Renewal',
    category: 'project', image_url: '',
    description: '중소기업 쇼핑몰 전면 리뉴얼 프로젝트',
    description_en: 'SME shopping mall full renewal project',
    date: '2026-01-20'
  },
  {
    title: '2026 신년 킥오프 미팅', title_en: '2026 New Year Kickoff Meeting',
    category: 'event', image_url: '',
    description: '2026년 신년 전략 회의 및 킥오프 미팅',
    description_en: '2026 new year strategy meeting and kickoff',
    date: '2026-01-06'
  }
];

async function seed() {
  console.log('=== Supabase 시드 데이터 삽입 시작 ===\n');

  // 1. 블로그 데이터 확인 및 삽입
  const { data: existingBlogs, error: blogCheckErr } = await supabase
    .from('blog_posts').select('id');

  if (blogCheckErr) {
    console.error('blog_posts 조회 실패:', blogCheckErr.message);
  } else if (existingBlogs && existingBlogs.length > 0) {
    console.log(`blog_posts: 이미 ${existingBlogs.length}건 존재 → 건너뜀`);
  } else {
    const { data, error } = await supabase
      .from('blog_posts').insert(blogPosts).select();
    if (error) {
      console.error('blog_posts 삽입 실패:', error.message);
    } else {
      console.log(`blog_posts: ${data.length}건 삽입 완료`);
    }
  }

  // 2. 갤러리 데이터 확인 및 삽입
  const { data: existingGallery, error: galleryCheckErr } = await supabase
    .from('gallery_items').select('id');

  if (galleryCheckErr) {
    console.error('gallery_items 조회 실패:', galleryCheckErr.message);
  } else if (existingGallery && existingGallery.length > 0) {
    console.log(`gallery_items: 이미 ${existingGallery.length}건 존재 → 건너뜀`);
  } else {
    const { data, error } = await supabase
      .from('gallery_items').insert(galleryItems).select();
    if (error) {
      console.error('gallery_items 삽입 실패:', error.message);
    } else {
      console.log(`gallery_items: ${data.length}건 삽입 완료`);
    }
  }

  console.log('\n=== 완료 ===');
}

seed().catch(console.error);
