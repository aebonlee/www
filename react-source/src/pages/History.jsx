import { useEffect } from 'react';
import useAOS from '../hooks/useAOS';
import { useLanguage } from '../contexts/LanguageContext';
import CTA from '../components/CTA';

const History = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const timelineData = [
    {
      year: '2003.09',
      title: isEn ? 'DreamIT Founded' : '드림아이티(DreamIT) 창업',
      desc: isEn ? '1st founding as an IT & telecommunications company' : '1차 창업, IT 정보통신 전문 기업으로 출발',
      era: 'first'
    },
    {
      year: '2004~2005',
      title: isEn ? 'PDA e-Learning Content Development' : 'Web기반 PDA용 e-Learning 콘텐츠 개발',
      desc: isEn ? 'Industry-Academia-Research Consortium Project (10 months)' : '산·학·연 공동기술개발 컨소시엄사업 수행 (10개월)',
      era: 'first'
    },
    {
      year: '2005~2006',
      title: isEn ? 'PDA Online Learning System LMS' : 'PDA 온라인 학습 시스템 LMS 개발',
      desc: isEn ? 'PDA-only Learning Management Solution (Consortium, 10 months)' : 'PDA전용 Learning Management Solution 개발 (산·학·연 컨소시엄, 10개월)',
      era: 'first'
    },
    {
      year: '2006~2007',
      title: isEn ? 'Mobile Broadcast Learning Solution' : '모바일 방송 학습 관리 솔루션 개발',
      desc: isEn ? 'Any Study Pro — e-Learning solution for mobile broadcasting (Consortium, 6 months)' : 'Any Study Pro — 모바일 방송 시스템용 e-Learning 솔루션 (산·학·연 컨소시엄, 6개월)',
      era: 'first'
    },
    {
      year: '2007',
      title: isEn ? 'RFID·HSDPA Navigation for the Visually Impaired' : 'RFID·HSDPA 시각장애인 위치정보 시스템 개발',
      desc: isEn ? 'Navigation system using RFID and high-speed downlink packet access (Consortium, 6 months)' : '무선 주파수 인식 기술과 고속하향패킷전송을 이용한 내비게이션 개발 (산·학·연 컨소시엄, 6개월)',
      era: 'first'
    },
    {
      year: '2008~2009',
      title: isEn ? 'Training Management System (TMS)' : '학습 능률 향상 통합 솔루션 TMS 개발',
      desc: isEn ? 'Education Synergy Tools: Training Management System (Consortium, 12 months)' : 'Education Synergy Tools: Training Management System (산·학·연 컨소시엄, 12개월)',
      era: 'first'
    },
    {
      year: '2009.06',
      title: isEn ? 'DreamIT Closed' : '드림아이티 폐업',
      desc: isEn ? 'Business closure due to financial difficulties' : '경영난으로 사업 종료',
      era: 'gap'
    },
    {
      year: '2020.03',
      title: isEn ? 'Re-founded as Korea Vocational Competency Development Center' : '한국직업능력개발센터 재창업',
      desc: isEn ? '2nd founding in Suwon, Gyeonggi — IT services & vocational development' : '경기도 수원시에서 2차 창업, 직업능력개발 및 IT 서비스 사업 재개',
      era: 'second'
    },
    {
      year: '2023',
      title: isEn ? 'Education Institution Projects' : '교육 기관 프로젝트 수행',
      desc: isEn ? 'Sejong University Future Education Center, Chinju Education University 100th Anniversary' : '세종대학교 미래교육원, 진주교육대학교 100주년 기념 사이트 구축',
      era: 'second'
    },
    {
      year: '2024',
      title: isEn ? 'Education & Publishing Business Launch' : '교육 및 출판 사업 진출',
      desc: isEn ? 'Corporate training programs and IT book publishing' : '기업 맞춤 강의 프로그램 운영 및 IT 전문 서적 출판 시작',
      era: 'second'
    },
    {
      year: '2025',
      title: isEn ? 'Platform Service Expansion' : '플랫폼 서비스 확대',
      desc: isEn ? 'Online education platform and e-publishing service expansion' : '온라인 교육 플랫폼 및 전자출판 서비스 확장',
      era: 'second'
    },
    {
      year: '2026.02',
      title: isEn ? 'Renamed to DreamIT Biz' : '드림아이티비즈(DreamIT Biz)로 상호 변경',
      desc: isEn ? 'Rebranded from Korea Vocational Competency Development Center to DreamIT Biz' : '한국직업능력개발센터에서 드림아이티비즈로 사명 변경, 종합 IT 서비스 기업으로 도약',
      era: 'second'
    }
  ];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEn ? 'History' : '연혁'}</h1>
          <p className="page-description">
            {isEn ? 'The journey of DreamIT Biz since 2003' : '2003년부터 이어온 드림아이티비즈의 발자취'}
          </p>
        </div>
      </section>

      {/* Era 1: 1차 창업기 */}
      <section style={{ padding: '60px 0 40px', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title" style={{ fontSize: '1.6rem' }}>
              {isEn ? '1st Era — DreamIT (2003~2009)' : '1차 창업기 — 드림아이티 (2003~2009)'}
            </h2>
            <p className="section-subtitle">
              {isEn ? 'Industry-Academia-Research R&D Projects' : '산·학·연 공동기술개발 컨소시엄 사업 수행'}
            </p>
          </div>
          <div className="timeline">
            {timelineData.filter(item => item.era === 'first').map((item, i) => (
              <div key={i} className="timeline-item" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="timeline-date">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gap */}
      <section style={{ padding: '40px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="timeline">
            {timelineData.filter(item => item.era === 'gap').map((item, i) => (
              <div key={i} className="timeline-item" data-aos="fade-up">
                <div className="timeline-date">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Era 2: 2차 창업기 */}
      <section style={{ padding: '40px 0 60px', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title" style={{ fontSize: '1.6rem' }}>
              {isEn ? '2nd Era — Reborn (2020~Present)' : '2차 창업기 — 재도약 (2020~현재)'}
            </h2>
            <p className="section-subtitle">
              {isEn ? 'Digital transformation & comprehensive IT services' : '디지털 전환 및 종합 IT 서비스 기업으로 도약'}
            </p>
          </div>
          <div className="timeline">
            {timelineData.filter(item => item.era === 'second').map((item, i) => (
              <div key={i} className="timeline-item" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="timeline-date">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
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

export default History;
