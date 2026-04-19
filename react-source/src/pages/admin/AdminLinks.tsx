import { useState, useMemo } from 'react';

const SITE_CATEGORIES = [
  {
    label: 'Hub 사이트',
    color: '#6366f1',
    sites: [
      { name: 'edu-hub',     domain: 'edu-hub.dreamitbiz.com',     pay: true  },
      { name: 'ai-hub',      domain: 'ai-hub.dreamitbiz.com',      pay: false },
      { name: 'biz-hub',     domain: 'biz-hub.dreamitbiz.com',     pay: false },
      { name: 'cs-hub',      domain: 'cs-hub.dreamitbiz.com',      pay: true  },
      { name: 'basic-hub',   domain: 'basic-hub.dreamitbiz.com',   pay: true  },
      { name: 'exam-hub',    domain: 'exam-hub.dreamitbiz.com',    pay: true  },
      { name: 'career-hub',  domain: 'carrer-hub.dreamitbiz.com',  pay: true  },
      { name: 'thesis-hub',  domain: 'thesis-hub.dreamitbiz.com',  pay: false },
      { name: 'coding-hub',  domain: 'coding-hub.dreamitbiz.com',  pay: false },
    ],
  },
  {
    label: '프로그래밍 교육',
    color: '#0ea5e9',
    sites: [
      { name: 'coding',       domain: 'coding.dreamitbiz.com',       pay: false },
      { name: 'c-study',      domain: 'c-study.dreamitbiz.com',      pay: false },
      { name: 'python-study', domain: 'python-study.dreamitbiz.com', pay: false },
      { name: 'java-study',   domain: 'java-study.dreamitbiz.com',   pay: false },
      { name: 'reactstudy',   domain: 'reactstudy.dreamitbiz.com',   pay: false },
      { name: 'html',         domain: 'html.dreamitbiz.com',         pay: false },
    ],
  },
  {
    label: 'IT/CS 교육',
    color: '#10b981',
    sites: [
      { name: 'algorithm',      domain: 'algorithm.dreamitbiz.com',      pay: false },
      { name: 'data-structure', domain: 'data-structure.dreamitbiz.com', pay: false },
      { name: 'linux-study',    domain: 'linux-study.dreamitbiz.com',    pay: false },
      { name: 'db-study',       domain: 'db-study.dreamitbiz.com',       pay: false },
      { name: 'software',       domain: 'software.dreamitbiz.com',       pay: false },
      { name: 'webstudy',       domain: 'webstudy.dreamitbiz.com',       pay: false },
      { name: 'koreatech',      domain: 'koreatech.dreamitbiz.com',      pay: false },
      { name: 'aisw',           domain: 'aisw.dreamitbiz.com',           pay: false },
    ],
  },
  {
    label: 'AI 교육',
    color: '#8b5cf6',
    sites: [
      { name: 'ai-prompt',  domain: 'ai-prompt.dreamitbiz.com',  pay: false },
      { name: 'ai-data',    domain: 'ai-data.dreamitbiz.com',    pay: false },
      { name: 'ai-media',   domain: 'ai-media.dreamitbiz.com',   pay: false },
      { name: 'claude',     domain: 'claude.dreamitbiz.com',     pay: false },
      { name: 'chatgpt',    domain: 'chatgpt.dreamitbiz.com',    pay: false },
      { name: 'gemini',     domain: 'gemini.dreamitbiz.com',     pay: false },
      { name: 'genspark',   domain: 'genspark.dreamitbiz.com',   pay: false },
      { name: 'copilot',    domain: 'copilot.dreamitbiz.com',    pay: false },
    ],
  },
  {
    label: 'AI 도구',
    color: '#f43f5e',
    sites: [
      { name: 'aI-agents',   domain: 'aI-agents.dreamitbiz.com',   pay: false },
      { name: 'autowork',    domain: 'autowork.dreamitbiz.com',     pay: false },
      { name: 'fine-tuning', domain: 'fine-tuning.dreamitbiz.com',  pay: false },
      { name: 'vibe',        domain: 'vibe.dreamitbiz.com',         pay: false },
    ],
  },
  {
    label: '비즈니스/LMS',
    color: '#f59e0b',
    sites: [
      { name: 'digitalbiz',    domain: 'digitalbiz.dreamitbiz.com',    pay: false },
      { name: 'marketing',     domain: 'marketing.dreamitbiz.com',     pay: false },
      { name: 'uxdesign',      domain: 'uxdesign.dreamitbiz.com',      pay: false },
      { name: 'self-branding', domain: 'self-branding.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '어학',
    color: '#06b6d4',
    sites: [
      { name: 'english',  domain: 'english.dreamitbiz.com',  pay: false },
      { name: 'japanese', domain: 'japanese.dreamitbiz.com', pay: false },
      { name: 'korean',   domain: 'korean.dreamitbiz.com',   pay: false },
    ],
  },
  {
    label: '자격증',
    color: '#84cc16',
    sites: [
      { name: 'eip',  domain: 'eip.dreamitbiz.com',  pay: false },
      { name: 'sqld', domain: 'sqld.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '핵심 플랫폼',
    color: '#ec4899',
    sites: [
      { name: 'competency', domain: 'competency.dreamitbiz.com', pay: true  },
      { name: 'career',     domain: 'career.dreamitbiz.com',     pay: true  },
      { name: 'allthat',    domain: 'allthat.dreamitbiz.com',    pay: true  },
      { name: 'papers',     domain: 'papers.dreamitbiz.com',     pay: true  },
      { name: 'ahp-basic',  domain: 'ahp-basic.dreamitbiz.com',  pay: false },
      { name: 'teaching',   domain: 'teaching.dreamitbiz.com',   pay: false },
      { name: 'planning',   domain: 'planning.dreamitbiz.com',   pay: false },
    ],
  },
  {
    label: '출판/문서',
    color: '#64748b',
    sites: [
      { name: 'books',        domain: 'books.dreamitbiz.com',        pay: false },
      { name: 'docs',         domain: 'docs.dreamitbiz.com',         pay: false },
      { name: 'reserve',      domain: 'reserve.dreamitbiz.com',      pay: false },
      { name: 'openclaw',     domain: 'openclaw.dreamitbiz.com',     pay: false },
      { name: 'presentation', domain: 'presentation.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '취업/경력',
    color: '#f97316',
    sites: [
      { name: 'jobpath', domain: 'jobpath.dreamitbiz.com', pay: true  },
      { name: 'jobexam', domain: 'jobexam.dreamitbiz.com', pay: true  },
      { name: 'www',     domain: 'www.dreamitbiz.com',     pay: true  },
    ],
  },
  {
    label: '개인/포트폴리오',
    color: '#a78bfa',
    sites: [
      { name: 'aebon',      domain: 'aebon.dreamitbiz.com',      pay: false },
      { name: 'jdy',        domain: 'jdy.dreamitbiz.com',        pay: false },
      { name: 'wonjunjang', domain: 'wonjunjang.dreamitbiz.com', pay: false },
      { name: 'hohai',      domain: 'hohai.dreamitbiz.com',      pay: false },
    ],
  },
  {
    label: '로봇/IoT/BI',
    color: '#2dd4bf',
    sites: [
      { name: 'pbirobot', domain: 'pbirobot.dreamitbiz.com', pay: false },
      { name: 'pbi',      domain: 'pbi.dreamitbiz.com',      pay: false },
      { name: 'koreait',  domain: 'koreait.dreamitbiz.com',  pay: false },
    ],
  },
  {
    label: '강사',
    color: '#fb923c',
    sites: [
      { name: 'instructor', domain: 'instructor.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '연구/학술',
    color: '#4ade80',
    sites: [
      { name: 'survey',     domain: 'survey.dreamitbiz.com',     pay: false },
      { name: 'esg',        domain: 'esg.dreamitbiz.com',        pay: false },
      { name: 'accounting', domain: 'accounting.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '클라우드/DevOps',
    color: '#facc15',
    sites: [
      { name: 'aws', domain: 'aws.dreamitbiz.com', pay: false },
    ],
  },
  {
    label: '학습법/안전',
    color: '#34d399',
    sites: [
      { name: 'study',      domain: 'study.dreamitbiz.com',      pay: false },
      { name: 'safety',     domain: 'safety.dreamitbiz.com',     pay: false },
      { name: 'statistics', domain: 'statistics.dreamitbiz.com', pay: false },
    ],
  },
];

const TOTAL = SITE_CATEGORIES.reduce((s, c) => s + c.sites.length, 0);

const AdminLinks = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SITE_CATEGORIES
      .filter((cat) => activeCategory === '전체' || cat.label === activeCategory)
      .map((cat) => ({
        ...cat,
        sites: cat.sites.filter(
          (s) => !q || s.name.includes(q) || s.domain.includes(q)
        ),
      }))
      .filter((cat) => cat.sites.length > 0);
  }, [search, activeCategory]);

  return (
    <>
      {/* 헤더 */}
      <div className="admin-page-header">
        <div>
          <h2>사이트 바로가기</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>
            전체 {TOTAL}개 사이트 · dreamitbiz.com
          </p>
        </div>
        {/* 검색 */}
        <input
          type="search"
          placeholder="사이트명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
            border: '1px solid var(--border-color)', width: '200px',
            background: 'var(--bg-card)', color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '20px',
      }}>
        {['전체', ...SITE_CATEGORIES.map((c) => c.label)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
              fontWeight: activeCategory === cat ? 700 : 500,
              border: '1px solid',
              borderColor: activeCategory === cat
                ? (SITE_CATEGORIES.find((c) => c.label === cat)?.color ?? '#6366f1')
                : 'var(--border-color)',
              background: activeCategory === cat
                ? (SITE_CATEGORIES.find((c) => c.label === cat)?.color ?? '#6366f1')
                : 'transparent',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 카테고리별 사이트 목록 */}
      {filtered.map((cat) => (
        <div key={cat.label} style={{ marginBottom: '24px' }}>
          {/* 카테고리 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${cat.color}`,
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: cat.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: cat.color }}>
              {cat.label}
            </span>
            <span style={{
              fontSize: '11px', color: '#fff',
              background: cat.color, borderRadius: '10px',
              padding: '1px 7px', fontWeight: 600,
            }}>
              {cat.sites.length}
            </span>
          </div>

          {/* 사이트 카드 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '8px',
          }}>
            {cat.sites.map((site) => (
              <a
                key={site.name}
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.color;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 0 2px ${cat.color}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-color)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
              >
                {/* 파비콘 영역 */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                  background: `${cat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, color: cat.color,
                }}>
                  {site.name.charAt(0).toUpperCase()}
                </div>

                {/* 텍스트 */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {site.name}
                    {site.pay && (
                      <span style={{
                        fontSize: '9px', background: '#fef3c7', color: '#92400e',
                        border: '1px solid #fde68a', borderRadius: '4px', padding: '0 4px',
                        fontWeight: 700,
                      }}>결제</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {site.domain}
                  </div>
                </div>

                {/* 외부링크 아이콘 */}
                <svg viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2"
                  style={{ width: '14px', height: '14px', flexShrink: 0, opacity: 0.7 }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="admin-empty">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </>
  );
};

export default AdminLinks;
