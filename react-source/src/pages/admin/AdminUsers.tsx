import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { downloadCSV } from '../../utils/csv';
import { resolveRole, isProtectedAdmin, getUserSiteNames } from '../../utils/userHelpers';
import { getSiteName } from '../../constants/sites';

import UserStatsBox from '../../components/admin/users/UserStatsBox';
import UserSiteFilterBar from '../../components/admin/users/UserSiteFilterBar';
import UserFilterBar from '../../components/admin/users/UserFilterBar';
import UserBulkActions from '../../components/admin/users/UserBulkActions';
import UserActionModal from '../../components/admin/users/UserActionModal';
import { useUserColumns } from '../../components/admin/users/useUserColumns';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [couponIds, setCouponIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statFilter, setStatFilter] = useState('all');

  // ID 보기 토글
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
    if (!window.confirm(`${selectedIds.size}명��� 소프트 삭제(탈퇴 처리)하시겠습니까?`)) return;
    setBulkLoading(true);
    await Promise.allSettled([...selectedIds].map(id => updateUserStatus(id, 'deleted', '관리자 일괄 탈퇴 처리')));
    setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: 'deleted' } : u));
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  // 액션 패널 상태
  const [actionTarget, setActionTarget] = useState<{ user: any; type: 'edit' | 'ban' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
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

  const handleRoleChange = useCallback(async (userId: string, newRole: string) => {
    const oldRole = users.find((u) => u.id === userId)?.role;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    const result = await updateUserRole(userId, newRole);
    if (result.error) {
      alert('등급 변경 실패: ' + result.error);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: oldRole } : u)));
    }
  }, [users]);

  const handleAddSite = useCallback(async (userId: string, domain: string) => {
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
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          return { ...u, visited_sites: (u.visited_sites || []).filter((d: string) => d !== domain) };
        })
      );
    }
  }, []);

  const handleRemoveSite = useCallback(async (userId: string, domain: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, visited_sites: (u.visited_sites || []).filter((d: string) => d !== domain) };
      })
    );
    const result = await removeVisitedSite(userId, domain);
    if (result.error) {
      alert('사이트 제거 실패: ' + result.error);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const current = Array.isArray(u.visited_sites) ? u.visited_sites : [];
          return { ...u, visited_sites: [...current, domain] };
        })
      );
    }
  }, []);

  const openAction = (user: any, type: string) => {
    setActionTarget({ user, type: type as 'edit' | 'ban' });
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

  const handleRestore = async (user: any) => {
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

  const handleDelete = async (user: any) => {
    const choice = window.confirm(
      `${user.display_name || user.email} 회원을 삭제합니다.\n\n` +
      `[확인] = 소프트 삭제 (기록 보존, 상태만 '탈퇴'�� 변경)\n` +
      `소프트 삭제 후 완전 삭제가 필요하면 탈퇴 상태에서 다시 삭제 버튼을 누르세요.`
    );
    if (!choice) return;

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

    if (statFilter !== 'all') {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      switch (statFilter) {
        case 'today':
          list = list.filter((u) => u.created_at?.slice(0, 10) === todayStr);
          break;
        case 'week':
          list = list.filter((u) => u.created_at && new Date(u.created_at) >= weekAgo);
          break;
        case 'month':
          list = list.filter((u) => u.created_at && new Date(u.created_at) >= monthStart);
          break;
        case 'active':
          list = list.filter((u) => (u.status || 'active') === 'active');
          break;
        case 'paid':
          list = list.filter((u) => paidIds.has(u.id));
          break;
        case 'coupon':
          list = list.filter((u) => couponIds.has(u.id));
          break;
      }
    }

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
  }, [users, siteFilter, roleFilter, statusFilter, paymentFilter, statFilter, paidIds, couponIds]);

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

  const { columns, renderActions } = useUserColumns({
    visibleIds,
    toggleId,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    filtered,
    paidIds,
    couponIds,
    handleRoleChange,
    handleAddSite,
    handleRemoveSite,
    handleRestore,
    handleDelete,
    openAction,
  });

  const handleStatFilterChange = (key: string) => {
    setStatFilter(key === 'all' ? 'all' : (statFilter === key ? 'all' : key));
    setSiteFilter('all');
    setRoleFilter('all');
    setStatusFilter('all');
    setPaymentFilter('all');
  };

  return (
    <>
      {/* 헤더 */}
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

      <UserStatsBox
        stats={stats}
        statFilter={statFilter}
        siteFilter={siteFilter}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        onStatFilterChange={handleStatFilterChange}
      />

      <UserSiteFilterBar
        siteNames={siteNames}
        siteFilter={siteFilter}
        setSiteFilter={setSiteFilter}
        users={users}
        loading={loading}
      />

      <UserFilterBar
        users={users}
        siteNames={siteNames}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        siteFilter={siteFilter}
        setSiteFilter={setSiteFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        paidIds={paidIds}
        couponIds={couponIds}
        filteredCount={filtered.length}
        resolveRole={resolveRole}
      />

      <UserBulkActions
        selectedCount={selectedIds.size}
        bulkRole={bulkRole}
        setBulkRole={setBulkRole}
        bulkLoading={bulkLoading}
        onBulkRoleChange={handleBulkRoleChange}
        onBulkBan={handleBulkBan}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds(new Set())}
      />

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

      <UserActionModal
        actionTarget={actionTarget}
        actionLoading={actionLoading}
        editName={editName}
        setEditName={setEditName}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        banReason={banReason}
        setBanReason={setBanReason}
        onEdit={handleEdit}
        onBan={handleBan}
        onClose={closeAction}
      />
    </>
  );
};

export default AdminUsers;
