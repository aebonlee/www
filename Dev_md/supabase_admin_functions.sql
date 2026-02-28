-- ============================================
-- 회원 관리 — DB 스키마 + SQL 함수
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- ── 0. role 기본값 'member'로 변경 + signup_domain / visited_sites 컬럼 ──
ALTER TABLE user_profiles ALTER COLUMN role SET DEFAULT 'member';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS signup_domain TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS visited_sites TEXT[] DEFAULT '{}';

-- ── 0-1. 회원가입 트리거 업데이트 (role='member', signup_domain 자동 설정) ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url, provider, role, signup_domain)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    'member',
    NEW.raw_user_meta_data->>'signup_domain'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 1. user_profiles 테이블 컬럼 추가 ──
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status_reason TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status_changed_by UUID;

-- ── 2. admin_update_user_status — 정지/차단/복구/소프트삭제 ──
CREATE OR REPLACE FUNCTION admin_update_user_status(
  target_user_id UUID,
  new_status TEXT,
  reason TEXT DEFAULT NULL,
  suspend_until TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  target_email TEXT;
  admin_emails TEXT[] := ARRAY['aebon@kakao.com', 'aebon@kyonggi.ac.kr'];
BEGIN
  -- 호출자 이메일
  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  IF caller_email IS NULL OR NOT (lower(caller_email) = ANY(admin_emails)) THEN
    RETURN jsonb_build_object('error', '관리자 권한이 필요합니다.');
  END IF;

  -- 대상 이메일 확인 (최고관리자 보호)
  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;
  IF target_email IS NULL THEN
    RETURN jsonb_build_object('error', '대상 유저를 찾을 수 없습니다.');
  END IF;
  IF lower(target_email) = ANY(admin_emails) THEN
    RETURN jsonb_build_object('error', '최고관리자의 상태는 변경할 수 없습니다.');
  END IF;

  -- 유효한 상태값 확인
  IF new_status NOT IN ('active', 'suspended', 'banned', 'deleted') THEN
    RETURN jsonb_build_object('error', '유효하지 않은 상태값입니다: ' || new_status);
  END IF;

  -- 상태 업데이트
  UPDATE user_profiles
  SET status = new_status,
      suspended_until = CASE WHEN new_status = 'suspended' THEN suspend_until ELSE NULL END,
      status_reason = reason,
      status_changed_at = now(),
      status_changed_by = auth.uid()
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'status', new_status);
END;
$$;

-- ── 3. admin_update_user_profile — 프로필 수정 ──
CREATE OR REPLACE FUNCTION admin_update_user_profile(
  target_user_id UUID,
  new_display_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  admin_emails TEXT[] := ARRAY['aebon@kakao.com', 'aebon@kyonggi.ac.kr'];
BEGIN
  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  IF caller_email IS NULL OR NOT (lower(caller_email) = ANY(admin_emails)) THEN
    RETURN jsonb_build_object('error', '관리자 권한이 필요합니다.');
  END IF;

  UPDATE user_profiles
  SET display_name = new_display_name
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ── 4. admin_delete_user — 완전 삭제 (auth.users CASCADE) ──
CREATE OR REPLACE FUNCTION admin_delete_user(
  target_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  target_email TEXT;
  admin_emails TEXT[] := ARRAY['aebon@kakao.com', 'aebon@kyonggi.ac.kr'];
BEGIN
  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  IF caller_email IS NULL OR NOT (lower(caller_email) = ANY(admin_emails)) THEN
    RETURN jsonb_build_object('error', '관리자 권한이 필요합니다.');
  END IF;

  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;
  IF target_email IS NULL THEN
    RETURN jsonb_build_object('error', '대상 유저를 찾을 수 없습니다.');
  END IF;
  IF lower(target_email) = ANY(admin_emails) THEN
    RETURN jsonb_build_object('error', '최고관리자는 삭제할 수 없습니다.');
  END IF;

  -- auth.users 삭제 → ON DELETE CASCADE로 user_profiles도 삭제
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ── 5. check_user_status — 로그인 시 상태 확인 + signup_domain/visited_sites 자동 설정 ──
-- 주의: 기존 1파라미터 버전이 있으면 먼저 삭제 필요
--   DROP FUNCTION IF EXISTS check_user_status(UUID);
CREATE OR REPLACE FUNCTION check_user_status(
  target_user_id UUID,
  current_domain TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_status TEXT;
  user_suspended_until TIMESTAMPTZ;
  user_reason TEXT;
  user_signup_domain TEXT;
  user_visited_sites TEXT[];
BEGIN
  SELECT status, suspended_until, status_reason, signup_domain, visited_sites
  INTO user_status, user_suspended_until, user_reason, user_signup_domain, user_visited_sites
  FROM user_profiles
  WHERE id = target_user_id;

  -- signup_domain 자동 설정 (최초 가입 사이트)
  IF (user_signup_domain IS NULL OR user_signup_domain = '') AND current_domain IS NOT NULL AND current_domain != '' THEN
    UPDATE user_profiles
    SET signup_domain = current_domain
    WHERE id = target_user_id;
  END IF;

  -- visited_sites 배열에 현재 도메인 추가 (중복 방지)
  IF current_domain IS NOT NULL AND current_domain != '' THEN
    IF user_visited_sites IS NULL OR NOT (current_domain = ANY(user_visited_sites)) THEN
      UPDATE user_profiles
      SET visited_sites = array_append(COALESCE(visited_sites, '{}'), current_domain)
      WHERE id = target_user_id;
    END IF;
  END IF;

  IF user_status IS NULL THEN
    RETURN jsonb_build_object('status', 'active');
  END IF;

  -- 정지 기간 만료 시 자동 복구
  IF user_status = 'suspended' AND user_suspended_until IS NOT NULL AND user_suspended_until < now() THEN
    UPDATE user_profiles
    SET status = 'active',
        suspended_until = NULL,
        status_reason = NULL,
        status_changed_at = now()
    WHERE id = target_user_id;

    RETURN jsonb_build_object('status', 'active');
  END IF;

  RETURN jsonb_build_object(
    'status', user_status,
    'reason', COALESCE(user_reason, ''),
    'suspended_until', user_suspended_until
  );
END;
$$;
