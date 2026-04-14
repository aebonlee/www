-- ============================================
-- DreamIT Biz — orders SELECT 정책 + 프로필 트리거 복구
-- ★ Supabase SQL Editor에서 각 STEP별로 나눠서 실행하세요
-- 작성일: 2026-04-14
-- ============================================

-- ★ STEP 1: orders SELECT 정책 추가
DROP POLICY IF EXISTS "orders_select" ON orders;
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );
