-- ============================================
-- DreamIT Biz — orders SELECT 정책 + 프로필 트리거 복구
-- 문제: 관리자가 주문 목록을 볼 수 없음 (SELECT 정책 누락)
--       신규 회원 프로필이 자동 생성되지 않음 (트리거 미등록)
-- Supabase SQL Editor에서 실행
-- 작성일: 2026-04-14
-- ============================================

-- ■ 1. orders SELECT 정책 추가 (관리자 전체 + 본인 주문)
--    이것이 핵심 문제: SELECT 정책이 없어서 모든 조회가 빈 배열 반환
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

-- ■ 2. user_profiles 프로필 자동 생성 트리거 (재등록)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ■ 3. 기존 auth.users 중 user_profiles에 없는 회원 백필
INSERT INTO user_profiles (id, email, display_name, avatar_url, provider)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  u.raw_app_meta_data->>'provider'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);

-- ■ 4. 확인 쿼리
SELECT COUNT(*) AS total_profiles FROM user_profiles;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT payment_status, COUNT(*) FROM orders GROUP BY payment_status;
