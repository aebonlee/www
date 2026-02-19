# 개발 로그 - 2026-02-19 (세션 7)

## 작업자: Claude Opus 4.6

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

## 금일 커밋 이력 (세션 7)

| 순서 | 커밋 해시 | 내용 |
|------|----------|------|
| 1 | `62e791d` | style: 모바일 네비바 2단 구조 + 히어로 버튼·캐러셀 최적화 |
| 2 | `f64119c` | style: 히어로 슬라이드 5개 높이 통일 + 빌드 배포 |
| 3 | `cde1a26` | style: 히어로 버튼 가로 나란히 배치 + 슬라이드 높이 확정 고정 |
| 4 | (본 커밋) | docs: 세션 7 개발일지 업데이트 + 빌드 배포 |
