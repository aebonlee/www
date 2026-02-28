import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              <span className="brand-dream">Dream</span>
              <span className="brand-it">IT</span>{' '}
              <span className="brand-biz">Biz</span>
            </h3>
            <p>{t('footer.tagline')}</p>
            <div className="company-info">
              <p><strong>드림아이티비즈(DreamIT Biz)</strong></p>
              <p>대표이사: 이애본</p>
              <p>사업자등록번호: 601-45-20154</p>
              <p>통신판매신고번호: 제2024-수원팔달-0584호</p>
              <p>출판사 신고번호: 제2026-000026호</p>
            </div>
          </div>
          <div className="footer-links">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/services">{t('nav.itServices')}</Link></li>
              <li><Link to="/consulting">{t('nav.consulting')}</Link></li>
              <li><Link to="/education">{t('nav.education')}</Link></li>
              <li><Link to="/publishing">{t('nav.publishing')}</Link></li>
              <li><Link to="/shop">{t('shop.title')}</Link></li>
              <li><Link to="/portfolio">{t('nav.portfolio')}</Link></li>
              <li><Link to="/community/blog">{t('nav.community')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/about/ceo">{t('about.ceoProfile')}</Link></li>
              <li><Link to="/contact">{t('about.contact')}</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>{t('footer.contact')}</h4>
            <p>경기도 수원시 팔달구 매산로 45, 419호</p>
            <p>aebon@dreamitbiz.com</p>
            <p>010-3700-0629</p>
            <p>카카오톡: aebon</p>
            <p className="business-hours">평일: 09:00 ~ 18:00</p>

            <div className="footer-family">
              <h4>Family Site</h4>
              <ul>
                <li><a href="https://books.dreamitbiz.com" target="_blank" rel="noopener noreferrer">DreamIT Biz 출판사</a></li>
                <li><a href="https://hohai.dreamitbiz.com" target="_blank" rel="noopener noreferrer">호해 - 학습관리(LMS)</a></li>
                <li><a href="https://ahp-basic.dreamitbiz.com" target="_blank" rel="noopener noreferrer">AHP 연구 플랫폼</a></li>
                <li><a href="https://competency.dreamitbiz.com" target="_blank" rel="noopener noreferrer">핵심역량 자가측정</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2020-{new Date().getFullYear()} DreamIT Biz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
