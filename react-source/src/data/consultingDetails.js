const consultingDetails = {
  business: {
    title: '기업 컨설팅',
    titleEn: 'Business Consulting',
    subtitle: '디지털 전환을 위한 맞춤 IT 컨설팅을 제공합니다',
    subtitleEn: 'Tailored IT consulting for digital transformation',
    overview: [
      '드림아이티비즈의 기업 컨설팅은 디지털 전환의 모든 과정을 지원합니다.',
      '현재 비즈니스의 IT 환경을 분석하고, 최적의 디지털 전략을 수립합니다.',
      '실행 가능한 로드맵과 함께 기술 도입부터 조직 변화 관리까지 종합적으로 지원합니다.'
    ],
    overviewEn: [
      'DreamIT Biz business consulting supports every step of digital transformation.',
      'We analyze your current IT environment and develop optimal digital strategies.',
      'We provide actionable roadmaps and comprehensive support from technology adoption to organizational change management.'
    ],
    features: [
      { title: 'IT 전략 수립', titleEn: 'IT Strategy', description: '비즈니스 목표에 맞는 IT 전략과 로드맵을 수립합니다.', descriptionEn: 'We develop IT strategies and roadmaps aligned with your business goals.' },
      { title: '프로세스 개선', titleEn: 'Process Improvement', description: '업무 프로세스를 분석하고 자동화 솔루션을 제안합니다.', descriptionEn: 'We analyze business processes and propose automation solutions.' },
      { title: '기술 도입 지원', titleEn: 'Tech Adoption', description: '새로운 기술 도입 시 리스크를 최소화하고 효과를 극대화합니다.', descriptionEn: 'Minimize risks and maximize effectiveness when adopting new technologies.' },
      { title: '보안 컨설팅', titleEn: 'Security Consulting', description: '정보보안 체계를 점검하고 강화 방안을 제시합니다.', descriptionEn: 'Review information security systems and propose enhancement measures.' },
      { title: '데이터 분석', titleEn: 'Data Analytics', description: '데이터 기반 의사결정을 위한 분석 환경을 구축합니다.', descriptionEn: 'Build data analytics environments for data-driven decision making.' },
      { title: '변화 관리', titleEn: 'Change Management', description: '조직의 디지털 전환에 따른 변화 관리를 지원합니다.', descriptionEn: 'Support change management for organizational digital transformation.' }
    ],
    process: [
      { step: 1, title: '진단', titleEn: 'Diagnosis', description: '현황 분석 및\n문제 도출', descriptionEn: 'Current state analysis\nand problem identification' },
      { step: 2, title: '전략', titleEn: 'Strategy', description: '솔루션 설계 및\n로드맵 수립', descriptionEn: 'Solution design\nand roadmap planning' },
      { step: 3, title: '실행', titleEn: 'Execution', description: '솔루션 도입 및\n실행 지원', descriptionEn: 'Solution implementation\nand execution support' },
      { step: 4, title: '평가', titleEn: 'Evaluation', description: '성과 측정 및\n지속적 개선', descriptionEn: 'Performance measurement\nand continuous improvement' }
    ],
    ctaTitle: 'IT 컨설팅으로 비즈니스를 혁신하세요',
    ctaTitleEn: 'Innovate your business with IT consulting',
    ctaSubtitle: '전문 컨설턴트와 무료 상담을 시작하세요',
    ctaSubtitleEn: 'Start a free consultation with our expert consultants'
  },
  university: {
    title: '대학 컨설팅',
    titleEn: 'University Consulting',
    subtitle: '대학 교육 혁신과 디지털 캠퍼스 구축을 지원합니다',
    subtitleEn: 'Supporting university education innovation and digital campus development',
    overview: [
      '드림아이티비즈는 대학 교육의 디지털 전환을 종합적으로 지원합니다.',
      '스마트 캠퍼스 구축, LMS(학습관리시스템) 도입, 비대면 교육 환경 구축 등 대학 특화 IT 컨설팅을 제공합니다.',
      '세종대학교 미래교육원, 진주교육대학교 등 다수의 대학 프로젝트 경험을 바탕으로 실질적인 솔루션을 제안합니다.'
    ],
    overviewEn: [
      'DreamIT Biz provides comprehensive support for digital transformation in university education.',
      'We offer university-specific IT consulting including smart campus development, LMS implementation, and remote education infrastructure.',
      'Based on our experience with Sejong University, Jinju National University of Education, and other institutions, we propose practical solutions.'
    ],
    features: [
      { title: '스마트 캠퍼스', titleEn: 'Smart Campus', description: '디지털 인프라 기반의 스마트 캠퍼스 환경을 설계하고 구축합니다.', descriptionEn: 'Design and build smart campus environments based on digital infrastructure.' },
      { title: 'LMS 구축', titleEn: 'LMS Development', description: '대학 맞춤형 학습관리시스템(LMS)을 도입하고 운영을 지원합니다.', descriptionEn: 'Implement and support customized Learning Management Systems for universities.' },
      { title: '비대면 교육', titleEn: 'Remote Education', description: '온라인 강의, 화상 수업 등 비대면 교육 환경을 구축합니다.', descriptionEn: 'Build remote education environments including online lectures and video classes.' },
      { title: '학사 시스템', titleEn: 'Academic System', description: '학사 행정 시스템의 디지털화와 자동화를 지원합니다.', descriptionEn: 'Support digitization and automation of academic administration systems.' },
      { title: '데이터 기반 교육', titleEn: 'Data-Driven Education', description: '학습 데이터 분석을 통한 맞춤형 교육 전략을 수립합니다.', descriptionEn: 'Develop personalized education strategies through learning data analytics.' },
      { title: '산학 협력', titleEn: 'Industry Collaboration', description: '산학 협력 플랫폼 구축 및 프로그램 개발을 지원합니다.', descriptionEn: 'Support industry-academia collaboration platform development and program creation.' }
    ],
    process: [
      { step: 1, title: '현황 조사', titleEn: 'Assessment', description: '대학 IT 환경\n현황 분석', descriptionEn: 'University IT environment\nassessment' },
      { step: 2, title: '로드맵', titleEn: 'Roadmap', description: '디지털 전환\n로드맵 수립', descriptionEn: 'Digital transformation\nroadmap planning' },
      { step: 3, title: '시스템 구축', titleEn: 'Implementation', description: '플랫폼 및\n시스템 구축', descriptionEn: 'Platform and\nsystem development' },
      { step: 4, title: '운영 지원', titleEn: 'Operations', description: '운영 교육 및\n지속 지원', descriptionEn: 'Operations training\nand ongoing support' }
    ],
    ctaTitle: '대학 교육의 미래를 함께 만들어 갑니다',
    ctaTitleEn: 'Building the future of university education together',
    ctaSubtitle: '대학 디지털 전환 전문 컨설턴트와 상담하세요',
    ctaSubtitleEn: 'Consult with our university digital transformation specialists'
  },
  institution: {
    title: '교육기관 컨설팅',
    titleEn: 'Educational Institution Consulting',
    subtitle: '교육기관의 스마트 교육 환경 구축을 지원합니다',
    subtitleEn: 'Supporting smart education environment for educational institutions',
    overview: [
      '드림아이티비즈는 초·중·고등학교, 평생교육원, 직업훈련기관 등 다양한 교육기관의 IT 컨설팅을 제공합니다.',
      '스마트 교실 구축, 교육용 콘텐츠 플랫폼 개발, 교육 행정 시스템 혁신 등 교육 현장에 맞는 솔루션을 제안합니다.',
      '교육부 정책과 트렌드를 반영한 실효성 있는 디지털 교육 환경을 설계합니다.'
    ],
    overviewEn: [
      'DreamIT Biz provides IT consulting for various educational institutions including K-12 schools, lifelong education centers, and vocational training facilities.',
      'We propose solutions tailored to educational settings including smart classroom setup, educational content platforms, and administrative system innovation.',
      'We design effective digital education environments reflecting government policies and educational trends.'
    ],
    features: [
      { title: '스마트 교실', titleEn: 'Smart Classroom', description: '디지털 기기와 소프트웨어를 활용한 스마트 교실 환경을 구축합니다.', descriptionEn: 'Build smart classroom environments utilizing digital devices and software.' },
      { title: '교육 콘텐츠', titleEn: 'Educational Content', description: '맞춤형 교육 콘텐츠 제작 및 콘텐츠 관리 플랫폼을 구축합니다.', descriptionEn: 'Create customized educational content and build content management platforms.' },
      { title: '행정 시스템', titleEn: 'Admin System', description: '교육 행정 업무의 자동화와 효율화를 위한 시스템을 구축합니다.', descriptionEn: 'Build systems for automation and efficiency of educational administrative tasks.' },
      { title: 'AI 교육 도구', titleEn: 'AI Education Tools', description: 'AI 기반 학습 분석 및 맞춤형 교육 도구를 도입합니다.', descriptionEn: 'Introduce AI-based learning analytics and personalized education tools.' },
      { title: '정보보안', titleEn: 'Information Security', description: '학생 개인정보 보호 및 교육 데이터 보안 체계를 수립합니다.', descriptionEn: 'Establish student data protection and educational data security systems.' },
      { title: '교사 연수', titleEn: 'Teacher Training', description: '디지털 교육 도구 활용을 위한 교사 역량 강화 프로그램을 제공합니다.', descriptionEn: 'Provide teacher competency programs for utilizing digital education tools.' }
    ],
    process: [
      { step: 1, title: '현장 분석', titleEn: 'Field Analysis', description: '교육 환경 현장\n실태 분석', descriptionEn: 'On-site education\nenvironment analysis' },
      { step: 2, title: '설계', titleEn: 'Design', description: '맞춤형 솔루션\n설계', descriptionEn: 'Customized solution\ndesign' },
      { step: 3, title: '구축', titleEn: 'Build', description: '시스템 구축 및\n콘텐츠 개발', descriptionEn: 'System development\nand content creation' },
      { step: 4, title: '교육·지원', titleEn: 'Training', description: '사용자 교육 및\n운영 지원', descriptionEn: 'User training\nand operational support' }
    ],
    ctaTitle: '교육 현장의 디지털 혁신을 시작하세요',
    ctaTitleEn: 'Start digital innovation in education',
    ctaSubtitle: '교육기관 전문 컨설턴트에게 문의하세요',
    ctaSubtitleEn: 'Contact our educational institution consulting specialists'
  }
};

export default consultingDetails;
