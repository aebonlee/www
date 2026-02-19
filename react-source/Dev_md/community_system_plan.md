# 커뮤니티 시스템 구현: 게시판 CRUD + 블로그 상세 + 갤러리

## Context

사이트에 게시판(Board) 리스트와 블로그(Blog) 리스트 페이지는 존재하지만 모두 하드코딩된 샘플 데이터. 상세 페이지, 글쓰기/수정/삭제, 갤러리가 없음. Supabase 키 설정은 나중에 하므로 **localStorage 폴백**으로 먼저 개발하고, 키 입력 시 자동으로 Supabase 전환되는 구조.

## 신규 파일 (6개)

| 파일 | 설명 |
|------|------|
| `src/utils/boardStorage.js` | 게시판/블로그/갤러리 CRUD (localStorage 폴백 + Supabase 대응) |
| `src/components/Pagination.jsx` | 재사용 가능한 페이지네이션 컴포넌트 |
| `src/styles/community.css` | 게시판 상세/글쓰기, 블로그 상세, 갤러리, 라이트박스, 페이지네이션 스타일 |
| `src/pages/BoardDetail.jsx` | 게시판 글 상세 보기 |
| `src/pages/BoardWrite.jsx` | 게시판 글쓰기/수정 폼 |
| `src/pages/BlogDetail.jsx` | 블로그 글 상세 보기 |
| `src/pages/Gallery.jsx` | 갤러리 페이지 (이미지 그리드 + 라이트박스) |

## 수정 파일 (7개)

| 파일 | 변경 내용 |
|------|----------|
| `src/App.jsx` | 4개 lazy import + 5개 라우트 추가 |
| `src/components/layout/Navbar.jsx` | 커뮤니티 드롭다운에 갤러리 추가 |
| `src/pages/Board.jsx` | 하드코딩 → boardStorage, Link 연결, 페이지네이션 |
| `src/pages/Blog.jsx` | 하드코딩 → boardStorage, Link 연결, 페이지네이션, useLanguage 적용 |
| `src/utils/translations.js` | ~60개 번역 키 추가 (ko/en) |
| `src/index.css` | `@import './styles/community.css'` 추가 |
| `src/styles/responsive.css` | 갤러리 그리드, 상세 페이지, 폼 반응형 |
| `src/styles/dark-mode.css` | 새 컴포넌트 다크모드 |

## 라우트 추가

```
/community/board/write      → BoardWrite (글쓰기)
/community/board/edit/:id   → BoardWrite (수정)
/community/board/:postId    → BoardDetail (상세)
/community/blog/:postId     → BlogDetail (상세)
/community/gallery          → Gallery (갤러리)
```

## 데이터 구조 (localStorage → 나중에 Supabase 테이블과 1:1 매핑)

**게시판** (`dreamitbiz_board_posts`):
```
{ id, category(notice/free/qna), title, content, author, date, views, created_at, updated_at }
```

**블로그** (`dreamitbiz_blog_posts`):
```
{ id, category, categoryEn, title, titleEn, excerpt, excerptEn, content, contentEn, icon, date, created_at }
```

**갤러리** (`dreamitbiz_gallery_items`):
```
{ id, title, titleEn, category(project/office/event/education), imageUrl, description, descriptionEn, date, created_at }
```

## 설계 원칙

- **갤러리 이미지**: Supabase Storage 미설정이므로 CSS 그라데이션 플레이스홀더 (블로그 카드와 동일 패턴)
- **인증 없음**: 글쓰기/수정/삭제에 로그인 불필요 (나중에 Supabase Auth로 추가)
- **리치 에디터 없음**: textarea + `white-space: pre-wrap` (심플하게)
- **시드 데이터**: 첫 접근 시 localStorage에 샘플 데이터 자동 생성
- **5색 테마/다크모드**: 모든 스타일은 CSS 변수만 사용 → 자동 대응
