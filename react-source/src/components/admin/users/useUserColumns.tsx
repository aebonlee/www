import { Link } from 'react-router-dom';
import { SITE_OPTIONS, getSiteName, getSiteColor } from '../../../constants/sites';
import { STATUS_OPTIONS, ROLE_OPTIONS, PROVIDER_LABELS } from '../../../constants/adminConstants';
import { resolveRole, isProtectedAdmin } from '../../../utils/userHelpers';
import { getRelativeTimeString, isDaysAgo } from '../../../utils/dateHelpers';
import { ADMIN_EMAILS } from '../../../config/admin';

interface UseUserColumnsParams {
  visibleIds: Set<string>;
  toggleId: (id: string) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  filtered: any[];
  paidIds: Set<string>;
  couponIds: Set<string>;
  handleRoleChange: (userId: string, newRole: string) => void;
  handleAddSite: (userId: string, domain: string) => void;
  handleRemoveSite: (userId: string, domain: string) => void;
  handleRestore: (user: any) => void;
  handleDelete: (user: any) => void;
  openAction: (user: any, type: string) => void;
}

export function useUserColumns({
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
}: UseUserColumnsParams) {
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
      render: (val: string, row: any) => isProtectedAdmin(row) ? null : (
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
      render: (val: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
          {visibleIds.has(val) && (
            <span style={{
              fontSize: '9px', color: 'var(--text-light)', wordBreak: 'break-all' as const,
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
      render: (val: string, row: any) => val || row.name || '-',
    },
    { key: 'email', label: '이메일' },
    {
      key: 'phone',
      label: '전화번호',
      width: '130px',
      render: (val: string) => val || <span style={{ color: 'var(--text-light)' }}>-</span>,
    },
    {
      key: 'display_name',
      label: '프로필',
      width: '70px',
      render: (val: string, row: any) => {
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
      render: (val: string, row: any) => {
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
      render: (val: string) => {
        const p = val || 'email';
        const colorMap: Record<string, string> = { google: 'blue', kakao: 'yellow', email: 'gray' };
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
      render: (val: string) => {
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
      render: (val: string[], row: any) => {
        const sites = Array.isArray(val) && val.length > 0
          ? val
          : row.signup_domain ? [row.signup_domain] : [];
        const remaining = SITE_OPTIONS.filter((opt) => !sites.includes(opt.value));
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
            {sites.map((domain: string) => {
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
                    >&times;</button>
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
      render: (val: string, row: any) => {
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
      render: (val: string) => (val ? val.slice(0, 10) : '-'),
    },
    {
      key: 'last_sign_in_at',
      label: '최종 로그인',
      width: '140px',
      render: (val: string) => {
        if (!val) return <span style={{ color: 'var(--text-light)' }}>-</span>;
        const dateStr = val.slice(0, 10);
        const timeStr = val.slice(11, 16);
        const ago = getRelativeTimeString(val);
        const isOld = isDaysAgo(val, 30);
        return (
          <span title={`${dateStr} ${timeStr}`} style={{ fontSize: '12px' }}>
            {dateStr}
            <br />
            <span style={{ color: isOld ? '#dc2626' : 'var(--text-light)', fontSize: '11px' }}>
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
      render: (val: string) => {
        if (!val) return <span style={{ color: 'var(--text-light)' }}>-</span>;
        const dateStr = val.slice(0, 10);
        const timeStr = val.slice(11, 16);
        const ago = getRelativeTimeString(val);
        const isOld = isDaysAgo(val, 30);
        return (
          <span title={`${dateStr} ${timeStr}`} style={{ fontSize: '12px' }}>
            {dateStr}
            <br />
            <span style={{ color: isOld ? '#dc2626' : 'var(--text-light)', fontSize: '11px' }}>
              {ago}
            </span>
          </span>
        );
      },
    },
  ];

  const renderActions = (row: any) => {
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

  return { columns, renderActions };
}
