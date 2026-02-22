import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllUsers } from '../../utils/adminStorage';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filtered = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter((u) => (u.provider || 'email') === filter);
  }, [users, filter]);

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
