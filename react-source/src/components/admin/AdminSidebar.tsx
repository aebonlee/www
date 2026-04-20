import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import getSupabase from '../../utils/supabase';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

const GROUP_COLORS: Record<string, string> = {
  '개요':    '#6366f1',
  '회원':    '#10b981',
  '상거래':  '#f59e0b',
  '콘텐츠':  '#0ea5e9',
  '바로가기': '#f43f5e',
};


/* ── SVG 아이콘 ── */
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconBoard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconTrending = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTicket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ── AdminSidebar ── */
const AdminSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) => {
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, newUsers: 0, newOrders: 0 });

  useEffect(() => {
    const load = async () => {
      const client = getSupabase();
      if (!client) return;
      try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const w = weekAgo.toISOString();
        const [totalRes, newURes, newORes] = await Promise.all([
          client.from('user_profiles').select('*', { count: 'exact', head: true }),
          client.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', w),
          client.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', w),
        ]);
        setStats({
          total:     totalRes.count  || 0,
          newUsers:  newURes.count   || 0,
          newOrders: newORes.count   || 0,
        });
      } catch {}
    };
    load();
  }, []);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };
  const handleLinkClick = () => { if (mobileOpen) onMobileClose(); };

  const menuGroups = [
    {
      label: '개요',
      items: [
        { path: '/admin',         label: '대시보드',     icon: <IconDashboard /> },
        { path: '/admin/sites',   label: '사이트 현황',  icon: <IconGlobe /> },
        { path: '/admin/links',   label: '사이트 바로가기', icon: <IconLink /> },
        { path: '/admin/site-visits', label: '사이트별 방문통계', icon: <IconBarChart /> },
        { path: '/admin/trends',  label: '트렌드 분석',  icon: <IconTrending /> },
      ],
    },
    {
      label: '회원',
      items: [
        { path: '/admin/users', label: '회원 관리', icon: <IconUsers />, badge: stats.newUsers || null },
      ],
    },
    {
      label: '상거래',
      items: [
        { path: '/admin/products', label: '상품 관리', icon: <IconBox /> },
        { path: '/admin/orders',   label: '주문/결제', icon: <IconCard />, badge: stats.newOrders || null },
        { path: '/admin/coupons',  label: '쿠폰 관리', icon: <IconTicket /> },
      ],
    },
    {
      label: '콘텐츠',
      items: [
        { path: '/admin/blog',     label: '블로그',    icon: <IconEdit /> },
        { path: '/admin/gallery',  label: '갤러리',    icon: <IconImage /> },
        { path: '/admin/board',    label: '게시판',    icon: <IconBoard /> },
        { path: '/admin/syllabus', label: '강의계획서', icon: <IconBook /> },
      ],
    },
  ];

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onMobileClose}
      />
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        {/* ── 로고 ── */}
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
              {collapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>

        {/* ── 미니 통계 위젯 (펼침 상태에서만) ── */}
        {!collapsed && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px',
            padding: '10px 14px', borderBottom: '1px solid var(--border-light)',
          }}>
            {([
              { label: '전체 회원', value: stats.total,     color: GROUP_COLORS['개요'] },
              { label: '이번주 신규', value: stats.newUsers, color: GROUP_COLORS['회원'] },
              { label: '이번주 주문', value: stats.newOrders, color: GROUP_COLORS['상거래'] },
            ] as const).map(({ label, value, color }) => (
              <div key={label} style={{
                textAlign: 'center',
                background: `rgba(${hexToRgb(color)},0.08)`,
                border: `1px solid rgba(${hexToRgb(color)},0.2)`,
                borderRadius: '8px', padding: '7px 4px',
              }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '3px', lineHeight: 1.2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── 내비게이션 ── */}
        <nav className="sidebar-nav">
          {menuGroups.map((group) => {
            const color = GROUP_COLORS[group.label] ?? '#6b7280';
            const rgb = hexToRgb(color);
            return (
              <div className="sidebar-group" key={group.label}>
                <div
                  className="sidebar-group-label"
                  style={{ color, borderLeft: `2px solid ${color}`, paddingLeft: '16px' }}
                >
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-link ${active ? 'active' : ''}`}
                      onClick={handleLinkClick}
                      title={collapsed ? item.label : undefined}
                      style={{
                        borderLeftColor: active ? color : 'transparent',
                        background: active ? `rgba(${rgb},0.09)` : undefined,
                        color: active ? color : undefined,
                        fontWeight: active ? 600 : undefined,
                      }}
                    >
                      {/* 아이콘 래퍼 (colored bg) */}
                      <div style={{
                        width: '30px', height: '30px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '7px',
                        background: active ? color : `rgba(${rgb},0.12)`,
                        color: active ? '#fff' : color,
                        transition: 'all 0.2s ease',
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: color, color: '#fff',
                          borderRadius: '20px', padding: '1px 7px',
                          fontSize: '11px', fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          +{item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}

        </nav>

        {/* ── 푸터 ── */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-back" onClick={handleLinkClick}>
            <IconArrowLeft />
            <span>사이트로 돌아가기</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
