import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { path: '/', label: t('nav.home') },
    {
      label: t('nav.services'),
      path: '/services',
      dropdown: [
        { path: '/services/web-development', label: t('services.webDev') },
        { path: '/services/web-hosting', label: t('services.webHosting') },
        { path: '/services/design', label: t('services.design') },
        { path: '/services/consulting', label: t('services.consulting') },
        { path: '/services/education', label: t('services.education') },
        { path: '/services/publishing', label: t('services.publishing') }
      ]
    },
    {
      label: t('nav.portfolio'),
      path: '/portfolio',
      dropdown: [
        { path: '/portfolio#sejong', label: t('portfolio.sejong') },
        { path: '/portfolio#chinju', label: t('portfolio.chinju') },
        { path: '/portfolio#projects', label: t('portfolio.projects') }
      ]
    },
    {
      label: t('nav.about'),
      path: '/about',
      dropdown: [
        { path: '/about#company', label: t('about.company') },
        { path: '/about#vision', label: t('about.vision') },
        { path: '/about#history', label: t('about.history') }
      ]
    },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
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

          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="navMenu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={item.dropdown ? 'nav-item-dropdown' : ''}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                onClick={() => {
                  if (item.dropdown) {
                    setActiveDropdown(activeDropdown === index ? null : index);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                {item.dropdown ? (
                  <>
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                    <ul className={`dropdown-menu ${activeDropdown === index ? 'active' : ''}`}>
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              className="lang-switcher"
              onClick={toggleLanguage}
              aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              {language === 'ko' ? 'EN' : 'KR'}
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="테마 전환"
            >
              <svg
                className="sun-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
              <svg
                className="moon-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <button
              className="mobile-toggle"
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
