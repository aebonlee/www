# 개발 로그 - 2026-02-19~20 (세션 7) — 최종

## 작업자: Claude Opus 4.6
## 상태: 완료 (고도화 작업 별도 계획 예정)

---

## 세션 22: 모바일 네비바 2단 구조 + 히어로 슬라이드 버튼 최적화

**커밋**: `62e791d` style: 모바일 네비바 2단 구조 + 히어로 버튼·캐러셀 최적화

### 문제점

1. **네비바 밀집**: `.nav-actions` 안에 장바구니, 언어전환, 팔레트, 낮/밤, 로그인 + 햄버거가 한 줄에 6~7개 밀집 → 햄버거 버튼이 거의 안 보임
2. **히어로 CTA 버튼**: `width: 100%`로 화면 전체를 차지해 터치 영역이 과도함
3. **캐러셀 도트/인디케이터**: 여백 부족, 480px에서 불필요한 스크롤 인디케이터 표시

### 변경 파일 (2개, CSS only)

| 파일 | 변경 내용 |
|------|----------|
| `src/styles/responsive.css` | 768px 네비바 2단, 히어로 버튼 60%, 캐러셀 여백, 480px 인디케이터 숨김 |
| `src/styles/navbar.css` | 768px 액션 아이콘 크기 축소 (40px → 32px / 28px) |

### 네비바 2단 구조 (768px)

```
Before: [로고] ─── [장바구니·언어·팔레트·낮밤·로그인·☰]  ← 한 줄에 밀집

After:  [로고]                                           ← 1행
         [장바구니·언어·팔레트·낮밤·로그인·☰]            ← 2행 우측정렬
```

핵심 CSS:
- `.nav-wrapper { flex-wrap: wrap }`
- `.logo { flex: 0 0 100% }` — 1행 강제
- `.nav-actions { flex: 0 0 100%; justify-content: flex-end }` — 2행 우측정렬
- `--nav-height: 90px` — 2행에 맞게 높이 보정

### 아이콘 크기 축소

| 요소 | Before | After |
|------|--------|-------|
| `.theme-toggle` | 40×40 | 32×32 |
| `.color-picker-btn` | 40×40 | 32×32 |
| `.cart-icon-link` | 기본 | 32×32 |
| `.lang-switcher` | 32×32, 10px | 28×28, 9px |
| `.nav-login-btn` | 7px 18px, 13px | 5px 14px, 12px |

### 히어로 CTA 버튼

- `width: 100%` → `width: 60% !important; max-width: 280px`
- `.hero-buttons { align-items: center }` — 중앙정렬

### 캐러셀 도트 + 스크롤 인디케이터

| 요소 | 768px | 480px |
|------|-------|-------|
| `.carousel-dots` | `bottom: 32px`, `gap: 10px` | `bottom: 24px` |
| `.scroll-indicator` | `bottom: 6px` | `display: none` |
| `.mouse` | 20×32px | 숨김 |

---

## 세션 23: 히어로 슬라이드 5개 높이 통일

### 문제점

768px에서 `.hero { min-height: auto }` 설정으로 인해 슬라이드별 콘텐츠 양에 따라 높이가 제각기:
- 슬라이드 2: 타이틀 **4줄** + 버튼 2개 (가장 높음)
- 슬라이드 1, 3: 타이틀 3줄 + 버튼 **1개** (가장 낮음)
- 슬라이드 0, 4: 타이틀 3줄 + 버튼 2개

슬라이드 전환 시 hero 영역이 위아래로 출렁이는 현상 발생.

### 해결 방법: 최대 슬라이드 기준 고정 + 내부 영역 min-height 예약

| 요소 | 768px | 480px | 효과 |
|------|-------|-------|------|
| `.hero` | `min-height: 560px` | `min-height: 500px` | 전체 박스 크기 통일 |
| `.hero-content` | `flex column + min-height: 300px` | — | 콘텐츠 영역 균일 배치 |
| `.hero-title` | `min-height: 4.2em` + flex center | `min-height: 5em` | 3~4줄 차이 흡수 |
| `.hero-description` | `min-height: 3.6em` | — | 설명 영역 예약 |
| `.hero-buttons` | `min-height: 104px` | — | 1~2개 버튼 차이 흡수 |

### 설계 원칙

- **CSS only** — JSX 변경 없음
- **min-height 예약 방식** — 각 콘텐츠 영역에 최대 슬라이드 기준 공간 확보
- **flex center** — 예약 공간 내에서 콘텐츠 수직 중앙 정렬
- **브레이크포인트별 조정** — 768px/480px 각각 폰트 크기에 맞는 min-height 산출

