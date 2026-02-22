import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllUsers } from '../../utils/adminStorage';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

const getDomain = (email) => {
  if (!email) return '기타';
  const parts = email.split('@');
  return parts.length > 1 ? parts[1].toLowerCase() : '기타';
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

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

  const domains = useMemo(() => {
    const doms = [...new Set(users.map((u) => getDomain(u.email)))];
    return doms.sort();
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (filter !== 'all') {
      list = list.filter((u) => (u.provider || 'email') === filter);
    }
    if (domainFilter !== 'all') {
      list = list.filter((u) => getDomain(u.email) === domainFilter);
    }
    return list;
  }, [users, filter, domainFilter]);

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
      key: 'email',
      label: '도메인',
      width: '130px',
      render: (val) => {
        const d = getDomain(val);
        const colorMap = { 'gmail.com': 'blue', 'kakao.com': 'yellow', 'naver.com': 'green' };
        return <span className={`td-badge ${colorMap[d] || 'gray'}`}>{d}</span>;
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
      {domains.length > 1 && (
        <div className="admin-filter-tabs">
          <button className={`admin-filter-tab ${domainFilter === 'all' ? 'active' : ''}`} onClick={() => setDomainFilter('all')}>
            전체 도메인<span className="admin-filter-count">({users.filter((u) => filter === 'all' || (u.provider || 'email') === filter).length})</span>
          </button>
          {domains.map((dom) => {
            const count = users.filter((u) => getDomain(u.email) === dom && (filter === 'all' || (u.provider || 'email') === filter)).length;
            if (count === 0) return null;
            return (
              <button key={dom} className={`admin-filter-tab ${domainFilter === dom ? 'active' : ''}`} onClick={() => setDomainFilter(dom)}>
                @{dom}<span className="admin-filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      )}
      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKeys={['display_name', 'email']}
      />
    </>
  );
};

export default AdminUsers;
