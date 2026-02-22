import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllUsers } from '../../utils/adminStorage';
import { ADMIN_EMAILS } from '../../config/admin';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

/** signup_domain에서 사이트 이름 추출 — 예: hohai.dreamitbiz.com → hohai */
const getSiteName = (domain) => {
  if (!domain) return '-';
  const d = domain.toLowerCase();
  // dreamitbiz.com 하위 도메인 추출
  if (d.endsWith('.dreamitbiz.com')) {
    const sub = d.replace('.dreamitbiz.com', '');
    return sub || 'www';
  }
  // dreamitbiz.com 자체
  if (d === 'dreamitbiz.com' || d === 'www.dreamitbiz.com') return 'www';
  // localhost 등 개발환경
  if (d.includes('localhost') || d.includes('127.0.0.1')) return 'localhost';
  // 기타 도메인은 그대로
  return d;
};

/** 사이트별 뱃지 색상 */
const getSiteColor = (siteName) => {
  const colorMap = {
    hohai: 'blue',
    competency: 'green',
    'ahp-basic': 'purple',
    www: 'yellow',
    localhost: 'gray',
  };
  return colorMap[siteName] || 'gray';
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const providers = useMemo(() => {
    const provs = [...new Set(users.map((u) => u.provider || 'email'))];
    return provs;
  }, [users]);

  /** 가입 사이트(하위 도메인) 목록 */
  const siteNames = useMemo(() => {
    const names = [...new Set(users.map((u) => getSiteName(u.signup_domain)))];
    // 미설정('-')은 맨 뒤로
    return names.filter(n => n !== '-').sort().concat(names.includes('-') ? ['-'] : []);
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (filter !== 'all') {
      list = list.filter((u) => (u.provider || 'email') === filter);
    }
    if (siteFilter !== 'all') {
      list = list.filter((u) => getSiteName(u.signup_domain) === siteFilter);
    }
    return list;
  }, [users, filter, siteFilter]);

  const columns = [
    { key: 'id', label: 'ID', width: '80px' },
    {
      key: 'display_name',
      label: '이름',
      className: 'td-title',
      render: (val) => val || '-'
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
      }
    },
    {
      key: 'signup_domain',
      label: '가입 사이트',
      width: '140px',
      render: (val) => {
        const name = getSiteName(val);
        const color = getSiteColor(name);
        return <span className={`td-badge ${color}`}>{name}</span>;
      }
    },
    {
      key: 'role',
      label: '권한',
      width: '80px',
      render: (val, row) => {
        const isAdmin = val === 'admin' || ADMIN_EMAILS.includes((row.email || '').toLowerCase());
        return isAdmin
          ? <span className="td-badge red">관리자</span>
          : <span className="td-badge gray">일반</span>;
      }
    },
    {
      key: 'created_at',
      label: '가입일',
      render: (val) => val ? val.slice(0, 10) : '-'
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <h2>회원 관리</h2>
      </div>
      {/* 가입방법 필터 */}
      <div className="admin-filter-tabs">
        <button className={`admin-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          전체<span className="admin-filter-count">({users.length})</span>
        </button>
        {providers.map((prov) => {
          const count = users.filter((u) => (u.provider || 'email') === prov).length;
          return (
            <button key={prov} className={`admin-filter-tab ${filter === prov ? 'active' : ''}`} onClick={() => setFilter(prov)}>
              {PROVIDER_LABELS[prov] || prov}<span className="admin-filter-count">({count})</span>
            </button>
          );
        })}
      </div>
      {/* 가입 사이트(하위 도메인) 필터 */}
      {siteNames.length > 1 && (
        <div className="admin-filter-tabs">
          <button className={`admin-filter-tab ${siteFilter === 'all' ? 'active' : ''}`} onClick={() => setSiteFilter('all')}>
            전체 사이트<span className="admin-filter-count">({filtered.length})</span>
          </button>
          {siteNames.map((name) => {
            const count = users.filter((u) => getSiteName(u.signup_domain) === name && (filter === 'all' || (u.provider || 'email') === filter)).length;
            if (count === 0) return null;
            return (
              <button key={name} className={`admin-filter-tab ${siteFilter === name ? 'active' : ''}`} onClick={() => setSiteFilter(name)}>
                {name === '-' ? '미설정' : name}<span className="admin-filter-count">({count})</span>
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
