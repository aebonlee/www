const educationDetails = {
  custom: {
    title: '맞춤 강의',
    titleEn: 'Custom Training',
    subtitle: '기업 환경에 맞춘 실무 중심 IT 교육 프로그램',
    subtitleEn: 'Practical IT training programs tailored to your business',
    overview: [
      '드림아이티비즈의 맞춤 강의 서비스는 기업의 실무 환경에 맞춘 맞춤형 커리큘럼을 제공합니다.',
      '현업 전문가가 직접 강의하여 이론과 실무를 연결하는 효과적인 학습 경험을 제공합니다.',
      '온라인과 오프라인 모두 지원하며, 수강생 수준에 맞는 단계별 교육을 진행합니다.'
    ],
    overviewEn: [
      'DreamIT Biz custom training provides tailored curricula designed for your business environment.',
      'Industry experts deliver lectures that effectively bridge theory and practice.',
      'Both online and offline formats are supported, with step-by-step training suited to participants\' levels.'
    ],
    features: [
      { title: '맞춤형 커리큘럼', titleEn: 'Custom Curriculum', description: '기업의 업무 환경과 목표에 맞는 맞춤형 교육 과정을 설계합니다.', descriptionEn: 'We design custom training courses tailored to your business environment and goals.' },
      { title: '실습 중심 교육', titleEn: 'Hands-on Training', description: '실제 프로젝트를 통한 실습 중심의 교육으로 실무 역량을 강화합니다.', descriptionEn: 'Strengthen practical skills through hands-on training with real projects.' },
      { title: '온/오프라인 강의', titleEn: 'Online/Offline', description: '방문 교육, 화상 교육, 녹화 강의 등 다양한 형태를 지원합니다.', descriptionEn: 'We support on-site, video conference, and recorded lecture formats.' },
      { title: '수료증 발급', titleEn: 'Certification', description: '교육 이수 후 수료증을 발급하여 역량을 인증합니다.', descriptionEn: 'Certificates are issued upon course completion to certify competence.' },
      { title: '사후 지원', titleEn: 'Post-training Support', description: '교육 종료 후에도 질의응답과 추가 자료를 제공합니다.', descriptionEn: 'Q&A and additional materials are provided even after training ends.' },
      { title: '성과 측정', titleEn: 'Performance Measurement', description: '교육 효과를 측정하고 개선점을 피드백합니다.', descriptionEn: 'We measure training effectiveness and provide improvement feedback.' }
    ],
    process: [
      { step: 1, title: '니즈 파악', titleEn: 'Needs Analysis', description: '기업 교육 니즈\n분석 및 상담', descriptionEn: 'Analyze corporate\ntraining needs' },
      { step: 2, title: '설계', titleEn: 'Design', description: '커리큘럼 설계 및\n교재 제작', descriptionEn: 'Curriculum design\nand material creation' },
      { step: 3, title: '교육', titleEn: 'Training', description: '강의 진행 및\n실습 지도', descriptionEn: 'Deliver lectures\nand hands-on guidance' },
      { step: 4, title: '평가', titleEn: 'Evaluation', description: '학습 성과 평가 및\n수료증 발급', descriptionEn: 'Evaluate results\nand issue certificates' }
    ],
    ctaTitle: '기업 맞춤 교육을 시작하세요',
    ctaTitleEn: 'Start Custom Corporate Training',
    ctaSubtitle: '직원들의 IT 역량을 효과적으로 강화하세요',
    ctaSubtitleEn: 'Effectively strengthen your team\'s IT skills'
  },
  classroom: {
    title: '온라인 강의실',
    titleEn: 'Online Classroom',
    subtitle: '언제 어디서나 학습할 수 있는 온라인 강의 플랫폼',
    subtitleEn: 'Online learning platform accessible anytime, anywhere',
    highlights: [
      { title: '실시간 화상 강의', titleEn: 'Live Video Lectures', description: '실시간 화상 강의로 현장감 있는 교육을 온라인에서 경험하세요.', descriptionEn: 'Experience immersive education online with live video lectures.' },
      { title: 'VOD 무제한 복습', titleEn: 'Unlimited VOD Replay', description: '녹화된 강의를 언제든지 반복 시청하며 학습할 수 있습니다.', descriptionEn: 'Replay recorded lectures anytime for review.' },
      { title: '실습 환경 제공', titleEn: 'Practice Environment', description: '클라우드 기반 실습 환경에서 직접 코딩하며 배울 수 있습니다.', descriptionEn: 'Learn by coding directly in a cloud-based practice environment.' },
      { title: '학습 진도 관리', titleEn: 'Progress Tracking', description: '개인별 학습 진도와 성과를 실시간으로 확인할 수 있습니다.', descriptionEn: 'Track individual learning progress and performance in real-time.' }
    ],
    sampleCourses: [
      { title: 'React 실무 과정', titleEn: 'React Practical Course', level: '중급', levelEn: 'Intermediate', duration: '40시간', durationEn: '40 hours', description: 'React 기반 웹 프론트엔드 개발 실무', descriptionEn: 'Practical React web frontend development' },
      { title: 'Python 데이터 분석', titleEn: 'Python Data Analysis', level: '초급', levelEn: 'Beginner', duration: '32시간', durationEn: '32 hours', description: 'Python을 활용한 데이터 분석 기초', descriptionEn: 'Foundations of data analysis with Python' },
      { title: 'AWS 클라우드 아키텍처', titleEn: 'AWS Cloud Architecture', level: '고급', levelEn: 'Advanced', duration: '48시간', durationEn: '48 hours', description: 'AWS 기반 클라우드 인프라 설계', descriptionEn: 'Cloud infrastructure design on AWS' },
      { title: 'UI/UX 디자인 실무', titleEn: 'UI/UX Design Practical', level: '중급', levelEn: 'Intermediate', duration: '36시간', durationEn: '36 hours', description: 'Figma를 활용한 UI/UX 디자인', descriptionEn: 'UI/UX design with Figma' },
      { title: 'Node.js 백엔드 개발', titleEn: 'Node.js Backend Development', level: '중급', levelEn: 'Intermediate', duration: '44시간', durationEn: '44 hours', description: 'Node.js와 Express 기반 서버 개발', descriptionEn: 'Server development with Node.js and Express' },
      { title: 'AI/머신러닝 입문', titleEn: 'AI/ML Introduction', level: '초급', levelEn: 'Beginner', duration: '36시간', durationEn: '36 hours', description: '인공지능과 머신러닝의 기초 개념', descriptionEn: 'Foundational concepts of AI and machine learning' }
    ],
    ctaTitle: '온라인 강의실이 곧 오픈합니다',
    ctaTitleEn: 'Online Classroom Opening Soon',
    ctaSubtitle: '관심 있는 강좌에 대해 문의해 주세요',
    ctaSubtitleEn: 'Contact us about courses you\'re interested in'
  }
};

export default educationDetails;
