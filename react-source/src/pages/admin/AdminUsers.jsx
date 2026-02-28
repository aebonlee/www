import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import {
  getAllUsers,
  updateUserRole,
  updateUserSignupDomain,
  updateUserStatus,
  adminUpdateUserProfile,
  deleteUser,
} from '../../utils/adminStorage';
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

const STATUS_OPTIONS = [
  { value: 'active', label: '정상', color: 'green' },
  { value: 'suspended', label: '정지', color: 'yellow' },
  { value: 'banned', label: '차단', color: 'red' },
  { value: 'deleted', label: '탈퇴', color: 'gray' },
];

const SUSPEND_PRESETS = [
  { label: '1일', days: 1 },
  { label: '3일', days: 3 },
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
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

/** 유저가 최고관리자(ADMIN_EMAILS)인지 */
const isProtectedAdmin = (user) =>
  ADMIN_EMAILS.includes((user.email || '').toLowerCase());

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 액션 패널 상태
  const [actionTarget, setActionTarget] = useState(null); // { user, type }
  const [actionLoading, setActionLoading] = useState(false);

  // 수정 폼
  const [editName, setEditName] = useState('');

  // 정지 폼
  const [suspendDays, setSuspendDays] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  // 차단 폼
  const [banReason, setBanReason] = useState('');

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

  // 액션 열기
  const openAction = (user, type) => {
    setActionTarget({ user, type });
    setActionLoading(false);
    if (type === 'edit') setEditName(user.display_name || '');
    if (type === 'suspend') { setSuspendDays(null); setSuspendReason(''); }
    if (type === 'ban') setBanReason('');
  };

  const closeAction = () => {
    setActionTarget(null);
    setActionLoading(false);
  };

  // 수정 실행
  const handleEdit = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    const result = await adminUpdateUserProfile(actionTarget.user.id, editName);
    if (result.error) {
      alert('프로필 수정 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === actionTarget.user.id ? { ...u, display_name: editName } : u)
      );
      closeAction();
    }
    setActionLoading(false);
  };

  // 정지 실행
  const handleSuspend = async () => {
    if (!actionTarget || !suspendDays) return;
    setActionLoading(true);
    const until = new Date();
    until.setDate(until.getDate() + suspendDays);
    const result = await updateUserStatus(
      actionTarget.user.id, 'suspended', suspendReason || null, until.toISOString()
    );
    if (result.error) {
      alert('정지 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === actionTarget.user.id
          ? { ...u, status: 'suspended', suspended_until: until.toISOString(), status_reason: suspendReason }
          : u)
      );
      closeAction();
    }
    setActionLoading(false);
  };

  // 차단 실행
  const handleBan = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    const result = await updateUserStatus(actionTarget.user.id, 'banned', banReason || null);
    if (result.error) {
      alert('차단 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === actionTarget.user.id
          ? { ...u, status: 'banned', suspended_until: null, status_reason: banReason }
          : u)
      );
      closeAction();
    }
    setActionLoading(false);
  };

  // 복구 실행
  const handleRestore = async (user) => {
    if (!window.confirm(`${user.display_name || user.email} 회원을 정상 상태로 복구하시겠습니까?`)) return;
    const result = await updateUserStatus(user.id, 'active');
    if (result.error) {
      alert('복구 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === user.id
          ? { ...u, status: 'active', suspended_until: null, status_reason: null }
          : u)
      );
    }
  };

  // 삭제 실행
  const handleDelete = async (user) => {
    const choice = window.confirm(
      `${user.display_name || user.email} 회원을 삭제합니다.\n\n` +
      `[확인] = 소프트 삭제 (기록 보존, 상태만 '탈퇴'로 변경)\n` +
      `소프트 삭제 후 완전 삭제가 필요하면 탈퇴 상태에서 다시 삭제 버튼을 누르세요.`
    );
    if (!choice) return;

    // 이미 deleted 상태면 완전 삭제
    if ((user.status || 'active') === 'deleted') {
      const hardConfirm = window.confirm(
        '⚠️ 완전 삭제: 이 회원의 모든 데이터가 영구 삭제됩니다.\n정말 삭제하시겠습니까?'
      );
      if (!hardConfirm) return;
      const result = await deleteUser(user.id);
      if (result.error) {
        alert('완전 삭제 실패: ' + result.error);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
      return;
    }

    // 소프트 삭제
    const result = await updateUserStatus(user.id, 'deleted', '관리자에 의한 탈퇴 처리');
    if (result.error) {
      alert('소프트 삭제 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === user.id
          ? { ...u, status: 'deleted', suspended_until: null, status_reason: '관리자에 의한 탈퇴 처리' }
          : u)
      );
    }
  };

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
    if (statusFilter !== 'all') {
      list = list.filter((u) => (u.status || 'active') === statusFilter);
    }
    return list;
  }, [users, siteFilter, roleFilter, statusFilter]);

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
      key: 'status',
      label: '상태',
      width: '80px',
      render: (val) => {
        const s = val || 'active';
        const opt = STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];
        return <span className={`td-badge ${opt.color}`}>{opt.label}</span>;
      },
    },
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

  // 액션 버튼 렌더러
  const renderActions = (row) => {
    if (isProtectedAdmin(row)) return null;
    const status = row.status || 'active';

    if (status === 'suspended' || status === 'banned') {
      return (
        <div className="admin-row-actions">
          <button className="admin-row-btn" onClick={() => handleRestore(row)}>복구</button>
          <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>삭제</button>
        </div>
      );
    }

    if (status === 'deleted') {
      return (
        <div className="admin-row-actions">
          <button className="admin-row-btn" onClick={() => handleRestore(row)}>복구</button>
          <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>완전삭제</button>
        </div>
      );
    }

    return (
      <div className="admin-row-actions">
        <button className="admin-row-btn" onClick={() => openAction(row, 'edit')}>수정</button>
        <button className="admin-row-btn" onClick={() => openAction(row, 'suspend')}>정지</button>
        <button className="admin-row-btn danger" onClick={() => openAction(row, 'ban')}>차단</button>
        <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>삭제</button>
      </div>
    );
  };

  // 액션 패널 렌더
  const renderActionPanel = () => {
    if (!actionTarget) return null;
    const { user, type } = actionTarget;

    return (
      <div className="admin-user-action-panel">
        <div className="admin-user-action-panel-header">
          <strong>
            {type === 'edit' && '프로필 수정'}
            {type === 'suspend' && '기간 정지'}
            {type === 'ban' && '영구 차단'}
          </strong>
          <span className="admin-user-action-target">
            {user.display_name || user.email}
          </span>
          <button className="admin-row-btn" onClick={closeAction} style={{ marginLeft: 'auto' }}>닫기</button>
        </div>

        {type === 'edit' && (
          <div className="admin-user-action-body">
            <label>이름</label>
            <input
              type="text"
              className="admin-action-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="표시 이름"
            />
            <button
              className="admin-row-btn"
              onClick={handleEdit}
              disabled={actionLoading || !editName.trim()}
            >
              {actionLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        )}

        {type === 'suspend' && (
          <div className="admin-user-action-body">
            <label>정지 기간</label>
            <div className="admin-suspend-presets">
              {SUSPEND_PRESETS.map((p) => (
                <button
                  key={p.days}
                  className={`admin-row-btn ${suspendDays === p.days ? 'active' : ''}`}
                  onClick={() => setSuspendDays(p.days)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label>사유 (선택)</label>
            <input
              type="text"
              className="admin-action-input"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="정지 사유 입력"
            />
            <button
              className="admin-row-btn danger"
              onClick={handleSuspend}
              disabled={actionLoading || !suspendDays}
            >
              {actionLoading ? '처리 중...' : '정지 적용'}
            </button>
          </div>
        )}

        {type === 'ban' && (
          <div className="admin-user-action-body">
            <label>사유 (선택)</label>
            <input
              type="text"
              className="admin-action-input"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="차단 사유 입력"
            />
            <button
              className="admin-row-btn danger"
              onClick={handleBan}
              disabled={actionLoading}
            >
              {actionLoading ? '처리 중...' : '영구 차단'}
            </button>
          </div>
        )}
      </div>
    );
  };

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

      {/* 상태 필터 */}
      <div className="admin-filter-tabs">
        <button
          className={`admin-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          전체 상태<span className="admin-filter-count">({users.length})</span>
        </button>
        {STATUS_OPTIONS.map((opt) => {
          const count = users.filter((u) => (u.status || 'active') === opt.value).length;
          if (count === 0) return null;
          return (
            <button
              key={opt.value}
              className={`admin-filter-tab ${statusFilter === opt.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(opt.value)}
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

      {/* 액션 패널 */}
      {renderActionPanel()}

      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKeys={['display_name', 'email', 'signup_domain']}
        actions={renderActions}
      />
    </>
  );
};

export default AdminUsers;
