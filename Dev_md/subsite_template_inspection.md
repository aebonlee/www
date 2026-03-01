# subsite-template 점검 보고서

**점검일**: 2026-03-01
**대상**: `D:\www\subsite-template\`
**빌드 상태**: `npm run build` 성공 (2.08s, 110 modules, 0 errors)

---

## 종합 결과

| 점검 항목 | 결과 | 이슈 수 |
|-----------|------|---------|
| 임포트 의존성 | PASS | 0 |
| 소스 파일 복사 정합성 | PASS | 0 |
| 번역 키 커버리지 | WARN | 2개 누락 |
| 라우트/네비 일관성 | FAIL | 4개 경로 미구현 |
| CSS 변수/클래스 | WARN | 1개 미정의 변수 |

---

## 1. 임포트 의존성 점검

**결과: PASS — 이슈 없음**

- 32개 파일 전수 검사 완료
- 깨진 임포트: 0건
- 순환 참조: 0건
- 미사용 임포트: 0건
- 미사용 파일: 0건
- 모든 named export 확인 완료
- npm 패키지 5종 모두 package.json에 선언되어 있고 설치 완료

---

## 2. 소스 파일 복사 정합성

**결과: PASS — 33/33 파일 원본과 동일**

| 카테고리 | 파일 수 | 상태 |
|---------|---------|------|
| Contexts | 5 | 동일 |
| Utils | 3 | 동일 |
| Components | 4 | 동일 |
| Pages | 9 | 동일 |
| Hooks | 1 | 동일 |
| Styles | 11 | 동일 |

추가 의존성 파일 2개(`searchStorage.js`, `config/admin.js`)도 정상 복사 확인.

---

## 3. 번역 키 커버리지

**결과: WARN — 누락 키 2개**

### 사용되지만 정의되지 않은 키 (CRITICAL)

| 키 | 사용 파일 | 설명 |
|----|----------|------|
| `community.cancel` | MyPage.jsx (line 89) | 취소 버튼 텍스트 |
| `community.loading` | OrderHistory.jsx (line 81) | 로딩 텍스트 |

### 정의되었지만 미사용 키 (INFO)

약 48개 키가 정의되어 있지만 현재 코드에서 사용하지 않음. `nav.*`, `footer.companyInfo`, `shop.subtitle`, `search.*`, `comments.*` 등. 대부분 Navbar/Footer가 `site.js`의 `labelKey`를 통해 간접 참조하거나, SearchModal/Pagination 등의 내부에서 사용되므로 삭제하면 안 됨. 향후 페이지 추가 시 활용될 공용 키이므로 유지 권장.

### ko/en 구조 일치 여부

양 언어 키 구조 완전 일치 확인. 누락된 언어 키 없음.

---

## 4. 라우트 / 네비게이션 일관성

**결과: FAIL — 4개 경로 미구현**

### site.js 메뉴에 정의되었지만 PublicLayout 라우트 없음

| 경로 | 메뉴 위치 | 영향 |
|------|----------|------|
| `/books` | 메뉴 + 푸터 | 클릭 시 404 |
| `/books/it` | 드롭다운 서브메뉴 | 클릭 시 404 |
| `/books/education` | 드롭다운 서브메뉴 | 클릭 시 404 |
| `/shop` | 메뉴 + 푸터 | 클릭 시 404 |

### 참고: 의도된 설계

이 4개 경로는 **하위 사이트 개발자가 직접 페이지를 만들어 추가하도록** 템플릿에서 의도적으로 비워둔 것임. PublicLayout.jsx의 주석(line 47-53)에 추가 방법이 안내되어 있음. 다만, `/shop`은 본사이트에서 복사한 `Shop.jsx` 페이지가 포함되지 않아 Cart/Checkout만 존재하는 상태.

### 하드코딩 경로 (정상)

Navbar 내부의 `/cart`, `/mypage`, `/mypage/orders`, `/login` 등 인증/쇼핑 관련 하드코딩 경로는 모두 PublicLayout에 Route가 존재하여 정상 작동.

---

## 5. CSS 변수 / 클래스 점검

**결과: WARN — 미정의 변수 1개**

### CSS 파일 존재 확인

index.css의 12개 @import 모두 정상. 고아 CSS 파일 없음.

### 미정의 CSS 변수

| 파일 | 라인 | 변수 | 심각도 |
|------|------|------|--------|
| toast.css | 70 | `var(--bg-gray)` | **HIGH** — 폴백 없음, 호버 효과 미작동 |
| auth.css | 11, 76 | `var(--bg-secondary, #f8f9fa)` | LOW — 폴백값 있어 작동은 함 |

### JSX className 검증

| 컴포넌트 | 결과 |
|----------|------|
| Navbar.jsx | 모든 클래스 navbar.css에 정의됨 |
| Footer.jsx | 모든 클래스 footer.css에 정의됨 |
| Home.jsx | `page-header` → hero.css, `section`/`site-welcome` → site.css |
| PublicLayout.jsx | `loading-spinner` → base.css |

---

## 수정 권고 사항

### 즉시 수정 (P0)

**1. 번역 키 2개 추가** — `translations.js`

```js
// ko 섹션에 추가
community: {
  cancel: '취소',
  loading: '로딩 중...',
}
// en 섹션에 추가
community: {
  cancel: 'Cancel',
  loading: 'Loading...',
}
```

**2. CSS 변수 수정** — `toast.css:70`

```css
/* AS-IS */
background: var(--bg-gray);
/* TO-BE */
background: var(--bg-light-gray);
```

### 선택 수정 (P1)

**3. /shop 라우트 추가** — 본사이트의 `Shop.jsx` 복사 후 PublicLayout에 추가하거나, site.js 메뉴에서 `/shop` 제거

**4. CSS 변수 정규화** — `base.css :root`에 `--bg-secondary: #f8f9fa;` 추가

### 향후 작업 (P2)

**5. /books 페이지 구현** — 하위 사이트 콘텐츠에 맞는 Books, BooksCategory 페이지 작성

---

## 파일 현황

```
subsite-template/           파일 수
├── src/config/            2  (site.js, admin.js)
├── src/contexts/          5  (Theme, Language, Auth, Cart, Toast)
├── src/utils/             5  (supabase, auth, portone, searchStorage, translations)
├── src/components/        4  (AuthGuard, SearchModal, SEOHead, Pagination)
├── src/components/layout/ 2  (Navbar, Footer)
├── src/layouts/           1  (PublicLayout)
├── src/pages/            10  (Home + 9 복사)
├── src/hooks/             1  (useAOS)
├── src/styles/           12  (11 복사 + site.css)
├── src/                   3  (main.jsx, App.jsx, index.css)
├── public/                1  (favicon.svg)
└── root                   5  (package.json, vite.config.js, index.html, .env.example, README.md)
                         ────
                          51 files total
```
