# 개발 로그 - 2026-02-19 (세션 4)

## 작업자: Claude Opus 4.6

---

## 세션 13: 커뮤니티 시스템 구현 — 게시판 CRUD + 블로그 상세 + 갤러리

**커밋**: `9b17b9f` feat: 커뮤니티 시스템 구현 — 게시판 CRUD + 블로그 상세 + 갤러리

### 개요

기존에 하드코딩된 샘플 데이터로만 존재하던 게시판(Board)과 블로그(Blog) 리스트 페이지를 localStorage 기반 CRUD 시스템으로 전면 리팩토링. 상세 보기, 글쓰기/수정/삭제 기능 추가. 신규 갤러리(Gallery) 페이지 구현. Supabase 키 설정 시 자동 전환 가능한 구조.

---

### 1. boardStorage.js — localStorage CRUD + 시드 데이터

**신규 파일:** `src/utils/boardStorage.js`

3개 데이터 스토어(게시판/블로그/갤러리)의 CRUD 함수와 시드 데이터를 통합 관리.

#### 데이터 구조

| 스토어 | localStorage 키 | 필드 |
|--------|-----------------|------|
| 게시판 | `dreamitbiz_board_posts` | id, category, title, content, author, date, views, created_at, updated_at |
| 블로그 | `dreamitbiz_blog_posts` | id, category/En, title/En, excerpt/En, content/En, icon, date, created_at |
| 갤러리 | `dreamitbiz_gallery_items` | id, title/En, category, imageUrl, description/En, date, created_at |

#### 제공 함수

| 함수 | 설명 |
|------|------|
| `getBoardPosts()` | 게시판 전체 목록 |
| `getBoardPost(id)` | 게시판 단일 조회 |
| `createBoardPost({...})` | 게시판 글 생성 (자동 ID 부여) |
| `updateBoardPost(id, updates)` | 게시판 글 수정 |
| `deleteBoardPost(id)` | 게시판 글 삭제 |
| `incrementBoardViews(id)` | 조회수 증가 |
| `getBlogPosts()` / `getBlogPost(id)` | 블로그 조회 |
| `getGalleryItems()` / `getGalleryItem(id)` | 갤러리 조회 |

#### 시드 데이터

- 게시판: 5개 (공지 2, 자유 2, Q&A 1) — 기존 Board.jsx 하드코딩 데이터 이전
- 블로그: 6개 (한/영 이중 언어) — 기존 Blog.jsx 하드코딩 데이터 이전 + 상세 본문 추가
- 갤러리: 8개 (프로젝트 3, 교육 2, 행사 2, 사무실 1)

---

### 2. Pagination.jsx — 재사용 페이지네이션 컴포넌트

**신규 파일:** `src/components/Pagination.jsx`

| Props | 타입 | 설명 |
|-------|------|------|
| `currentPage` | number | 현재 페이지 |
| `totalPages` | number | 전체 페이지 수 |
| `onPageChange` | function | 페이지 변경 콜백 |

- 최대 5개 페이지 번호 표시
- 이전/다음 화살표 (첫/마지막 페이지에서 비활성화)
- `totalPages ≤ 1`이면 렌더링하지 않음

---

### 3. Board.jsx 리팩토링

**수정 파일:** `src/pages/Board.jsx`

| 변경 전 | 변경 후 |
|---------|---------|
| 하드코딩 `samplePosts` 배열 | `getBoardPosts()` 호출 |
| 제목 클릭 불가 (`cursor: default`) | `<Link to={/community/board/${id}}>` |
| 글쓰기 버튼 비활성 | `<Link to="/community/board/write">` |
| 페이지네이션 없음 | `<Pagination>` (10개/페이지) |

---

### 4. BoardDetail.jsx — 게시판 상세 보기

**신규 파일:** `src/pages/BoardDetail.jsx`

- URL: `/community/board/:postId`
- 카테고리 뱃지 + 제목 + 메타정보 (작성자/작성일/조회수)
- 본문: `white-space: pre-wrap`
- 하단: 목록으로 / 수정 / 삭제 버튼
- 페이지 진입 시 `incrementBoardViews()` 호출
- 삭제: `window.confirm()` 확인 후 `deleteBoardPost()` → 목록으로 이동

