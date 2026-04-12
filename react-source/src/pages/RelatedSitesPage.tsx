import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const EDU_HUB_URL = 'https://edu-hub.dreamitbiz.com';

const siteGroups = [
  {
    label: { ko: 'Hub 사이트', en: 'Hub Sites' },
    sites: [
      { name: 'edu-hub', url: 'https://edu-hub.dreamitbiz.com', emoji: '🎓' },
      { name: 'ai-hub', url: 'https://ai-hub.dreamitbiz.com', emoji: '🤖' },
      { name: 'biz-hub', url: 'https://biz-hub.dreamitbiz.com', emoji: '💼' },
      { name: 'cs-hub', url: 'https://cs-hub.dreamitbiz.com', emoji: '💻' },
      { name: 'basic-hub', url: 'https://basic-hub.dreamitbiz.com', emoji: '📚' },
      { name: 'exam-hub', url: 'https://exam-hub.dreamitbiz.com', emoji: '📝' },
    ],
  },
  {
    label: { ko: '프로그래밍 교육', en: 'Programming Education' },
    sites: [
      { name: 'coding', url: 'https://coding.dreamitbiz.com', emoji: '👨‍💻' },
      { name: 'python-study', url: 'https://python-study.dreamitbiz.com', emoji: '🐍' },
      { name: 'java-study', url: 'https://java-study.dreamitbiz.com', emoji: '☕' },
      { name: 'c-study', url: 'https://c-study.dreamitbiz.com', emoji: '⚙️' },
      { name: 'reactstudy', url: 'https://reactstudy.dreamitbiz.com', emoji: '⚛️' },
      { name: 'html', url: 'https://html.dreamitbiz.com', emoji: '🌐' },
    ],
  },
  {
    label: { ko: 'IT/CS 교육', en: 'IT/CS Education' },
    sites: [
      { name: 'algorithm', url: 'https://algorithm.dreamitbiz.com', emoji: '🧮' },
      { name: 'data-structure', url: 'https://data-structure.dreamitbiz.com', emoji: '🗂️' },
      { name: 'linux-study', url: 'https://linux-study.dreamitbiz.com', emoji: '🐧' },
      { name: 'db-study', url: 'https://db-study.dreamitbiz.com', emoji: '🗄️' },
      { name: 'software', url: 'https://software.dreamitbiz.com', emoji: '📦' },
      { name: 'webstudy', url: 'https://webstudy.dreamitbiz.com', emoji: '🕸️' },
    ],
  },
  {
    label: { ko: 'AI 교육', en: 'AI Education' },
    sites: [
      { name: 'ai-prompt', url: 'https://ai-prompt.dreamitbiz.com', emoji: '💬' },
      { name: 'ai-data', url: 'https://ai-data.dreamitbiz.com', emoji: '📊' },
      { name: 'ai-media', url: 'https://ai-media.dreamitbiz.com', emoji: '🎬' },
      { name: 'claude', url: 'https://claude.dreamitbiz.com', emoji: '🧠' },
      { name: 'chatgpt', url: 'https://chatgpt.dreamitbiz.com', emoji: '💡' },
      { name: 'gemini', url: 'https://gemini.dreamitbiz.com', emoji: '♊' },
    ],
  },
  {
    label: { ko: '비즈니스/LMS', en: 'Business/LMS' },
    sites: [
      { name: 'digitalbiz', url: 'https://digitalbiz.dreamitbiz.com', emoji: '📱' },
      { name: 'marketing', url: 'https://marketing.dreamitbiz.com', emoji: '📣' },
      { name: 'uxdesign', url: 'https://uxdesign.dreamitbiz.com', emoji: '🎨' },
      { name: 'self-branding', url: 'https://self-branding.dreamitbiz.com', emoji: '🏷️' },
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
            <div key={gi} style={{ marginBottom: 48 }} data-aos="fade-up" data-aos-delay={gi * 80}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                {language === 'ko' ? group.label.ko : group.label.en}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {group.sites.map((site) => (
                  <a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-card"
                    style={{ textDecoration: 'none', padding: 20, textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{site.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{site.name}</div>
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
