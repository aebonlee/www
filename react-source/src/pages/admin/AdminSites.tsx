import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../utils/adminStorage';

interface SiteInfo {
  name: string;
  domain: string;
  hasPayment: boolean;
  totalMembers: number;
  recentMembers: number;
}

const ALL_SITES: { name: string; domain: string; hasPayment: boolean }[] = [
  // Hub Sites
  { name: 'edu-hub', domain: 'edu-hub.dreamitbiz.com', hasPayment: true },
  { name: 'ai-hub', domain: 'ai-hub.dreamitbiz.com', hasPayment: false },
  { name: 'biz-hub', domain: 'biz-hub.dreamitbiz.com', hasPayment: false },
  { name: 'cs-hub', domain: 'cs-hub.dreamitbiz.com', hasPayment: true },
  { name: 'basic-hub', domain: 'basic-hub.dreamitbiz.com', hasPayment: true },
  { name: 'exam-hub', domain: 'exam-hub.dreamitbiz.com', hasPayment: true },
  { name: 'career-hub', domain: 'carrer-hub.dreamitbiz.com', hasPayment: true },
  { name: 'thesis-hub', domain: 'thesis-hub.dreamitbiz.com', hasPayment: false },
  { name: 'coding-hub', domain: 'coding-hub.dreamitbiz.com', hasPayment: false },
  // Programming Education
  { name: 'coding', domain: 'coding.dreamitbiz.com', hasPayment: false },
  { name: 'c-study', domain: 'c-study.dreamitbiz.com', hasPayment: false },
  { name: 'python-study', domain: 'python-study.dreamitbiz.com', hasPayment: false },
  { name: 'java-study', domain: 'java-study.dreamitbiz.com', hasPayment: false },
  { name: 'reactstudy', domain: 'reactstudy.dreamitbiz.com', hasPayment: false },
  { name: 'html', domain: 'html.dreamitbiz.com', hasPayment: false },
  // IT/CS Education
  { name: 'algorithm', domain: 'algorithm.dreamitbiz.com', hasPayment: false },
  { name: 'data-structure', domain: 'data-structure.dreamitbiz.com', hasPayment: false },
  { name: 'linux-study', domain: 'linux-study.dreamitbiz.com', hasPayment: false },
  { name: 'db-study', domain: 'db-study.dreamitbiz.com', hasPayment: false },
  { name: 'software', domain: 'software.dreamitbiz.com', hasPayment: false },
  { name: 'webstudy', domain: 'webstudy.dreamitbiz.com', hasPayment: false },
  { name: 'koreatech', domain: 'koreatech.dreamitbiz.com', hasPayment: false },
  { name: 'aisw', domain: 'aisw.dreamitbiz.com', hasPayment: false },
  // AI Education
  { name: 'ai-prompt', domain: 'ai-prompt.dreamitbiz.com', hasPayment: false },
  { name: 'ai-data', domain: 'ai-data.dreamitbiz.com', hasPayment: false },
  { name: 'ai-media', domain: 'ai-media.dreamitbiz.com', hasPayment: false },
  { name: 'claude', domain: 'claude.dreamitbiz.com', hasPayment: false },
  { name: 'chatgpt', domain: 'chatgpt.dreamitbiz.com', hasPayment: false },
  { name: 'gemini', domain: 'gemini.dreamitbiz.com', hasPayment: false },
  { name: 'genspark', domain: 'genspark.dreamitbiz.com', hasPayment: false },
  { name: 'copilot', domain: 'copilot.dreamitbiz.com', hasPayment: false },
  // Business/LMS
  { name: 'digitalbiz', domain: 'digitalbiz.dreamitbiz.com', hasPayment: false },
  { name: 'marketing', domain: 'marketing.dreamitbiz.com', hasPayment: false },
  { name: 'uxdesign', domain: 'uxdesign.dreamitbiz.com', hasPayment: false },
  { name: 'self-branding', domain: 'self-branding.dreamitbiz.com', hasPayment: false },
  // Language Learning
  { name: 'english', domain: 'english.dreamitbiz.com', hasPayment: false },
  { name: 'japanese', domain: 'japanese.dreamitbiz.com', hasPayment: false },
  { name: 'korean', domain: 'korean.dreamitbiz.com', hasPayment: false },
  // Certification
  { name: 'eip', domain: 'eip.dreamitbiz.com', hasPayment: false },
  { name: 'sqld', domain: 'sqld.dreamitbiz.com', hasPayment: false },
  // AI Tools
  { name: 'aI-agents', domain: 'aI-agents.dreamitbiz.com', hasPayment: false },
  { name: 'autowork', domain: 'autowork.dreamitbiz.com', hasPayment: false },
  { name: 'fine-tuning', domain: 'fine-tuning.dreamitbiz.com', hasPayment: false },
  { name: 'vibe', domain: 'vibe.dreamitbiz.com', hasPayment: false },
  // Core Platforms
  { name: 'competency', domain: 'competency.dreamitbiz.com', hasPayment: true },
  { name: 'career', domain: 'career.dreamitbiz.com', hasPayment: true },
  { name: 'allthat', domain: 'allthat.dreamitbiz.com', hasPayment: true },
  { name: 'papers', domain: 'papers.dreamitbiz.com', hasPayment: true },
  { name: 'ahp_basic', domain: 'ahp-basic.dreamitbiz.com', hasPayment: false },
  { name: 'teaching', domain: 'teaching.dreamitbiz.com', hasPayment: false },
  { name: 'planning', domain: 'planning.dreamitbiz.com', hasPayment: false },
  // Publishing/Docs
  { name: 'books', domain: 'books.dreamitbiz.com', hasPayment: false },
  { name: 'docs', domain: 'docs.dreamitbiz.com', hasPayment: false },
  { name: 'reserve', domain: 'reserve.dreamitbiz.com', hasPayment: false },
  { name: 'openclaw', domain: 'openclaw.dreamitbiz.com', hasPayment: false },
  { name: 'presentation', domain: 'presentation.dreamitbiz.com', hasPayment: false },
  // Personal/Portfolio
  { name: 'aebon', domain: 'aebon.dreamitbiz.com', hasPayment: false },
  { name: 'jdy', domain: 'jdy.dreamitbiz.com', hasPayment: false },
  { name: 'wonjunjang', domain: 'wonjunjang.dreamitbiz.com', hasPayment: false },
  { name: 'hohai', domain: 'hohai.dreamitbiz.com', hasPayment: false },
  // Robot/IoT/BI
  { name: 'pbirobot', domain: 'pbirobot.dreamitbiz.com', hasPayment: false },
  { name: 'pbi', domain: 'pbi.dreamitbiz.com', hasPayment: false },
  { name: 'koreait', domain: 'koreait.dreamitbiz.com', hasPayment: false },
  // Career
  { name: 'jobpath', domain: 'jobpath.dreamitbiz.com', hasPayment: true },
  { name: 'jobexam', domain: 'jobexam.dreamitbiz.com', hasPayment: true },
  { name: 'www', domain: 'www.dreamitbiz.com', hasPayment: true },
  // Instructor
  { name: 'instructor', domain: 'instructor.dreamitbiz.com', hasPayment: false },
  // Research/Academic
  { name: 'survey', domain: 'survey.dreamitbiz.com', hasPayment: false },
  { name: 'esg', domain: 'esg.dreamitbiz.com', hasPayment: false },
  { name: 'accounting', domain: 'accounting.dreamitbiz.com', hasPayment: false },
  // Cloud/DevOps
  { name: 'aws', domain: 'aws.dreamitbiz.com', hasPayment: false },
  // Study Skills
  { name: 'study', domain: 'study.dreamitbiz.com', hasPayment: false },
  { name: 'safety', domain: 'safety.dreamitbiz.com', hasPayment: false },
  // Statistics
  { name: 'statistics', domain: 'statistics.dreamitbiz.com', hasPayment: false },
];