---

### 5. BoardWrite.jsx — 게시판 글쓰기/수정

**신규 파일:** `src/pages/BoardWrite.jsx`

- 글쓰기: `/community/board/write`
- 수정: `/community/board/edit/:id` (URL 파라미터로 모드 구분)
- 폼 필드: 카테고리(select), 작성자(input), 제목(input), 내용(textarea)
- 제출 시 빈값 검증 → `createBoardPost()` 또는 `updateBoardPost()` 호출
- 취소 버튼: 목록으로 이동

---

### 6. Blog.jsx 리팩토링

**수정 파일:** `src/pages/Blog.jsx`

| 변경 전 | 변경 후 |
|---------|---------|
| 하드코딩 `posts` 배열 | `getBlogPosts()` 호출 |
| 한국어 고정 | `language === 'en'` 분기 (제목/카테고리/요약) |
| 카드 클릭 불가 | `<Link to={/community/blog/${id}}>` |
| 페이지 타이틀 하드코딩 | `t('community.blogTitle')` |
| 페이지네이션 없음 | `<Pagination>` (6개/페이지) |

---

### 7. BlogDetail.jsx — 블로그 상세 보기

**신규 파일:** `src/pages/BlogDetail.jsx`

- URL: `/community/blog/:postId`
- 히어로 영역: `primary-gradient` 배경 + 아이콘 (64px)
- 카테고리 뱃지 + 날짜 + 제목 + 요약 + 본문
- 한/영 자동 전환 (`language` 컨텍스트 기반)
- 하단: 목록으로 버튼

---

### 8. Gallery.jsx — 갤러리 페이지

**신규 파일:** `src/pages/Gallery.jsx`

- URL: `/community/gallery`
- 카테고리 필터: 전체 / 프로젝트 / 사무실 / 행사 / 교육
- 4열 그리드 (반응형: 1024px→3열, 768px→2열, 480px→1열)
- 이미지 대신 CSS 그라데이션 플레이스홀더 (8가지 색상 순환)
- 카드 호버: `translateY(-4px)` + 그림자

#### 라이트박스 모달

| 기능 | 구현 |
|------|------|
| 열기 | 카드 클릭 |
| 닫기 | × 버튼 / 오버레이 클릭 / ESC 키 |
| 이전/다음 | ‹ › 버튼 / ← → 키보드 |
| 스크롤 잠금 | `document.body.style.overflow = 'hidden'` |

---

### 9. 라우트 추가 (App.jsx)

**수정 파일:** `src/App.jsx`

```
4개 lazy import 추가:
  BoardDetail, BoardWrite, BlogDetail, Gallery

5개 라우트 추가:
  /community/board/write      → BoardWrite (글쓰기)
  /community/board/edit/:id   → BoardWrite (수정)
  /community/board/:postId    → BoardDetail (상세)
  /community/blog/:postId     → BlogDetail (상세)
  /community/gallery          → Gallery
```

> `/community/board/write`와 `/community/board/edit/:id`는 `/community/board/:postId` 앞에 배치하여 라우트 충돌 방지

---

### 10. Navbar 갤러리 메뉴 추가

**수정 파일:** `src/components/layout/Navbar.jsx`

커뮤니티 드롭다운에 갤러리 항목 추가:

```js
dropdown: [
  { path: '/community/blog', label: t('community.blog') },
  { path: '/community/board', label: t('community.board') },
  { path: '/community/gallery', label: t('community.gallery') }  // 신규
]
```

---

### 11. 번역 키 추가 (translations.js)

**수정 파일:** `src/utils/translations.js`

`community` 섹션에 약 30개 키 추가 (ko/en 각각):

