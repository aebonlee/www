-- ============================================
-- 테이블 격리 마이그레이션 (site_domain 컬럼 추가)
-- 여러 사이트가 공유하는 테이블에 site_domain 컬럼을 추가하여
-- 사이트별 데이터 격리를 구현합니다.
-- Supabase Dashboard > SQL Editor에서 실행
-- 실행일: 2026-03-26
-- ============================================

-- ╔══════════════════════════════════════════╗
-- ║  PART 1: 템플릿 사이트 공유 테이블 (9개)   ║
-- ║  영향: koreatech, marketing, digitalbiz,  ║
-- ║        self-branding, uxdesign             ║
-- ╚══════════════════════════════════════════╝

-- ── 1-1. posts ──
ALTER TABLE posts ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_posts_site_domain ON posts(site_domain);

-- ── 1-2. comments ──
ALTER TABLE comments ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_comments_site_domain ON comments(site_domain);

-- ── 1-3. lectures ──
ALTER TABLE lectures ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_lectures_site_domain ON lectures(site_domain);

-- ── 1-4. gallery ──
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_gallery_site_domain ON gallery(site_domain);

-- ── 1-5. gallery_comments ──
ALTER TABLE gallery_comments ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_gallery_comments_site_domain ON gallery_comments(site_domain);

-- ── 1-6. portfolio ──
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_portfolio_site_domain ON portfolio(site_domain);

-- ── 1-7. portfolio_comments ──
ALTER TABLE portfolio_comments ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_site_domain ON portfolio_comments(site_domain);

-- ── 1-8. websites ──
ALTER TABLE websites ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_websites_site_domain ON websites(site_domain);

-- ── 1-9. websites_comments ──
ALTER TABLE websites_comments ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_websites_comments_site_domain ON websites_comments(site_domain);


-- ╔══════════════════════════════════════════╗
-- ║  PART 2: 기타 공유 테이블 (6개)            ║
-- ║  해당 테이블이 존재하지 않으면 무시됩니다      ║
-- ╚══════════════════════════════════════════╝

-- ── 2-1. orders ──
-- 사용: allthat, books, edu-hub, papers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_site_domain ON orders(site_domain);

-- ── 2-2. order_items ──
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_order_items_site_domain ON order_items(site_domain);

-- ── 2-3. board_posts ──
-- 사용: allthat, competency, linux-study, reserve, subsite-template
ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_board_posts_site_domain ON board_posts(site_domain);

-- ── 2-4. gallery_items ──
-- 사용: allthat, edu-hub, papers, linux-study, reserve, subsite-template
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_gallery_items_site_domain ON gallery_items(site_domain);

-- ── 2-5. blog_posts ──
-- 사용: edu-hub, papers, reserve, subsite-template
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_blog_posts_site_domain ON blog_posts(site_domain);

-- ── 2-6. products ──
-- 사용: edu-hub, papers
ALTER TABLE products ADD COLUMN IF NOT EXISTS site_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_products_site_domain ON products(site_domain);


-- ╔══════════════════════════════════════════╗
-- ║  PART 3: 기존 데이터 백필 (선택사항)        ║
-- ║  주의: 사이트별로 데이터가 구분 불가능한      ║
-- ║  경우 수동 확인이 필요합니다                  ║
-- ╚══════════════════════════════════════════╝

-- 만약 기존 데이터가 특정 사이트의 것으로 확실히 알 수 있다면
-- 아래 예시처럼 백필합니다:
--
-- UPDATE posts SET site_domain = 'koreatech.dreamit.kr'
-- WHERE site_domain IS NULL AND created_at < '2026-03-26';
--
-- 또는 user_profiles의 signup_domain으로 추정:
-- UPDATE posts p
-- SET site_domain = up.signup_domain
-- FROM user_profiles up
-- WHERE p.author_id = up.id AND p.site_domain IS NULL;


-- ╔══════════════════════════════════════════╗
-- ║  PART 4: RLS 정책 (보안 강화 - 선택사항)    ║
-- ║  site_domain 기반 행 수준 보안               ║
-- ╚══════════════════════════════════════════╝

-- 참고: RLS로 서버 사이드에서 강제하려면 클라이언트가
-- request header 또는 RPC를 통해 도메인을 전달해야 합니다.
-- 현재는 프론트엔드 코드에서 site_domain 필터링으로 처리합니다.
-- 추후 보안 강화가 필요하면 아래 패턴을 적용하세요:
--
-- CREATE POLICY "posts_site_isolation" ON posts
--   FOR ALL
--   USING (
--     site_domain = current_setting('app.current_domain', true)
--     OR site_domain IS NULL  -- 마이그레이션 전 데이터 허용
--   );


-- ╔══════════════════════════════════════════╗
-- ║  PART 5: 확인 쿼리                         ║
-- ╚══════════════════════════════════════════╝

-- 마이그레이션 완료 후 아래 쿼리로 확인:
-- SELECT table_name, column_name
-- FROM information_schema.columns
-- WHERE column_name = 'site_domain'
-- ORDER BY table_name;
