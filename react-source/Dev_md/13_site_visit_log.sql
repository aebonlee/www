-- ============================================================
-- 13_site_visit_log.sql
-- 사이트별 방문 로그 테이블 (www 관리자 대시보드 전용)
-- ============================================================

CREATE TABLE IF NOT EXISTS site_visit_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  site_domain text NOT NULL,           -- e.g. 'jobpath.dreamitbiz.com'
  visited_at  timestamptz DEFAULT now(),
  user_agent  text
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_svl_domain_date ON site_visit_log(site_domain, visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_svl_user        ON site_visit_log(user_id);

-- RLS
ALTER TABLE site_visit_log ENABLE ROW LEVEL SECURITY;

-- 관리자만 읽기
CREATE POLICY "admin_read" ON site_visit_log FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'superadmin')
    )
  );

-- 누구나 INSERT (로그인한 사용자가 자기 방문 기록)
CREATE POLICY "anyone_insert" ON site_visit_log FOR INSERT
  WITH CHECK (true);