| 키 | 한국어 | 영어 |
|----|--------|------|
| `gallery` | 갤러리 | Gallery |
| `blogTitle` / `blogSubtitle` | 블로그 / IT 트렌드... | Blog / IT trends... |
| `galleryTitle` / `gallerySubtitle` | 갤러리 / 드림아이티비즈의... | Gallery / Explore... |
| `backToList` | 목록으로 | Back to List |
| `edit` / `delete` / `deleteConfirm` | 수정/삭제/정말... | Edit/Delete/Are you sure... |
| `titlePlaceholder` / `contentPlaceholder` / `authorPlaceholder` | 제목을.../내용을.../작성자명 | Enter.../Enter.../Author name |
| `category` / `content` / `submit` / `update` / `cancel` | 카테고리/내용/등록/수정/취소 | Category/Content/Submit/Update/Cancel |
| `newPost` / `editPost` / `readMore` | 새 글 작성/글 수정/자세히 보기 | New Post/Edit Post/Read More |
| `galleryProject` / `galleryOffice` / `galleryEvent` / `galleryEducation` | 프로젝트/사무실/행사/교육 | Projects/Office/Events/Education |

---

### 12. 스타일링

#### community.css (신규)

**신규 파일:** `src/styles/community.css`

| 섹션 | 주요 클래스 |
|------|------------|
| 페이지네이션 | `.pagination`, `.pagination-btn`, `.pagination-btn.active` |
| 게시판 상세 | `.board-detail`, `.board-detail-header`, `.board-detail-body`, `.board-detail-footer` |
| 게시판 글쓰기 | `.board-write`, `.board-form-group`, `.board-form-row`, `.board-form-actions` |
| 블로그 상세 | `.blog-detail`, `.blog-detail-hero`, `.blog-detail-meta`, `.blog-detail-content` |
| 갤러리 | `.gallery-filters`, `.gallery-grid`, `.gallery-card`, `.gallery-thumb` |
| 라이트박스 | `.lightbox-overlay`, `.lightbox-content`, `.lightbox-nav`, `.lightbox-close` |
| 공통 버튼 | `.board-btn`, `.board-btn.primary`, `.board-btn.danger` |

#### responsive.css (수정)

| 브레이크포인트 | 추가 내용 |
|---------------|----------|
| 1024px | `.gallery-grid` 3열, `.board-form-row` 2열 |
| 768px | `.gallery-grid` 2열, `.board-detail` 패딩 축소, `.board-form-row` 1열, `.blog-detail-title` 24px, 라이트박스 패딩 16px |
| 480px | `.gallery-grid` 1열, `.board-detail-title` 20px |

#### dark-mode.css (수정)

신규 다크모드 셀렉터 추가:

| 대상 | 처리 |
|------|------|
| `.board-detail` | `bg-light-gray`, `border-medium` |
| `.board-btn` / `.board-btn.danger` | 다크 배경 + 적절한 텍스트 컬러 |
| `.board-write` / 폼 요소 | `bg-medium-gray` 입력 필드 |
| `.pagination-btn` | 다크 배경 + active 시 primary |
| `.gallery-card` / `.gallery-filter-btn` | `bg-light-gray`, active 시 primary |
| `.lightbox-content` | `bg-light-gray` |
| `.blog-detail-*` | 다크 카테고리/구분선 |

#### index.css (수정)

```css
@import './styles/community.css';  /* dark-mode.css 앞에 추가 */
```

---

## 세션 14: Hero 배경효과 Geometric+Particles만 + 핑퐁 순환

**커밋**: `83875f8` feat: Hero 효과 Geometric+Particles만 적용, 핑퐁 순환(1→5→1)

### 1. HeroBackground.jsx — 효과 정리

**수정 파일:** `src/components/HeroBackground.jsx`

Matrix Code Rain, Network Nodes, Rising Orbs 컴포넌트 코드 삭제. Geometric(기하학 도형)과 Particles(부유 입자) 2가지만 남김.

| 변경 전 | 변경 후 |
|---------|---------|
| `[ParticlesBg, MatrixBg, GeometricBg, ParticlesBg, MatrixBg]` | `[GeometricBg, ParticlesBg, GeometricBg, ParticlesBg, GeometricBg]` |

| 슬라이드 | 배경 효과 |
|----------|----------|
| 0 (IT솔루션) | Geometric (삼각형/사각형/육각형) |
| 1 (웹개발) | Particles (부유 입자) |
| 2 (R&D/컨설팅) | Geometric |
| 3 (교육) | Particles |
| 4 (출판) | Geometric |

