# Supabase 연동: boardStorage.js → Supabase 전용

**날짜**: 2026-02-19
**상태**: 완료

## 변경 요약

`boardStorage.js`를 순수 localStorage 기반에서 **Supabase 전용**으로 전환.
localStorage는 사용하지 않으며, Supabase 미설정 시 빈 배열/null 반환.

## 수정 파일 (7개)

| 파일 | 변경 내용 |
|------|----------|
| `src/utils/boardStorage.js` | 전체 리팩토링: async + Supabase 전용 + snake_case↔camelCase 매핑 |
| `src/pages/Board.jsx` | useEffect async IIFE |
| `src/pages/BoardDetail.jsx` | useEffect + handleDelete async |
| `src/pages/BoardWrite.jsx` | useEffect + handleSubmit async |
| `src/pages/Blog.jsx` | useEffect async IIFE |
| `src/pages/BlogDetail.jsx` | useEffect async IIFE |
| `src/pages/Gallery.jsx` | useEffect async IIFE |

## 함수별 Supabase 매핑

| 함수 | 테이블 | 쿼리 |
|------|--------|------|
| `getBoardPosts()` | `board_posts` | `.select('*').order('id', { ascending: false })` |
| `getBoardPost(id)` | `board_posts` | `.select('*').eq('id', id).single()` |
| `createBoardPost({...})` | `board_posts` | `.insert({...}).select().single()` |
| `updateBoardPost(id, updates)` | `board_posts` | `.update({...}).eq('id', id).select().single()` |
| `deleteBoardPost(id)` | `board_posts` | `.delete().eq('id', id)` |
| `incrementBoardViews(id)` | `board_posts` | read→views+1→update |
| `getBlogPosts()` | `blog_posts` | `.select('*').order('id', { ascending: false })` |
| `getBlogPost(id)` | `blog_posts` | `.select('*').eq('id', id).single()` |
| `getGalleryItems()` | `gallery_items` | `.select('*').order('id', { ascending: false })` |
| `getGalleryItem(id)` | `gallery_items` | `.select('*').eq('id', id).single()` |

## 컬럼명 매핑 (자동 변환)

boardStorage.js 내 `toCamel(row)` / `toSnake(obj)` 헬퍼가 자동 변환:

| Supabase (snake_case) | JS (camelCase) |
|------------------------|----------------|
| `category_en` | `categoryEn` |
| `title_en` | `titleEn` |
| `excerpt_en` | `excerptEn` |
| `content_en` | `contentEn` |
| `image_url` | `imageUrl` |
| `description_en` | `descriptionEn` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |

## Supabase 테이블 SQL

```sql
-- board_posts
CREATE TABLE board_posts (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'free',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '익명',
  date TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- blog_posts
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  category TEXT,
  category_en TEXT,
  title TEXT NOT NULL,
  title_en TEXT,
  excerpt TEXT,
  excerpt_en TEXT,
  content TEXT,
  content_en TEXT,
  icon TEXT DEFAULT '📝',
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- gallery_items
CREATE TABLE gallery_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  category TEXT DEFAULT 'project',
  image_url TEXT,
  description TEXT,
  description_en TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 환경 변수

`.env` 파일에 아래 값 설정 필요:

```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

## 설계 원칙

- **Supabase 전용**: localStorage 사용 안 함
- **에러 안전**: Supabase 쿼리 실패 시 빈 배열/null 반환 (console.error 로깅)
- **컬럼명 매핑**: 자동 snake_case ↔ camelCase 변환
- **기존 API 시그니처 유지**: 함수명/파라미터 동일, 반환값만 Promise로 변경
