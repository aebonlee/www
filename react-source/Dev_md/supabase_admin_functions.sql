-- ============================================
-- 관리자 전용 Supabase 함수 (RLS 우회)
-- Supabase Dashboard > SQL Editor 에서 실행
-- ============================================

-- 1. 회원 등급(role) 변경 함수
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
BEGIN
  -- 호출자 이메일 확인
  SELECT email INTO caller_email
  FROM auth.users
  WHERE id = auth.uid();

  -- 최고관리자만 허용
  IF caller_email NOT IN ('aebon@kakao.com', 'aebon@kyonggi.ac.kr') THEN
    RETURN json_build_object('error', 'Unauthorized: admin only');
  END IF;

  UPDATE user_profiles
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN json_build_object('success', true);
END;
$$;

-- 2. 방문 가입 사이트(signup_domain) 변경 함수
CREATE OR REPLACE FUNCTION update_user_signup_domain(target_user_id UUID, new_domain TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
BEGIN
  SELECT email INTO caller_email
  FROM auth.users
  WHERE id = auth.uid();

  IF caller_email NOT IN ('aebon@kakao.com', 'aebon@kyonggi.ac.kr') THEN
    RETURN json_build_object('error', 'Unauthorized: admin only');
  END IF;

  UPDATE user_profiles
  SET signup_domain = new_domain, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN json_build_object('success', true);
END;
$$;