### 변경 파일

| 파일 | 변경 |
|------|------|
| `src/styles/responsive.css` @768px | `.hero` min-height 560px, `.hero-content` flex column, `.hero-title`/`.hero-description`/`.hero-buttons` min-height |
| `src/styles/responsive.css` @480px | `.hero` min-height 500px, `.hero-title` min-height 5em |

---

## 세션 24: 히어로 슬라이드 확정 고정 height + 버튼 가로 나란히 배치

**커밋**: `f64119c` style: 히어로 슬라이드 5개 높이 통일 + 빌드 배포
**커밋**: `cde1a26` style: 히어로 버튼 가로 나란히 배치 + 슬라이드 높이 확정 고정

### 문제점

1. `min-height` 방식은 콘텐츠 양에 따라 여전히 높이가 가변적
2. 버튼이 세로(column) 배치되어 1개/2개 슬라이드 간 높이 차이 발생

### 해결: 확정 height + 가로 배치

모든 영역을 `min-height`가 아닌 **확정 `height`**로 변경하여 콘텐츠와 무관하게 완전 고정.

#### 768px 확정 사이즈

| 요소 | 값 | 산출 근거 |
|------|-----|----------|
| `.hero` | `height: 580px` | padding-top 130px + 콘텐츠 + padding-bottom 40px |
| `.hero-content` | `height: 100%` | 부모 채움 |
| `.hero-title` | `height: 170px` | 34px × 1.25(line-height) × 4줄 = 170px |
| `.hero-description` | `height: 58px` | 16px × 1.8 × 2줄 = 58px |
| `.hero-buttons` | `height: 48px` | 가로 1줄 배치 |

#### 480px 확정 사이즈

| 요소 | 값 | 산출 근거 |
|------|-----|----------|
| `.hero` | `height: 520px` | 소형 모바일 비례 축소 |
| `.hero-title` | `height: 136px` | 26px × 1.3 × 4줄 = 135px |
| `.hero-description` | `height: 54px` | 15px × 1.8 × 2줄 = 54px |
| `.hero-buttons` | `height: 44px` | 가로 1줄 배치 (축소) |

#### 버튼 가로 나란히 배치

```
Before (column):        After (row):
┌──────────────┐       ┌─────────┐ ┌─────────┐
│  서비스 보기  │       │서비스보기│ │ 문의하기 │
├──────────────┤       └─────────┘ └─────────┘
│   문의하기   │          (중앙정렬, gap: 10px)
└──────────────┘
```

- `flex-direction: column` 제거 → 기본 `row`
- `padding: 10px 20px`, `font-size: 14px` → 컴팩트 사이즈
- `justify-content: center` → 가로 중앙
- 480px: `padding: 8px 16px`, `font-size: 13px`

---

## 세션 25: PC/태블릿 히어로 캐러셀 도트·스크롤 인디케이터 간격 조정

**커밋**: `d814269` style: PC/태블릿 히어로 캐러셀 도트·스크롤 인디케이터 간격 조정 + 빌드 배포

### 문제점

데스크톱(PC) 화면에서 캐러셀 도트 5개(●●●●●)와 아래 마우스 스크롤 인디케이터 간 간격이 **약 2px**로 거의 붙어 보임. 태블릿(1024px)에서도 별도 조정 없이 데스크톱 값 그대로 적용되어 간격 부족.

### 해결: 뷰포트별 도트↔마우스 간격 체계화

#### 변경 파일 (2개, CSS only)

| 파일 | 변경 내용 |
|------|----------|
| `src/styles/hero.css` | 데스크톱 base: 도트 bottom 56→64px, 마우스 크기 축소 24×38→20×32px, indicator bottom 16→14px |
| `src/styles/responsive.css` @1024px | 태블릿: 도트 bottom 56px, indicator bottom 12px 추가 |

#### hero.css 변경 상세 (데스크톱 base)

| 요소 | Before | After | 변경 이유 |
|------|--------|-------|----------|
| `.carousel-dots` | `bottom: 56px` | `bottom: 64px` | 도트를 위로 올려 간격 확보 |
| `.scroll-indicator` | `bottom: 16px` | `bottom: 14px` | 약간 아래로 내려 간격 확대 |
| `.mouse` | `24×38px`, `border-radius: 12px` | `20×32px`, `border-radius: 10px` | 컴팩트하게 축소 |
| `.mouse border` | `rgba(255,255,255,0.4)` | `rgba(255,255,255,0.35)` | 약간 부드럽게 |
| `.wheel` | `height: 8px`, `top: 8px` | `height: 7px`, `top: 6px` | 마우스 축소에 비례 |

