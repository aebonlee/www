# 개발 로그 - 2026-02-19 (세션 6)

## 작업자: Claude Opus 4.6

---

## 세션 17: 푸터 Biz 컬러 테마 연동

**커밋**: `3814fb5` fix: 푸터 Biz 컬러를 테마 컬러와 연동

### 변경 내용

| 파일 | 변경 |
|------|------|
| `src/styles/footer.css` | `.brand-biz` 고정색(`#93C5FD`) → `var(--primary-blue-light)` |

**효과**: 5색 테마(블루/퍼플/그린/오렌지/레드) 변경 시 푸터의 "Dream**IT** **Biz**" 로고에서 Biz 부분도 테마 색상에 맞춰 변경됨.

---

## 세션 18: Supabase 전용 전환 + DB 연동

**커밋**: `54de975` feat: boardStorage.js Supabase 전용 전환 + DB 연동 완료
**커밋**: `5026445` deploy: Supabase 연동 빌드 배포 (루트 assets 업데이트)

### 변경 개요

`boardStorage.js`를 localStorage 기반에서 **Supabase 전용**으로 전면 리팩토링.

### 수정 파일 (7개)

| 파일 | 변경 내용 |
|------|----------|
| `src/utils/boardStorage.js` | 전체 리팩토링: async + Supabase CRUD + snake↔camel 자동 변환 |
| `src/pages/Board.jsx` | useEffect async IIFE |
| `src/pages/BoardDetail.jsx` | useEffect + handleDelete async |
| `src/pages/BoardWrite.jsx` | useEffect + handleSubmit async |
| `src/pages/Blog.jsx` | useEffect async IIFE |
| `src/pages/BlogDetail.jsx` | useEffect async IIFE |
| `src/pages/Gallery.jsx` | useEffect async IIFE |

### Supabase 테이블 3개

| 테이블 | 용도 |
|--------|------|
| `board_posts` | 게시판 CRUD (카테고리, 제목, 내용, 작성자, 조회수) |
| `blog_posts` | 블로그 (카테고리, 제목, 발췌, 본문, 아이콘, 한/영) |
| `gallery_items` | 갤러리 (제목, 카테고리, 이미지URL, 설명, 한/영) |

### 설계 원칙

- Supabase 전용 (localStorage 미사용)
- 에러 안전 (쿼리 실패 시 빈 배열/null 반환)
- snake_case ↔ camelCase 자동 변환
- 기존 API 시그니처 유지 (함수명/파라미터 동일, 반환값만 Promise)

---

## 세션 19: 커뮤니티 디자인 개선 — 갤러리(카드형) + 블로그(매거진형)

**커밋**: `adc82e0` feat: 커뮤니티 디자인 개선 - 갤러리(카드형) + 블로그(매거진형)

### 갤러리 카드형 디자인

| 변경 항목 | 내용 |
|----------|------|
| 호버 효과 | 썸네일 줌(1.08x) + 반투명 어두운 오버레이 + "+" 아이콘 |
| 카테고리 뱃지 | pill 형태, primary-blue 8% 배경 |
| 설명 미리보기 | 2줄 line-clamp, 다국어 지원 |
| 날짜 표시 | 전용 `.gallery-date` 스타일 |
| 카드 shadow | 기본 shadow + 호버 시 shadow-xl |

### 블로그 매거진형 레이아웃

| 변경 항목 | 내용 |
|----------|------|
| 피처드 히어로 | 1페이지 첫 포스트를 2열 그리드(이미지+콘텐츠) 히어로로 표시 |
| 읽기 시간 | `estimateReadTime()` 함수 (200 wpm 기준) |
| line-clamp | 피처드: h2 3줄, p 3줄 / 카드: h3 2줄, p 2줄 |
| 2페이지+ | 피처드 없이 일반 그리드만 표시 |

### 반응형 (3 브레이크포인트)

- **1024px**: 피처드 h2 24px, padding 32px
- **768px**: 피처드 1열(이미지 위+콘텐츠 아래), min-height 200px
- **480px**: 갤러리 info padding 12px, 피처드 padding 20px

### 수정 파일 (5개)

| 파일 | 변경 |
|------|------|
| `src/styles/community.css` | 갤러리 카드 강화 CSS (12개 새 규칙) |
| `src/styles/blog.css` | 피처드 히어로 CSS (10개 새 규칙) + line-clamp |
| `src/styles/responsive.css` | 1024/768/480px 반응형 규칙 6개 추가 |
| `src/pages/Gallery.jsx` | 오버레이 + 뱃지 + 설명 + 날짜 JSX |
| `src/pages/Blog.jsx` | 피처드 히어로 + 읽기시간 + 매거진 구조 |

---

## 세션 20: 갤러리/블로그 데이터 표시 수정

**커밋**: `47189f1` fix: 갤러리/블로그 데이터 표시 수정

### 수정 사항 3건

#### 1. 갤러리 카테고리 뱃지 현지화

**문제**: `item.category` 원시 영문 키("project", "office")가 그대로 표시
**해결**: `getCategoryLabel()` 헬퍼 — 필터 목록에서 현지화 레이블 조회

#### 2. 갤러리 설명 null 처리

**문제**: DB에 `description`이 null이면 빈 `<p>` 태그가 공간 차지
**해결**: 조건부 렌더링으로 null일 때 `<p>` 태그 자체 숨김

#### 3. 블로그 읽기 시간 한국어 대응

**문제**: 영문 200 wpm 기준으로 한국어 텍스트가 항상 "1 min read" 표시
**해결**: 한글 감지(유니코드 범위) 시 500자/분 기준 적용

---

## 금일 커밋 이력 (세션 6)

| 순서 | 커밋 해시 | 내용 |
|------|----------|------|
| 1 | `3814fb5` | fix: 푸터 Biz 컬러를 테마 컬러와 연동 |
| 2 | `54de975` | feat: boardStorage.js Supabase 전용 전환 + DB 연동 완료 |
| 3 | `5026445` | deploy: Supabase 연동 빌드 배포 |
| 4 | `adc82e0` | feat: 커뮤니티 디자인 개선 — 갤러리 카드형 + 블로그 매거진형 |
| 5 | `dd5329b` | docs: 커뮤니티 디자인 개선 개발일지 작성 |
| 6 | `47189f1` | fix: 갤러리/블로그 데이터 표시 수정 |

---

## 다음 작업 예정

- [ ] 갤러리 실제 이미지 업로드 (Supabase Storage)
- [ ] 블로그/게시판 글쓰기 기능 (관리자 권한)
- [ ] 인증 시스템 (Supabase Auth)
- [ ] 댓글 기능
- [ ] 검색 기능
