# 개발 로그 - 2026-02-19 (세션 2)

## 작업자: Claude Opus 4.6

---

## 세션 10: Hero 캐러셀 슬라이더 구현

**커밋**: `dfcdf4d` feat: Hero 캐러셀 슬라이더 + 5색 컬러셋 + 시간 기반 자동 테마 전환

### 개요

Home 페이지의 정적 Hero 섹션을 5개 슬라이드 캐러셀로 전환. 각 슬라이드마다 고유 컬러 그라데이션과 JavaScript 배경 효과를 적용하고, 다크모드 가독성 개선 및 시스템 시간 기반 자동 테마 전환 기능을 추가.

---

### 1. Hero 캐러셀 슬라이더

**신규 파일:**
- `src/components/HeroCarousel.jsx` — 메인 캐러셀 컴포넌트
- `src/components/HeroBackground.jsx` — 5가지 배경 효과 컴포넌트

**수정 파일:**
- `src/pages/Home.jsx` — Hero 섹션을 `<HeroCarousel />` 컴포넌트로 교체

#### 5개 슬라이드 구성

| # | 테마 | 하이라이트 | 배경 효과 | CTA 링크 |
|---|------|-----------|----------|----------|
| 0 | 브랜드 총괄 | 미래 / Future | 파티클 부유 | /services, /contact |
| 1 | IT서비스 (웹개발·호스팅·디자인) | 디지털 존재감 | 매트릭스 코드 낙하 | /services |
| 2 | 연구개발 & 컨설팅 | 혁신 컨설팅 | 네트워크 노드 연결 | /rnd, /consulting |
| 3 | 교육 | IT 교육 | 상승 오브 (빛 구슬) | /education |
| 4 | 출판 & 스토어 | 출판 | 기하학 도형 부유 | /publishing, /shop |

#### 기능 사양

| 기능 | 구현 |
|------|------|
| 자동 재생 | 5초 간격, hover 시 일시정지 |
| 화살표 | 양쪽 원형 글래스모피즘 버튼 (`‹` `›`) |
| 도트 인디케이터 | 하단 중앙, 활성 슬라이드 강조 |
| 터치 스와이프 | 좌우 50px 이상 시 슬라이드 전환 |
| 키보드 | ArrowLeft/ArrowRight 지원 |
| 전환 애니메이션 | CSS translateX, 0.7s cubic-bezier |
| 다국어 | ko/en 모든 슬라이드 번역 |

---

### 2. 5가지 컬러셋 (현재 블루 채도 기준 통일)

**수정 파일:** `src/styles/hero.css`

현재 브랜드 블루(HSL 215°, 100%, 39%)의 채도를 기준으로 5가지 대표 컬러 통일:

| 슬라이드 | 컬러 | 라이트 모드 그라데이션 |
|---|---|---|
| 0 | **파랑** | `#0046C8 → #002E8A → #1E3A5F` |
| 1 | **빨강** | `#C8102E → #8A001A → #5F1E28` |
| 2 | **녹색** | `#00855A → #005C3E → #1E4A35` |
| 3 | **보라** | `#8B1AC8 → #5E008A → #3C1E5F` |
| 4 | **주황** | `#C87200 → #8A4E00 → #5F401E` |

#### 배경 효과 컬러 매칭

| 슬라이드 | 효과 | 효과 컬러 |
|---|---|---|
| 0 파랑 | 파티클 부유 | 흰색 반투명 |
| 1 빨강 | 매트릭스 코드 낙하 | `rgba(255,120,120,0.35)` 빨강 톤 |
| 2 녹색 | 네트워크 노드 | `rgba(100,230,170,0.3)` 에메랄드 톤 |
| 3 보라 | 상승 오브 | `hue 270~310` 바이올렛 톤 |
| 4 주황 | 기하학 도형 | `rgba(255,180,60,0.1)` 앰버/골드 톤 |

---

### 3. 다크모드 가독성 개선

**수정 파일:** `src/styles/dark-mode.css`

#### 문제
기존 다크모드 슬라이드 그라데이션이 `#0A~0F` 대의 극저 명도로 색상 구분이 불가능하고 흰색 텍스트와의 대비가 불충분.

#### 해결
다크모드 그라데이션 채도를 `#4A~6E` 대로 상향. 충분히 어두우면서도 색상 정체성을 유지:

| 슬라이드 | 컬러 | 다크 모드 그라데이션 (개선) |
|---|---|---|
| 0 | **파랑** | `#0A2D6E → #122870 → #172D58` |
| 1 | **빨강** | `#6E1422 → #701020 → #581828` |
| 2 | **녹색** | `#0A5438 → #104830 → #163D2A` |
| 3 | **보라** | `#4A126E → #3C0A60 → #2C1850` |
| 4 | **주황** | `#6E3E10 → #603510 → #4E2C18` |

