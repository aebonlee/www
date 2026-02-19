# 커뮤니티 디자인 개선 - 갤러리(카드형) + 블로그(매거진형)

**작업일**: 2026-02-19
**작업자**: Claude Opus 4.6
**커밋**:
- `adc82e0` feat: 커뮤니티 디자인 개선 - 갤러리(카드형) + 블로그(매거진형)
- `47189f1` fix: 갤러리/블로그 데이터 표시 수정

---

## 1. 개요

커뮤니티 메뉴의 갤러리와 블로그 페이지 디자인을 고도화했습니다.

- **갤러리**: 기본 그리드 → 카드형 디자인 (카테고리 뱃지, 설명 미리보기, 호버 오버레이)
- **블로그**: 3열 균일 카드 → 매거진형 레이아웃 (피처드 히어로 + 소형 그리드)

---

## 2. 수정 파일 (5개)

| 파일 | 변경 내용 |
|------|----------|
| `src/styles/community.css` | 갤러리 카드 강화 CSS (오버레이, 뱃지, line-clamp) |
| `src/styles/blog.css` | 매거진 피처드 히어로 + 카드 line-clamp CSS |
| `src/styles/responsive.css` | 피처드 블로그 반응형 (1024/768/480px) |
| `src/pages/Gallery.jsx` | 카테고리 뱃지, 설명 텍스트, 호버 오버레이 JSX |
| `src/pages/Blog.jsx` | 피처드 히어로 포스트, 읽기 시간 계산, 매거진 구조 |

---

## 3. 갤러리 (카드형) 변경 상세

### 3.1 CSS 변경 (`community.css`)

- `.gallery-card` — `border-radius` md→lg, 기본 shadow 추가, hover시 translateY -6px + shadow-xl
- `.gallery-card:hover .gallery-thumb-gradient` — `scale(1.08)` 줌 효과
- `.gallery-overlay` — 반투명 어두운 배경(rgba 0,0,0,0.4), opacity 0→1 트랜지션
- `.gallery-overlay-icon` — 48px 원형 흰색 배경에 "+" 아이콘
- `.gallery-category-badge` — pill 형태, primary-blue 8% 배경, 11px 폰트
- `.gallery-desc` — 2줄 `-webkit-line-clamp`, 13px 라이트 컬러
- `.gallery-date` — 12px 라이트 컬러 (기존 `.gallery-info p` 대체)
- `.gallery-info` — padding 14px→16px

### 3.2 JSX 변경 (`Gallery.jsx`)

각 `gallery-card` 내부에 추가:
- `gallery-overlay` + `gallery-overlay-icon` 호버 오버레이
- `gallery-category-badge` 카테고리 뱃지 (현지화 레이블 표시)
- `gallery-desc` 설명 미리보기 (다국어 지원, null 시 숨김)
- `gallery-date` 날짜 표시 (기존 `<p>` 태그 대체)

---

## 4. 블로그 (매거진형) 변경 상세

### 4.1 CSS 변경 (`blog.css`)

**신규 피처드 히어로 스타일:**
- `.blog-featured` — 2열 grid, border + radius, 호버 shadow/translateY
- `.blog-featured-image` — 그라데이션 배경, 80px 아이콘, min-height 320px
- `.blog-featured-content` — padding 40px, flex column justify-center
- `.blog-featured-content h2` — 28px, 3줄 line-clamp
- `.blog-featured-content p` — 16px, 3줄 line-clamp
- `.blog-read-time` — 12px 라이트 컬러

**기존 카드 line-clamp 추가:**
- `.blog-content h3` — 2줄 line-clamp 추가
- `.blog-content p` — 2줄 line-clamp 추가

### 4.2 JSX 변경 (`Blog.jsx`)

