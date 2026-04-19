import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  getMonthlySignups, getMonthlyRevenue, getSiteDistribution
} from '../../utils/adminStorage';
import { formatPrice } from '../../utils/format';

const PIE_COLORS = [
  '#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444',
  '#06B6D4','#EC4899','#6366F1','#84CC16','#F97316',
];

const AdminTrends = () => {
  const [signups,  setSignups]  = useState<{ month: string; count: number }[]>([]);
  const [revenue,  setRevenue]  = useState<{ month: string; amount: number }[]>([]);
  const [siteDist, setSiteDist] = useState<{ site: string; count: number }[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getMonthlySignups(), getMonthlyRevenue(), getSiteDistribution()])
      .then(([s, r, d]) => {
        setSignups(s);
        setRevenue(r);
        setSiteDist(d);
        setLoading(false);
      });
  }, []);

  /* ── 분석 계산 ── */
  const totalSignups  = signups.reduce((s, x) => s + x.count, 0);
  const totalRevenue  = revenue.reduce((s, x) => s + x.amount, 0);
  const lastSignups   = signups[signups.length - 1]?.count  ?? 0;
  const prevSignups   = signups[signups.length - 2]?.count  ?? 0;
  const lastRevenue   = revenue[revenue.length - 1]?.amount ?? 0;
  const prevRevenue   = revenue[revenue.length - 2]?.amount ?? 0;
  const signupGrowth  = prevSignups  > 0 ? ((lastSignups  - prevSignups)  / prevSignups  * 100).toFixed(1) : null;
  const revenueGrowth = prevRevenue  > 0 ? ((lastRevenue  - prevRevenue)  / prevRevenue  * 100).toFixed(1) : null;
  const topSite       = siteDist[0];
  const avgMonthlySignups = signups.length > 0 ? Math.round(totalSignups / signups.length) : 0;

  const insightItems = [
    {
      icon: '📈',
      color: '#6366f1',
      title: '최근 월 신규 가입',
      value: `${lastSignups}명`,
      detail: signupGrowth !== null
        ? `전월 대비 ${Number(signupGrowth) >= 0 ? '+' : ''}${signupGrowth}%`
        : '전월 데이터 없음',
      up: signupGrowth !== null && Number(signupGrowth) >= 0,
    },
    {
      icon: '💰',
      color: '#10b981',
      title: '최근 월 매출',
      value: formatPrice(lastRevenue),
      detail: revenueGrowth !== null
        ? `전월 대비 ${Number(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}%`
        : '전월 데이터 없음',
      up: revenueGrowth !== null && Number(revenueGrowth) >= 0,
    },
    {
      icon: '📊',
      color: '#f59e0b',
      title: '6개월 누적 가입',
      value: `${totalSignups}명`,
      detail: `월평균 ${avgMonthlySignups}명`,
      up: true,
    },
    {
      icon: '🏆',
      color: '#0ea5e9',
      title: '최다 회원 사이트',
      value: topSite?.site ?? '-',
      detail: topSite ? `${topSite.count}명` : '',
      up: true,
    },
    {
      icon: '💳',
      color: '#ec4899',
      title: '6개월 누적 매출',
      value: formatPrice(totalRevenue),
      detail: `월평균 ${formatPrice(Math.round(totalRevenue / (revenue.length || 1)))}`,
      up: true,
    },
  ];

  if (loading) {
    return <div className="admin-loading"><div className="loading-spinner" /></div>;
  }

  return (
    <>
      {/* 헤더 */}
      <div className="admin-page-header">
        <div>
          <h2>트렌드 분석</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>
            최근 6개월 가입·매출·사이트 분포 분석
          </p>
        </div>
      </div>

      {/* ── 인사이트 카드 ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {insightItems.map((item) => (
          <div key={item.title} style={{
            background: 'var(--bg-card)',
            border: `1px solid var(--border-color)`,
            borderTop: `3px solid ${item.color}`,
            borderRadius: '10px',
            padding: '16px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</div>
            {item.detail && (
              <div style={{
                marginTop: '6px', fontSize: '11px', fontWeight: 600,
                color: item.up ? '#10b981' : '#ef4444',
              }}>
                {item.up ? '▲' : '▼'} {item.detail}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── 차트 2열 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* LineChart — 월별 신규 가입자 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>월별 신규 가입자</h3>
            <span className="dash-panel-sub">최근 6개월</span>
          </div>
          <div className="dash-panel-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={signups} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}명`, '신규 가입']} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            {/* 분석 텍스트 */}
            <div style={{ marginTop: '12px', padding: '10px 12px', background: '#f5f3ff', borderRadius: '8px', fontSize: '12px', color: '#4c1d95' }}>
              {signupGrowth !== null ? (
                <>최근 월 신규 가입은 <strong>{lastSignups}명</strong>으로, 전월({prevSignups}명) 대비{' '}
                  <strong style={{ color: Number(signupGrowth) >= 0 ? '#10b981' : '#ef4444' }}>
                    {Number(signupGrowth) >= 0 ? '+' : ''}{signupGrowth}%
                  </strong> 변동.{' '}
                  6개월 평균은 <strong>{avgMonthlySignups}명/월</strong>입니다.
                </>
              ) : <span>데이터가 부족합니다.</span>}
            </div>
          </div>
        </div>

        {/* BarChart — 월별 매출 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>월별 매출</h3>
            <span className="dash-panel-sub">최근 6개월 (결제완료 기준)</span>
          </div>
          <div className="dash-panel-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(v: number) => [formatPrice(v), '매출']} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '12px', padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px', color: '#064e3b' }}>
              {revenueGrowth !== null ? (
                <>최근 월 매출은 <strong>{formatPrice(lastRevenue)}</strong>으로, 전월 대비{' '}
                  <strong style={{ color: Number(revenueGrowth) >= 0 ? '#10b981' : '#ef4444' }}>
                    {Number(revenueGrowth) >= 0 ? '+' : ''}{revenueGrowth}%
                  </strong> 변동.{' '}
                  6개월 누적 <strong>{formatPrice(totalRevenue)}</strong>.
                </>
              ) : <span>데이터가 부족합니다.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── PieChart + 순위표 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* PieChart */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>사이트별 회원 분포</h3>
            <span className="dash-panel-sub">상위 10개 사이트</span>
          </div>
          <div className="dash-panel-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={siteDist}
                  dataKey="count"
                  nameKey="site"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(props: any) =>
                    props.percent > 0.05 ? `${props.site} ${(props.percent * 100).toFixed(0)}%` : ''
                  }
                  labelLine={false}
                >
                  {siteDist.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, name: string) => [`${v}명`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 사이트 순위 테이블 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>사이트 회원 순위</h3>
            <span className="dash-panel-sub">상위 {siteDist.length}개</span>
          </div>
          <div className="dash-panel-body-flush">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)' }}>
                  {['순위', '사이트', '회원 수', '비율'].map((h) => (
                    <th key={h} style={{
                      padding: '8px 14px', textAlign: 'left',
                      fontWeight: 600, color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '12px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siteDist.map((row, idx) => {
                  const total = siteDist.reduce((s, x) => s + x.count, 0);
                  const pct = total > 0 ? (row.count / total * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={row.site} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px 14px', fontWeight: 700, color: PIE_COLORS[idx % PIE_COLORS.length] }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '8px 14px', fontWeight: 600 }}>
                        <span style={{
                          display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                          background: PIE_COLORS[idx % PIE_COLORS.length], marginRight: '6px',
                        }} />
                        {row.site}
                      </td>
                      <td style={{ padding: '8px 14px', fontWeight: 600 }}>{row.count}명</td>
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            height: '6px', borderRadius: '3px', width: `${pct}%`,
                            background: PIE_COLORS[idx % PIE_COLORS.length], minWidth: '4px',
                          }} />
                          <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTrends;