#### 뷰포트별 배치 종합표

| 뷰포트 | 도트 (bottom) | 마우스 (bottom) | 마우스 크기 | 도트↔마우스 간격 |
|--------|-------------|---------------|-----------|--------------|
| Desktop (1025px+) | 64px | 14px | 20×32px | **18px** |
| Tablet (1024px) | 56px | 12px | 20×32px | **12px** |
| Mobile (768px) | 32px | 6px | 20×32px | compact |
| Small (480px) | 24px | 숨김 | — | — |

### 간격 산출 근거

```
Desktop: 도트 하단 = 64px, 마우스 상단 = 14px + 32px = 46px
         간격 = 64 - 46 = 18px ✓

Tablet:  도트 하단 = 56px, 마우스 상단 = 12px + 32px = 44px
         간격 = 56 - 44 = 12px ✓
```

---

## 세션 26: 스크롤 인디케이터 도트 위로 배치 + 1.5배 크기 확대

**커밋**: `739b89c` style: 스크롤 인디케이터 도트 위로 배치 + 1.5배 크기 확대 + 빌드 배포

### 변경 내용

#### 배치 순서 반전: 마우스를 도트 위로

```
Before:  [도트 ●●●●●]  ← 위
         [🖱 마우스]    ← 아래 (바닥에 붙음)

After:   [🖱 마우스]    ← 위 (스크롤 유도)
         [도트 ●●●●●]  ← 아래 (고정)
```

#### 크기 1.5배 확대

| 요소 | Before | After (1.5x) |
|------|--------|-------------|
| `.carousel-dot` | 10px, border 2px | **15px**, border **3px** |
| `.carousel-dots gap` | 10px | **14px** |
| `.mouse` | 20×32px | **30×48px** |
| `.mouse border` | 2px, radius 10px | **3px**, radius **15px** |
| `.wheel` | 3×7px, top 6px | **4×10px**, top **9px** |

#### 뷰포트별 배치 (도트 하단 고정, 마우스 상단)

| 뷰포트 | 도트 (bottom) | 도트 크기 | 마우스 (bottom) | 마우스 크기 |
|--------|-------------|----------|---------------|-----------|
| Desktop (1025px+) | 30px | 15px | 64px | 30×48px |
| Tablet (1024px) | 26px | 15px | 58px | 30×48px |
| Mobile (768px) | 20px | 12px | 50px | 26×42px |
| Small (480px) | 16px | 10px | 숨김 | — |

### 변경 파일

| 파일 | 변경 |
|------|------|
| `src/styles/hero.css` | dots bottom 78→30px, indicator bottom 26→64px (순서 반전), 도트·마우스·휠 1.5배 확대 |
| `src/styles/responsive.css` @1024px | dots 26px, indicator 58px |
| `src/styles/responsive.css` @768px | dots 20px/12px, indicator 50px, mouse 26×42px |
| `src/styles/responsive.css` @480px | dots 16px/10px, indicator 숨김 |

---

## 세션 27: 게시판·갤러리·블로그 CRUD 점검 + 페이지네이션 수정

**커밋**: `f3c0852` fix: 게시판 페이지당 표시 글 수 10→20개로 변경 + 빌드 배포

### 점검 내용

사용자로부터 "게시판은 로그인 후 글쓰기 버튼 보이지만, 갤러리·블로그에 아무 변화 없음" 보고 접수.
3개 커뮤니티 페이지의 CRUD 기능 전수 점검 수행.

### 점검 결과

| 페이지 | 파일 | 글쓰기 권한 | CRUD 상태 | 페이지당 |
|--------|------|-----------|----------|---------|
| **게시판** (Board) | `src/pages/Board.jsx` | `isLoggedIn` (로그인 사용자) | ✅ 정상 | 10 → **20** 수정 |
| **갤러리** (Gallery) | `src/pages/Gallery.jsx` | `isAdmin` (관리자 전용) | ✅ 정상 | 8 |
| **블로그** (Blog) | `src/pages/Blog.jsx` | `isAdmin` (관리자 전용) | ✅ 정상 | 6 |

### 갤러리·블로그 "변화 없음" 원인