- `estimateReadTime()` 함수 추가 — 한국어: 500자/분, 영어: 200 wpm 기준
- 1페이지 첫 번째 포스트를 `blog-featured` 피처드 히어로로 분리
- 나머지 포스트는 기존 `blog-grid` 3열 카드 유지
- 2페이지 이후는 피처드 없이 전체 그리드만 표시
- 모든 카드에 `blog-read-time` 읽기 시간 뱃지 추가

---

## 5. 반응형 대응 (`responsive.css`)

### 1024px
- `.blog-featured-content h2` → 24px
- `.blog-featured-content` → padding 32px

### 768px
- `.blog-featured` → 1열 (이미지 위, 콘텐츠 아래)
- `.blog-featured-image` → min-height 200px
- `.blog-featured-content` → padding 24px, h2 22px

### 480px
- `.gallery-info` → padding 12px
- `.blog-featured-content` → padding 20px, h2 20px

---

## 6. 점검 후 수정 사항 (커밋 `47189f1`)

### 6.1 갤러리 카테고리 뱃지 현지화

**문제**: `item.category` 원시 값("project", "office" 등)이 그대로 표시됨
**해결**: `getCategoryLabel()` 헬퍼 함수 추가 — 필터 목록에서 현지화된 레이블 조회

```jsx
const getCategoryLabel = (key) => {
  const found = filters.find((f) => f.key === key);
  return found ? found.label : key;
};
```

### 6.2 갤러리 설명 null 처리

**문제**: Supabase DB에 `description`이 null이면 빈 `<p>` 태그가 공간 차지
**해결**: 조건부 렌더링으로 null일 때 `<p>` 태그 자체를 숨김

```jsx
{(language === 'en' ? item.descriptionEn : item.description) && (
  <p className="gallery-desc">...</p>
)}
```

### 6.3 블로그 읽기 시간 한국어 대응

**문제**: 영문 기준 200 wpm 계산 시 한국어 텍스트가 띄어쓰기가 적어 항상 "1 min read" 표시
**해결**: 한글 감지 후 500자/분 기준 적용

```jsx
const estimateReadTime = (text) => {
  if (!text) return 1;
  const len = text.replace(/\s+/g, '').length;
  if (len > 0 && /[\uAC00-\uD7AF]/.test(text)) {
    return Math.max(1, Math.ceil(len / 500));
  }
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
};
```

---

## 7. 검증 체크리스트

- [x] 갤러리: 카드 호버 시 줌 + 어두운 오버레이 + "+" 아이콘 표시
- [x] 갤러리: 카테고리 뱃지 한국어 표시 (프로젝트, 사무실, 이벤트, 교육)
- [x] 갤러리: 설명 null일 때 빈 공간 없음
- [x] 갤러리: 설명 있을 때 2줄 제한 표시
- [x] 블로그 1페이지: 피처드 히어로 (좌: 이미지, 우: 콘텐츠) 표시
- [x] 블로그 2페이지+: 피처드 없이 일반 그리드만 표시
- [x] 블로그: 한국어 읽기 시간 정확 계산 (500자/분)
- [x] 반응형: 768px에서 피처드 1열, 480px 패딩 축소
- [x] 라이트박스: 기존 동작 정상 유지
- [x] `npm run build` 성공 (2회)
- [x] dist → 배포 디렉토리 복사 완료
- [x] git commit & push 완료 (2회)

---

## 8. 커밋 이력

| 순서 | 커밋 해시 | 내용 |
|------|----------|------|
| 1 | `adc82e0` | feat: 커뮤니티 디자인 개선 — 갤러리 카드형 + 블로그 매거진형 |
| 2 | `dd5329b` | docs: 커뮤니티 디자인 개선 개발일지 작성 |
| 3 | `47189f1` | fix: 갤러리/블로그 데이터 표시 수정 (현지화, null처리, 한국어 읽기시간) |

---

## 9. 배포

- GitHub Pages: https://www.dreamitbiz.com
- 최종 커밋: `47189f1`
- 브랜치: `main`
