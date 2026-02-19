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

## 세션 21: useAOS 동적 요소 감지 버그 수정 (블로그/갤러리 투명 문제 해결)

**커밋**: `83e4a73` fix: useAOS 동적 요소 감지 + Blog/Gallery 로딩/빈상태 처리

### 근본 원인 분석

블로그 페이지가 아무것도 표시하지 않고, 갤러리 페이지가 공허한 영역으로 보이던 문제의 **근본 원인**을 발견하여 수정.

#### 문제 메커니즘

1. CSS 규칙 `[data-aos] { opacity: 0; }` — AOS 애니메이션용 초기 투명 처리
2. `useAOS()` 훅이 컴포넌트 마운트 시 `document.querySelectorAll('[data-aos]')`로 **기존 DOM 요소만 관찰**
3. Blog/Gallery 카드는 Supabase 비동기 데이터 로드 **이후** 렌더링됨
4. 새로 추가된 카드에 `data-aos="fade-up"` 속성이 있지만 IntersectionObserver가 **관찰하지 않음**
5. 결과: 카드가 `opacity: 0` 상태로 영구 유지 → 투명 = "빈 영역" / "아무것도 없음"

#### Board가 정상이었던 이유

Board는 컨테이너 `<div data-aos="fade-up">`에만 AOS 속성이 있고, 이 div는 데이터 로드 전에도 항상 DOM에 존재. 따라서 마운트 시점 IntersectionObserver가 정상 관찰.

### 수정 파일 (3개)

| 파일 | 변경 내용 |
|------|----------|
| `src/hooks/useAOS.js` | `MutationObserver` 추가 — DOM에 새로운 `[data-aos]` 요소가 추가될 때 자동으로 IntersectionObserver에 등록 |
| `src/pages/Blog.jsx` | `loading` 상태 관리 + 데이터 없을 때 빈 목록 안내 메시지 표시 |
| `src/pages/Gallery.jsx` | `loading` 상태 관리 + 데이터 없을 때 빈 목록 안내 메시지 표시 |

### useAOS.js 핵심 변경

```js
// 기존: 마운트 시 1회만 스캔
const elements = document.querySelectorAll('[data-aos]');
elements.forEach((el) => observer.observe(el));

// 수정: MutationObserver로 동적 요소 자동 감지
const observeAll = () => {
  document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach((el) => {
    observer.observe(el);
  });
};
observeAll();
const mutObs = new MutationObserver(observeAll);
mutObs.observe(document.body, { childList: true, subtree: true });
```

### 추가 배포 이슈 발견

이전 빌드가 실제로는 배포되지 않았던 것으로 확인. 빌드 해시 비교:

| 구분 | 이전 배포 | 이번 배포 |
|------|----------|----------|
| Blog | `Blog-TAAOxpch.js` | `Blog-TMa_48G1.js` |
| Gallery | `Gallery-DP8NfoWj.js` | `Gallery-1BtIvbfb.js` |
| useAOS | `useAOS-CxKk3MXB.js` | `useAOS-kHyhlWgo.js` |
| index | `index-BLgPhbCS.js` | `index-VBzfrMeh.js` |

해시가 모두 변경됨 → 이전 배포본은 코드 수정 **이전** 빌드였음.

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
| 7 | `e5fbc50` | docs: 세션 6 개발일지 작성 |
| 8 | `83e4a73` | fix: useAOS 동적 요소 감지 + Blog/Gallery 로딩/빈상태 처리 |

---

## 다음 작업 예정

- [ ] 갤러리 실제 이미지 업로드 (Supabase Storage)
- [ ] 블로그/게시판 글쓰기 기능 (관리자 권한)
- [ ] 인증 시스템 (Supabase Auth)
- [ ] 댓글 기능
- [ ] 검색 기능
