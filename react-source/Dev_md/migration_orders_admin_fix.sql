-- ============================================
-- DreamIT Biz - 주문관리/회원관리 버그 수정 마이그레이션
-- Supabase Dashboard > SQL Editor에서 실행
-- 작성일: 2026-04-14
-- ============================================

-- ■ 1. orders 테이블 누락 컬럼 추가
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- ■ 2. payment_status CHECK 제약조건 수정 (refunded 추가)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded'));

-- ■ 3. user_profiles role CHECK 제약조건 수정 (superadmin, evaluator 추가)
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('user', 'admin', 'superadmin', 'evaluator'));

-- ■ 4. orders UPDATE 정책 추가 (관리자 주문 상태 변경 허용)
DROP POLICY IF EXISTS "orders_admin_update" ON orders;
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- ■ 5. order_items SELECT 정책 추가 (관리자 + 본인 주문)
DROP POLICY IF EXISTS "order_items_select" ON order_items;
CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (
        o.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
      )
    )
  );

-- ■ 6. 관리자 계정 role 확인 및 설정
-- (관리자 이메일의 role이 'admin'이 아니면 SELECT 정책이 작동하지 않음)
UPDATE user_profiles
SET role = 'admin'
WHERE email IN ('aebon@kakao.com', 'aebon@kyonggi.ac.kr')
  AND role != 'admin';

-- ■ 7. 확인 쿼리
SELECT email, role, status FROM user_profiles
WHERE email IN ('aebon@kakao.com', 'aebon@kyonggi.ac.kr');

SELECT COUNT(*) AS total_orders,
       SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_orders
FROM orders;
