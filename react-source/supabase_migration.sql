-- ============================================================
-- DreamIT Biz — Supabase 종합 마이그레이션 SQL
-- 실행 순서: 위에서 아래로 순차 실행
-- 생성일: 2026-02-19
-- ============================================================

-- ────────────────────────────────────────────────
-- Phase 0: 인증 시스템
-- ────────────────────────────────────────────────

-- 1. user_profiles 테이블
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.user_profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. 회원가입 시 프로필 자동 생성 트리거
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────
-- Phase 1: 블로그 CRUD
-- ────────────────────────────────────────────────

-- blog_posts 컬럼 추가
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- blog_posts RLS (관리자만 쓰기)
CREATE POLICY "blog_select" ON public.blog_posts
  FOR SELECT USING (true);
CREATE POLICY "admin_insert_blog" ON public.blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_update_blog" ON public.blog_posts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_delete_blog" ON public.blog_posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────────────
-- Phase 2: 갤러리 CRUD + 이미지 업로드
-- ────────────────────────────────────────────────

-- gallery_items 컬럼 추가
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- gallery_items RLS
CREATE POLICY "gallery_select" ON public.gallery_items
  FOR SELECT USING (true);
CREATE POLICY "admin_insert_gallery" ON public.gallery_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_update_gallery" ON public.gallery_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_delete_gallery" ON public.gallery_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage: media 버킷 (Supabase Dashboard에서 생성하거나 아래 SQL 실행)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "admin_upload_media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_delete_media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────────────
-- Phase 3: 스토어 DB 전환
-- ────────────────────────────────────────────────

-- products 테이블
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('book','ebook','periodical','material','course')),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_sold_out BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "admin_insert_products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_update_products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "admin_delete_products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 기존 하드코딩 상품 마이그레이션 (22개)
INSERT INTO public.products (slug, category, title, title_en, description, description_en, price, sort_order)
VALUES
  -- Books
  ('book-001', 'book', '실전 React 개발', 'Practical React Development', NULL, NULL, 35000, 1),
  ('book-002', 'book', 'Python 데이터 분석 입문', 'Introduction to Python Data Analysis', NULL, NULL, 32000, 2),
  ('book-003', 'book', '클라우드 아키텍처 가이드', 'Cloud Architecture Guide', NULL, NULL, 38000, 3),
  ('book-004', 'book', 'AI 시대의 비즈니스 전략', 'Business Strategy in the AI Era', NULL, NULL, 28000, 4),
  -- Materials (as book category)
  ('mat-001', 'book', '생성형 AI 활용 실습 교재', 'Generative AI Practical Workbook', NULL, NULL, 25000, 5),
  ('mat-002', 'book', 'Python 데이터 분석 강의안', 'Python Data Analysis Lecture Notes', NULL, NULL, 22000, 6),
  ('mat-003', 'book', '빅데이터 시각화 실습자료', 'Big Data Visualization Practice Materials', NULL, NULL, 20000, 7),
  ('mat-004', 'book', '업무자동화 RPA 워크북', 'RPA Automation Workbook', NULL, NULL, 18000, 8),
  -- E-books
  ('ebook-001', 'ebook', 'ePub 전자책 제작 가이드', 'ePub E-book Production Guide', 'ePub 포맷 전자책 제작 완벽 가이드', 'Complete guide to ePub e-book production', 15000, 9),
  ('ebook-002', 'ebook', '인터랙티브 전자책 실무', 'Interactive E-book Practical', '동영상/애니메이션 포함 인터랙티브 전자책', 'Interactive e-book with video and animation', 22000, 10),
  ('ebook-003', 'ebook', 'PDF 전자출판 마스터', 'PDF E-Publishing Master', '고품질 PDF 전자출판 제작 노하우', 'Know-how for high-quality PDF e-publishing', 18000, 11),
  ('ebook-004', 'ebook', '오디오북 제작 입문', 'Audiobook Production Basics', '텍스트 기반 콘텐츠를 오디오북으로 전환하는 방법', 'How to convert text-based content to audiobooks', 20000, 12),
  -- Periodicals
  ('period-001', 'periodical', '기업 뉴스레터 템플릿 모음', 'Corporate Newsletter Template Collection', '사내외 소통을 위한 뉴스레터 템플릿', 'Newsletter templates for communication', 18000, 13),
  ('period-002', 'periodical', '학술지 편집 매뉴얼', 'Academic Journal Editing Manual', '학술 저널 편집 및 제작 매뉴얼', 'Manual for academic journal editing', 25000, 14),
  ('period-003', 'periodical', '사보 디자인 가이드', 'Company Magazine Design Guide', '기업 홍보를 위한 사보 디자인 가이드', 'Design guide for company magazines', 22000, 15),
  ('period-004', 'periodical', '연간 보고서 템플릿', 'Annual Report Template', '전문 연간 보고서 편집 템플릿', 'Professional annual report editing template', 30000, 16),
  -- Courses
  ('course-001', 'course', 'React 실무 과정', 'React Practical Course', 'React 기반 웹 프론트엔드 개발 실무', 'Practical React web frontend development', 450000, 17),
  ('course-002', 'course', 'Python 데이터 분석', 'Python Data Analysis', 'Python을 활용한 데이터 분석 기초', 'Foundations of data analysis with Python', 380000, 18),
  ('course-003', 'course', 'AWS 클라우드 아키텍처', 'AWS Cloud Architecture', 'AWS 기반 클라우드 인프라 설계', 'Cloud infrastructure design on AWS', 550000, 19),
  ('course-004', 'course', 'UI/UX 디자인 실무', 'UI/UX Design Practical', 'Figma를 활용한 UI/UX 디자인', 'UI/UX design with Figma', 420000, 20),
  ('course-005', 'course', 'Node.js 백엔드 개발', 'Node.js Backend Development', 'Node.js와 Express 기반 서버 개발', 'Server development with Node.js and Express', 480000, 21),
  ('course-006', 'course', 'AI/머신러닝 입문', 'AI/ML Introduction', '인공지능과 머신러닝의 기초 개념', 'Foundational concepts of AI and machine learning', 400000, 22)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────
-- Phase 4: 게시판 인증 연동
-- ────────────────────────────────────────────────

ALTER TABLE public.board_posts
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- board_posts RLS 재설정
DROP POLICY IF EXISTS "board_posts_select" ON public.board_posts;
DROP POLICY IF EXISTS "board_posts_insert" ON public.board_posts;
DROP POLICY IF EXISTS "board_posts_update" ON public.board_posts;
DROP POLICY IF EXISTS "board_posts_delete" ON public.board_posts;

CREATE POLICY "board_read" ON public.board_posts
  FOR SELECT USING (true);
CREATE POLICY "board_insert" ON public.board_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "board_update" ON public.board_posts
  FOR UPDATE USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "board_delete" ON public.board_posts
  FOR DELETE USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────────────
-- Phase 5: 주문 이력
-- ────────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- orders RLS
DROP POLICY IF EXISTS "orders_select" ON public.orders;

CREATE POLICY "orders_user_select" ON public.orders
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
-- 비로그인 주문 삽입도 허용 (anon key)
CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 완료
-- Supabase Dashboard에서 추가로 필요한 설정:
-- 1. Auth > Providers: Google, Kakao, Naver 활성화 + 키 입력
-- 2. 최초 관리자: user_profiles.role = 'admin' 수동 설정
-- ============================================================
