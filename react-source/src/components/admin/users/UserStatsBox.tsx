interface StatItem {
  label: string;
  value: number;
  color: string;
  bg: string;
  key: string;
}

interface UserStatsBoxProps {
  stats: {
    today: number;
    week: number;
    month: number;
    active: number;
    paid: number;
    coupon: number;
    total: number;
  };
  statFilter: string;
  siteFilter: string;
  roleFilter: string;
  statusFilter: string;
  paymentFilter: string;
  onStatFilterChange: (key: string) => void;
}

const UserStatsBox = ({
  stats,
  statFilter,
  siteFilter,
  roleFilter,
  statusFilter,
  paymentFilter,
  onStatFilterChange,
}: UserStatsBoxProps) => {
  const items: StatItem[] = [
    { label: '오늘 가입', value: stats.today, color: '#6366f1', bg: '#eef2ff', key: 'today' },
    { label: '이번 주', value: stats.week, color: '#0ea5e9', bg: '#f0f9ff', key: 'week' },
    { label: '이번 달', value: stats.month, color: '#10b981', bg: '#f0fdf4', key: 'month' },
    { label: '정상 회원', value: stats.active, color: '#f59e0b', bg: '#fffbeb', key: 'active' },
    { label: '유료 회원', value: stats.paid, color: '#92400e', bg: '#fef3c7', key: 'paid' },
    { label: '쿠폰 사용', value: stats.coupon, color: '#047857', bg: '#d1fae5', key: 'coupon' },
    { label: '전체 회원', value: stats.total, color: '#8b5cf6', bg: '#f5f3ff', key: 'all' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '12px',
      marginBottom: '20px',
      margin: '0 -70px 20px',
    }}>
      {items.map(({ label, value, color, bg, key }) => {
        const isActive = statFilter === key || (statFilter === 'all' && key === 'all' && siteFilter === 'all' && roleFilter === 'all' && statusFilter === 'all' && paymentFilter === 'all');
        return (
          <div key={label} onClick={() => onStatFilterChange(key)} style={{
            background: isActive ? bg : 'var(--bg-card, #fff)',
            border: isActive ? `2px solid ${color}` : '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isActive ? 'translateY(-2px)' : 'none',
            boxShadow: isActive ? `0 4px 12px ${color}25` : 'none',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-light, #6b7280)', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
            <span style={{
              display: 'inline-block', marginTop: '4px',
              fontSize: '11px', background: bg, color, borderRadius: '4px',
              padding: '1px 6px', alignSelf: 'flex-start',
            }}>명</span>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatsBox;
