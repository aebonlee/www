import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getSiteVisitStats, getAllOrdersAll } from '../../utils/adminStorage';
import { SITES, type SiteEntry } from '../../constants/siteRegistry';

type LiveStatus = 'unknown' | 'checking' | 'up' | 'down';

interface SiteRow extends SiteEntry {
  totalMembers: number;
  recentMembers: number;
  visits: number;
  orderCount: number;
  revenue: number;
}

/** 단일 사이트 도달 가능 여부 핑 (no-cors — 응답 오면 up, 네트워크 실패/타임아웃이면 down) */
async function pingSite(url: string, timeoutMs = 7000): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    await fetch(url, { mode: 'no-cors', signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(timer);
    return true;
  } catch {
    return false;
  }
}

const num = (v: unknown) => (typeof v === 'number' && !isNaN(v) ? v : 0);

const AdminSites = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [visitMap, setVisitMap] = useState<Record<string, number>>({});
  const [orderAgg, setOrderAgg] = useState<Record<string, { count: number; revenue: number }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'members' | 'visits' | 'revenue' | 'recent' | 'name'>('members');
  const [filterPayment, setFilterPayment] = useState<'all' | 'payment'>('all');
  const [status, setStatus] = useState<Record<string, LiveStatus>>({});
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    Promise.all([getAllUsers(), getSiteVisitStats(90), getAllOrdersAll()])
      .then(([userData, visits, orders]) => {
        setUsers(userData || []);
        // 방문수: site_domain → count
        const vm: Record<string, number> = {};
        (visits || []).forEach((v: any) => { vm[v.site_domain] = num(v.count); });
        setVisitMap(vm);
        // 주문/매출: order.site → {count, revenue}
        const oa: Record<string, { count: number; revenue: number }> = {};
        (orders || []).forEach((o: any) => {
          const key = o.site;
          if (!oa[key]) oa[key] = { count: 0, revenue: 0 };
          oa[key].count += 1;
          const paid = !o.payment_status || o.payment_status === 'paid' || o.status === 'paid';
          if (paid) oa[key].revenue += num(o.total_amount) || num(o.amount) || num(o.price) || 0;
        });
        setOrderAgg(oa);
      })
      .finally(() => setLoading(false));
  }, []);

  const sevenDaysAgo = useMemo(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), []);

  const rows = useMemo((): SiteRow[] => {
    return SITES.map((site) => {
      let totalMembers = 0, recentMembers = 0;
      users.forEach((u: any) => {
        const sites: string[] = Array.isArray(u.visited_sites) && u.visited_sites.length > 0
          ? u.visited_sites
          : u.signup_domain ? [u.signup_domain] : [];
        const matched = sites.some((d: string) =>
          d.toLowerCase() === site.domain.toLowerCase() ||
          d.toLowerCase().replace('.dreamitbiz.com', '') === site.name.toLowerCase()
        );
        if (matched) {
          totalMembers++;
          if (u.created_at && new Date(u.created_at) >= sevenDaysAgo) recentMembers++;
        }
      });
      const ord = orderAgg[site.ordersSite || site.name] || { count: 0, revenue: 0 };
      return {
        ...site,
        totalMembers,
        recentMembers,
        visits: visitMap[site.domain] || 0,
        orderCount: ord.count,
        revenue: ord.revenue,
      };
    });
  }, [users, visitMap, orderAgg, sevenDaysAgo]);

  const filtered = useMemo(() => {
    let list = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q));
    }
    if (filterPayment === 'payment') list = list.filter(s => s.hasPayment);
    const by: Record<string, (a: SiteRow, b: SiteRow) => number> = {
      members: (a, b) => b.totalMembers - a.totalMembers,
      visits: (a, b) => b.visits - a.visits,
      revenue: (a, b) => b.revenue - a.revenue,
      recent: (a, b) => b.recentMembers - a.recentMembers,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sortBy]);
  }, [rows, search, sortBy, filterPayment]);

  // 합계
  const totals = useMemo(() => ({
    sites: SITES.length,
    withMembers: rows.filter(s => s.totalMembers > 0).length,
    members: rows.reduce((n, s) => n + s.totalMembers, 0),
    visits: rows.reduce((n, s) => n + s.visits, 0),
    orders: rows.reduce((n, s) => n + s.orderCount, 0),
    revenue: rows.reduce((n, s) => n + s.revenue, 0),
    up: Object.values(status).filter(v => v === 'up').length,
    down: Object.values(status).filter(v => v === 'down').length,
  }), [rows, status]);

  /** 전체 사이트 라이브 상태 점검 (배치 8개씩) */
  const checkLive = useCallback(async () => {
    setChecking(true);
    const init: Record<string, LiveStatus> = {};
    SITES.forEach(s => { init[s.name] = 'checking'; });
    setStatus(init);
    const batch = 8;
    for (let i = 0; i < SITES.length; i += batch) {
      const slice = SITES.slice(i, i + batch);
      const res = await Promise.all(slice.map(s => pingSite(s.url)));
      setStatus(prev => {
        const next = { ...prev };
        slice.forEach((s, j) => { next[s.name] = res[j] ? 'up' : 'down'; });
        return next;
      });
    }
    setChecking(false);
  }, []);

  const exportCSV = useCallback(() => {
    const header = ['사이트', '도메인', '결제', '상태', '전체회원', '최근7일', '방문(90일)', '주문', '매출'];
    const lines = [header.join(',')];
    filtered.forEach(s => {
      lines.push([
        s.name, s.domain, s.hasPayment ? 'Y' : 'N', status[s.name] || '-',
        s.totalMembers, s.recentMembers, s.visits, s.orderCount, s.revenue,
      ].join(','));
    });
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `사이트종합현황_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [filtered, status]);

  const won = (n: number) => '₩' + n.toLocaleString();
  const statusDot = (st: LiveStatus) => {
    const map = { up: '#10B981', down: '#EF4444', checking: '#F59E0B', unknown: '#cbd5e1' };
    const label = { up: '정상', down: '응답없음', checking: '확인중', unknown: '미점검' };
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: map[st], flexShrink: 0 }} />
        {label[st]}
      </span>
    );
  };

  return (
    <>
      <div className="admin-page-header">
        <h2>사이트 종합 현황</h2>
        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
          {loading ? '로딩 중...' : `총 ${totals.sites}개 · 회원보유 ${totals.withMembers}개${totals.down ? ` · ⚠ 응답없음 ${totals.down}개` : ''}`}
        </span>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: '전체 사이트', value: totals.sites.toLocaleString(), color: '#6366F1' },
          { label: '전체 회원', value: totals.members.toLocaleString(), color: '#3B82F6' },
          { label: '방문(90일)', value: totals.visits.toLocaleString(), color: '#0EA5E9' },
          { label: '총 주문', value: totals.orders.toLocaleString(), color: '#8B5CF6' },
          { label: '총 매출', value: won(totals.revenue), color: '#10B981' },
          { label: '라이브 정상', value: checking ? '점검중…' : (totals.up || totals.down ? `${totals.up}/${totals.sites}` : '미점검'), color: totals.down ? '#EF4444' : '#10B981' },
        ].map((c) => (
          <div key={c.label} style={{ background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e5e7eb)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* 필터/검색/액션 */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px', padding: '12px 16px', background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e5e7eb)', borderRadius: '10px' }}>
        <input type="text" placeholder="사이트 검색..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color,#e5e7eb)', fontSize: '13px', minWidth: '180px', background: 'var(--bg-card)' }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="role-select" style={{ minWidth: '120px' }}>
          <option value="members">회원수 순</option>
          <option value="visits">방문수 순</option>
          <option value="revenue">매출 순</option>
          <option value="recent">최근 신규 순</option>
          <option value="name">이름 순</option>
        </select>
        <select value={filterPayment} onChange={e => setFilterPayment(e.target.value as any)} className="role-select" style={{ minWidth: '120px' }}>
          <option value="all">전체 사이트</option>
          <option value="payment">결제 사이트만</option>
        </select>
        <button onClick={checkLive} disabled={checking} className="admin-btn"
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #6366F1', background: checking ? '#e0e7ff' : '#6366F1', color: checking ? '#6366F1' : '#fff', fontSize: '13px', fontWeight: 600, cursor: checking ? 'default' : 'pointer' }}>
          {checking ? '점검 중…' : '🔄 라이브 점검'}
        </button>
        <button onClick={exportCSV} className="admin-btn"
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-color,#e5e7eb)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          ⬇ CSV
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-light)' }}>{filtered.length}개 표시</span>
      </div>

      {/* 종합 현황 테이블 */}
      {loading ? (
        <div className="admin-loading"><div className="loading-spinner"></div></div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e5e7eb)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '860px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color,#e5e7eb)', textAlign: 'left', color: 'var(--text-light)' }}>
                <th style={{ padding: '10px 12px' }}>상태</th>
                <th style={{ padding: '10px 12px' }}>사이트</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>전체 회원</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>최근 7일</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>방문(90일)</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>주문</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>매출</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.name} style={{ borderBottom: '1px solid var(--border-color,#f1f5f9)' }}>
                  <td style={{ padding: '10px 12px' }}>{statusDot(status[s.name] || 'unknown')}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                      {s.hasPayment && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', border: '1px solid #fbbf24' }}>결제</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{s.domain}</div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: s.totalMembers > 0 ? '#3B82F6' : 'var(--text-light)' }}>{s.totalMembers.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: s.recentMembers > 0 ? '#10B981' : 'var(--text-light)' }}>+{s.recentMembers}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{s.visits.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{s.orderCount.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: s.revenue > 0 ? 700 : 400, color: s.revenue > 0 ? '#10B981' : 'var(--text-light)' }}>{s.revenue > 0 ? won(s.revenue) : '-'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" title="사이트 열기"
                      style={{ textDecoration: 'none', fontSize: '14px', marginRight: '8px' }}>↗</a>
                    <button onClick={() => navigate(`/admin/users?site=${s.name}`)} title="회원 보기"
                      style={{ background: 'none', border: '1px solid var(--border-color,#e5e7eb)', borderRadius: '5px', padding: '2px 8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-primary)' }}>회원</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminSites;
