import { useState, useEffect, useMemo, useCallback } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import {
  getAllUsers,
  updateUserRole,
  addVisitedSite,
  updateUserStatus,
  adminUpdateUserProfile,
  deleteUser,
} from '../../utils/adminStorage';
import { ADMIN_EMAILS } from '../../config/admin';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

const ROLE_OPTIONS = [
  { value: 'admin', label: '관리자', color: 'red' },
  { value: 'superadmin', label: '최고관리자', color: 'red' },
  { value: 'evaluator', label: '평가자', color: 'purple' },
  { value: 'user', label: '일반회원', color: 'blue' },
];

const SITE_OPTIONS = [
  // 핵심 사이트
  { value: 'www.dreamitbiz.com', label: 'www', color: 'yellow' },
  { value: 'hohai.dreamitbiz.com', label: 'hohai', color: 'blue' },
  { value: 'books.dreamitbiz.com', label: 'books', color: 'green' },
  { value: 'docs.dreamitbiz.com', label: 'docs', color: 'green' },
  { value: 'papers.dreamitbiz.com', label: 'papers', color: 'purple' },
  { value: 'pbi.dreamitbiz.com', label: 'pbi', color: 'yellow' },
  { value: 'aebon.dreamitbiz.com', label: 'aebon', color: 'blue' },
  // AI Hub & AI 학습 사이트 (11개)
  { value: 'ai-hub.dreamitbiz.com', label: 'ai-hub', color: 'red' },
  { value: 'chatgpt.dreamitbiz.com', label: 'chatgpt', color: 'green' },
  { value: 'gemini.dreamitbiz.com', label: 'gemini', color: 'blue' },
  { value: 'genspark.dreamitbiz.com', label: 'genspark', color: 'purple' },
  { value: 'claude.dreamitbiz.com', label: 'claude', color: 'yellow' },
  { value: 'openclaw.dreamitbiz.com', label: 'openclaw', color: 'green' },
  { value: 'aI-agents.dreamitbiz.com', label: 'aI-agents', color: 'red' },
  { value: 'ai-media.dreamitbiz.com', label: 'ai-media', color: 'purple' },
  { value: 'autowork.dreamitbiz.com', label: 'autowork', color: 'blue' },
  { value: 'fine-tuning.dreamitbiz.com', label: 'fine-tuning', color: 'green' },
  // AI/데이터
  { value: 'ai-prompt.dreamitbiz.com', label: 'ai-prompt', color: 'purple' },
  { value: 'ai-data.dreamitbiz.com', label: 'ai-data', color: 'purple' },
  // 교육 플랫폼
  { value: 'edu-hub.dreamitbiz.com', label: 'edu-hub', color: 'purple' },
  { value: 'allthat.dreamitbiz.com', label: 'allthat', color: 'green' },
  { value: 'koreatech.dreamitbiz.com', label: 'koreatech', color: 'purple' },
  { value: 'koreait.dreamitbiz.com', label: 'koreait', color: 'blue' },
  { value: 'competency.dreamitbiz.com', label: 'competency', color: 'purple' },
  { value: 'teaching.dreamitbiz.com', label: 'teaching', color: 'green' },
  // 프로그래밍 교육
  { value: 'coding.dreamitbiz.com', label: 'coding', color: 'blue' },
  { value: 'html.dreamitbiz.com', label: 'html', color: 'blue' },
  { value: 'python-study.dreamitbiz.com', label: 'python-study', color: 'blue' },
  { value: 'java-study.dreamitbiz.com', label: 'java-study', color: 'red' },
  { value: 'c-study.dreamitbiz.com', label: 'c-study', color: 'blue' },
  { value: 'linux-study.dreamitbiz.com', label: 'linux-study', color: 'yellow' },
  { value: 'software.dreamitbiz.com', label: 'software', color: 'green' },
  // IT/자격증
  { value: 'eip.dreamitbiz.com', label: 'eip', color: 'red' },
  { value: 'sqld.dreamitbiz.com', label: 'sqld', color: 'purple' },
  { value: 'ahp-basic.dreamitbiz.com', label: 'ahp-basic', color: 'red' },
  { value: 'jobpath.dreamitbiz.com', label: 'jobpath', color: 'red' },
  { value: 'planning.dreamitbiz.com', label: 'planning', color: 'green' },
  // 비즈니스/마케팅
  { value: 'marketing.dreamitbiz.com', label: 'marketing', color: 'yellow' },
  { value: 'digitalbiz.dreamitbiz.com', label: 'digitalbiz', color: 'green' },
  { value: 'self-branding.dreamitbiz.com', label: 'self-branding', color: 'yellow' },
  { value: 'uxdesign.dreamitbiz.com', label: 'uxdesign', color: 'purple' },
  { value: 'career.dreamitbiz.com', label: 'career', color: 'green' },
  // 어학
  { value: 'english.dreamitbiz.com', label: 'english', color: 'blue' },
  { value: 'japanese.dreamitbiz.com', label: 'japanese', color: 'red' },
  { value: 'korean.dreamitbiz.com', label: 'korean', color: 'green' },
  // 기타
  { value: 'reserve.dreamitbiz.com', label: 'reserve', color: 'red' },
  { value: 'algorithm.dreamitbiz.com', label: 'algorithm', color: 'blue' },
  { value: 'webstudy.dreamitbiz.com', label: 'webstudy', color: 'green' },
  { value: 'reactstudy.dreamitbiz.com', label: 'reactstudy', color: 'blue' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: '정상', color: 'green' },
  { value: 'banned', label: '차단', color: 'red' },
  { value: 'deleted', label: '탈퇴', color: 'gray' },
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
    www: 'yellow', hohai: 'blue', books: 'green', docs: 'green',
    papers: 'purple', pbi: 'yellow', aebon: 'blue',
    'ai-hub': 'red', chatgpt: 'green', gemini: 'blue', genspark: 'purple',
    claude: 'yellow', openclaw: 'green', 'aI-agents': 'red',
    'ai-media': 'purple', autowork: 'blue', 'fine-tuning': 'green',
    'ai-prompt': 'purple', 'ai-data': 'purple',
    'edu-hub': 'purple', allthat: 'green', koreatech: 'purple',
    koreait: 'blue', competency: 'purple', teaching: 'green',
    coding: 'blue', html: 'blue', 'python-study': 'blue',
    'java-study': 'red', 'c-study': 'blue', 'linux-study': 'yellow',
    software: 'green', eip: 'red', sqld: 'purple', 'ahp-basic': 'red',
    jobpath: 'red', planning: 'green',
    marketing: 'yellow', digitalbiz: 'green', 'self-branding': 'yellow',
    uxdesign: 'purple', career: 'green',
    english: 'blue', japanese: 'red', korean: 'green',
    reserve: 'red', algorithm: 'blue', webstudy: 'green',
    reactstudy: 'blue', localhost: 'gray',
  };
  return colorMap[siteName] || 'gray';
};

