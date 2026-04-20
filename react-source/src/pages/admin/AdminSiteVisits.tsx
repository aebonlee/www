import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  getSiteVisitStats, getDailySiteVisits, getSiteVisitSummary, getSiteDistribution,
} from '../../utils/adminStorage';

const COLORS = [
  '#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444',
  '#06B6D4','#EC4899','#6366F1','#84CC16','#F97316',
];

const AdminSiteVisits = () => {
  const [loading, setLoading] = useState(true);
  const [siteDist, setSiteDist] = useState<{ site: string; count: number }[]>([]);
  const [visitStats, setVisitStats] = useState<{ site_domain: string; count: number }[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [dailyVisits, setDailyVisits] = useState<{ date: string; count: number }[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('전체');

  useEffect(() => {
    Promise.all([
      getSiteDistribution(),
      getSiteVisitStats(30),
      getSiteVisitSummary(),
    ]).then(([dist, stats, sum]) => {
      setSiteDist(dist);
      setVisitStats(stats);
      setSummary(sum);
      setLoading(false);
    });
  }, []);

  // 사이트 선택 시 일별 추이 로드
  useEffect(() => {
    if (selectedSite && selectedSite !== '전체') {
      getDailySiteVisits(selectedSite, 30).then(setDailyVisits);
    } else {
      setDailyVisits([]);
    }
  }, [selectedSite]);

  // 인사이트 카드 계산
  const totalSites = siteDist.length;
  const todayVisits = visitStats.reduce((s, x) => s + x.count, 0); // 30일 기준 (근사)
  const weekVisitsTotal = summary.reduce((s, x) => s + x.weekVisits, 0);
  const topSite = visitStats[0];

  // 사이트 목록 (탭 필터용)
  const siteList = ['전체', ...siteDist.map((s) => s.site)];

  // 필터된 요약 테이블
  const filteredSummary = selectedSite === '전체'
    ? summary
    : summary.filter((s) => s.domain.includes(selectedSite));

  if (loading) {
    return <div className="admin-loading"><div className="loading-spinner" /></div>;
  }

  return (
    <>
      {/* 헤더 */}
      <div className="admin-page-header">
        <div>
          <h2>사이트별 방문통계</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>
            각 사이트의 방문 현황과 회원 분포를 분석합니다
          </p>
        </div>
      </div>

      {/* 인사이트 카드 (4개) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {([
          { icon: '🌐', color: '#6366f1', title: '등록 사이트', value: `${totalSites}개`, detail: 'visited_sites 기반' },
          { icon: '📊', color: '#10b981', title: '30일 방문 수', value: `${todayVisits}회`, detail: 'visit_log 기준' },
          { icon: '📅', color: '#f59e0b', title: '금주 방문 수', value: `${weekVisitsTotal}회`, detail: '최근 7일' },
          { icon: '🏆', color: '#0ea5e9', title: '가장 활발한 사이트', value: topSite?.site_domain?.replace('.dreamitbiz.com', '') || '-', detail: topSite ? `${topSite.count}회 방문` : '' },
        ]).map((item) => (
          <div key={item.title} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderTop: `3px solid ${item.color}`,
            borderRadius: '10px',
            padding: '16px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</div>
            {item.detail && (
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-light)' }}>
                {item.detail}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 사이트 필터 탭 */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '16px', padding: '10px 0',
      }}>
        {siteList.map((site) => (
          <button
            key={site}
            onClick={() => setSelectedSite(site)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedSite === site ? '2px solid #6366f1' : '1px solid var(--border-color)',
              background: selectedSite === site ? '#6366f1' : 'var(--bg-card)',
              color: selectedSite === site ? '#fff' : 'var(--text-primary)',
              fontWeight: selectedSite === site ? 600 : 400,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {site}
          </button>
        ))}
      </div>

      {/* 차트 2열 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* BarChart — 사이트별 총 회원 수 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>사이트별 회원 수</h3>
            <span className="dash-panel-sub">visited_sites 기반 상위 10개</span>
          </div>
          <div className="dash-panel-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={siteDist.slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="site" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}명`, '회원 수']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {siteDist.slice(0, 10).map((_, idx) => (
                    <rect key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LineChart — 선택 사이트 일별 방문 추이 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>일별 방문 추이</h3>
            <span className="dash-panel-sub">
              {selectedSite === '전체' ? '사이트를 선택하세요' : `${selectedSite} (최근 30일)`}
            </span>
          </div>
          <div className="dash-panel-body">
            {selectedSite === '전체' ? (
              <div style={{
                height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-light)', fontSize: '14px',
              }}>
                위 탭에서 사이트를 선택하면 일별 방문 추이가 표시됩니다
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyVisits} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(v: string) => v}
                    formatter={(v: number) => [`${v}회`, '방문']}
                  />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2}
                    dot={{ r: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 사이트별 상세 테이블 */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <h3>사이트별 상세 현황</h3>
          <span className="dash-panel-sub">{filteredSummary.length}개 사이트</span>
        </div>
        <div className="dash-panel-body-flush">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)' }}>
                {['도메인', '총 회원', '금주 방문', '금월 방문', '신규 가입(월)', '성장률'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontWeight: 600, color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '12px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSummary.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                    방문 데이터가 없습니다. site_visit_log 테이블을 생성하고 방문 로깅을 활성화하세요.
                  </td>
                </tr>
              ) : (
                filteredSummary.map((row, idx) => (
                  <tr key={row.domain} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      <span style={{
                        display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                        background: COLORS[idx % COLORS.length], marginRight: '8px',
                      }} />
                      {row.domain.replace('.dreamitbiz.com', '') || 'www'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>{row.totalMembers}명</td>
                    <td style={{ padding: '10px 14px' }}>{row.weekVisits}회</td>
                    <td style={{ padding: '10px 14px' }}>{row.monthVisits}회</td>
                    <td style={{ padding: '10px 14px' }}>{row.newSignupsMonth}명</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        color: row.growth >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                      }}>
                        {row.growth >= 0 ? '▲' : '▼'} {Math.abs(row.growth)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminSiteVisits;
