-- ============================================
-- DreamIT Biz - orders 테이블 site_domain 컬럼 추가
-- 멀티사이트 주문 추적용
-- Supabase Dashboard > SQL Editor에서 실행
-- 작성일: 2026-04-14
-- ============================================

-- ■ 1. site_domain 컬럼 추가 (주문이 발생한 사이트 도메인)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_domain TEXT;

-- ■ 2. 인덱스 추가 (사이트별 주문 필터링용)
CREATE INDEX IF NOT EXISTS idx_orders_site_domain ON orders(site_domain);

-- ■ 3. 확인
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'site_domain';
