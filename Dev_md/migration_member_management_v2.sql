-- ============================================
-- 회원 관리 v2 마이그레이션
-- last_active_at 추가 + check_user_status RPC 개선
-- Supabase Dashboard > SQL Editor에서 실행
-- 실행일: 2026-03-26
-- ============================================

-- ── 1. last_active_at 컬럼 추가 ──
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- 기존 last_sign_in_at 데이터가 있으면 last_active_at 초기값으로 복사
UPDATE user_profiles
SET last_active_at = last_sign_in_at
WHERE last_active_at IS NULL AND last_sign_in_at IS NOT NULL;

-- ── 2. check_user_status RPC 업데이트 ──
-- visited_sites 자동 추가 + last_active_at 자동 갱신
-- 기존 함수의 반환 타입이 다를 수 있으므로 DROP 후 재생성
DROP FUNCTION IF EXISTS check_user_status(UUID, TEXT);

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

  -- last_active_at 갱신 (매 호출 시)
  UPDATE user_profiles
  SET last_active_at = now()
  WHERE id = target_user_id;

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

-- ── 3. 인덱스 추가 ──
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active_at ON user_profiles(last_active_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_user_profiles_signup_domain ON user_profiles(signup_domain);