- 갤러리/블로그의 글쓰기·수정·삭제 버튼은 `isAdmin` 체크 — **관리자 계정으로만 표시**
- 일반 사용자 로그인 시 CRUD 버튼이 나타나지 않는 것이 **정상 동작**
- 사용자 확인: "관리자만 글을 쓰게 해줘" → 현행 유지 확인

### 수정 사항

```jsx
// src/pages/Board.jsx (line 9)
const POSTS_PER_PAGE = 20;  // was 10
```

- 게시판 한 페이지당 표시 글 수를 20개로 변경
- 페이지네이션 로직은 기존 `Pagination` 컴포넌트 그대로 사용

---

## 세션 7 최종 요약

### 작업 범위

| 분류 | 세부 내용 |
|------|----------|
| **모바일 네비바** | 2단 구조 (로고 1행 / 액션+햄버거 2행), 아이콘 32px 축소 |
| **히어로 슬라이드** | 5개 높이 완전 고정 (580px/520px), CTA 버튼 가로 나란히 배치 |
| **캐러셀 인디케이터** | 도트 하단 고정 + 마우스 상단 배치, 1.5배 크기 확대, 4단계 반응형 |
| **히어로 하단 여백** | padding-bottom 96px, 도트·마우스 간격 체계화 |
| **커뮤니티 CRUD** | 게시판 20개/페이지, 갤러리·블로그 관리자 전용 확인 |

### 변경 파일 총 4개

| 파일 | 변경 유형 |
|------|----------|
| `src/styles/responsive.css` | CSS — 4단계 반응형 (1024/768/480px) |
| `src/styles/navbar.css` | CSS — 모바일 액션 아이콘 크기 축소 |
| `src/styles/hero.css` | CSS — 캐러셀 도트·스크롤 인디케이터 배치·크기 |
| `src/pages/Board.jsx` | JSX — POSTS_PER_PAGE 10→20 |

### 최종 반응형 캐러셀 인디케이터 사양

```
Desktop (1025px+):  [🖱 30×48] ── 마우스 bottom: 64px
                    [● 15px]   ── 도트 bottom: 30px, gap: 14px

Tablet (1024px):    [🖱 30×48] ── 마우스 bottom: 58px
                    [● 15px]   ── 도트 bottom: 26px

Mobile (768px):     [🖱 26×42] ── 마우스 bottom: 50px
                    [● 12px]   ── 도트 bottom: 20px, gap: 12px

Small (480px):      (마우스 숨김)
                    [● 10px]   ── 도트 bottom: 16px, gap: 10px
```

### 고도화 예정 항목 (별도 계획)

- 추가 모바일 UX 개선
- 성능 최적화
- 기능 확장

---

## 커밋 이력 (세션 7 전체, 13건)

| 순서 | 커밋 해시 | 유형 | 내용 |
|------|----------|------|------|
| 1 | `62e791d` | style | 모바일 네비바 2단 구조 + 히어로 버튼·캐러셀 최적화 |
| 2 | `f64119c` | style | 히어로 슬라이드 5개 높이 통일 + 빌드 배포 |
| 3 | `cde1a26` | style | 히어로 버튼 가로 나란히 배치 + 슬라이드 높이 확정 고정 |
| 4 | `a4e4aaf` | docs | 세션 7 개발일지 업데이트 + 빌드 배포 |
| 5 | `d814269` | style | PC/태블릿 히어로 캐러셀 도트·스크롤 인디케이터 간격 조정 + 빌드 배포 |
| 6 | `359b839` | docs | 세션 25 개발일지 — PC/태블릿 캐러셀 도트·스크롤 인디케이터 간격 조정 |
| 7 | `36738ee` | build | 프로덕션 빌드 배포 (Vite v7.3.1) |
| 8 | `5700558` | docs | 세션 7 커밋 이력 업데이트 (7건) |
| 9 | `d99cf06` | style | 히어로 하단 여백 확대 + 캐러셀 도트·스크롤 인디케이터 간격 재조정 |
| 10 | `739b89c` | style | 스크롤 인디케이터 도트 위로 배치 + 1.5배 크기 확대 + 빌드 배포 |
| 11 | `3b8e517` | docs | 세션 7 개발일지 커밋 해시 보정 (10건) |
| 12 | `f3c0852` | fix | 게시판 페이지당 표시 글 수 10→20개로 변경 + 빌드 배포 |
| 13 | `7a0420d` | docs | 세션 27 개발일지 — 게시판·갤러리·블로그 CRUD 점검 + 커밋 이력 12건 |
