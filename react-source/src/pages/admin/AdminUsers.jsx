import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllUsers } from '../../utils/adminStorage';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

const getDomain = (email) => {
  if (!email) return '기타';
  const parts = email.split('@');
  return parts.length > 1 ? parts[1].toLowerCase() : '기타';
};

/** 상위 도메인(TLD 유형) 분류 */
const getDomainType = (domain) => {
  if (!domain || domain === '기타') return { type: '기타', color: 'gray' };
  const d = domain.toLowerCase();
  if (d.endsWith('.ac.kr')) return { type: '교육기관', color: 'blue' };
  if (d.endsWith('.edu')) return { type: '교육기관', color: 'blue' };
  if (d.endsWith('.go.kr')) return { type: '정부기관', color: 'red' };
  if (d.endsWith('.gov')) return { type: '정부기관', color: 'red' };
  if (d.endsWith('.co.kr')) return { type: '기업', color: 'purple' };
  if (d.endsWith('.or.kr')) return { type: '기관/단체', color: 'green' };
  if (d.endsWith('.org')) return { type: '기관/단체', color: 'green' };
  if (d.endsWith('.com') || d.endsWith('.net')) return { type: '글로벌', color: 'yellow' };
  if (d.endsWith('.kr')) return { type: '한국', color: 'green' };
  return { type: '기타', color: 'gray' };
};

/** 하위 도메인(서비스명) 추출 — 예: kakao.com → kakao, kyonggi.ac.kr → kyonggi */
const getSubdomain = (domain) => {
  if (!domain || domain === '기타') return '-';
  const parts = domain.split('.');
  return parts[0];
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

  /** 상위 도메인 유형 목록 (필터용) */
  const domainTypes = useMemo(() => {
    const types = [...new Set(users.map((u) => getDomainType(getDomain(u.email)).type))];
    const order = ['글로벌', '교육기관', '기업', '정부기관', '기관/단체', '한국', '기타'];
    return order.filter(t => types.includes(t));
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (filter !== 'all') {
      list = list.filter((u) => (u.provider || 'email') === filter);
    }
    if (domainFilter !== 'all') {
      // domainFilter가 상위 도메인 유형(교육기관 등)인지, 개별 도메인(kakao.com 등)인지 구분
      const isType = domainTypes.includes(domainFilter);
      if (isType) {
        list = list.filter((u) => getDomainType(getDomain(u.email)).type === domainFilter);
      } else {
        list = list.filter((u) => getDomain(u.email) === domainFilter);
      }
    }
    return list;
  }, [users, filter, domainFilter, domainTypes]);

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
      label: '하위도메인',
      width: '110px',
      render: (val) => {
        const d = getDomain(val);
        const sub = getSubdomain(d);
        const colorMap = { gmail: 'blue', kakao: 'yellow', naver: 'green', daum: 'yellow', hanmail: 'yellow' };
        return <span className={`td-badge ${colorMap[sub] || 'gray'}`}>{sub}</span>;
      }
    },
    {
      key: 'email',
      label: '상위도메인',
      width: '100px',
      render: (val) => {
        const d = getDomain(val);
        const info = getDomainType(d);
        return <span className={`td-badge ${info.color}`}>{info.type}</span>;
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
      {/* 상위 도메인 유형 필터 */}
      {domainTypes.length > 1 && (
        <div className="admin-filter-tabs">
          <button className={`admin-filter-tab ${domainFilter === 'all' ? 'active' : ''}`} onClick={() => setDomainFilter('all')}>
            전체 도메인<span className="admin-filter-count">({users.filter((u) => filter === 'all' || (u.provider || 'email') === filter).length})</span>
          </button>
          {domainTypes.map((type) => {
            const count = users.filter((u) => getDomainType(getDomain(u.email)).type === type && (filter === 'all' || (u.provider || 'email') === filter)).length;
            if (count === 0) return null;
            return (
              <button key={type} className={`admin-filter-tab ${domainFilter === type ? 'active' : ''}`} onClick={() => setDomainFilter(type)}>
                {type}<span className="admin-filter-count">({count})</span>
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
