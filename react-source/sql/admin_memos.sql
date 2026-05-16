-- admin_memos 테이블 생성
-- 관리자 메모를 Supabase에 영속 저장 (기존 localStorage 대체)

CREATE TABLE IF NOT EXISTS admin_memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_admin_memos_user_id ON admin_memos(user_id);

-- RLS 정책: superadmin 3개 이메일만 접근
ALTER TABLE admin_memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage admin_memos" ON admin_memos
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('aebon@kakao.com', 'radical8566@gmail.com', 'aebon@kyonggi.ac.kr')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('aebon@kakao.com', 'radical8566@gmail.com', 'aebon@kyonggi.ac.kr')
    )
  );
