# 품질 평가 보고서

> 작성일: 2026-03-27 (3차 업데이트)
> 이전 평가: 2026-03-25 (초안), 2026-03-26 (재평가)
> 평가 대상: D:\dreamit-web 내 37개 활성 프로젝트

---

## 1. 종합 평가 점수

### 평가 기준 (5점 만점)

| 평가 항목 | 이전(3/25) | 현재(3/27) | 상세 |
|-----------|:----------:|:----------:|------|
| **프로젝트 구조** | 4.0 | **4.0** | 일관된 React+Vite 구조, Context/Hook 패턴 체계적 |
| **기술 스택 현대성** | 4.5 | **4.5** | React 19, Vite 7~8, Next.js 16, Tailwind 4 |
| **코드 품질 도구** | 2.0 | **2.5** ▲ | ESLint 12개/37개 (+3), TypeScript 4개/37개 |
| **테스트 커버리지** | 1.0 | **1.5** ▲ | 3개 테스트 보유 (ahp_basic 8파일, competency 4파일, edu-hub 5파일) |
| **배포 자동화** | 3.0 | **3.5** ▲ | 34개+ gh-pages 설정, predeploy 스크립트 보완 |
| **보안** | 3.0 | **3.5** ▲ | npm audit 전체 실행, CartContext NaN 방어, .env gitignore 확인 |
| **문서화** | 2.5 | **3.0** ▲ | description/homepage 32개 보완, Dev_md 문서 체계 구축 |
| **접근성/SEO** | 2.0 | **2.5** ▲ | SEOHead 컴포넌트 전체 적용, 히어로 모바일 반응형 20개 추가 |
| **종합 점수** | **2.75** | **3.13** ▲ | Phase 1~2 개선 반영, 모바일 UX 대폭 개선 |

**종합 점수 변동: +0.38점 (2.75 → 3.13)**

---

## 2. 강점 (Strengths)

### S1. 최신 기술 스택 적극 도입
- React 19 (36/37개), Vite 7~8, Next.js 16, Tailwind CSS 4
- Supabase BaaS로 서버리스 아키텍처 구현 (31개+)
- 6개 프로젝트에서 Vite 8.0 (최신) 적용
- Monaco Editor, Pyodide Worker, Wandbox API 등 고급 기능

### S2. 일관된 아키텍처 패턴
- React SPA + Supabase + GitHub Pages 배포 패턴 통일
- Context API 패턴: Auth, Theme, Language, Toast (최대 5개)
- 커스텀 훅: useAOS, useCodeCopy, useTableScroller 공유
- LazyLoading + Suspense + ErrorBoundary 패턴

### S3. 풍부한 기능 구현
- PortOne 결제 연동 (5개 사이트)
- 브라우저 내 코드 실행 (JSCPP, Pyodide, Piston, Wandbox, Monaco)
- AI 통합 (Korean AI챗봇, Teaching 멀티AI, AHP AI분석, EIP 코드실행)
- PDF/Excel 생성, QR코드, 수료증, 뱃지/업적 시스템

### S4. 다양한 도메인 커버리지
- 교육 플랫폼 (15+개), 비즈니스 (7개), 언어학습 (3개), 자격증 (2개)
- 총 1,160+ 페이지, 430,000+ LOC
- 부모-자식 도메인 구조 (*.dreamitbiz.com)

### S5. 2026-03-27 개선사항 ★
- 장바구니/결제 버그 3건 수정 (TDZ, NaN, max 제한)
- 히어로 영역 모바일 반응형 20개 프로젝트 일괄 적용
- .gitignore 보안 정리, CNAME 관리 개선

---

## 3. 약점 (Weaknesses)

### W1. 테스트 부재 (심각도: 높음)
- **현황**: 37개 중 3개만 테스트 보유 (ahp_basic 8파일, competency 4파일, edu-hub 5파일)
- **영향**: 결제 기능 5개 사이트 중 1개만 테스트 있음
- **권장**: 결제/인증 로직 유닛 테스트 우선 작성

### W2. TypeScript 미적용 (심각도: 중간)
- **현황**: 37개 중 4개만 TypeScript (pbirobot, books, hohai, competency 부분)
- **준비 상태**: english, japanese, reactStudy, webstudy에 @types/react 이미 설치
- **권장**: 결제 프로젝트부터 점진적 전환

### W3. ESLint 낮은 적용률 (심각도: 중간)
- **현황**: 37개 중 12개 ESLint 설정 (3/25 대비 +3개)
- **권장**: ESLint 9 flat config 일괄 적용

### W4. 코드 중복 (심각도: 중간)
- LMS 4개 (digitalbiz/marketing/uxdesign/self-branding): 80%+ 코드 동일
- 어학 2개 (english/japanese): 90%+ 구조 동일
- 프로그래밍 4개 (c-study/python-study/java-study/coding): 유사 구조
- **권장**: 공통 모듈 패키지 추출

### W5. 버전 파편화 (심각도: 낮음)
- koreait: React 18, react-router-dom 6, Tailwind 3 (유일한 구버전)
- ahp_basic: Vite 5, React 18
- aebon: React 18, Vite 6
- **권장**: React 19 + Vite 7+ 통일

