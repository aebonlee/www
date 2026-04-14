-- ★ STEP 3: 트리거 등록
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ★ STEP 4: 기존 auth.users 중 user_profiles에 없는 회원 백필
INSERT INTO user_profiles (id, email, display_name, avatar_url, provider)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  u.raw_app_meta_data->>'provider'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);

-- ★ STEP 5: 확인
SELECT COUNT(*) AS total_profiles FROM user_profiles;
SELECT COUNT(*) AS total_orders FROM orders;
