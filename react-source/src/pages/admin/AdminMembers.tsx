/**
 * AdminMembers.tsx — www 회원 총괄 (전 사이트 통합 회원 관리)
 *
 * 데이터: www_profiles(전 사이트 공용 프로필) + www_signup_stats(출처별 집계 뷰).
 * 접근 제어: RLS(www_admins 정책)가 서버에서 막고, 화면에서도 www_is_admin() RPC로
 * 판정해 비관리자에게는 안내 페이지를 보여준다 (2026-07-18 대표 확정 체계).
 */
import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import getSupabase from '../../utils/supabase';
import { downloadCSV } from '../../utils/csv';

interface WwwProfile {
  user_id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  org: string | null;
  course: string | null;
  signup_site: string | null;
  signup_at: string;
  updated_at: string;
  is_complete: boolean;
}

interface SignupStat {
  signup_site: string;
  total: number;
  complete: number;
  incomplete: number;
  first_signup: string | null;
  last_signup: string | null;
}

const S: Record<string, CSSProperties> = {
  page: { padding: 4 },
  h1: { fontSize: 22, fontWeight: 700, margin: '0 0 4px' },
  sub: { fontSize: 13, color: '#888', margin: '0 0 20px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 },
  card: { border: '1px solid #e3e6ea', borderRadius: 10, padding: '14px 16px', background: 'var(--card-bg, #fff)' },
  cardSite: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  cardTotal: { fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
  cardMeta: { fontSize: 12, color: '#888', marginTop: 4 },
  toolbar: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '0 0 12px' },
  select: { padding: '8px 10px', borderRadius: 8, border: '1px solid #d5d8dd', fontSize: 14 },
  search: { padding: '8px 12px', borderRadius: 8, border: '1px solid #d5d8dd', fontSize: 14, minWidth: 220 },
  csvBtn: {
    marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: 'none',
    background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  tableWrap: { overflowX: 'auto', border: '1px solid #e3e6ea', borderRadius: 10 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 880 },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #e3e6ea', whiteSpace: 'nowrap', background: 'rgba(0,0,0,.02)' },
  td: { padding: '9px 12px', borderBottom: '1px solid #eef0f3', whiteSpace: 'nowrap' },
  incompleteRow: { background: 'rgba(220, 53, 69, .07)' },
  badge: {
    display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 11,
    fontWeight: 700, background: '#dc3545', color: '#fff',
  },
  notice: { padding: '48px 24px', textAlign: 'center', wordBreak: 'keep-all', overflowWrap: 'break-word' },
};

function fmtDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

const AdminMembers = () => {
  const [adminState, setAdminState] = useState<'loading' | 'yes' | 'no' | 'error'>('loading');
  const [stats, setStats] = useState<SignupStat[]>([]);
  const [members, setMembers] = useState<WwwProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const client = getSupabase();
    if (!client) { setAdminState('error'); return; }

    (async () => {
      // 1) 화면 접근 판정 — DB의 www_is_admin()과 동일 기준
      const { data: isAdmin, error: adminErr } = await client.rpc('www_is_admin');
      if (adminErr) { setAdminState('error'); return; }
      if (!isAdmin) { setAdminState('no'); return; }
      setAdminState('yes');

      // 2) 출처별 집계
      const { data: statRows } = await client.from('www_signup_stats').select('*');
      setStats(((statRows ?? []) as SignupStat[]).sort((a, b) => b.total - a.total));

      // 3) 회원 전체 (PostgREST 1000행 제한 대비 페이징 루프)
      const all: WwwProfile[] = [];
      const PAGE = 1000;
      for (let from = 0; ; from += PAGE) {
        const { data: rows, error } = await client
          .from('www_profiles')
          .select('*')
          .order('signup_at', { ascending: false })
          .range(from, from + PAGE - 1);
        if (error || !rows) break;
        all.push(...(rows as WwwProfile[]));
        if (rows.length < PAGE) break;
      }
      setMembers(all);
      setLoading(false);
    })();
  }, []);

  const siteOptions = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => set.add(m.signup_site ?? '(미기록)'));
    return [...set].sort();
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const site = m.signup_site ?? '(미기록)';
      if (siteFilter !== 'all' && site !== siteFilter) return false;
      if (!q) return true;
      return (m.name ?? '').toLowerCase().includes(q) || (m.email ?? '').toLowerCase().includes(q);
    });
  }, [members, siteFilter, search]);

  const exportCSV = () => {
    if (!filtered.length) return;
    downloadCSV(
      filtered.map((m) => ({
        이름: m.name ?? '',
        연락처: m.phone ?? '',
        이메일: m.email ?? '',
        소속기관: m.org ?? '',
        수강과정: m.course ?? '',
        가입출처: m.signup_site ?? '(미기록)',
        가입일: fmtDate(m.signup_at),
        완성여부: m.is_complete ? '완성' : '미완성',
      })),
      `www_members_${siteFilter === 'all' ? '전체' : siteFilter}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  if (adminState === 'loading') {
    return <div className="admin-loading"><div className="loading-spinner"></div></div>;
  }
  if (adminState === 'no') {
    return (
      <div style={S.notice}>
        <h2 style={S.h1}>회원 총괄은 관리자 전용입니다</h2>
        <p style={{ color: '#888', whiteSpace: 'pre-line' }}>
          {'이 화면은 www_admins에 등록된 계정만 볼 수 있습니다.\n접근이 필요하면 대표에게 등록을 요청해 주세요.'}
        </p>
      </div>
    );
  }
  if (adminState === 'error') {
    return (
      <div style={S.notice}>
        <h2 style={S.h1}>권한 확인에 실패했습니다</h2>
        <p style={{ color: '#888' }}>네트워크 상태를 확인하고 새로고침해 주세요.</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <h1 style={S.h1}>회원 총괄</h1>
      <p style={S.sub}>전 사이트 통합 회원(www_profiles) — 가입 출처별 현황과 목록. 미완성 = 필수 3종(이름·연락처·이메일) 미입력.</p>

      <div style={S.cards}>
        {stats.map((s) => (
          <div key={s.signup_site} style={S.card}>
            <div style={S.cardSite}>{s.signup_site}</div>
            <div style={S.cardTotal}>{s.total.toLocaleString()}명</div>
            <div style={S.cardMeta}>완성 {s.complete} · 미완성 {s.incomplete}</div>
            <div style={S.cardMeta}>최근 가입 {fmtDate(s.last_signup)}</div>
          </div>
        ))}
      </div>

      <div style={S.toolbar}>
        <select style={S.select} value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
          <option value="all">전체 출처 ({members.length})</option>
          {siteOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          style={S.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 / 이메일 검색"
        />
        <span style={{ fontSize: 13, color: '#888' }}>{filtered.length}명 표시</span>
        <button type="button" style={S.csvBtn} onClick={exportCSV} disabled={!filtered.length}>
          CSV 내보내기
        </button>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {['이름', '연락처', '이메일', '소속 기관', '수강 과정', '가입 출처', '가입일', '상태'].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td style={S.td} colSpan={8}>불러오는 중…</td></tr>
            )}
            {!loading && !filtered.length && (
              <tr><td style={S.td} colSpan={8}>조건에 맞는 회원이 없습니다.</td></tr>
            )}
            {filtered.map((m) => (
              <tr key={m.user_id} style={m.is_complete ? undefined : S.incompleteRow}>
                <td style={S.td}>{m.name ?? '—'}</td>
                <td style={S.td}>{m.phone ?? '—'}</td>
                <td style={S.td}>{m.email ?? '—'}</td>
                <td style={S.td}>{m.org ?? ''}</td>
                <td style={S.td}>{m.course ?? ''}</td>
                <td style={S.td}>{m.signup_site ?? '(미기록)'}</td>
                <td style={S.td}>{fmtDate(m.signup_at)}</td>
                <td style={S.td}>{m.is_complete ? '완성' : <span style={S.badge}>미완성</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