---

## 4. 위험 요소 (Risks)

### R1. Supabase 단일 장애점 (SPOF)
- 31개+ 사이트가 Supabase에 의존
- **완화**: Supabase 상태 모니터링, 캐싱 전략

### R2. 결제 보안
- 5개 사이트 PortOne 결제 사용 (competency, edu-hub, career, allthat, papers)
- **2026-03-27 개선**: CartContext NaN 방어 추가, Cart.jsx max 수량 제한
- **잔여 위험**: 서버 사이드 결제 검증 미확인

### R3. 의존성 취약점
- **2026-03-25 완화**: npm audit 전체 실행 완료
- **잔여**: CRA 프로젝트 (ahp, ahp_app) 보안 이슈

### R4. Vite 버전 파편화
- 5.x (1개), 6.x (5개), 7.3 (24개), 8.0 (6개)
- **완화**: 주기적 버전 통일 업데이트

---

## 5. 프로젝트별 등급 분류 (37개)

### S등급 (4.5~5.0/5) — 4개

| 프로젝트 | 점수 | 핵심 특징 | 변동 |
|---------|:----:|----------|:----:|
| pbirobot | 5/5 | Next.js 16, TS, TW4, Zustand, Zod, i18n | - |
| books | 5/5 | Next.js 16, TS, TW4, EPUB/PDF, MDX, FlexSearch | - |
| career | 5/5 | ESLint, CSS 디자인 토큰, 멘토링, 결제, 역할 기반 접근 | - |
| ai-data | 5/5 | Pyodide Worker, 퀴즈/배지, 서비스 아키텍처, 14,700 LOC | - |

### A등급 (4.0~4.5/5) — 7개

| 프로젝트 | 점수 | 핵심 특징 | 변동 |
|---------|:----:|----------|:----:|
| eip | 4.5 | TW4, Monaco, CBT시험, 코딩실습, v2.0.1 대폭 업데이트 | ▲ 13커밋 |
| hohai | 4.5 | TS, Framer Motion, 음악/시 플랫폼, CSS Modules, 13 hooks | - |
| competency | 4.5 | TS(부분), Vitest, CI/CD, DOMPurify, PortOne 결제 | ▲ 4→4.5 |
| linux-study | 4.5 | PDF 인증서, Supabase 진행도 병합, 중첩 라우트, ESLint | - |
| koreatech | 4.5 | Pyodide, CT 교육, AI 도구 가이드, 관리자 시스템 | - |
| docs | 4.5 | Admin/Public 분리, 서비스 레이어, PDF 뷰어, 최소 의존성 | - |
| koreait | 4.5 | Recharts 대시보드, TW3, 서비스 레이어, UI 라이브러리 패턴 | - |

### B등급 (3.5~4.0/5) — 19개

| 프로젝트 | 점수 | 핵심 특징 | 변동 |
|---------|:----:|----------|:----:|
| ahp_basic | 4 | AHP 엔진, 8개 테스트, CSS Modules, AI 분석, QR | - |
| edu-hub | 4 | 5개 테스트, 결제, 장바구니, 학습허브 32개 연동 | ▲ 카트 버그수정 |
| korean | 4 | Web Speech TTS, AI 챗봇, 2,300+ 단어, ESLint | - |
| teaching | 4 | 멀티AI(4종), 5형식 내보내기, 교육학 이론 | - |
| c-study | 4 | JSCPP 브라우저 C 실행, 배지/퀴즈, 커뮤니티 | - |
| python-study | 4 | Pyodide+Turtle, 배지/퀴즈, 커뮤니티 | - |
| data-structure | 4 | 체계적 URL 설계, 최소 의존성, LazyLoad | - |
| db-study | 4 | SQL 12챕터, Oracle 튜닝, 18,400 LOC | - |
| software | 4 | 디자인패턴, SOLID, 서비스 계층, 커뮤니티 | ▲ gitignore+CNAME |
| ai-prompt | 4 | 프롬프트 기법, 워크북 8주제, 13,000 LOC | - |
| digitalbiz | 4 | 14주 디지털 전환, 검색 모달, 4채널 커뮤니티 | - |
| marketing | 4 | 15주 마케팅, 디지털 하위 8섹션, 22,200 LOC | - |
| uxdesign | 4 | 13주 UX/CXD, 19,200 LOC | - |
| self-branding | 4 | 15주 브랜딩, 마케팅 도구 8종, ErrorBoundary | - |
| allthat | 4 | ESG 자가진단, 레이더차트, lazyWithRetry, 결제 | - |
| papers | 4 | 학술 연구, 장바구니/결제, 분야별 데이터 4,100줄 | ▲ 카트 버그수정 |
| reserve | 4 | 캘린더뷰, 예약시스템, 서비스 레이어 4개 | - |
| aebon | 4 | 포트폴리오 SPA, ParticleBackground, 14섹션 | - |
| templete-ref | 3.5 | 템플릿 원본, 5 Context, PortOne | ▲ 카트 버그수정 |

