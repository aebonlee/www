import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import CTA from '../components/CTA';
import educationDetails from '../data/educationDetails';

const Classroom = () => {
  const { language, t } = useLanguage();
  const data = educationDetails.classroom;
  const isEn = language === 'en';
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEn ? data.titleEn : data.title}<span className="coming-soon-badge">{t('education.comingSoon')}</span></h1>
          <p className="page-description">{isEn ? data.subtitleEn : data.subtitle}</p>
        </div>
      </section>

      {/* Highlights */}
      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('education.highlights')}</h2>
          </div>
          <div className="highlight-grid">
            {data.highlights.map((item, i) => (
              <div key={i} className="highlight-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h4>{isEn ? item.titleEn : item.title}</h4>
                <p>{isEn ? item.descriptionEn : item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Courses */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light-gray)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('education.sampleCourses')}</h2>
          </div>
          <div className="course-grid">
            {data.sampleCourses.map((course, i) => (
              <div key={i} className="course-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <h4>{isEn ? course.titleEn : course.title}</h4>
                <p>{isEn ? course.descriptionEn : course.description}</p>
                <div className="course-meta">
                  <span className="course-level">{t('education.level')}: {isEn ? course.levelEn : course.level}</span>
                  <span>{t('education.duration')}: {isEn ? course.durationEn : course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA title={isEn ? data.ctaTitleEn : data.ctaTitle} subtitle={isEn ? data.ctaSubtitleEn : data.ctaSubtitle} buttonText={t('common.contactUs')} />
    </>
  );
};

export default Classroom;
