# 개발 로그 - 2026-02-19 (세션 3)

## 작업자: Claude Opus 4.6

---

## 세션 11: 사이트 전체 5가지 컬러 테마 시스템 구현

**커밋**: `8fd2c58` feat: 사이트 전체 5가지 컬러 테마 시스템 구현

### 개요

기존 브랜드 블루(#0046C8) 단일 컬러로 통일되어 있던 사이트를 5가지 컬러 테마(파랑/빨강/녹색/보라/주황) 중 선택 가능하도록 전면 개편. CSS `data-color` 속성 + CSS 변수 오버라이드 전략으로 기존 코드 변경을 최소화하면서 전체 사이트에 컬러 테마를 적용.

---

### 1. CSS 컬러 테마 변수 시스템

**수정 파일:** `src/styles/base.css`

기존 `:root` 변수(`--primary-blue`, `--primary-gradient` 등)의 값만 테마별로 오버라이드하는 방식. 변수 이름 변경 없이 값만 전환하므로 기존 CSS 파일 대부분 수정 불필요.

```css
html[data-color="blue"]   → 기본값 (변경 없음)
html[data-color="red"]    → --primary-blue: #C8102E; ...
html[data-color="green"]  → --primary-blue: #00855A; ...
html[data-color="purple"] → --primary-blue: #8B1AC8; ...
html[data-color="orange"] → --primary-blue: #C87200; ...
```

#### 5가지 테마 컬러 정의

| 테마 | Primary | Dark | Light |
|------|---------|------|-------|
| **파랑** (기본) | `#0046C8` | `#002E8A` | `#4A8FE7` |
| **빨강** | `#C8102E` | `#8A001A` | `#E74A5A` |
| **녹색** | `#00855A` | `#005C3E` | `#4AE79A` |
| **보라** | `#8B1AC8` | `#5E008A` | `#B04AE7` |
| **주황** | `#C87200` | `#8A4E00` | `#E7A04A` |

#### 신규 CSS 변수 추가

| 변수 | 용도 |
|------|------|
| `--hero-bg` | Hero/CTA/페이지헤더 그라데이션 (라이트) |
| `--hero-bg-dark` | Hero/CTA/페이지헤더 그라데이션 (다크) |
| `--highlight-gradient` | Hero 하이라이트 텍스트 그라데이션 |

---

### 2. Hero 캐러셀 단일 컬러 전환

**수정 파일:** `src/styles/hero.css`

- `.gradient-slide-0~4` 개별 그라데이션 → **삭제**
- 모든 슬라이드가 `var(--hero-bg)` 하나의 그라데이션 사용
- `.highlight` 텍스트: `var(--highlight-gradient)` 참조

**수정 파일:** `src/components/HeroCarousel.jsx`

- `gradient-slide-${i}` 클래스 → 제거 (모든 슬라이드 동일 CSS 변수 배경)

---

### 3. 다크모드 + 테마 컬러 조합

**수정 파일:** `src/styles/dark-mode.css`

- `.gradient-slide-0~4` 다크모드 개별 오버라이드 → **삭제**
- 5가지 `[data-theme="dark"][data-color="xxx"]` 셀렉터 추가
- 각 테마별 다크모드 Primary/Dark/Light/Hero/Highlight 변수 오버라이드

| 테마 | 다크모드 Primary | 다크모드 Hero 그라데이션 |
|------|-----------------|------------------------|
| 파랑 | `#4A8FE7` | `#0A2D6E → #122870 → #172D58` |
| 빨강 | `#E74A5A` | `#6E1422 → #701020 → #581828` |
| 녹색 | `#4AE79A` | `#0A5438 → #104830 → #163D2A` |
| 보라 | `#B04AE7` | `#4A126E → #3C0A60 → #2C1850` |
| 주황 | `#E7A04A` | `#6E3E10 → #603510 → #4E2C18` |

---

### 4. CTA·페이지헤더 변수 참조 전환

**수정 파일:**
- `src/styles/cta.css` — `.cta-section` background: 하드코딩 → `var(--hero-bg)` 참조
- `src/styles/portfolio.css` — `.page-header` background: 하드코딩 → `var(--hero-bg)` 참조

---

### 5. ThemeContext 컬러 테마 상태 추가

**수정 파일:** `src/contexts/ThemeContext.jsx`

- `colorTheme` state 추가 (`'blue' | 'red' | 'green' | 'purple' | 'orange'`)
- `document.documentElement.setAttribute('data-color', colorTheme)` 적용
- `localStorage.setItem('colorTheme', ...)` 저장 및 복원
- Provider에 `colorTheme`, `setColorTheme` 노출

---

### 6. Navbar 컬러 팔레트 UI (인라인 도트)

**수정 파일:** `src/components/layout/Navbar.jsx`, `src/styles/navbar.css`

- `.nav-actions` 내에 5개 컬러 도트 버튼 인라인 배치
- 각 도트: 해당 테마 primary 색상 배경, 선택 테마에 active 링 표시
- `useTheme()` 에서 `colorTheme`, `setColorTheme` 사용

---

### 7. SVG 인라인 컬러 변수 전환 (11개 JSX 페이지)

하드코딩된 SVG 컬러(`#0066CC`, `#3385D6`, `#0046C8`, `#4A8FE7`)를 CSS 변수로 전환.

> SVG 인라인 속성(`fill="#0066CC"`)은 CSS 변수를 직접 사용할 수 없으므로
> `style={{ fill: 'var(--primary-blue)' }}` / `style={{ stopColor: 'var(--primary-blue)' }}` 로 변환

**수정 대상 파일 (11개):**

| 파일 | 변환 내역 |
|------|----------|
| `src/pages/About.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/RnD.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/ServiceDetail.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/ConsultingBusiness.jsx` | `#0046C8`/`#0066CC` → `var(--primary-blue)` |
| `src/pages/ConsultingUniversity.jsx` | `#0046C8`/`#4A8FE7` → `var(--primary-blue)`/`var(--primary-blue-light)` |
| `src/pages/ConsultingInstitution.jsx` | `#0066CC` → `var(--primary-blue)` |
| `src/pages/EducationCustom.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/PublishingBook.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/PublishingEbook.jsx` | `#0066CC` → `var(--primary-blue)` |
| `src/pages/PublishingMaterial.jsx` | `#0066CC` → `var(--primary-blue)`, `#3385D6` → `var(--primary-blue-light)` |
| `src/pages/PublishingPeriodical.jsx` | `#0066CC` → `var(--primary-blue)` |

---

## 세션 12: Hero 배경효과 정리 + 컬러 팔레트 아이콘 툴팁 UI

**커밋**: `0927132` feat: 컬러 팔레트 아이콘 툴팁 UI + Hero 배경효과 정리

### 1. Hero 캐러셀 배경효과 정리

**수정 파일:** `src/components/HeroBackground.jsx`

Particles(파티클 부유)와 Orbs(상승 오브)는 시각적으로 복잡해 보이기만 하므로 제거. Matrix/Network/Geometric 3가지만 유지하고 2개를 반복하여 5개 슬라이드를 채움.

| 변경 전 | 변경 후 |
|---------|---------|
| `[ParticlesBg, MatrixBg, NetworkBg, OrbsBg, GeometricBg]` | `[MatrixBg, NetworkBg, GeometricBg, MatrixBg, NetworkBg]` |

| 슬라이드 | 배경 효과 |
|----------|----------|
| 0 | 매트릭스 코드 낙하 |
| 1 | 네트워크 노드 연결 |
| 2 | 기하학 도형 부유 |
| 3 | 매트릭스 코드 낙하 (반복) |
| 4 | 네트워크 노드 연결 (반복) |

- `ParticlesBg`, `OrbsBg` 컴포넌트는 코드 내 유지 (미사용)

---

### 2. 컬러 팔레트 아이콘 + 풍선 도움말 UI

**수정 파일:**
- `src/components/layout/Navbar.jsx`
- `src/styles/navbar.css`
- `src/styles/responsive.css`

기존 인라인으로 나열되던 5개 컬러 도트를 **팔레트 아이콘 버튼 + 클릭 시 풍선 도움말(tooltip)** 형태로 변경.

#### 변경 전후 비교

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 표시 방식 | 5개 컬러 점 항상 표시 | 팔레트 아이콘 1개 |
| 선택 방법 | 바로 클릭 | 아이콘 클릭 → 풍선 도움말에서 선택 |
| 닫기 | — | 바깥 클릭 시 자동 닫힘 |
| 네비바 공간 | 넓음 | 최소화 (40×40px 아이콘 1개) |

#### 새로운 컴포넌트 구조

```jsx
<div className="color-picker-wrapper">
  <button className="color-picker-btn">  {/* 팔레트 SVG 아이콘 */}
  {showColorPicker && (
    <>
      <div className="color-picker-overlay" />     {/* 바깥 클릭 감지용 */}
      <div className="color-picker-tooltip">        {/* 풍선 도움말 */}
        <div className="color-picker-arrow" />      {/* 화살표 */}
        {COLOR_OPTIONS.map(c => <button className="color-dot" />)}
      </div>
    </>
  )}
</div>
```

#### 새로운 CSS 스타일

| 클래스 | 역할 |
|--------|------|
| `.color-picker-wrapper` | 상대 위치 컨테이너 |
| `.color-picker-btn` | 40×40px 버튼 (테마 토글과 동일 스타일) |
| `.color-picker-overlay` | 풀스크린 투명 오버레이 (z-index: 998) |
| `.color-picker-tooltip` | 절대 위치 풍선 도움말 (z-index: 999) |
| `.color-picker-arrow` | CSS 삼각형 화살표 |
| `@keyframes tooltip-fade-in` | 페이드인 애니메이션 |

#### 모바일 반응형 (768px 이하)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 버튼 크기 | 40×40px | 34×34px |
| 도트 크기 | 24px | 20px |
| 툴팁 정렬 | 중앙 | 우측 정렬 (화면 밖 방지) |
| 화살표 위치 | 중앙 | 우측 12px |

---

## 수정 파일 전체 목록

### 세션 11 (`8fd2c58`)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/styles/base.css` | 수정 | 5가지 `[data-color]` 셀렉터 + 신규 변수 추가 |
| `src/styles/hero.css` | 수정 | 슬라이드별 그라데이션 삭제 → 단일 변수 참조 |
| `src/styles/dark-mode.css` | 수정 | 슬라이드별 오버라이드 삭제 + 5색 다크모드 추가 |
| `src/styles/cta.css` | 수정 | 하드코딩 그라데이션 → `var(--hero-bg)` |
| `src/styles/portfolio.css` | 수정 | 페이지헤더 → `var(--hero-bg)` |
| `src/styles/navbar.css` | 수정 | 컬러 팔레트 도트 스타일 추가 |
| `src/contexts/ThemeContext.jsx` | 수정 | `colorTheme` + `setColorTheme` 추가 |
| `src/components/layout/Navbar.jsx` | 수정 | 5색 컬러 도트 UI 추가 |
| `src/components/HeroCarousel.jsx` | 수정 | `gradient-slide-${i}` 클래스 제거 |
| `src/pages/About.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/RnD.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/ServiceDetail.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/ConsultingBusiness.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/ConsultingUniversity.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/ConsultingInstitution.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/EducationCustom.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/PublishingBook.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/PublishingEbook.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/PublishingMaterial.jsx` | 수정 | SVG 컬러 → CSS 변수 |
| `src/pages/PublishingPeriodical.jsx` | 수정 | SVG 컬러 → CSS 변수 |

### 세션 12 (`0927132`)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/HeroBackground.jsx` | 수정 | Particles/Orbs 제거 → Matrix/Network/Geometric만 사용 |
| `src/components/layout/Navbar.jsx` | 수정 | 인라인 도트 → 팔레트 아이콘 + 풍선 도움말 |
| `src/styles/navbar.css` | 수정 | `.color-picker-*` 스타일 추가 |
| `src/styles/responsive.css` | 수정 | 모바일 컬러 팔레트 우측 정렬 |

---

## 금일 전체 커밋 이력 (세션 2~3)

1. `dfcdf4d` feat: Hero 캐러셀 슬라이더 + 5색 컬러셋 + 시간 기반 자동 테마 전환
2. `8425930` deploy: Hero 캐러셀 슬라이더 + 5색 컬러셋 + 자동 테마 전환 빌드 배포
3. `8fd2c58` feat: 사이트 전체 5가지 컬러 테마 시스템 구현
4. `0927132` feat: 컬러 팔레트 아이콘 툴팁 UI + Hero 배경효과 정리

---

## 빌드 배포 결과

- **빌드 도구**: Vite v7.3.1
- **모듈 수**: 126 모듈
- **빌드 시간**: 4.55초
- **CSS**: 69.65 kB (gzip 11.90 kB)
- **JS**: 262.79 kB (gzip 84.09 kB)
- dist → D:/www/ 복사 → GitHub Pages 배포 완료

---

## 다음 작업 예정

- [ ] 구 빌드 에셋 파일 정리 (사용하지 않는 이전 해시 파일 삭제)
- [ ] 다크모드 + 각 컬러 테마 조합 크로스 브라우저 테스트
- [ ] 모바일 기기 실물 테스트 (터치 인터랙션, 풍선 도움말 위치)