### 2. HeroCarousel.jsx — 핑퐁 자동재생

**수정 파일:** `src/components/HeroCarousel.jsx`

기존 순환 방식(0→1→2→3→4→0→1→...)을 핑퐁 방식으로 변경.

| 변경 전 | 변경 후 |
|---------|---------|
| `goTo(current + 1)` (modulo 순환) | `setCurrent(prev + direction)` (방향 반전) |

#### 핑퐁 로직

```
directionRef = useRef(1)  // 1=forward, -1=backward

autoNext:
  if (prev >= 4) direction = -1  // 끝 도달 → 역방향
  if (prev <= 0) direction = 1   // 처음 도달 → 정방향
  return prev + direction
```

**재생 순서**: `0→1→2→3→4→3→2→1→0→1→2→3→4→...`

- 수동 조작(화살표/점/키보드/스와이프)은 기존 modulo 순환 유지
- 자동재생만 핑퐁 적용

---

## 배포 커밋 이력

| 커밋 | 설명 |
|------|------|
| `9b17b9f` | feat: 커뮤니티 시스템 구현 |
| `b466d94` | deploy: dist 빌드 결과 추가 |
| `20aed18` | deploy: 루트 assets 업데이트 (커뮤니티) |
| `83875f8` | feat: Hero Geometric+Particles + 핑퐁 + 빌드 배포 |

---

## 수정 파일 전체 목록

### 신규 파일 (7개)

| 파일 | 설명 |
|------|------|
| `src/utils/boardStorage.js` | localStorage CRUD + 시드 데이터 |
| `src/components/Pagination.jsx` | 재사용 페이지네이션 |
| `src/styles/community.css` | 커뮤니티 전체 스타일 |
| `src/pages/BoardDetail.jsx` | 게시판 상세 |
| `src/pages/BoardWrite.jsx` | 게시판 글쓰기/수정 |
| `src/pages/BlogDetail.jsx` | 블로그 상세 |
| `src/pages/Gallery.jsx` | 갤러리 (그리드+필터+라이트박스) |

### 수정 파일 (9개)

| 파일 | 설명 |
|------|------|
| `src/App.jsx` | 4개 lazy import + 5개 라우트 |
| `src/components/layout/Navbar.jsx` | 갤러리 메뉴 추가 |
| `src/pages/Board.jsx` | boardStorage 연동 + Link + 페이지네이션 |
| `src/pages/Blog.jsx` | boardStorage 연동 + 한/영 전환 + 페이지네이션 |
| `src/utils/translations.js` | ~30개 번역 키 추가 (ko/en) |
| `src/index.css` | community.css import 추가 |
| `src/styles/responsive.css` | 갤러리/상세/폼 반응형 |
| `src/styles/dark-mode.css` | 새 컴포넌트 다크모드 |
| `src/components/HeroBackground.jsx` | Geometric+Particles만 사용 |
| `src/components/HeroCarousel.jsx` | 핑퐁 자동재생 |
| `.gitignore` | dist 제외 해제 |

---

## 빌드 결과

- **빌드 도구**: Vite v7.3.1
- **모듈 수**: 132 모듈
- **빌드 시간**: ~2초
- **CSS**: 79.42 kB (gzip 13.16 kB) — community.css 추가로 증가
- **JS (main)**: 265.25 kB (gzip 84.90 kB)
- **boardStorage**: 17.64 kB (gzip 7.68 kB) — 시드 데이터 포함
- dist → D:/www/ 루트 복사 → GitHub Pages 배포 완료

---

## 다음 작업 예정

- [ ] Supabase 연동 시 boardStorage.js에 Supabase 클라이언트 분기 추가
- [ ] 게시판 댓글 기능
- [ ] 갤러리 실제 이미지 업로드 (Supabase Storage)
- [ ] 블로그 글쓰기/수정 기능 (현재 읽기 전용)
- [ ] 인증 연동 (글쓰기/수정/삭제 권한 제어)
