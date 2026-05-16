import { STATUS_OPTIONS, ROLE_OPTIONS } from '../../../constants/adminConstants';
import { getUserSiteNames } from '../../../utils/userHelpers';

interface UserFilterBarProps {
  users: any[];
  siteNames: string[];
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  siteFilter: string;
  setSiteFilter: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  paidIds: Set<string>;
  couponIds: Set<string>;
  filteredCount: number;
  resolveRole: (user: any) => string;
}

const UserFilterBar = ({
  users,
  siteNames,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  siteFilter,
  setSiteFilter,
  paymentFilter,
  setPaymentFilter,
  paidIds,
  couponIds,
  filteredCount,
  resolveRole,
}: UserFilterBarProps) => {
  const hasFilter = statusFilter !== 'all' || roleFilter !== 'all' || siteFilter !== 'all' || paymentFilter !== 'all';

  return (
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
      {hasFilter && (
        <button
          className="admin-row-btn"
          onClick={() => { setStatusFilter('all'); setRoleFilter('all'); setSiteFilter('all'); setPaymentFilter('all'); }}
        >
          필터 초기화
        </button>
      )}

      <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-light)' }}>
        {filteredCount !== users.length
          ? <><strong style={{ color: 'var(--text-primary)' }}>{filteredCount}</strong> / {users.length}명</>
          : <><strong style={{ color: 'var(--text-primary)' }}>{users.length}</strong>명</>
        }
      </span>
    </div>
  );
};

export default UserFilterBar;
