import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const menuItems = [
    { path: '/', label: t('nav.home') },
    {
      label: t('nav.itServices'),
      path: '/services',
      activePath: '/services',
      dropdown: [
        { path: '/services/web-development', label: t('services.webDev') },
        { path: '/services/web-hosting', label: t('services.webHosting') },
        { path: '/services/design', label: t('services.design') },
        { path: '/portfolio', label: t('services.portfolio') }
      ]
    },
    {
      label: t('nav.consulting'),
      path: '/consulting',
      activePath: '/consulting',
      dropdown: [
        { path: '/consulting/business', label: t('consulting.business') },
        { path: '/consulting/university', label: t('consulting.university') },
        { path: '/consulting/institution', label: t('consulting.institution') }
      ]
    },
    {
      label: t('nav.education'),
      path: '/education',
      activePath: '/education',
      dropdown: [
        { path: '/education/custom', label: t('education.custom') },
        { path: '/education/classroom', label: t('education.classroom') }
      ]
    },
    {
      label: t('nav.publishing'),
      path: '/publishing',
      activePath: '/publishing',
      dropdown: [
        { path: '/publishing/ebook', label: t('publishing.ebook') },
        { path: '/publishing/periodical', label: t('publishing.periodical') },
        { path: '/publishing/book', label: t('publishing.book') },
        { path: '/publishing/material', label: t('publishing.material') }
      ]
    },
    { path: '/shop', label: t('shop.title'), activePath: '/shop' },
    {
      label: t('nav.community'),
      path: '/community/blog',
      activePath: '/community',
      dropdown: [
        { path: '/community/blog', label: t('community.blog') },
        { path: '/community/board', label: t('community.board') }
      ]
    },
    {
      label: t('nav.about'),
      path: '/about',
      activePath: '/about',
      dropdown: [
        { path: '/about', label: t('about.companyVision') },
        { path: '/about/history', label: t('about.history') },
        { path: '/about/ceo', label: t('about.ceoProfile') },
        { path: '/contact', label: t('about.contact') }
      ]
    }
  ];

  const isActive = (item) => {
    const checkPath = item.activePath || item.path;
    if (checkPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(checkPath);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <Link to="/">
              <h1>
                <span className="brand-dream">Dream</span>
                <span className="brand-it">IT</span>{' '}
                <span className="brand-biz">Biz</span>
              </h1>
            </Link>
          </div>

          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`${item.dropdown ? 'nav-item-dropdown' : ''} ${activeDropdown === index ? 'active' : ''}`}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item) ? 'active' : ''}`}
                      onClick={(e) => {
                        if (window.innerWidth <= 1100) {
                          e.preventDefault();
                          setActiveDropdown(activeDropdown === index ? null : index);
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                    <ul className={`dropdown-menu ${activeDropdown === index ? 'active' : ''}`}>
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={item.path} className={`nav-link ${isActive(item) ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link to="/cart" className="cart-icon-link" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cart-icon-svg">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button className="lang-switcher" onClick={toggleLanguage} aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}>
              {language === 'ko' ? 'EN' : 'KR'}
            </button>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="테마 전환">
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <button
              className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 토글"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
