-- ============================================
-- www 총괄 대시보드 — 회원/결제 조회 불가 긴급 수정
-- 문제: 관리자 대시보드에서 회원, 결제 데이터가 안 보임
-- 원인: RLS SELECT 정책 누락 또는 admin role 미설정
-- Supabase SQL Editor에서 실행
-- 작성일: 2026-04-15
-- ============================================

-- ■ 1. user_profiles: 누구나 조회 가능 (프로필은 공개)
DROP POLICY IF EXISTS "profiles_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
CREATE POLICY "user_profiles_select" ON user_profiles
  FOR SELECT USING (true);

-- ■ 2. orders: 본인 + 관리자 조회
DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "select_own" ON orders;
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email IN ('aebon@kakao.com', 'radical8566@gmail.com')
    )
  );

-- ■ 3. orders: 관리자 UPDATE
DROP POLICY IF EXISTS "orders_admin_update" ON orders;
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
    OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email IN ('aebon@kakao.com', 'radical8566@gmail.com'))
  );

-- ■ 4. order_items: 관리자 + 본인 조회
DROP POLICY IF EXISTS "order_items_select" ON order_items;
CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (
        o.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
        OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email IN ('aebon@kakao.com', 'radical8566@gmail.com'))
      )
    )
  );

-- ■ 5. forjob_orders: www 총괄에서도 조회 필요 (is_forjob_admin 또는 이메일 fallback)
-- is_forjob_admin()이 이미 존재하면 이 정책이 사용됨
-- 존재하지 않으면 아래에서 생성
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'is_forjob_admin'
  ) THEN
    EXECUTE '
      CREATE FUNCTION is_forjob_admin() RETURNS BOOLEAN AS $f$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid()
          AND email IN (''aebon@kakao.com'', ''radical8566@gmail.com'')
        );
      END;
      $f$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
    ';
  END IF;
END;
$$;

-- forjob_orders SELECT 정책 (이미 있으면 재생성)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'forjob_orders') THEN
    EXECUTE 'DROP POLICY IF EXISTS "orders_select" ON forjob_orders';
    EXECUTE 'DROP POLICY IF EXISTS "select_own" ON forjob_orders';
    EXECUTE 'DROP POLICY IF EXISTS "admin_read_all_orders" ON forjob_orders';
    EXECUTE '
      CREATE POLICY "orders_select" ON forjob_orders
        FOR SELECT USING (
          auth.uid() = user_id
          OR is_forjob_admin()
          OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email IN (''aebon@kakao.com'', ''radical8566@gmail.com'')
          )
        )
    ';
  END IF;
END;
$$;

-- ■ 6. 관리자 role 확인 및 설정
UPDATE user_profiles SET role = 'superadmin'
WHERE email = 'aebon@kakao.com' AND (role IS NULL OR role NOT IN ('admin', 'superadmin'));

UPDATE user_profiles SET role = 'admin'
WHERE email IN ('radical8566@gmail.com', 'aebon@kyonggi.ac.kr')
  AND (role IS NULL OR role NOT IN ('admin', 'superadmin'));

-- ■ 7. 프로필 자동 생성 트리거 (최신 버전 — ON CONFLICT 포함)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url, provider, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    'member'
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

-- ■ 8. 기존 auth.users 중 user_profiles에 없는 회원 백필
INSERT INTO user_profiles (id, email, display_name, avatar_url, provider)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  u.raw_app_meta_data->>'provider'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);

-- ■ 9. 확인 쿼리
SELECT 'user_profiles' AS tbl, COUNT(*) AS cnt FROM user_profiles
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'forjob_orders', COUNT(*) FROM forjob_orders;

SELECT email, role FROM user_profiles WHERE role IN ('admin', 'superadmin');
