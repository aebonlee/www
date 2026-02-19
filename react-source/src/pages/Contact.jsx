import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';

const Contact = () => {
  const { t } = useLanguage();
  useAOS();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('contactPage.title')}</h1>
          <p className="page-description">{t('contactPage.subtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          {/* Info Cards */}
          <div className="info-cards-grid">
            <div className="info-box" data-aos="fade-up">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="info-content">
                <h3>{t('contactPage.address')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('contactPage.addressDetail')}</p>
              </div>
            </div>

            <div className="info-box" data-aos="fade-up" data-aos-delay="100">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="info-content">
                <h3>{t('contactPage.phone')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('contactPage.phoneDetail')}</p>
              </div>
            </div>

            <div className="info-box" data-aos="fade-up" data-aos-delay="200">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="info-content">
                <h3>{t('contactPage.email')}</h3>
                <p><a href="mailto:aebon@dreamitbiz.com">aebon@dreamitbiz.com</a></p>
              </div>
            </div>

            <div className="info-box" data-aos="fade-up" data-aos-delay="300">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="info-content">
                <h3>{t('contactPage.kakao')}</h3>
                <p>aebon</p>
              </div>
            </div>

            <div className="info-box" data-aos="fade-up" data-aos-delay="400">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="info-content">
                <h3>{t('contactPage.hours')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('contactPage.hoursDetail')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-box" data-aos="fade-up">
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>{t('contactPage.formTitle')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('contactPage.name')} *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('contactPage.emailLabel')} *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('contactPage.phoneLabel')}</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{t('contactPage.subject')} *</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('contactPage.message')} *</label>
                <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t('contactPage.submit')}
              </button>
              {submitStatus === 'success' && (
                <div className="form-submit-status success">
                  {t('contactPage.success')}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