const AdminSites = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'members' | 'name' | 'recent'>('members');
  const [filterPayment, setFilterPayment] = useState<'all' | 'payment'>('all');

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const sevenDaysAgo = useMemo(() => {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }, []);

  const siteStats = useMemo((): SiteInfo[] => {
    return ALL_SITES.map((site) => {
      let totalMembers = 0;
      let recentMembers = 0;
      users.forEach((u: any) => {
        const sites: string[] = Array.isArray(u.visited_sites) && u.visited_sites.length > 0
          ? u.visited_sites
          : u.signup_domain ? [u.signup_domain] : [];
        const matched = sites.some((d: string) =>
          d.toLowerCase().includes(site.name.toLowerCase()) ||
          d.toLowerCase() === site.domain.toLowerCase()
        );
        if (matched) {
          totalMembers++;
          if (u.created_at && new Date(u.created_at) >= sevenDaysAgo) {
            recentMembers++;
          }
        }
      });
      return { ...site, totalMembers, recentMembers };
    });
  }, [users, sevenDaysAgo]);

  const filtered = useMemo(() => {
    let list = siteStats;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q));
    }
    if (filterPayment === 'payment') {
      list = list.filter(s => s.hasPayment);
    }
    if (sortBy === 'members') list = [...list].sort((a, b) => b.totalMembers - a.totalMembers);
    else if (sortBy === 'recent') list = [...list].sort((a, b) => b.recentMembers - a.recentMembers);
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [siteStats, search, sortBy, filterPayment]);

  const handleSiteClick = (siteName: string) => {
    navigate(`/admin/users?site=${siteName}`);
  };

  const totalWithMembers = siteStats.filter(s => s.totalMembers > 0).length;

  return (
    <>
      <div className="admin-page-header">
        <h2>사이트 현황</h2>
        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
          {loading ? '로딩 중...' : `총 ${ALL_SITES.length}개 사이트 · 회원 보유 ${totalWithMembers}개`}
        </span>
      </div>

      {/* 필터/검색 */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
        marginBottom: '16px', padding: '12px 16px',
        background: 'var(--bg-card, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '10px',
      }}>
        <input
          type="text"
          placeholder="사이트 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color, #e5e7eb)',
            fontSize: '13px', minWidth: '200px', background: 'var(--bg-card)',
          }}
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="role-select"
          style={{ minWidth: '120px' }}
        >
          <option value="members">회원수 순</option>
          <option value="recent">최근 신규 순</option>
          <option value="name">이름 순</option>
        </select>
        <select
          value={filterPayment}
          onChange={e => setFilterPayment(e.target.value as any)}
          className="role-select"
          style={{ minWidth: '120px' }}
        >
          <option value="all">전체 사이트</option>
          <option value="payment">결제 사이트만</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-light)' }}>
          {filtered.length}개 표시
        </span>
      </div>

      {/* 사이트 카드 그리드 */}
      {loading ? (
        <div className="admin-loading"><div className="loading-spinner"></div></div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {filtered.map((site) => (
            <div
              key={site.name}
              onClick={() => site.totalMembers > 0 && handleSiteClick(site.name)}
              style={{
                background: 'var(--bg-card, #fff)',
                border: '1px solid var(--border-color, #e5e7eb)',
                borderRadius: '10px',
                padding: '16px 20px',
                cursor: site.totalMembers > 0 ? 'pointer' : 'default',
                transition: 'box-shadow 0.15s',
                opacity: site.totalMembers === 0 ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (site.totalMembers > 0) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                    {site.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>
                    {site.domain}
                  </div>
                </div>
                {site.hasPayment && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 6px',
                    background: '#fef3c7', color: '#92400e', borderRadius: '4px',
                    border: '1px solid #fbbf24', whiteSpace: 'nowrap',
                  }}>
                    결제
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: site.totalMembers > 0 ? '#3B82F6' : 'var(--text-light)' }}>
                    {site.totalMembers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>전체 회원</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: site.recentMembers > 0 ? '#10B981' : 'var(--text-light)' }}>
                    +{site.recentMembers}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>최근 7일</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminSites;
