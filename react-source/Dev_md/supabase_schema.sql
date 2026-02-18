-- ============================================
-- DreamIT Biz 이커머스 - Supabase DB 스키마
-- 3차 개발: 장바구니 + 결제 시스템
-- 작성일: 2026-02-18
-- ============================================

-- 상품 테이블
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('book', 'ebook', 'periodical', 'course')),
  price INTEGER NOT NULL,  -- 원 단위
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 주문 테이블
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  total_amount INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
  portone_payment_id TEXT,
  portone_tx_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- 주문 상세 테이블
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_title TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL
);

-- 인덱스
CREATE INDEX idx_orders_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- RLS 정책
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 상품: 누구나 조회 가능
CREATE POLICY "products_read" ON products FOR SELECT USING (is_active = true);

-- 주문: 누구나 INSERT 가능 (비인증 구매 지원)
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);

-- 주문 조회: service_role만 (Edge Function에서 처리)
-- 프론트엔드에서 직접 주문 조회는 Edge Function 경유

-- ============================================
-- 샘플 데이터 (개발/테스트용)
-- ============================================
INSERT INTO products (title, title_en, description, description_en, category, price) VALUES
  ('실전 React 개발', 'Practical React Development', 'React 기반 웹 프론트엔드 개발 실무 도서', 'Practical React web frontend development book', 'book', 35000),
  ('Python 데이터 분석 입문', 'Introduction to Python Data Analysis', 'Python을 활용한 데이터 분석 기초 도서', 'Foundations of data analysis with Python', 'book', 32000),
  ('클라우드 아키텍처 가이드', 'Cloud Architecture Guide', 'AWS 기반 클라우드 인프라 설계 가이드', 'Cloud infrastructure design guide on AWS', 'book', 38000),
  ('AI 시대의 비즈니스 전략', 'Business Strategy in the AI Era', '인공지능 시대의 비즈니스 전략 도서', 'Business strategy book for the AI era', 'book', 28000),
  ('ePub 전자책 제작 가이드', 'ePub E-book Production Guide', 'ePub 포맷 전자책 제작 완벽 가이드', 'Complete guide to ePub e-book production', 'ebook', 15000),
  ('인터랙티브 전자책 실무', 'Interactive E-book Practical', '동영상/애니메이션 포함 인터랙티브 전자책', 'Interactive e-book with video and animation', 'ebook', 22000),
  ('기업 뉴스레터 템플릿 모음', 'Corporate Newsletter Template Collection', '사내외 소통을 위한 뉴스레터 템플릿', 'Newsletter templates for communication', 'periodical', 18000),
  ('학술지 편집 매뉴얼', 'Academic Journal Editing Manual', '학술 저널 편집 및 제작 매뉴얼', 'Manual for academic journal editing', 'periodical', 25000),
  ('React 실무 과정', 'React Practical Course', 'React 기반 웹 프론트엔드 개발 실무 온라인 과정 (40시간)', 'Practical React course (40 hours)', 'course', 450000),
  ('Python 데이터 분석', 'Python Data Analysis', 'Python을 활용한 데이터 분석 기초 과정 (32시간)', 'Python data analysis course (32 hours)', 'course', 380000),
  ('AWS 클라우드 아키텍처', 'AWS Cloud Architecture', 'AWS 기반 클라우드 인프라 설계 과정 (48시간)', 'AWS cloud architecture course (48 hours)', 'course', 550000),
  ('UI/UX 디자인 실무', 'UI/UX Design Practical', 'Figma를 활용한 UI/UX 디자인 과정 (36시간)', 'UI/UX design with Figma course (36 hours)', 'course', 420000),
  ('Node.js 백엔드 개발', 'Node.js Backend Development', 'Node.js와 Express 기반 서버 개발 과정 (44시간)', 'Node.js backend course (44 hours)', 'course', 480000),
  ('AI/머신러닝 입문', 'AI/ML Introduction', '인공지능과 머신러닝 기초 과정 (36시간)', 'AI/ML introduction course (36 hours)', 'course', 400000);
