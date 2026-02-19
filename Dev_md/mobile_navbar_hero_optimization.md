# 모바일 네비바 2단 구조 + 히어로 슬라이드 버튼 최적화

**작업일**: 2026-02-19
**변경 유형**: CSS Only (JSX 변경 없음)
**대상 파일**: `src/styles/responsive.css`, `src/styles/navbar.css`

---

## 문제점 (Before)

| 항목 | 문제 |
|------|------|
| 네비바 | `.nav-actions`에 장바구니, 언어전환, 팔레트, 낮/밤, 로그인 + 햄버거가 **한 줄에 6~7개** 밀집 → 햄버거 버튼이 거의 안 보임 |
| 히어로 CTA 버튼 | `width: 100%`로 너무 넓어 터치 영역이 과도함 |
| 캐러셀 도트/인디케이터 | 도트와 스크롤 인디케이터 간 여백 부족, 480px에서 불필요한 스크롤 인디케이터 표시 |

---

## 변경 내용 (After)

### 1. 네비바 2단 구조 (768px 이하)

**파일**: `responsive.css` @768px

```css
:root {
    --nav-height: 90px;     /* 2행 구조에 맞게 높이 보정 */
}

.nav-wrapper {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 0 6px;
}

.logo {
    width: 100%;            /* 1행: 로고 전체 너비 */
}

.logo h1 {
    font-size: 22px;        /* 모바일용 축소 */
}

.nav-actions {
    width: 100%;            /* 2행: 액션 아이템들 전체 너비 */
    justify-content: flex-end;
    gap: 6px;               /* 8px → 6px 더 조밀하게 */
}
```

**결과**: 로고가 1행, 액션 버튼+햄버거가 2행으로 분리되어 각 요소가 명확하게 보임.

### 2. 액션 아이콘 크기 축소

**파일**: `navbar.css` @768px + `responsive.css` @768px

| 요소 | Before | After |
|------|--------|-------|
| `.theme-toggle` | 40x40px | 32x32px |
| `.theme-toggle svg` | 20x20px | 16x16px |
| `.color-picker-btn` | 40x40px | 32x32px |
| `.color-picker-btn svg` | 20x20px | 16x16px |
| `.cart-icon-link` | 기본 | 32x32px |
| `.cart-icon-svg` | 20x20px | 16x16px |
| `.lang-switcher` | 32x32px, 10px | 28x28px, 9px |
| `.nav-login-btn` | 7px 18px, 13px | 5px 14px, 12px |

### 3. 히어로 CTA 버튼 60% + 중앙정렬

**파일**: `responsive.css` @768px

```css
.hero-buttons {
    flex-direction: column;
    align-items: center;     /* 중앙 정렬 추가 */
}

.hero-buttons .btn {
    width: 60%;              /* 100% → 60% */
    max-width: 280px;        /* 과도한 확장 방지 */
}
```

**변경 포인트**: `.btn` 전체가 아닌 `.hero-buttons .btn`으로 선택자를 특정하여 다른 버튼에 영향 없음.

### 4. 캐러셀 도트 + 스크롤 인디케이터 여백 배치

**파일**: `responsive.css`

| 요소 | 768px | 480px |
|------|-------|-------|
| `.carousel-dots` | `bottom: 32px`, `gap: 10px` | `bottom: 24px` |
| `.scroll-indicator` | `bottom: 6px` | `display: none` (터치 기기에서 불필요) |
| `.mouse` | `20x32px` (축소) | 숨김 |

---

## 검증 체크리스트

- [x] `npx vite build` 성공
- [ ] 768px 모바일: 네비바 2줄 (로고 / 액션+햄버거 우측정렬) 확인
- [ ] 햄버거 버튼이 명확하게 보이는지 확인
- [ ] 히어로 CTA 버튼 60% 너비 + 중앙정렬 확인
- [ ] 캐러셀 도트가 버튼과 겹치지 않는지 확인
- [ ] 480px에서 스크롤 인디케이터 숨김 확인

---

## 변경 파일 요약

| 파일 | 변경 라인 | 설명 |
|------|-----------|------|
| `src/styles/responsive.css` | @768px 블록 상단 | nav-wrapper 2단 구조, --nav-height 오버라이드 |
| `src/styles/responsive.css` | @768px hero-buttons | .btn 60% + align-items: center |
| `src/styles/responsive.css` | @768px carousel-dots | bottom 32px, scroll-indicator bottom 6px |
| `src/styles/responsive.css` | @480px 블록 상단 | carousel-dots bottom 24px, scroll-indicator display:none |
| `src/styles/navbar.css` | @768px 블록 | theme-toggle, color-picker, cart-icon, lang-switcher, login-btn 크기 축소 |
