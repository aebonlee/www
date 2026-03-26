# 기술 스택 상세 분석

> 작성일: 2026-03-25

---

## 1. 프레임워크 & 빌드 도구 분포

### React 버전 분포

| React 버전 | 프로젝트 수 | 해당 프로젝트 |
|-----------|-----------|-------------|
| **React 19.x** | 33개 | coding, c-study, python-study, java-study, koreatech, algorithm, data-structure, linux-study, db-study, software, ai-prompt, ai-data, reactStudy, webstudy, career, digitalbiz, marketing, uxdesign, self-branding, english, japanese, templete-ref, allthat, papers, reserve, docs, competency, edu-hub, hohai, pbirobot, books, pbi, self-branding |
| **React 18.x** | 3개 | ahp, ahp_app, aebon, ahp_basic, koreait |
| **없음** | 1개 | jdy (바닐라 JS) |
| **없음** | 1개 | database_test (Node.js 서버) |

### 빌드 도구 분포

| 빌드 도구 | 버전 | 프로젝트 수 | 해당 프로젝트 |
|-----------|------|-----------|-------------|
| **Vite 8.0** | 최신 | 4개 | career, coding, english, japanese |
| **Vite 7.3** | 현재 주력 | 20개+ | 대부분의 학습/비즈니스 사이트 |
| **Vite 6.x** | 이전 | 4개 | hohai, koreait, docs, aebon |
| **Vite 5.x** | 구형 | 1개 | ahp_basic |
| **Next.js 16** | SSR | 3개 | pbirobot, pbi, books |
| **CRA (react-scripts)** | 레거시 | 2개 | ahp, ahp_app |
| **없음** | 서버/바닐라 | 2개 | database_test, jdy |

### 라우팅

| 라우터 | 버전 | 프로젝트 수 |
|--------|------|-----------|
| **react-router-dom 7.x** | 최신 | 28개+ |
| **react-router-dom 6.x** | 이전 | 5개 (ahp, ahp_app, ahp_basic, competency, koreait) |
| **Next.js 내장 라우터** | - | 3개 |
| **없음** | - | 3개 (jdy, database_test, aebon) |

---

## 2. 백엔드 & BaaS

### Supabase 사용 현황

| 상태 | 프로젝트 수 | 해당 프로젝트 |
|------|-----------|-------------|
| **Supabase 사용** | ~28개 | 대부분의 운영 사이트 |
| **미사용** | ~7개 | algorithm, data-structure, reactStudy, webstudy, db-study, jdy, database_test |
| **PostgreSQL 직접** | 1개 | database_test (pg 드라이버 직접 사용) |

### 결제 시스템

| 결제 SDK | 프로젝트 | 비고 |
|----------|---------|------|
| **PortOne V1** (구 아임포트) | competency, templete-ref, allthat, papers | KG이니시스 |
| **@portone/browser-sdk** | edu-hub | 최신 SDK |
| **미사용** | 나머지 34개 | |

### 백엔드 서비스

| 서비스 | 프로젝트 | URL |
|--------|---------|-----|
| **Django REST** | ahp_basic (+ ahp, ahp_app) | ahp-django-backend.onrender.com |
| **Node.js + Express** | database_test | 로컬 서버 |
| **Supabase 전용** | 나머지 모든 프로젝트 | Supabase 클라우드 |

---

## 3. UI & 스타일링

| 기술 | 프로젝트 | 비고 |
|------|---------|------|
| **Tailwind CSS 4** | pbirobot, pbi, books | Next.js 프로젝트 |
| **Tailwind CSS 3** | ahp, ahp_app, koreait | 이전 버전 |
| **CSS (자체)** | 나머지 대부분 | Vanilla CSS / CSS Modules |
| **Framer Motion** | pbirobot, pbi, hohai | 애니메이션 |
| **Recharts** | ahp, ahp_app, koreait, ahp_basic | 차트/그래프 |
| **Chart.js** | competency | 차트 |

---

## 4. 특수 기능별 라이브러리

### 코드 에디터 & 실행

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **PrismJS** | 코드 구문 강조 | koreatech, python-study, java-study, coding, c-study |
| **react-simple-code-editor** | 인라인 코드 에디터 | koreatech, python-study, java-study, coding, c-study |
| **JSCPP** | 브라우저 C/C++ 실행 | c-study |
| **Shiki + rehype-pretty-code** | 코드 하이라이팅 (MDX) | books |
| **Sandpack** | 코드 샌드박스 (인터랙티브) | books |

