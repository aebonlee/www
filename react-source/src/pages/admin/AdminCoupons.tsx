import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllCoupons, getAllCouponRedemptions } from '../../utils/adminStorage';
import { formatDate } from '../../utils/format';

const SITE_LABELS: Record<string, string> = {
  jobpath: 'JobPath',
  www: 'WWW',
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [c, r] = await Promise.all([getAllCoupons(), getAllCouponRedemptions()]);
    setCoupons(c);
    setRedemptions(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const summary = useMemo(() => {
    const active = coupons.filter(c => c.is_active && c.used_count < c.max_uses);
    const uniqueUsers = new Set(redemptions.map(r => r.user_email || r.user_id).filter(Boolean));
    return {
      total: coupons.length,
      active: active.length,
      totalUsed: redemptions.length,
      uniqueUsers: uniqueUsers.size,
    };
  }, [coupons, redemptions]);

  // Redemptions enriched with coupon code
  const enrichedRedemptions = useMemo(() => {
    return redemptions.map(r => {
      const coupon = coupons.find(c => c.id === r.coupon_id);
      return {
        ...r,
        coupon_code: coupon?.code || '-',
        coupon_days: coupon?.days || 1,
      };
    });
  }, [redemptions, coupons]);

  const couponColumns = [
    {
      key: 'site', label: '사이트', width: '90px',
      render: (val: string) => <span className="td-badge blue">{SITE_LABELS[val] || val}</span>,
    },
    { key: 'code', label: '코드', className: 'td-title' },
    {
      key: 'days', label: '이용기간', width: '90px',
      render: (val: number) => `${val || 1}일`,
    },
    {
      key: 'max_uses', label: '최대사용', width: '80px',
      render: (val: number) => `${val}회`,
    },
    {
      key: 'used_count', label: '사용횟수', width: '80px',
      render: (val: number, row: any) => {
        const full = val >= row.max_uses;
        return <span className={`td-badge ${full ? 'red' : 'green'}`}>{val}/{row.max_uses}</span>;
      },
    },
    {
      key: 'is_active', label: '상태', width: '80px',
      render: (val: boolean, row: any) => {
        if (!val) return <span className="td-badge gray">비활성</span>;
        if (row.used_count >= row.max_uses) return <span className="td-badge red">소진</span>;
        return <span className="td-badge green">활성</span>;
      },
    },
    {
      key: 'expires_at', label: '만료일', width: '110px',
      render: (val: string) => val ? new Date(val).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'created_at', label: '생성일', width: '140px',
      render: (val: string) => formatDate(val),
    },
  ];

  const redemptionColumns = [
    {
      key: 'site', label: '사이트', width: '90px',
      render: (val: string) => <span className="td-badge blue">{SITE_LABELS[val] || val}</span>,
    },
    { key: 'coupon_code', label: '쿠폰 코드', className: 'td-title' },
    {
      key: 'coupon_days', label: '이용기간', width: '80px',
      render: (val: number) => `${val}일`,
    },
    { key: 'user_email', label: '사용자 이메일' },
    {
      key: 'created_at', label: '사용일시', width: '160px',
      render: (val: string) => formatDate(val),
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <h2>쿠폰 관리</h2>
        <button className="admin-refresh-btn" onClick={load} disabled={loading}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Summary cards */}
      <div className="admin-order-summary">
        <div className="admin-order-summary-card">
          <span className="admin-order-summary-label">전체 쿠폰</span>
          <span className="admin-order-summary-value">{summary.total}개</span>
        </div>
        <div className="admin-order-summary-card paid">
          <span className="admin-order-summary-label">활성 쿠폰</span>
          <span className="admin-order-summary-value">{summary.active}개</span>
        </div>
        <div className="admin-order-summary-card">
          <span className="admin-order-summary-label">총 사용 횟수</span>
          <span className="admin-order-summary-value">{summary.totalUsed}회</span>
        </div>
        <div className="admin-order-summary-card">
          <span className="admin-order-summary-label">쿠폰 사용 회원</span>
          <span className="admin-order-summary-value">{summary.uniqueUsers}명</span>
        </div>
      </div>

      {/* Coupon list */}
      <h3 style={{ margin: '24px 0 12px', fontSize: '15px', fontWeight: 700 }}>
        쿠폰 목록 ({coupons.length}개)
      </h3>
      <AdminDataTable
        columns={couponColumns}
        data={coupons}
        loading={loading}
        searchKeys={['code']}
        pageSize={15}
      />

      {/* Redemption history */}
      <h3 style={{ margin: '32px 0 12px', fontSize: '15px', fontWeight: 700 }}>
        쿠폰 사용 내역 ({redemptions.length}건)
      </h3>
      <AdminDataTable
        columns={redemptionColumns}
        data={enrichedRedemptions}
        loading={loading}
        searchKeys={['coupon_code', 'user_email']}
        pageSize={15}
      />
    </>
  );
};

export default AdminCoupons;
