import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const menuGroups = [
    {
      label: '개요',
      items: [
        { path: '/admin', label: '대시보드', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        )}
      ]
    },
    {
      label: '콘텐츠 관리',
      items: [
        { path: '/admin/blog', label: '블로그', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        )},
        { path: '/admin/gallery', label: '갤러리', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        )},
        { path: '/admin/board', label: '게시판', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )},
        { path: '/admin/syllabus', label: '강의계획서', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )}
      ]
    },
    {
      label: '상거래',
      items: [
        { path: '/admin/products', label: '상품 관리', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )},
        { path: '/admin/orders', label: '주문 관리', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        )}
      ]
    },
    {
      label: '회원',
      items: [
        { path: '/admin/users', label: '회원 관리', icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )}
      ]
    }
  ];

  const handleLinkClick = () => {
    if (mobileOpen) onMobileClose();
  };

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onMobileClose}
      />
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <Link to="/admin" onClick={handleLinkClick}>
            <span className="logo-text">
              <span className="brand-dream">Dream</span>
              <span className="brand-it">IT</span>{' '}
              <span className="brand-biz">Biz</span>
            </span>
          </Link>
          <button className="sidebar-toggle-btn" onClick={onToggle} aria-label="사이드바 토글">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              {collapsed ? (
                <polyline points="9 18 15 12 9 6" />
              ) : (
                <polyline points="15 18 9 12 15 6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuGroups.map((group, gi) => (
            <div className="sidebar-group" key={gi}>
              <div className="sidebar-group-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-back" onClick={handleLinkClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>사이트로 돌아가기</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
