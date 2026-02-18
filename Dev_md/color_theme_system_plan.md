# 사이트 전체 5가지 컬러 테마 시스템 구현 - 개발계획서

**작성일**: 2026-02-19
**프로젝트**: DreamIT Biz 웹사이트
**목표**: 사이트 전체를 5가지 컬러 테마 중 선택 가능하게 구현

---

## 1. 개요

### 현재 상태
- 파랑(#0046C8) 단일 브랜드 컬러로 전체 통일
- Hero 캐러셀 5개 슬라이드가 각각 다른 색상 그라데이션 사용

### 변경 사항
1. Hero 캐러셀 5개 슬라이드를 모두 동일한 다크블루 원컬러로 통일 (슬라이드별 다른 색상 제거)
2. 사이트 전체 컬러 테마를 5가지 중 선택 가능 (파랑/빨강/녹색/보라/주황)
3. 선택한 테마 컬러가 네비게이션, 버튼, Hero, CTA, 페이지헤더, 아이콘, SVG 등 사이트 전체에 적용

---

## 2. 5가지 테마 컬러 정의

기존 다크블루(#0046C8)의 채도를 기준으로 5색 통일:

### 라이트모드 컬러

| 테마 | Primary | Dark | Light | Hero Gradient (Light) | Hero Gradient (Dark) |
|------|---------|------|-------|-----------------------|----------------------|
| **파랑** (기본) | `#0046C8` | `#002E8A` | `#4A8FE7` | `#0046C8→#002E8A→#1E3A5F` | `#0A2D6E→#122870→#172D58` |
| **빨강** | `#C8102E` | `#8A001A` | `#E74A5A` | `#C8102E→#8A001A→#5F1E28` | `#6E1422→#701020→#581828` |
| **녹색** | `#00855A` | `#005C3E` | `#4AE79A` | `#00855A→#005C3E→#1E4A35` | `#0A5438→#104830→#163D2A` |
| **보라** | `#8B1AC8` | `#5E008A` | `#B04AE7` | `#8B1AC8→#5E008A→#3C1E5F` | `#4A126E→#3C0A60→#2C1850` |
| **주황** | `#C87200` | `#8A4E00` | `#E7A04A` | `#C87200→#8A4E00→#5F401E` | `#6E3E10→#603510→#4E2C18` |

### 다크모드 컬러 (밝게 조정)

| 테마 | Dark Mode Primary | Dark Mode Dark | Dark Mode Light |
|------|-------------------|----------------|-----------------|
| 파랑 | `#4A8FE7` | `#2B6CC4` | `#93C5FD` |
| 빨강 | `#E74A5A` | `#C42B3B` | `#FD9393` |
| 녹색 | `#4AE79A` | `#2BC46A` | `#93FDC5` |
| 보라 | `#B04AE7` | `#8B2BC4` | `#D493FD` |
| 주황 | `#E7A04A` | `#C4832B` | `#FDCF93` |

---

## 3. 구현 전략

### CSS `data-color` 속성 + 변수 오버라이드

기존 CSS 변수(`--primary-blue`, `--primary-gradient` 등)의 **값만** 테마별로 오버라이드. 변수 이름 변경 없음 → CSS 파일 대부분 수정 불필요.

```css
html[data-color="blue"]   → 기본값 (변경 없음)
html[data-color="red"]    → --primary-blue: #C8102E; ...
html[data-color="green"]  → --primary-blue: #00855A; ...
html[data-color="purple"] → --primary-blue: #8B1AC8; ...
html[data-color="orange"] → --primary-blue: #C87200; ...
```

---

## 4. 수정 파일 목록

### CSS 파일 (6개)

#### 4.1 `src/styles/base.css` — 테마 컬러 변수 정의 추가
- `:root` 뒤에 5가지 `[data-color]` 셀렉터 추가
- 새 변수 추가: `--hero-bg`, `--hero-bg-dark`, `--highlight-gradient`
- 기존 `:root` 변수는 그대로 유지 (blue 기본값)

#### 4.2 `src/styles/hero.css` — Hero 캐러셀 단일 컬러 전환
- `.gradient-slide-0~4` 개별 그라데이션 → **삭제**
- 모든 슬라이드가 `var(--hero-bg)` 하나의 그라데이션 사용
- `.hero` 배경: `var(--hero-bg)` 변수 참조
- `.highlight` 텍스트: `var(--highlight-gradient)` 변수 참조
- `.hero-buttons .btn-primary` color: `var(--primary-blue)` 참조

#### 4.3 `src/styles/dark-mode.css` — 슬라이드별 오버라이드 제거 + 테마 다크 변수
- `.gradient-slide-0~4` 다크모드 개별 오버라이드 → **삭제**
- `[data-theme="dark"] .hero`: `var(--hero-bg-dark)` 참조
- 5가지 `[data-theme="dark"][data-color="xxx"]` 오버라이드 추가
- CTA/page-header 다크모드도 변수 참조로 전환

#### 4.4 `src/styles/cta.css` — 하드코딩된 그라데이션 → 변수 참조
- `.cta-section` background: `var(--hero-bg)` 참조
- `.cta-content .btn-primary` color: `var(--primary-blue)` 참조

#### 4.5 `src/styles/portfolio.css` — page-header 그라데이션 → 변수
- `.page-header` background: `var(--hero-bg)` 참조

#### 4.6 `src/styles/navbar.css` — 컬러 팔레트 버튼 스타일 추가
- `.color-palette` 컨테이너 (5개 원형 버튼)
- 각 버튼 `.color-dot` + `.color-dot.active` 스타일
- 반응형: 모바일에서 세로 배치 or 모바일 메뉴 내 배치

### React 컴포넌트 (3개)

#### 4.7 `src/contexts/ThemeContext.jsx` — 컬러 테마 상태 추가
- `colorTheme` state 추가 ('blue' | 'red' | 'green' | 'purple' | 'orange')
- `document.documentElement.setAttribute('data-color', colorTheme)` 적용
- `localStorage.setItem('colorTheme', ...)` 저장
- Provider에 `colorTheme`, `setColorTheme` 추가

#### 4.8 `src/components/layout/Navbar.jsx` — 컬러 팔레트 UI 추가
- `.nav-actions` 내 테마토글 앞에 5개 컬러 도트 버튼 추가
- `useTheme()` 에서 `colorTheme`, `setColorTheme` 사용
- 각 도트: 해당 테마 primary 색상 배경, 선택된 테마에 active 링 표시

#### 4.9 `src/components/HeroCarousel.jsx` — 슬라이드별 gradient 클래스 제거
- `gradient-slide-${i}` → 제거 (모든 슬라이드 동일 CSS 변수 배경)

#### 4.10 `src/components/HeroBackground.jsx` — 배경 효과 컬러 중립화
- 모든 배경 효과를 흰색/반투명 톤으로 통일
- 테마 컬러와 무관하게 어떤 배경에서든 잘 보이도록

### JSX 페이지 SVG 컬러 업데이트 (11개 파일)
하드코딩된 `#0066CC`/`#3385D6` → `var(--primary-blue)`/`var(--primary-blue-light)` 변환

- `src/pages/About.jsx`
- `src/pages/RnD.jsx`
- `src/pages/ServiceDetail.jsx`
- `src/pages/ConsultingBusiness.jsx`
- `src/pages/ConsultingUniversity.jsx`
- `src/pages/ConsultingInstitution.jsx`
- `src/pages/EducationCustom.jsx`
- `src/pages/PublishingBook.jsx`
- `src/pages/PublishingEbook.jsx`
- `src/pages/PublishingMaterial.jsx`
- `src/pages/PublishingPeriodical.jsx`

> SVG 인라인 속성(`fill="#0066CC"`)은 CSS 변수를 직접 사용할 수 없음.
> → `style={{ fill: 'var(--primary-blue)' }}` 또는 `style={{ stopColor: 'var(--primary-blue)' }}` 로 변환

---

## 5. 빌드 & 배포

```bash
cd D:/www/react-source && npm run build
node -e "require('fs').cpSync('D:/www/react-source/dist','D:/www',{recursive:true,force:true})"
git commit & push
```

---

## 6. 검증 항목

- [ ] 기본 파랑 테마에서 기존과 동일한 UI
- [ ] 5개 컬러 도트 클릭 시 사이트 전체 컬러 즉시 변경
- [ ] Hero 캐러셀 모든 슬라이드 동일 그라데이션 (선택 테마 컬러)
- [ ] 다크모드 + 각 테마 컬러 조합 정상 작동
- [ ] 페이지 새로고침 후 선택한 테마 유지 (localStorage)
- [ ] SVG 아이콘/배경이 테마 컬러에 맞게 변경
- [ ] CTA, 페이지헤더, 버튼, 링크 등 전체 통일
- [ ] 모바일 반응형에서 컬러 팔레트 UI 접근 가능
