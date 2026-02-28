import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllUsers, updateUserRole, updateUserSignupDomain } from '../../utils/adminStorage';
import { ADMIN_EMAILS } from '../../config/admin';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

const ROLE_OPTIONS = [
  { value: 'admin', label: '관리자', color: 'red' },
  { value: 'vip', label: 'VIP회원', color: 'purple' },
  { value: 'member', label: '정회원', color: 'blue' },
  { value: 'associate', label: '준회원', color: 'gray' },
];

const SITE_OPTIONS = [
  { value: 'hohai.dreamitbiz.com', label: 'hohai', color: 'blue' },
  { value: 'books.dreamitbiz.com', label: 'books', color: 'green' },
  { value: 'competency.dreamitbiz.com', label: 'competency', color: 'purple' },
  { value: 'ahp-basic.dreamitbiz.com', label: 'ahp-basic', color: 'red' },
  { value: 'www.dreamitbiz.com', label: 'www', color: 'yellow' },
];

/** signup_domain에서 사이트 이름 추출 — 예: hohai.dreamitbiz.com → hohai */
const getSiteName = (domain) => {
  if (!domain) return '-';
  const d = domain.toLowerCase();
  if (d.endsWith('.dreamitbiz.com')) {
    const sub = d.replace('.dreamitbiz.com', '');
    return sub || 'www';
  }
  if (d === 'dreamitbiz.com' || d === 'www.dreamitbiz.com') return 'www';
  if (d.includes('localhost') || d.includes('127.0.0.1')) return 'localhost';
  return d;
};

/** 사이트별 뱃지 색상 */
const getSiteColor = (siteName) => {
  const colorMap = {
    hohai: 'blue',
    books: 'green',
    competency: 'purple',
    'ahp-basic': 'red',
    www: 'yellow',
    localhost: 'gray',
  };
  return colorMap[siteName] || 'gray';
};

/** 유저의 실제 role 결정 (ADMIN_EMAILS이면 admin 강제) */
const resolveRole = (user) => {
  if (ADMIN_EMAILS.includes((user.email || '').toLowerCase())) return 'admin';
  return user.role || 'member';
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = useCallback(async (userId, newRole) => {
    const oldRole = users.find((u) => u.id === userId)?.role;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const result = await updateUserRole(userId, newRole);
    if (result.error) {
      alert('등급 변경 실패: ' + result.error);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: oldRole } : u))
      );
    }
  }, [users]);

  const handleSiteChange = useCallback(async (userId, newDomain) => {
    const oldDomain = users.find((u) => u.id === userId)?.signup_domain;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, signup_domain: newDomain } : u))
    );
    const result = await updateUserSignupDomain(userId, newDomain);
    if (result.error) {
      alert('가입 사이트 변경 실패: ' + result.error);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, signup_domain: oldDomain } : u))
      );
    }
  }, [users]);

  const siteNames = useMemo(() => {
    const names = [...new Set(users.map((u) => getSiteName(u.signup_domain)))];
    return names.filter((n) => n !== '-').sort().concat(names.includes('-') ? ['-'] : []);
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (siteFilter !== 'all') {
      list = list.filter((u) => getSiteName(u.signup_domain) === siteFilter);
    }
    if (roleFilter !== 'all') {
      list = list.filter((u) => resolveRole(u) === roleFilter);
    }
    return list;
  }, [users, siteFilter, roleFilter]);

  const columns = [
    { key: 'id', label: 'ID', width: '80px' },
    {
      key: 'display_name',
      label: '이름',
      className: 'td-title',
      render: (val) => val || '-',
    },
    { key: 'email', label: '이메일' },
    {
      key: 'provider',
      label: '가입방법',
      width: '100px',
      render: (val) => {
        const p = val || 'email';
        const colorMap = { google: 'blue', kakao: 'yellow', email: 'gray' };
        return (
          <span className={`td-badge ${colorMap[p] || 'gray'}`}>
            {PROVIDER_LABELS[p] || p}
          </span>
        );
      },
    },
    {
      key: 'signup_domain',
      label: '방문 가입 사이트',
      width: '160px',
      render: (val, row) => {
        const name = getSiteName(val);
        const color = getSiteColor(name);

        return (
          <select
            className={`role-select role-site-${color}`}
            value={val || ''}
            onChange={(e) => handleSiteChange(row.id, e.target.value)}
          >
            {!val && <option value="">미설정</option>}
            {SITE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      key: 'role',
      label: '등급',
      width: '120px',
      render: (val, row) => {
        const isAdminEmail = ADMIN_EMAILS.includes((row.email || '').toLowerCase());
        const currentRole = resolveRole(row);

        if (isAdminEmail) {
          return <span className="td-badge red">관리자</span>;
        }

        return (
          <select
            className={`role-select role-${currentRole}`}
            value={currentRole}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      key: 'created_at',
      label: '가입일',
      render: (val) => (val ? val.slice(0, 10) : '-'),
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <h2>회원 관리</h2>
      </div>

      {/* 등급 필터 */}
      <div className="admin-filter-tabs">
        <button
          className={`admin-filter-tab ${roleFilter === 'all' ? 'active' : ''}`}
          onClick={() => setRoleFilter('all')}
        >
          전체 등급<span className="admin-filter-count">({users.length})</span>
        </button>
        {ROLE_OPTIONS.map((opt) => {
          const count = users.filter((u) => resolveRole(u) === opt.value).length;
          if (count === 0) return null;
          return (
            <button
              key={opt.value}
              className={`admin-filter-tab ${roleFilter === opt.value ? 'active' : ''}`}
              onClick={() => setRoleFilter(opt.value)}
            >
              {opt.label}<span className="admin-filter-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 방문 가입 사이트 필터 */}
      {siteNames.length > 1 && (
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-tab ${siteFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSiteFilter('all')}
          >
            전체 사이트<span className="admin-filter-count">({filtered.length})</span>
          </button>
          {siteNames.map((name) => {
            const count = users.filter(
              (u) => getSiteName(u.signup_domain) === name
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={name}
                className={`admin-filter-tab ${siteFilter === name ? 'active' : ''}`}
                onClick={() => setSiteFilter(name)}
              >
                {name === '-' ? '미설정' : name}
                <span className="admin-filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKeys={['display_name', 'email', 'signup_domain']}
      />
    </>
  );
};

export default AdminUsers;
