const About = () => {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-description">드림아이티비즈를 소개합니다</p>
        </div>
      </section>

      <section id="company" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">회사 개요</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
              드림아이티비즈는 혁신적인 IT 솔루션을 제공하는 전문 기업입니다.
              웹개발, 웹호스팅, 디자인, 기업컨설팅, 교육, 출판 등 다양한 분야에서
              고객의 성공을 위해 최선을 다하고 있습니다.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              우리는 고객의 니즈를 정확히 파악하고, 맞춤형 솔루션을 제공하여
              비즈니스의 성장을 돕습니다.
            </p>
          </div>
        </div>
      </section>

      <section id="vision" style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">비전</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '32px', background: 'var(--bg-white)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>혁신</h3>
              <p>최신 기술을 활용한 혁신적인 솔루션 제공</p>
            </div>
            <div style={{ padding: '32px', background: 'var(--bg-white)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>신뢰</h3>
              <p>고객과의 신뢰를 최우선으로 하는 서비스</p>
            </div>
            <div style={{ padding: '32px', background: 'var(--bg-white)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>성장</h3>
              <p>고객과 함께 성장하는 파트너</p>
            </div>
          </div>
        </div>
      </section>

      <section id="history" style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">연혁</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="timeline">
              <div className="timeline-item" data-aos="fade-up">
                <div className="timeline-date">2020</div>
                <div className="timeline-content">
                  <h4>드림아이티비즈 설립</h4>
                  <p>IT 솔루션 전문 기업으로 출발</p>
                </div>
              </div>
              <div className="timeline-item" data-aos="fade-up">
                <div className="timeline-date">2022</div>
                <div className="timeline-content">
                  <h4>사업 확장</h4>
                  <p>웹호스팅 및 디자인 서비스 시작</p>
                </div>
              </div>
              <div className="timeline-item" data-aos="fade-up">
                <div className="timeline-date">2024</div>
                <div className="timeline-content">
                  <h4>교육 및 출판 사업 진출</h4>
                  <p>기업 맞춤 강의 및 IT 전문 서적 출판</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