/** 유저의 실제 role 결정 (ADMIN_EMAILS이면 admin 강제) */
const resolveRole = (user) => {
  if (ADMIN_EMAILS.includes((user.email || '').toLowerCase())) return 'admin';
  return user.role || 'user';
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

  const handleAddSite = useCallback(async (userId, domain) => {
    // 즉시 UI 반영
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const current = Array.isArray(u.visited_sites) ? u.visited_sites : [];
        if (current.includes(domain)) return u;
        return { ...u, visited_sites: [...current, domain] };
      })
    );
    const result = await addVisitedSite(userId, domain);
    if (result.error) {
      alert('사이트 추가 실패: ' + result.error);
      // 롤백
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          return { ...u, visited_sites: (u.visited_sites || []).filter((d) => d !== domain) };
        })
      );
    }
  }, []);

  // 액션 열기
  const openAction = (user, type) => {
    setActionTarget({ user, type });
    setActionLoading(false);
    if (type === 'edit') setEditName(user.display_name || '');
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

  /** 유저의 visited_sites 배열에서 사이트 이름 목록 추출 */
  const getUserSiteNames = (user) => {
    const sites = user.visited_sites;
    if (Array.isArray(sites) && sites.length > 0) {
      return sites.map(getSiteName);
    }
    // visited_sites 비어있으면 signup_domain 폴백
    const name = getSiteName(user.signup_domain);
    return name !== '-' ? [name] : [];
  };

  const siteNames = useMemo(() => {
    const nameSet = new Set<string>();
    let hasEmpty = false;
    users.forEach((u) => {
      const names = getUserSiteNames(u);
      if (names.length === 0) {
        hasEmpty = true;
      } else {
        names.forEach((n) => nameSet.add(n));
      }
    });
    const sorted = [...nameSet].sort();
    return hasEmpty ? [...sorted, '-'] : sorted;
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (siteFilter !== 'all') {
      list = list.filter((u) => {
        const names = getUserSiteNames(u);
        if (siteFilter === '-') return names.length === 0;
        return names.includes(siteFilter);
      });
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
    { key: 'id', label: 'ID', width: '60px' },
    {
      key: 'name',
      label: '실명',
      width: '100px',
      render: (val, row) => val || row.display_name || '-',
    },
    { key: 'email', label: '이메일' },
    {
      key: 'phone',
      label: '전화번호',
      width: '130px',
      render: (val) => val || <span style={{ color: 'var(--text-light)' }}>-</span>,
    },
    {
      key: 'name',
      label: '프로필',
      width: '70px',
      render: (val, row) => {
        const hasName = !!(val || row.display_name);
        const hasPhone = !!row.phone;
        if (hasName && hasPhone) return <span className="td-badge green">완료</span>;
        return <span className="td-badge yellow">미완성</span>;
      },
    },
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
      width: '90px',
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
      key: 'visited_sites',
      label: '가입 사이트',
      width: '200px',
      render: (val, row) => {
        const sites = Array.isArray(val) && val.length > 0
          ? val
          : row.signup_domain ? [row.signup_domain] : [];
        const remaining = SITE_OPTIONS.filter((opt) => !sites.includes(opt.value));
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
            {sites.map((domain) => {
              const name = getSiteName(domain);
              const color = getSiteColor(name);
              return (
                <span key={domain} className={`td-badge ${color}`}>{name}</span>
              );
            })}
            {remaining.length > 0 && (
              <select
                className="role-select"
                style={{ width: '40px', minWidth: '40px', padding: '1px 2px', fontSize: '11px' }}
                value=""
                onChange={(e) => {
                  if (e.target.value) handleAddSite(row.id, e.target.value);
                }}
              >
                <option value="">+</option>
                {remaining.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>
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
      width: '110px',
      render: (val) => (val ? val.slice(0, 10) : '-'),
    },
    {
      key: 'last_sign_in_at',
      label: '최종 로그인',
      width: '140px',
      render: (val) => {
        if (!val) return <span style={{ color: 'var(--text-light)' }}>-</span>;
        const d = new Date(val);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const dateStr = val.slice(0, 10);
        const timeStr = val.slice(11, 16);
        let ago = '';
        if (diffDays === 0) ago = '오늘';
        else if (diffDays === 1) ago = '어제';
        else if (diffDays < 7) ago = `${diffDays}일 전`;
        else if (diffDays < 30) ago = `${Math.floor(diffDays / 7)}주 전`;
        else if (diffDays < 365) ago = `${Math.floor(diffDays / 30)}개월 전`;
        else ago = `${Math.floor(diffDays / 365)}년 전`;
        return (
          <span title={`${dateStr} ${timeStr}`} style={{ fontSize: '12px' }}>
            {dateStr}
            <br />
            <span style={{ color: diffDays > 30 ? '#dc2626' : 'var(--text-light)', fontSize: '11px' }}>
              {ago}
            </span>
          </span>
        );
      },
    },
    {
      key: 'last_active_at',
      label: '최종 활동',
      width: '140px',
      render: (val) => {
        if (!val) return <span style={{ color: 'var(--text-light)' }}>-</span>;
        const d = new Date(val);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const dateStr = val.slice(0, 10);
        const timeStr = val.slice(11, 16);
        let ago = '';
        if (diffDays === 0) ago = '오늘';
        else if (diffDays === 1) ago = '어제';
        else if (diffDays < 7) ago = `${diffDays}일 전`;
        else if (diffDays < 30) ago = `${Math.floor(diffDays / 7)}주 전`;
        else if (diffDays < 365) ago = `${Math.floor(diffDays / 30)}개월 전`;
        else ago = `${Math.floor(diffDays / 365)}년 전`;
        return (
          <span title={`${dateStr} ${timeStr}`} style={{ fontSize: '12px' }}>
            {dateStr}
            <br />
            <span style={{ color: diffDays > 30 ? '#dc2626' : 'var(--text-light)', fontSize: '11px' }}>
              {ago}
            </span>
          </span>
        );
      },
    },
  ];

  // 액션 버튼 렌더러
  const renderActions = (row) => {
    if (isProtectedAdmin(row)) return null;
    const status = row.status || 'active';

    if (status === 'banned') {
      return (
        <div className="admin-row-actions">
          <button className="admin-row-btn" onClick={() => handleRestore(row)}>해제</button>
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
            {type === 'ban' && '접근 차단'}
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
              {actionLoading ? '처리 중...' : '차단 적용'}
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

      {/* 가입 사이트 필터 */}
      {siteNames.length > 1 && (
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-tab ${siteFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSiteFilter('all')}
          >
            전체 사이트<span className="admin-filter-count">({filtered.length})</span>
          </button>
          {siteNames.map((name) => {
            const count = users.filter((u) => {
              const names = getUserSiteNames(u);
              if (name === '-') return names.length === 0;
              return names.includes(name);
            }).length;
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
        searchKeys={['name', 'display_name', 'email', 'phone']}
        actions={renderActions}
        pageSize={10}
      />
    </>
  );
};

export default AdminUsers;