### 문서 & 내보내기

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **html2canvas** | HTML → 이미지 변환 | competency, linux-study, coding |
| **jsPDF** | PDF 생성 | linux-study, coding |
| **ExcelJS** | Excel 내보내기 | ahp, ahp_app |
| **xlsx** | Excel 읽기/쓰기 | ahp_basic |
| **file-saver** | 파일 다운로드 | ahp_basic |
| **epubjs** | EPUB 전자책 리더 | books |
| **pdfjs-dist** | PDF 뷰어 | books |

### 이미지 처리

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **sharp** | 서버 사이드 이미지 최적화 | self-branding, uxdesign, python-study, java-study, ai-prompt, software, ai-data, japanese, c-study |
| **canvas / @napi-rs/canvas** | 이미지 생성/조작 | marketing, uxdesign, webstudy |
| **qrcode.react** | QR코드 생성 | ahp, ahp_app, ahp_basic |

### 국제화 & SEO

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **next-intl** | 다국어 지원 | pbirobot, pbi, books |
| **react-helmet-async** | SEO 메타 태그 | hohai |
| **FlexSearch** | 전문 검색 | books |

### 상태 관리

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **Zustand** | 경량 상태 관리 | pbirobot, pbi |
| **React Context** | 내장 상태 관리 | 나머지 대부분 |

### 폼 & 유효성 검증

| 라이브러리 | 용도 | 프로젝트 |
|-----------|------|---------|
| **react-hook-form** | 폼 관리 | pbirobot, pbi |
| **Zod** | 스키마 검증 | pbirobot, pbi |
| **DOMPurify** | XSS 방지 | competency |

---

## 5. 개발 도구 & 테스트

### 테스트 프레임워크

| 도구 | 프로젝트 | 비고 |
|------|---------|------|
| **Vitest** | ahp_basic, competency | 유닛 테스트 |
| **@testing-library/react** | ahp_basic, competency, ahp_app | 컴포넌트 테스트 |
| **미설정** | 나머지 36개 | 테스트 없음 |

### 코드 품질

| 도구 | 프로젝트 | 비고 |
|------|---------|------|
| **ESLint** | career, english, japanese, coding, ahp_app, reactStudy, webstudy, pbirobot, pbi | 9개 |
| **TypeScript** (전체 적용) | ahp, ahp_app, pbirobot, pbi, books, competency, hohai | 7개 |
| **TypeScript** (부분/@types만) | reactStudy, webstudy, career | 3개 |
| **미설정** | 나머지 ~29개 | JavaScript 전용 |

### 배포 설정

| 방법 | 프로젝트 수 | 해당 프로젝트 |
|------|-----------|-------------|
| **gh-pages (npm deploy)** | 16개 | self-branding, reactStudy, uxdesign, webstudy, algorithm, data-structure, python-study, java-study, ai-prompt, software, ai-data, c-study, ahp_app, hohai 등 |
| **GitHub Actions CI/CD** | 1개 | competency |
| **배포 스크립트 없음** | 약 22개 | 수동 배포 또는 미설정 |

---

## 6. 의존성 버전 매트릭스

| 프로젝트 | React | Vite | Router | Supabase | 결제 | 에디터 | 테스트 | ESLint | TS |
|---------|-------|------|--------|----------|------|--------|--------|--------|-----|
| ahp_basic | 18 | 5 | 6 | O | - | - | Vitest | - | - |
| competency | 19 | 7 | 6 | O | PortOne | - | Vitest | - | TS |
| pbirobot | 19 | - | Next | O | - | - | - | O | TS |
| books | 19 | - | Next | O | - | Sandpack | - | O | TS |
| coding | 19 | 8 | 7 | O | - | Prism | - | O | - |
| c-study | 19 | 7 | 7 | O | - | Prism+JSCPP | - | - | - |
| career | 19 | 8 | 7 | O | - | - | - | O | @types |
| english | 19 | 8 | 7 | O | - | - | - | O | @types |
| japanese | 19 | 8 | 7 | O | - | - | - | O | - |
| allthat | 19 | 7 | 7 | O | PortOne | - | - | - | - |
| papers | 19 | 7 | 7 | O | PortOne | - | - | - | - |
| edu-hub | 19 | 7 | 7 | O | PortOne | - | - | - | - |
