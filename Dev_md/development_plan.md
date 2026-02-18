# DreamIT Biz React 웹사이트 완전 복원 및 배포 계획

**작성일**: 2026-02-18
**상태**: 진행 중

## Context

DreamIT Biz(드림아이티비즈) 회사 웹사이트를 HTML 정적 사이트에서 React SPA로 전환하는 과정에서, GitHub Pages에서 React 앱이 마운트되지 않는 문제가 발생했습니다. 현재 `backup/` 폴더에 완전히 작동하는 정적 사이트가 있으나, React 버전은 라우터 불일치, CSS 누락, 빌드 불일치로 정상 동작하지 않습니다.

**목표**: backup 정적 사이트의 모든 콘텐츠와 디자인을 React SPA로 완전 복원하고, GitHub Pages(HashRouter)로 정상 배포합니다.

**결정사항**:
- 배포: GitHub Pages 유지 (HashRouter 사용)
- 백엔드: 1차 개발에서는 미정 (프론트엔드 우선)
- 범위: backup의 모든 콘텐츠 완전 복원 + 서비스 상세 6페이지 포함 + 배포

---

## Phase 1: 기반 수정 (Foundation Fix)

### 1.1 소스 디렉토리 통합
- `react-source/`를 유일한 개발 소스로 사용
- `webapp-react-full/` 디렉토리 삭제

### 1.2 라우터 전환 + Vite 설정
- **수정**: `react-source/src/App.jsx` → HashRouter + ServiceDetail 라우트 + React.lazy()
- **수정**: `react-source/vite.config.js` → `base: './'`
- **수정**: `react-source/index.html` → SPA 리다이렉트 스크립트 제거

### 1.3 CSS 시스템 재구축
backup style.css(1051줄) + portfolio.css(309줄) = 총 1360줄의 CSS를 React 모듈 CSS로 재구성

### 1.4 빌드 & 배포 파이프라인
- `npm run build` → dist/ 결과물을 D:/www/ 루트로 복사

---

## Phase 2: 전체 페이지 완성

### 2.1 커스텀 훅
- `useAOS.js` — IntersectionObserver 기반 스크롤 애니메이션
- `useCountUp.js` — 숫자 카운터 애니메이션

### 2.2 공통 컴포넌트
- `Particles.jsx`, `ScrollIndicator.jsx`, `AOSWrapper.jsx`, `CTA.jsx`

### 2.3 서비스 상세 페이지 (6개)
- web-development, web-hosting, design, consulting, education, publishing

### 2.4 기존 페이지 재작성
- Home, About, Portfolio, Blog, Contact, Navbar, Footer

### 2.5 다국어 데이터 확장

---

## Phase 3: 마무리 및 배포

### 3.1 반응형 디자인 완성
### 3.2 다크모드 완성
### 3.3 빌드 & GitHub Pages 배포
### 3.4 파일 정리

---

## Phase 4: 2차 개발 준비 (Render.com 백엔드)
- PostgreSQL + Express.js API 서버
- 게시판, 온라인 강의실, 결제, 전자출판, 회원 기능
- 별도 리포지토리(`aebonlee/www-api`)로 진행
