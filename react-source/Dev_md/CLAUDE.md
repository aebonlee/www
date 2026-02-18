# CLAUDE.md - DreamIT Biz React SPA 개발 가이드

**프로젝트**: DreamIT Biz 기업 웹사이트
**최종 업데이트**: 2026-02-18 20:35 KST
**담당 AI**: Claude Opus 4.6

---

## 프로젝트 경로

- **소스 코드**: `D:/www/react-source/`
- **빌드 출력**: `D:/www/react-source/dist/`
- **개발 문서**: `D:/www/react-source/Dev_md/`

---

## 기술 스택

- React 19.2.0 + React Router DOM 7.13.0
- Vite 7.3.1 (빌드 도구)
- CSS Variables + Custom CSS
- HashRouter (정적 배포 호환)
- Context API (테마, 언어)

---

## 아키텍처

### 라우팅
- `HashRouter` 사용 (정적 호스팅 호환)
- 모든 페이지 `lazy()` + `Suspense` 코드 분할
- 16개 라우트, 레거시 리다이렉트 포함

### 상태 관리
- `ThemeContext` — 다크/라이트 모드 (localStorage 저장)
- `LanguageContext` — 한국어/영어 전환, `t(key)` 함수

### CSS 시스템
- CSS Variables 기반 테마 전환
- `[data-theme="dark"]` 선택자로 다크모드 오버라이드
- 4단계 브레이크포인트: 1100px, 1024px, 768px, 480px
- 컴포넌트별 CSS 파일 분리 (13개)

---

## 메뉴 구조 (2026-02-18 적용)

```
홈 | IT서비스▼ | 교육▼ | 출판▼ | 포트폴리오▼ | 커뮤니티▼ | 회사소개▼ | 연락처
```

### 서비스 분류
- **IT서비스**: 웹개발, 웹호스팅, 디자인, 컨설팅
- **교육**: 맞춤 강의, 온라인 강의실
- **출판**: 전자출판, 간행물, 책

### 데이터 파일
- `serviceDetails.js` — IT서비스 4개 (web-development, web-hosting, design, consulting)
- `educationDetails.js` — 교육 2개 (custom, classroom)
- `publishingDetails.js` — 출판 3개 (ebook, periodical, book)

---

## 개발 규칙

### 파일 명명 규칙
- 페이지: PascalCase (`Education.jsx`, `PublishingBook.jsx`)
- 데이터: camelCase (`educationDetails.js`)
- 스타일: kebab-case (`dark-mode.css`)
- 컴포넌트: PascalCase (`Navbar.jsx`)

### 번역 추가 시
1. `src/utils/translations.js`에 ko/en 동시 추가
2. 키 구조: `nav.xxx`, `education.xxx`, `publishing.xxx`, `community.xxx`, `common.xxx`
3. 컴포넌트에서 `const { t } = useLanguage()` 로 사용

### 새 페이지 추가 시
1. `src/pages/NewPage.jsx` 생성
2. `src/App.jsx`에 `lazy()` import + `<Route>` 추가
3. `Navbar.jsx`의 `menuItems`에 메뉴 항목 추가
4. 필요시 `translations.js`에 번역 키 추가
5. `dark-mode.css`에 다크모드 스타일 추가
6. `responsive.css`에 반응형 규칙 추가

### CSS 추가 시
- 기존 CSS Variables 사용: `--primary-blue`, `--bg-white`, `--bg-light-gray` 등
- 다크모드 필수: `[data-theme="dark"] .new-component { ... }`
- 반응형 필수: 최소 768px, 1024px 브레이크포인트

---

## 백엔드 상태 (미구현)

현재 프론트엔드만 구축된 상태:
- **게시판**: 프론트엔드 UI 완성, 샘플 데이터 사용 (백엔드 CRUD 미연결)
- **온라인 강의실**: 프론트엔드 UI 완성, "준비 중" 표시 (LMS 백엔드 미구현)
- **결제 시스템**: 미구현
- **연락처 폼**: 프론트엔드만 (이메일 발송 미연결)

---

## 빌드 & 배포

```bash
# 개발
npm run dev

# 빌드
npm run build

# 빌드 결과: dist/ 폴더
# HashRouter 사용으로 어떤 정적 호스팅에도 배포 가능
```

---

## 변경 이력

### 2026-02-18: 서비스 메뉴 재구조화
- 서비스 메뉴를 IT서비스/교육/출판 3개 독립 메뉴로 분리
- 블로그를 커뮤니티(블로그+게시판)로 변경
- 8개 신규 페이지 생성
- 11개 신규 파일, 12개 수정 파일
- 반응형 1100px 브레이크포인트 추가
- 모든 신규 페이지 한/영 번역 + 다크모드 지원
- 빌드 성공: 70 modules, 4.09s
