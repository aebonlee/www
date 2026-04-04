-- ============================================================
-- Genspark Supabase 테이블 설정
-- chatgpt 프로젝트 스키마와 동일 구조, genspark_ 접두어
-- 실행: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. genspark_posts 테이블
CREATE TABLE IF NOT EXISTS genspark_posts (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Anonymous',
  category TEXT DEFAULT 'free',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_genspark_posts_category ON genspark_posts(category);
CREATE INDEX IF NOT EXISTS idx_genspark_posts_created_at ON genspark_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_genspark_posts_author_id ON genspark_posts(author_id);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION genspark_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS genspark_posts_updated_at ON genspark_posts;
CREATE TRIGGER genspark_posts_updated_at
  BEFORE UPDATE ON genspark_posts
  FOR EACH ROW EXECUTE FUNCTION genspark_update_updated_at();

-- RLS 정책
ALTER TABLE genspark_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "genspark_posts_select" ON genspark_posts
  FOR SELECT USING (true);

CREATE POLICY "genspark_posts_insert" ON genspark_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "genspark_posts_update" ON genspark_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "genspark_posts_delete" ON genspark_posts
  FOR DELETE USING (auth.uid() = author_id);

-- 2. genspark_comments 테이블
CREATE TABLE IF NOT EXISTS genspark_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES genspark_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Anonymous',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_genspark_comments_post_id ON genspark_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_genspark_comments_author_id ON genspark_comments(author_id);

-- RLS 정책
ALTER TABLE genspark_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "genspark_comments_select" ON genspark_comments
  FOR SELECT USING (true);

CREATE POLICY "genspark_comments_insert" ON genspark_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "genspark_comments_delete" ON genspark_comments
  FOR DELETE USING (auth.uid() = author_id);

-- 3. 조회수 증가 RPC 함수
CREATE OR REPLACE FUNCTION genspark_increment_view_count(p_post_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE genspark_posts SET view_count = view_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 완료! genspark_posts + genspark_comments + RPC 함수 생성됨
-- ============================================================