### C등급 (3.0~3.5/5) — 7개

| 프로젝트 | 점수 | 핵심 특징 | 변동 |
|---------|:----:|----------|:----:|
| coding | 3.5 | Pyodide/Wandbox, 수료증, Vite 8 | - |
| java-study | 3.5 | 74라우트 (최다), 5개 학습 트랙, 배지 시스템 | - |
| english | 3.5 | TOEIC, AI챗봇, 음성인식, ESLint | - |
| japanese | 3.5 | JLPT, useFurigana 훅, ESLint | - |
| reactStudy | 3 | 정적 학습 사이트, ESLint, 최소 구조 | - |
| webstudy | 3 | 정적 학습 사이트, ESLint, @napi-rs/canvas | - |
| algorithm | 3 | 정적, 4단계 실습, HashRouter | - |
| jdy | 3 | Vanilla HTML/CSS/JS, i18n, 5색 테마, OG 이미지 | - |

---

## 6. 2026-03-27 변동 요약

| 변경 유형 | 영향 프로젝트 | 상세 |
|----------|:----------:|------|
| 장바구니 TDZ 수정 | 3개 | edu-hub, papers, templete-ref supabase.js |
| CartContext NaN 방어 | 3개 | edu-hub, papers, templete-ref CartContext.jsx |
| Cart.jsx max 수량 | 3개 | edu-hub, papers, templete-ref Cart.jsx |
| 히어로 반응형 CSS | **20개** | 1024/768/480px 브레이크포인트 추가 |
| .gitignore 정리 | 2개 | software (.claude/, NUL), python-study (.claude/) |
| CNAME 추가 | 1개 | software public/CNAME |
| eip 대폭 업데이트 | 1개 | v1.3.0→v2.0.1 (13커밋, UI 리디자인) |
| competency 승급 | 1개 | 4/5→4.5/5 (유일한 full CI/CD 파이프라인 재평가) |

### 등급 변동

| 프로젝트 | 이전(3/26) | 현재(3/27) | 사유 |
|---------|:----------:|:----------:|------|
| competency | B (4/5) | **A (4.5/5)** | CI/CD(lint+type-check+test+build+deploy), TS 부분 전환, DOMPurify 보안 재평가 |
| eip | A (4.5/5) | A (4.5/5) | 점수 유지 — v2.0.1 대폭 업데이트(13커밋) 반영 |
| edu-hub | B (4/5) | B (4/5) | 장바구니/결제 버그 3건 수정으로 안정성 향상 |
| papers | B (4/5) | B (4/5) | 장바구니/결제 버그 3건 수정으로 안정성 향상 |

---

## 7. 즉시 조치 필요 항목 (Priority Action Items)

| 우선순위 | 항목 | 영향 범위 | 상태 |
|---------|------|-----------|------|
| ~~P0~~ | ~~npm audit 전체 실행~~ | ~~37개~~ | ✅ 완료 (3/25) |
| ~~P0~~ | ~~결제 CartContext 버그 수정~~ | ~~3개~~ | ✅ 완료 (3/27) |
| ~~P1~~ | ~~히어로 모바일 반응형~~ | ~~20개~~ | ✅ 완료 (3/27) |
| ~~P1~~ | ~~배포 스크립트 추가~~ | ~~15개~~ | ✅ 완료 (3/25) |
| ~~P1~~ | ~~메타데이터 보완~~ | ~~32개~~ | ✅ 완료 (3/25) |
| **P1** | 결제 서버사이드 검증 점검 | 5개 사이트 | 미완료 |
| **P2** | TypeScript 전환 (결제 프로젝트 우선) | 5개 | 미완료 |
| **P2** | ESLint 전체 적용 | 25개 사이트 | 미완료 |
| **P2** | koreait 버전 업그레이드 | 1개 | 미완료 |
| **P3** | 핵심 서비스 테스트 코드 작성 | 10개 | 미완료 |
| **P3** | LMS 4개 공통 모듈 추출 | 4개 | 미완료 |
| **P3** | java-study 동적 라우팅 전환 | 1개 | 미완료 |

---

## 8. 전체 통계

| 항목 | 수치 |
|------|------|
| **총 활성 프로젝트** | 37개 |
| **총 페이지** | ~1,160+ |
| **총 코드 라인** | ~430,000+ LOC |
| **S등급** | 4개 (pbirobot, books, career, ai-data) |
| **A등급** | 7개 (eip, hohai, competency, linux-study, koreatech, docs, koreait) |
| **B등급** | 19개 |
| **C등급** | 7개 (+ jdy) |
| **TypeScript** | 4개 (pbirobot, books, hohai, competency 부분) |
| **ESLint** | 12개 |
| **테스트** | 3개 (ahp_basic 8파일, competency 4파일, edu-hub 5파일) |
| **결제 연동** | 5개 (competency, edu-hub, career, allthat, papers) |
| **AI 통합** | 4개 (korean, teaching, ahp_basic, eip) |
| **Supabase** | 31개+ |
| **gh-pages 배포** | 34개+ |
| **평균 코드 품질** | **3.95/5** |