#### 전역 다크모드 개선
- `--primary-blue` 다크모드 오버라이드: `#0046C8` → `#4A8FE7` (밝은 블루)
- `--primary-blue-dark`: `#2B6CC4`
- `--primary-gradient`: 밝은 그라데이션으로 교체
- 전체 사이트 링크/버튼/아이콘의 다크 배경 대비 가독성 향상

---

### 4. 시스템 시간 기반 자동 테마 전환

**수정 파일:**
- `src/contexts/ThemeContext.jsx` — 3단계 모드 추가
- `src/components/layout/Navbar.jsx` — 3상태 토글 아이콘
- `src/styles/navbar.css` — 아이콘 표시 로직

#### 3단계 모드

| 모드 | 동작 | 아이콘 |
|------|------|--------|
| `auto` (기본값) | 06:00~18:00 라이트, 18:00~06:00 다크 (매분 체크) | 반원 (sun+moon) |
| `light` | 항상 라이트 | 달 (moon) |
| `dark` | 항상 다크 | 해 (sun) |

**토글 순서:** auto → light → dark → auto

**구현 상세:**
- `getTimeBasedTheme()` — 시스템 시간 기반 라이트/다크 판별
- auto 모드에서 60초 인터벌로 시간 변경 감지
- localStorage 키: `themeMode` (기존 `theme` 키 자동 마이그레이션)
- 3개 SVG 아이콘: `data-mode` 속성 기반 CSS 표시 전환

---

### 5. 출판 페이지 2×2 그리드 재배치

**수정 파일:** `src/pages/Publishing.jsx`

- `category-grid four-col` → `category-grid` (four-col 클래스 제거)
- 기본 `.category-grid`가 `grid-template-columns: repeat(2, 1fr)` (2열)
- 4개 카드가 2행 × 2열로 배치
- 반응형: 태블릿 2열 유지 → 모바일(768px 이하) 1열

---

### 6. 다국어 번역 추가

**수정 파일:** `src/utils/translations.js`

`heroSlides` 배열 추가 (ko/en 각 5개 슬라이드):

```
heroSlides[i] = {
  line1: 첫째 줄,
  line2: 둘째 줄 앞부분,
  highlight: 강조 텍스트 (그라데이션 효과),
  line3: 둘째 줄 뒷부분,
  description: 설명 (줄바꿈 포함),
  cta1: 첫 번째 CTA 버튼 텍스트,
  cta2: 두 번째 CTA 버튼 텍스트 (없으면 빈 문자열)
}
```

---

### 7. 반응형 디자인

**수정 파일:** `src/styles/responsive.css`

| 브레이크포인트 | 화살표 크기 | 화살표 위치 |
|--------------|-----------|-----------|
| 1024px 이하 | 42×42px | 좌 16px / 우 16px |
| 768px 이하 | 36×36px, 도트 8px | 좌 10px / 우 10px |
| 480px 이하 | 32×32px | 좌 8px / 우 8px |

---

## 수정 파일 전체 목록

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/HeroCarousel.jsx` | **신규** | 캐러셀 메인 컴포넌트 |
| `src/components/HeroBackground.jsx` | **신규** | 5가지 배경 효과 |
| `src/pages/Home.jsx` | 수정 | Hero → HeroCarousel 교체 |
| `src/pages/Publishing.jsx` | 수정 | four-col → 2×2 그리드 |
| `src/utils/translations.js` | 수정 | heroSlides ko/en 추가 |
| `src/styles/hero.css` | 수정 | 캐러셀 + 5색 그라데이션 + 효과 + 화살표 + 도트 |
| `src/styles/dark-mode.css` | 수정 | 다크모드 채도 상향 + primary 오버라이드 |
| `src/styles/responsive.css` | 수정 | 캐러셀 반응형 3단계 |
| `src/styles/navbar.css` | 수정 | 3상태 테마 토글 아이콘 |
| `src/contexts/ThemeContext.jsx` | 수정 | auto/light/dark 3단계 전환 |
| `src/components/layout/Navbar.jsx` | 수정 | auto 아이콘 + data-mode 속성 |

---

## 빌드 배포 결과

- Vite v7.3.1, 126 모듈, 2.6초 빌드
- CSS: 65.67 kB (gzip 11.21 kB)
- JS: 261.13 kB (gzip 83.61 kB)
- dist → root 복사 → GitHub Pages 배포 완료
