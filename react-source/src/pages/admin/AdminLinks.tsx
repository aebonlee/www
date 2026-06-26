import { useState, useMemo } from 'react';
import { SITES, getSite, SITE_CATEGORIES as CATEGORY_META } from '../../constants/siteRegistry';

/**
 * 카테고리·멤버십·domain·결제 여부 모두 siteRegistry(SSOT)에서 파생한다.
 * → 사이트 추가/분류 변경은 siteRegistry 한 곳만 수정하면 이 페이지에 자동 반영됨.
 */
const SITE_CATEGORIES: { label: string; color: string; sites: string[] }[] = CATEGORY_META
  .map((c) => ({
    label: c.label,
    color: c.color,
    sites: SITES.filter((s) => s.category === c.label).map((s) => s.name),
  }))
  .filter((c) => c.sites.length > 0);

interface ResolvedSite {
  name: string;
  domain: string;
  pay: boolean;
}

const TOTAL = SITE_CATEGORIES.reduce((s, c) => s + c.sites.length, 0);

const AdminLinks = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SITE_CATEGORIES
      .filter((cat) => activeCategory === '전체' || cat.label === activeCategory)
      .map((cat) => {
        const sites: ResolvedSite[] = cat.sites
          .map((name) => {
            const s = getSite(name);
            return {
              name,
              domain: s?.domain ?? `${name}.dreamitbiz.com`,
              pay: s?.hasPayment ?? false,
            };
          })
          .filter((s) => !q || s.name.includes(q) || s.domain.includes(q));
        return { ...cat, sites };
      })
      .filter((cat) => cat.sites.length > 0);
  }, [search, activeCategory]);

  return (
    <>
      {/* 헤더 */}
      <div className="admin-page-header">
        <div>
          <h2>사이트 바로가기</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-light)', marginTop: '2px' }}>
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
            padding: '10px 17px', borderRadius: '8px', fontSize: '16px',
            border: '1px solid var(--border-color)', width: '240px',
            background: 'var(--bg-card)', color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        marginBottom: '24px',
      }}>
        {['전체', ...SITE_CATEGORIES.map((c) => c.label)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '5px 14px', borderRadius: '20px', fontSize: '14px',
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
        <div key={cat.label} style={{ marginBottom: '29px' }}>
          {/* 카테고리 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: `2px solid ${cat.color}`,
          }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: cat.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: '16px', fontWeight: 700, color: cat.color }}>
              {cat.label}
            </span>
            <span style={{
              fontSize: '13px', color: '#fff',
              background: cat.color, borderRadius: '10px',
              padding: '1px 8px', fontWeight: 600,
            }}>
              {cat.sites.length}
            </span>
          </div>

          {/* 사이트 카드 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(264px, 1fr))',
            gap: '10px',
          }}>
            {cat.sites.map((site) => (
              <a
                key={site.name}
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 17px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
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
                  width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                  background: `${cat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 700, color: cat.color,
                }}>
                  {site.name.charAt(0).toUpperCase()}
                </div>

                {/* 텍스트 */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {site.name}
                    {site.pay && (
                      <span style={{
                        fontSize: '11px', background: '#fef3c7', color: '#92400e',
                        border: '1px solid #fde68a', borderRadius: '4px', padding: '0 5px',
                        fontWeight: 700,
                      }}>결제</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {site.domain}
                  </div>
                </div>

                {/* 외부링크 아이콘 */}
                <svg viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2"
                  style={{ width: '17px', height: '17px', flexShrink: 0, opacity: 0.7 }}>
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
