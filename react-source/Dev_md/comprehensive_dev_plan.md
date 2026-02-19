# DreamIT Biz 종합 기능 개발 계획

## Context

현재 DreamIT Biz React SPA(`D:\www\react-source`)는 **인증 시스템이 전무**하고, 블로그·갤러리는 읽기 전용, 스토어 상품은 하드코딩 JS 파일에 정의되어 있다. 사용자는 다음을 요청:
1. 블로그/갤러리에 글쓰기·수정·삭제 기능 추가
2. 스토어에 상품 관리(등록/수정/삭제/판매완료) + 장바구니→결제 DB화
3. 카카오·네이버·구글 소셜 로그인 + 이메일 가입 회원가입 시스템
4. 모든 데이터를 Supabase DB로 관리

**기술 스택**: React 19, React Router v7 (HashRouter), Supabase JS v2.96.0, Vite 7, PortOne V2
**Supabase**: `hcmgdztsgjvzcyxyayaj` (Mumbai region)

**상태**: 전체 완료 (2026-02-19)

---

## 개발 순서 (6 Phase)

```
Phase 0: 인증 시스템 ──────── [기반, 모든 Phase의 선행] ✅
   ├── Phase 1: 블로그 CRUD ── [관리자 전용 글쓰기] ✅
   ├── Phase 2: 갤러리 CRUD + 이미지 업로드 ✅
   └── Phase 4: 게시판 인증 연동 ✅
Phase 3: 스토어 DB 전환 ───── [Phase 0 + Phase 2 이후] ✅
Phase 5: 주문 이력 + 마이페이지 보강 ── [Phase 0 + Phase 3 이후] ✅
```

---

## Phase 0: 인증 시스템 (Supabase Auth + 소셜 로그인)

### Supabase 설정

**신규 테이블: `user_profiles`**
```sql
CREATE TABLE public.user_profiles (
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

CREATE POLICY "profiles_select" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
```

**트리거: 회원가입 시 프로필 자동 생성**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url, provider)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**OAuth 프로바이더** (Supabase Dashboard 설정 완료):
- Google: ✅ Client ID `899974314812-vn03m9taboqb7kc146j4fb8bhn599m0j.apps.googleusercontent.com`
- Kakao: ✅ REST API Key `c71805c94a02e91c2c1ea4ff50c0d159`
- Naver: ❌ 네이티브 미지원 → 제거

### 신규 파일 (8개)

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/contexts/AuthContext.jsx` | 세션 관리, 로그인/로그아웃, 프로필, isAdmin 판별 |
| 2 | `src/utils/auth.js` | signInWithGoogle/Kakao, signInWithEmail, signUp, signOut, getProfile |
| 3 | `src/components/AuthGuard.jsx` | 인증 필요 라우트 래퍼 |
| 4 | `src/components/AdminGuard.jsx` | 관리자 전용 라우트 래퍼 |
| 5 | `src/pages/Login.jsx` | 소셜 로그인 버튼 2종 + 이메일/비밀번호 폼 |
| 6 | `src/pages/Register.jsx` | 이메일 회원가입 폼 |
| 7 | `src/pages/MyPage.jsx` | 프로필 조회/수정, 주문 이력 |
| 8 | `src/styles/auth.css` | 로그인/가입/마이페이지 스타일 |

---

## Phase 1: 블로그 CRUD (관리자 전용)

### 신규 파일

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/pages/BlogWrite.jsx` | 블로그 글쓰기/수정 폼 |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/utils/boardStorage.js` | `createBlogPost()`, `updateBlogPost()`, `deleteBlogPost()` 추가 |
| `src/pages/Blog.jsx` | 관리자 "글쓰기" 버튼 |
| `src/pages/BlogDetail.jsx` | 관리자 수정/삭제 버튼 |

---

## Phase 2: 갤러리 CRUD + 이미지 업로드

### 신규 파일

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/pages/GalleryWrite.jsx` | 갤러리 등록/수정 폼 + 이미지 업로드 |
| 2 | `src/components/ImageUpload.jsx` | 재사용 이미지 업로드 (드래그앤드롭) |
| 3 | `src/utils/storage.js` | Supabase Storage 헬퍼 |

---

## Phase 3: 스토어 DB 전환 + 상품 관리

### 신규 파일

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/utils/productStorage.js` | 상품 CRUD |
| 2 | `src/pages/ProductWrite.jsx` | 관리자 상품 등록/수정 폼 |

---

## Phase 4: 게시판 인증 연동

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/pages/Board.jsx` | 로그인 시만 "글쓰기" 버튼 |
| `src/pages/BoardWrite.jsx` | 작성자 자동 입력, `author_id` 저장 |
| `src/pages/BoardDetail.jsx` | 본인/관리자만 수정/삭제 |

---

## Phase 5: 주문 이력 + 마이페이지 보강

### 신규 파일

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/pages/OrderHistory.jsx` | 내 주문 목록 + 상세 보기 |

---

## Supabase 최종 상태

| 유형 | 내용 |
|------|------|
| 테이블 | `user_profiles`, `products`, `blog_posts`, `board_posts`, `gallery_items`, `orders`, `order_items` (7개) |
| Storage | `media` 버킷 (public: true) |
| RLS 정책 | 22개 |
| 트리거 | `on_auth_user_created` |
| Auth 프로바이더 | Google, Kakao, Email |
| site_url | `https://www.dreamitbiz.com` |

## 구현 커밋

- `40eb110` feat: 종합 기능 개발 (6 Phase, 92 files, +3385/-212)
- `d054506` deploy: 네이버 제거 + OAuth 설정 반영 빌드 배포
