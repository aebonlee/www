# 커뮤니티 디자인 개선 - 갤러리(카드형) + 블로그(매거진형)

**작업일**: 2026-02-19
**작업자**: Claude Opus 4.6
**커밋**: feat: 커뮤니티 디자인 개선 - 갤러리(카드형) + 블로그(매거진형)

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
- `gallery-category-badge` 카테고리 뱃지
- `gallery-desc` 설명 미리보기 (다국어 지원)
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

- `estimateReadTime()` 함수 추가 — 단어 수 기반 읽기 시간 계산 (200 wpm)
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

## 6. 검증 체크리스트

- [x] 갤러리: 카드 호버 시 줌 + 어두운 오버레이 + "+" 아이콘 표시
- [x] 갤러리: 카테고리 뱃지, 설명 2줄 제한, 날짜 표시
- [x] 블로그 1페이지: 피처드 히어로 (좌: 이미지, 우: 콘텐츠) 표시
- [x] 블로그 2페이지+: 피처드 없이 일반 그리드만 표시
- [x] 블로그: 읽기 시간 뱃지 표시
- [x] 반응형: 768px에서 피처드 1열, 480px 패딩 축소
- [x] 라이트박스: 기존 동작 정상 유지
- [x] `npm run build` 성공
- [x] dist → 배포 디렉토리 복사 완료
- [x] git commit & push 완료

---

## 7. 빌드 결과

```
✓ 132 modules transformed
✓ built in 2.52s

주요 파일:
- assets/index-DJtvi8S1.css    82.36 kB (gzip: 13.53 kB)
- assets/Gallery-DftkjGFD.js    3.96 kB (gzip: 1.48 kB)
- assets/Blog-D7nfUd7r.js       2.72 kB (gzip: 0.95 kB)
- assets/index-tf7gT-tr.js    265.51 kB (gzip: 84.96 kB)
```

---

## 8. 배포

- GitHub Pages: https://www.dreamitbiz.com
- 커밋 해시: `adc82e0`
- 브랜치: `main`
