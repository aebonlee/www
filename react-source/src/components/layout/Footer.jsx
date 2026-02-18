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
          </div>
          <div className="footer-info">
            <div className="info-section">
              <h4>{t('footer.companyInfo')}</h4>
              <p>대표: 이애본</p>
              <p>사업자등록번호: 601-45-20154</p>
              <p>통신판매신고: 제2024-수원팔달-0584호</p>
            </div>
            <div className="info-section">
              <h4>{t('footer.contact')}</h4>
              <p>주소: 경기도 수원시 팔달구 매산로 45, 419호</p>
              <p>Email: aebon@dreamitbiz.com</p>
              <p>전화: 010-3700-0629</p>
              <p>카카오톡: aebon</p>
              <p>평일 09:00 ~ 18:00</p>
            </div>
            <div className="info-section">
              <h4>{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/services">{t('nav.services')}</Link></li>
                <li><Link to="/portfolio">{t('nav.portfolio')}</Link></li>
                <li><Link to="/about">{t('nav.about')}</Link></li>
                <li><Link to="/contact">{t('nav.contact')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2020 DreamIT Biz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
