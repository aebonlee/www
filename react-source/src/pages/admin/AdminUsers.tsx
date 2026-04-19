import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import {
  getAllUsers,
  getPaidUserIds,
  getCouponUserIds,
  updateUserRole,
  addVisitedSite,
  removeVisitedSite,
  updateUserStatus,
  adminUpdateUserProfile,
  deleteUser,
} from '../../utils/adminStorage';
import { ADMIN_EMAILS } from '../../config/admin';

const PROVIDER_LABELS = { google: 'Google', kakao: 'Kakao', email: 'Email' };

function downloadCSV(rows: Record<string, any>[], filename: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const body = rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const ROLE_OPTIONS = [
  { value: 'member', label: '일반회원', color: 'blue' },
  { value: 'admin', label: '관리자', color: 'red' },
  { value: 'superadmin', label: '최고관리자', color: 'red' },
  { value: 'evaluator', label: '평가자', color: 'purple' },
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
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [couponIds, setCouponIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all'); // all | paid | coupon

  // ID 보기 토글 (행별)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const toggleId = (id: string) => setVisibleIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRole, setBulkRole] = useState('member');
  const [bulkLoading, setBulkLoading] = useState(false);

  const toggleSelect = (id: string) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleSelectAll = () => {
    const selectableIds = filtered.filter(u => !isProtectedAdmin(u)).map(u => u.id);
    if (selectableIds.every(id => selectedIds.has(id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableIds));
    }
  };

  const handleBulkRoleChange = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`${selectedIds.size}명의 등급을 '${bulkRole}'로 변경하시겠습니까?`)) return;
    setBulkLoading(true);
    await Promise.allSettled([...selectedIds].map(id => updateUserRole(id, bulkRole)));
    setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, role: bulkRole } : u));
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  const handleBulkBan = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`${selectedIds.size}명을 일괄 차단하시겠습니까?`)) return;
    setBulkLoading(true);
    await Promise.allSettled([...selectedIds].map(id => updateUserStatus(id, 'banned', '관리자 일괄 차단')));
    setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: 'banned' } : u));
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`${selectedIds.size}명을 소프트 삭제(탈퇴 처리)하시겠습니까?`)) return;
    setBulkLoading(true);
    await Promise.allSettled([...selectedIds].map(id => updateUserStatus(id, 'deleted', '관리자 일괄 탈퇴 처리')));
    setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: 'deleted' } : u));
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  // 액션 패널 상태
  const [actionTarget, setActionTarget] = useState(null); // { user, type }
  const [actionLoading, setActionLoading] = useState(false);

  // 수정 폼
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // 차단 폼
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    Promise.all([getAllUsers(), getPaidUserIds(), getCouponUserIds()]).then(([data, paid, coupon]) => {
      setUsers(data);
      setPaidIds(paid);
      setCouponIds(coupon);
      setLoading(false);
    });
  }, []);

  const handleRefreshData = useCallback(() => {
    setLoading(true);
    Promise.all([getAllUsers(), getPaidUserIds(), getCouponUserIds()]).then(([data, paid, coupon]) => {
      setUsers(data);
      setPaidIds(paid);
      setCouponIds(coupon);
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

  const handleRemoveSite = useCallback(async (userId: string, domain: string) => {
    // 즉시 UI 반영
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, visited_sites: (u.visited_sites || []).filter((d: string) => d !== domain) };
      })
    );
    const result = await removeVisitedSite(userId, domain);
    if (result.error) {
      alert('사이트 제거 실패: ' + result.error);
      // 롤백 (다시 추가)
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const current = Array.isArray(u.visited_sites) ? u.visited_sites : [];
          return { ...u, visited_sites: [...current, domain] };
        })
      );
    }
  }, []);

  // 액션 열기
  const openAction = (user, type) => {
    setActionTarget({ user, type });
    setActionLoading(false);
    if (type === 'edit') {
      setEditName(user.display_name || '');
      setEditPhone(user.phone || '');
    }
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
    const result = await adminUpdateUserProfile(actionTarget.user.id, editName, editPhone);
    if (result.error) {
      alert('프로필 수정 실패: ' + result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === actionTarget.user.id ? { ...u, display_name: editName, phone: editPhone } : u)
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
    if (paymentFilter === 'paid') {
      list = list.filter((u) => paidIds.has(u.id));
    } else if (paymentFilter === 'coupon') {
      list = list.filter((u) => couponIds.has(u.id));
    }
    return list;
  }, [users, siteFilter, roleFilter, statusFilter, paymentFilter, paidIds, couponIds]);

  const columns = [
    {
      key: 'id',
      label: (
        <input
          type="checkbox"
          style={{ cursor: 'pointer' }}
          checked={filtered.filter(u => !isProtectedAdmin(u)).length > 0 &&
            filtered.filter(u => !isProtectedAdmin(u)).every(u => selectedIds.has(u.id))}
          onChange={toggleSelectAll}
          title="전체 선택"
        />
      ),
      width: '40px',
      render: (val, row) => isProtectedAdmin(row) ? null : (
        <input
          type="checkbox"
          checked={selectedIds.has(val)}
          onChange={() => toggleSelect(val)}
          onClick={e => e.stopPropagation()}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      key: 'id',
      label: 'ID',
      width: '100px',
      render: (val) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
          {visibleIds.has(val) && (
            <span style={{
              fontSize: '9px', color: 'var(--text-light)', wordBreak: 'break-all',
              fontFamily: 'monospace', lineHeight: 1.4,
            }}>
              {val}
            </span>
          )}
          <button
            className="admin-row-btn"
            style={{ fontSize: '10px', padding: '1px 5px', height: 'auto', minWidth: 'unset' }}
            onClick={() => toggleId(val)}
          >
            {visibleIds.has(val) ? '숨김' : '보기'}
          </button>
        </div>
      ),
    },
    {
      key: 'display_name',
      label: '이름',
      width: '100px',
      render: (val, row) => val || row.name || '-',
    },
    { key: 'email', label: '이메일' },
    {
      key: 'phone',
      label: '전화번호',
      width: '130px',
      render: (val) => val || <span style={{ color: 'var(--text-light)' }}>-</span>,
    },
    {
      key: 'display_name',
      label: '프로필',
      width: '70px',
      render: (val, row) => {
        const hasName = !!(val || row.name);
        const hasPhone = !!row.phone;
        if (hasName && hasPhone) return <span className="td-badge green">완료</span>;
        return <span className="td-badge yellow">미완성</span>;
      },
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (val, row) => {
        const s = val || 'active';
        const opt = STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];
        const isPaid = paidIds.has(row.id);
        const isCoupon = couponIds.has(row.id);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
            <span className={`td-badge ${opt.color}`}>{opt.label}</span>
            {isPaid && (
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '1px 5px',
                background: '#fef3c7', color: '#92400e', borderRadius: '4px',
                border: '1px solid #fbbf24',
              }}>유료결제</span>
            )}
            {isCoupon && (
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '1px 5px',
                background: '#d1fae5', color: '#065f46', borderRadius: '4px',
                border: '1px solid #6ee7b7',
              }}>쿠폰</span>
            )}
          </div>
        );
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
      key: 'signup_domain',
      label: '가입처',
      width: '80px',
      render: (val) => {
        if (!val) return <span style={{ color: 'var(--text-light)' }}>-</span>;
        const name = getSiteName(val);
        const color = getSiteColor(name);
        return <span className={`td-badge ${color}`}>{name}</span>;
      },
    },
    {
      key: 'visited_sites',
      label: '방문 사이트',
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
              const isSignupSite = domain === row.signup_domain;
              return (
                <span
                  key={domain}
                  className={`td-badge ${color}`}
                  title={isSignupSite ? '최초 가입 사이트' : domain}
                  style={{
                    ...(isSignupSite ? { fontWeight: 700, outline: '1px solid currentColor' } : undefined),
                    display: 'inline-flex', alignItems: 'center', gap: '2px',
                  }}
                >
                  {name}{isSignupSite ? '*' : ''}
                  {!isSignupSite && (
                    <button
                      onClick={e => { e.stopPropagation(); handleRemoveSite(row.id, domain); }}
                      title={`${name} 제거`}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0 1px', lineHeight: 1, color: 'inherit',
                        fontSize: '11px', opacity: 0.7,
                      }}
                    >×</button>
                  )}
                </span>
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
    const status = row.status || 'active';

    if (isProtectedAdmin(row)) {
      return (
        <div className="admin-row-actions" style={{ flexDirection: 'column', gap: '4px' }}>
          <Link to={`/admin/users/${row.id}`} className="admin-row-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>상세</Link>
        </div>
      );
    }

    if (status === 'banned') {
      return (
        <div className="admin-row-actions" style={{ flexDirection: 'column', gap: '4px' }}>
          <Link to={`/admin/users/${row.id}`} className="admin-row-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>상세</Link>
          <button className="admin-row-btn" onClick={() => handleRestore(row)}>해제</button>
          <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>삭제</button>
        </div>
      );
    }

    if (status === 'deleted') {
      return (
        <div className="admin-row-actions" style={{ flexDirection: 'column', gap: '4px' }}>
          <Link to={`/admin/users/${row.id}`} className="admin-row-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>상세</Link>
          <button className="admin-row-btn" onClick={() => handleRestore(row)}>복구</button>
          <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>완전삭제</button>
        </div>
      );
    }

    return (
      <div className="admin-row-actions" style={{ flexDirection: 'column', gap: '4px' }}>
        <Link to={`/admin/users/${row.id}`} className="admin-row-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>상세</Link>
        <button className="admin-row-btn" onClick={() => openAction(row, 'edit')}>수정</button>
        <button className="admin-row-btn danger" onClick={() => openAction(row, 'ban')}>차단</button>
        <button className="admin-row-btn danger" onClick={() => handleDelete(row)}>삭제</button>
      </div>
    );
  };

  // 액션 모달 렌더 (fixed overlay)
  const renderActionPanel = () => {
    if (!actionTarget) return null;
    const { user, type } = actionTarget;

    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={closeAction}
      >
        <div
          style={{
            background: 'var(--bg-white, #fff)',
            borderRadius: '14px', padding: '28px',
            minWidth: '380px', maxWidth: '500px', width: '90%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                {type === 'edit' ? '프로필 수정' : '접근 차단'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--primary-blue, #2563eb)', fontWeight: 600, marginTop: '3px' }}>
                {user.display_name || user.email}
              </div>
            </div>
            <button
              onClick={closeAction}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--text-light)', lineHeight: 1, padding: '0 2px' }}
            >×</button>
          </div>

          {type === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>이름</label>
                <input
                  type="text"
                  className="admin-action-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="표시 이름"
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>전화번호</label>
                <input
                  type="tel"
                  className="admin-action-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="010-0000-0000"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button className="admin-row-btn" onClick={closeAction}>취소</button>
                <button
                  className="admin-row-btn"
                  style={{ background: 'var(--primary-blue, #2563eb)', color: '#fff', borderColor: 'var(--primary-blue, #2563eb)' }}
                  onClick={handleEdit}
                  disabled={actionLoading || !editName.trim()}
                >
                  {actionLoading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          )}

          {type === 'ban' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>차단 사유 (선택)</label>
                <input
                  type="text"
                  className="admin-action-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="차단 사유 입력"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button className="admin-row-btn" onClick={closeAction}>취소</button>
                <button
                  className="admin-row-btn danger"
                  style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
                  onClick={handleBan}
                  disabled={actionLoading}
                >
                  {actionLoading ? '처리 중...' : '차단 적용'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };


  // 기간별 통계 계산
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      today: users.filter((u) => u.created_at?.slice(0, 10) === todayStr).length,
      week: users.filter((u) => u.created_at && new Date(u.created_at) >= weekAgo).length,
      month: users.filter((u) => u.created_at && new Date(u.created_at) >= monthStart).length,
      total: users.length,
      active: users.filter((u) => (u.status || 'active') === 'active').length,
      paid: users.filter((u) => paidIds.has(u.id)).length,
      coupon: users.filter((u) => couponIds.has(u.id)).length,
    };
  }, [users, paidIds, couponIds]);

  return (
    <>
      {/* ── 헤더 ── */}
      <div className="admin-page-header">
        <h2>회원 관리</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="admin-row-btn"
            onClick={() => {
              const rows = filtered.map(u => ({
                id: u.id,
                display_name: u.display_name || u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                role: resolveRole(u),
                status: u.status || 'active',
                signup_domain: u.signup_domain || '',
                created_at: u.created_at || '',
              }));
              downloadCSV(rows, `users_${new Date().toISOString().slice(0, 10)}.csv`);
            }}
            disabled={loading || filtered.length === 0}
          >
            CSV 내보내기
          </button>
          <button className="admin-row-btn" onClick={handleRefreshData} disabled={loading}>
            {loading ? '로딩 중...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* ── 통계 박스 ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '12px',
        marginBottom: '20px',
        margin: '0 -70px 20px',
      }}>
        {[
          { label: '오늘 가입', value: stats.today, color: '#6366f1', bg: '#eef2ff' },
          { label: '이번 주', value: stats.week, color: '#0ea5e9', bg: '#f0f9ff' },
          { label: '이번 달', value: stats.month, color: '#10b981', bg: '#f0fdf4' },
          { label: '정상 회원', value: stats.active, color: '#f59e0b', bg: '#fffbeb' },
          { label: '유료 회원', value: stats.paid, color: '#92400e', bg: '#fef3c7' },
          { label: '쿠폰 사용', value: stats.coupon, color: '#047857', bg: '#d1fae5' },
          { label: '전체 회원', value: stats.total, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{
            background: 'var(--bg-card, #fff)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-light, #6b7280)', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
            <span style={{
              display: 'inline-block', marginTop: '4px',
              fontSize: '11px', background: bg, color, borderRadius: '4px',
              padding: '1px 6px', alignSelf: 'flex-start',
            }}>명</span>
          </div>
        ))}
      </div>

      {/* ── 사이트별 빠른 필터 버튼 ── */}
      {!loading && siteNames.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          marginBottom: '12px',
          margin: '0 -70px 12px',
          padding: '24px 32px',
          background: 'var(--bg-card, #fff)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: '10px',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-light)', alignSelf: 'center', marginRight: '8px', whiteSpace: 'nowrap' }}>
            사이트
          </span>
          <button
            className={`admin-row-btn${siteFilter === 'all' ? ' active' : ''}`}
            style={{ fontSize: '14px', padding: '3px 13px' }}
            onClick={() => setSiteFilter('all')}
          >
            전체 ({users.length})
          </button>
          {siteNames.filter((n) => n !== '-').map((name) => {
            const count = users.filter((u) => getUserSiteNames(u).includes(name)).length;
            const isActive = siteFilter === name;
            const color = getSiteColor(name);
            const colorMap: Record<string, string> = {
              red: '#dc2626', blue: '#2563eb', green: '#16a34a',
              purple: '#7c3aed', yellow: '#d97706', gray: '#6b7280',
            };
            const c = colorMap[color] || '#6b7280';
            return (
              <button
                key={name}
                onClick={() => setSiteFilter(isActive ? 'all' : name)}
                style={{
                  fontSize: '14px', padding: '3px 13px',
                  borderRadius: '8px', border: `1px solid ${isActive ? c : 'var(--border-color, #e5e7eb)'}`,
                  background: isActive ? c : 'transparent',
                  color: isActive ? '#fff' : c,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* ── 필터 바 ── */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        alignItems: 'center', marginBottom: '14px',
        margin: '0 -70px 14px',
        padding: '12px 32px',
        background: 'var(--bg-card, #fff)',
        border: '1px solid var(--border-color, #e5e7eb)',
        borderRadius: '10px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '4px' }}>필터</span>

        {/* 상태 */}
        <select
          className="role-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: '110px' }}
        >
          <option value="all">전체 상태 ({users.length})</option>
          {STATUS_OPTIONS.map((opt) => {
            const count = users.filter((u) => (u.status || 'active') === opt.value).length;
            return <option key={opt.value} value={opt.value}>{opt.label} ({count})</option>;
          })}
        </select>

        {/* 등급 */}
        <select
          className="role-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ minWidth: '120px' }}
        >
          <option value="all">전체 등급 ({users.length})</option>
          {ROLE_OPTIONS.map((opt) => {
            const count = users.filter((u) => resolveRole(u) === opt.value).length;
            if (count === 0) return null;
            return <option key={opt.value} value={opt.value}>{opt.label} ({count})</option>;
          })}
        </select>

        {/* 사이트 */}
        <select
          className="role-select"
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          style={{ minWidth: '140px' }}
        >
          <option value="all">전체 사이트 ({users.length})</option>
          {siteNames.map((name) => {
            const count = users.filter((u) => {
              const names = getUserSiteNames(u);
              if (name === '-') return names.length === 0;
              return names.includes(name);
            }).length;
            if (count === 0) return null;
            return (
              <option key={name} value={name}>
                {name === '-' ? '미설정' : name} ({count})
              </option>
            );
          })}
        </select>

        {/* 결제/쿠폰 */}
        <select
          className="role-select"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{ minWidth: '130px' }}
        >
          <option value="all">결제 전체 ({users.length})</option>
          <option value="paid">유료 회원 ({users.filter((u) => paidIds.has(u.id)).length})</option>
          <option value="coupon">쿠폰 사용 ({users.filter((u) => couponIds.has(u.id)).length})</option>
        </select>

        {/* 리셋 */}
        {(statusFilter !== 'all' || roleFilter !== 'all' || siteFilter !== 'all' || paymentFilter !== 'all') && (
          <button
            className="admin-row-btn"
            onClick={() => { setStatusFilter('all'); setRoleFilter('all'); setSiteFilter('all'); setPaymentFilter('all'); }}
          >
            필터 초기화
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-light)' }}>
          {filtered.length !== users.length
            ? <><strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> / {users.length}명</>
            : <><strong style={{ color: 'var(--text-primary)' }}>{users.length}</strong>명</>
          }
        </span>
      </div>

      {/* Bulk Actions 플로팅 바 */}
      {selectedIds.size > 0 && (
        <div style={{
          position: 'sticky', bottom: '16px', zIndex: 100,
          background: '#1e293b', color: '#fff',
          borderRadius: '10px', padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          marginBottom: '8px',
        }}>
          <span style={{ fontWeight: 600, marginRight: '4px' }}>{selectedIds.size}명 선택됨</span>
          <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
          <select
            value={bulkRole}
            onChange={e => setBulkRole(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '13px', border: 'none', background: '#334155', color: '#fff' }}
          >
            {[
              { value: 'member', label: '일반회원' },
              { value: 'evaluator', label: '평가자' },
              { value: 'admin', label: '관리자' },
            ].map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className="admin-row-btn"
            style={{ background: '#3B82F6', color: '#fff', borderColor: '#3B82F6' }}
            onClick={handleBulkRoleChange}
            disabled={bulkLoading}
          >
            등급 변경
          </button>
          <button
            className="admin-row-btn danger"
            style={{ background: '#DC2626', color: '#fff', borderColor: '#DC2626' }}
            onClick={handleBulkBan}
            disabled={bulkLoading}
          >
            일괄차단
          </button>
          <button
            className="admin-row-btn danger"
            style={{ background: '#7F1D1D', color: '#fff', borderColor: '#7F1D1D' }}
            onClick={handleBulkDelete}
            disabled={bulkLoading}
          >
            일괄삭제
          </button>
          <button
            className="admin-row-btn"
            style={{ marginLeft: 'auto', background: 'transparent', color: '#94a3b8', borderColor: '#475569' }}
            onClick={() => setSelectedIds(new Set())}
          >
            선택해제
          </button>
        </div>
      )}

      <div style={{ margin: '0 -70px' }}>
        <AdminDataTable
          columns={columns}
          data={filtered}
          loading={loading}
          searchKeys={['display_name', 'name', 'email', 'phone', 'signup_domain']}
          actions={renderActions}
          pageSize={20}
          showRowNumbers={true}
        />
      </div>

      {/* 수정/차단 모달 (fixed overlay) */}
      {renderActionPanel()}
    </>
  );
};

export default AdminUsers;
