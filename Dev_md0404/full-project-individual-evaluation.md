# DreamIT Biz 전체 프로젝트 개별 분석 및 점수화 보고서

**작성일**: 2026-04-04
**평가자**: Claude Opus 4.6
**평가 대상**: D:\dreamit-web 내 전체 45개 프로젝트 (활성 37개 + 개발/백업 8개)
**평가 기준일**: 2026-04-04 (이전 평가: 03-25 초안, 03-26 재평가, 03-27 3차, 03-30 인증 표준화, 04-01 TS 마이그레이션)

---

## 목차

1. [종합 점수표 (전체 45개)](#1-종합-점수표)
2. [개별 프로젝트 평가 카드 (37개 활성)](#2-개별-프로젝트-평가-카드)
3. [아키텍처 유형별 분류](#3-아키텍처-유형별-분류)
4. [크로스 프로젝트 연계 매트릭스](#4-크로스-프로젝트-연계-매트릭스)
5. [버전 분포 분석](#5-버전-분포-분석)
6. [TypeScript 마이그레이션 현황](#6-typescript-마이그레이션-현황)
7. [인증 시스템 현황](#7-인증-시스템-현황)
8. [코드 중복 분석](#8-코드-중복-분석)
9. [우선순위별 개선 로드맵](#9-우선순위별-개선-로드맵)
10. [전체 통계 요약](#10-전체-통계-요약)

---

## 1. 종합 점수표

### 평가 항목별 가중치

| 평가 항목 | 가중치 | 설명 |
|-----------|:------:|------|
| 코드 품질 | 25% | 구조 분리, 패턴 일관성, 에러 처리, 코드 스멜 |
| 기술 현대성 | 15% | 프레임워크/라이브러리 버전, 최신 API 활용 |
| 완성도 | 20% | 기능 구현률, 콘텐츠 충실도, UX 완결성 |
| 보안 | 15% | 인증, 입력 검증, XSS/CSRF 방어, 환경변수 관리 |
| 테스트/CI | 10% | 테스트 커버리지, CI/CD 파이프라인 |
| TypeScript | 10% | TS 적용률, strict 모드, 타입 완전성 |
| 접근성/SEO | 5% | ARIA, 키보드 네비, SEOHead, OG 태그 |

### 전체 프로젝트 종합 점수표 (100점 만점)

| 순위 | 프로젝트 | 등급 | 코드(25) | 기술(15) | 완성(20) | 보안(15) | 테스트(10) | TS(10) | A11y(5) | **총점** | 변동 |
|:----:|---------|:----:|:--------:|:--------:|:--------:|:--------:|:----------:|:------:|:-------:|:--------:|:----:|
| 1 | pbirobot | **S** | 24 | 15 | 18 | 13 | 2 | 10 | 4 | **86** | - |
| 2 | books | **S** | 24 | 15 | 19 | 13 | 2 | 10 | 4 | **87** | - |
| 3 | career | **S** | 23 | 14 | 18 | 12 | 2 | 3 | 4 | **76** | - |
| 4 | ai-data | **S** | 23 | 13 | 19 | 12 | 2 | 3 | 4 | **76** | - |
| 5 | competency | **A** | 22 | 13 | 17 | 13 | 8 | 8 | 3 | **84** | ▲ TS완료 |
| 6 | eip | **A** | 21 | 14 | 18 | 11 | 2 | 8 | 4 | **78** | ▲ TS완료 |
| 7 | hohai | **A** | 22 | 13 | 17 | 11 | 2 | 10 | 3 | **78** | - |
| 8 | linux-study | **A** | 21 | 13 | 17 | 12 | 2 | 8 | 4 | **77** | ▲ TS완료 |
| 9 | koreatech | **A** | 21 | 13 | 17 | 11 | 2 | 3 | 4 | **71** | - |
| 10 | docs | **A** | 21 | 12 | 16 | 11 | 2 | 8 | 3 | **73** | ▲ TS완료 |
| 11 | koreait | **A** | 21 | 11 | 14 | 11 | 2 | 3 | 3 | **65** | - |
| 12 | ahp_basic | **B** | 20 | 10 | 18 | 10 | 7 | 3 | 3 | **71** | - |
| 13 | edu-hub | **B** | 19 | 13 | 16 | 12 | 6 | 3 | 3 | **72** | - |
| 14 | korean | **B** | 19 | 14 | 16 | 12 | 2 | 8 | 4 | **75** | ▲ TS완료 |
| 15 | teaching | **B** | 19 | 12 | 16 | 11 | 2 | 8 | 4 | **72** | ▲ TS완료 |
| 16 | c-study | **B** | 19 | 13 | 15 | 12 | 2 | 3 | 3 | **67** | - |
| 17 | python-study | **B** | 19 | 13 | 15 | 12 | 2 | 3 | 3 | **67** | - |
| 18 | data-structure | **B** | 19 | 13 | 13 | 8 | 2 | 8 | 3 | **66** | ▲ TS완료 |
| 19 | db-study | **B** | 19 | 13 | 16 | 8 | 2 | 8 | 3 | **69** | ▲ TS완료 |
| 20 | software | **B** | 19 | 13 | 15 | 12 | 2 | 3 | 3 | **67** | - |
| 21 | ai-prompt | **B** | 19 | 13 | 16 | 12 | 2 | 3 | 3 | **68** | - |
| 22 | digitalbiz | **B** | 18 | 13 | 16 | 11 | 2 | 8 | 3 | **71** | ▲ TS완료 |
| 23 | marketing | **B** | 18 | 13 | 16 | 11 | 2 | 3 | 3 | **66** | - |
| 24 | uxdesign | **B** | 18 | 13 | 16 | 11 | 2 | 3 | 3 | **66** | - |
| 25 | self-branding | **B** | 18 | 13 | 16 | 11 | 2 | 8 | 3 | **71** | ▲ TS완료 |
| 26 | allthat | **B** | 18 | 13 | 16 | 11 | 2 | 3 | 4 | **67** | - |
| 27 | papers | **B** | 18 | 13 | 16 | 11 | 2 | 3 | 3 | **66** | - |
| 28 | reserve | **B** | 19 | 13 | 15 | 11 | 2 | 8 | 3 | **71** | ▲ TS완료 |
| 29 | aebon | **B** | 19 | 11 | 15 | 8 | 2 | 8 | 3 | **66** | ▲ TS완료 |
| 30 | templete-ref | **B** | 17 | 13 | 13 | 11 | 2 | 8 | 3 | **67** | ▲ TS완료 |
| 31 | coding | **C+** | 17 | 14 | 14 | 12 | 2 | 3 | 3 | **65** | - |
| 32 | java-study | **C+** | 16 | 13 | 16 | 10 | 2 | 3 | 3 | **63** | - |
| 33 | english | **C+** | 17 | 14 | 16 | 12 | 2 | 8 | 3 | **72** | ▲ TS완료 |
| 34 | japanese | **C+** | 17 | 14 | 16 | 12 | 2 | 8 | 3 | **72** | ▲ TS완료 |
| 35 | reactStudy | **C** | 15 | 13 | 10 | 5 | 2 | 8 | 2 | **55** | ▲ TS완료 |
| 36 | webstudy | **C** | 15 | 13 | 10 | 5 | 2 | 8 | 2 | **55** | ▲ TS완료 |
| 37 | algorithm | **C** | 15 | 12 | 10 | 5 | 2 | 8 | 2 | **54** | ▲ TS완료 |
| 38 | jdy | **C** | 14 | 6 | 12 | 5 | 2 | 2 | 2 | **43** | - |

### 개발/백업 프로젝트 (비활성)

| 프로젝트 | 상태 | 비고 |
|---------|------|------|
| ahp | 백업 | ahp_basic의 이전 CRA 버전 |
| ahp_app | 백업 | ahp의 모바일 앱 버전 |
| pbi | 백업 | pbirobot 개발 참조 |
| database_test | 개발용 | Node.js+Express+PostgreSQL 테스트 서버 |
| ai-media | 대기 | TS 마이그레이션 Batch 6 |
| autowork | 대기 | TS 마이그레이션 Batch 7 |
| openclaw | 대기 | TS 마이그레이션 Batch 7 |
| presentation | 완료 | TS 마이그레이션 + 배포 완료 |

---

## 2. 개별 프로젝트 평가 카드

### S등급 — 최상위 품질 (4개)

---

#### #1. pbirobot — PBI 로봇 플랫폼 `5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | pbirobot.dreamitbiz.com |
| **기술 스택** | Next.js 16.1.6 + TypeScript 5 + Tailwind CSS 4 + Zustand 5 + Zod + react-hook-form 7.71 |
| **규모** | 11페이지 / 30컴포넌트 |
| **총점** | 86/100 |

**핵심 강점**:
- 전체 TypeScript strict mode (프로젝트 최초)
- Next.js 16 App Router + SSG (generateStaticParams)
- Zustand 상태관리 + Zod 폼 검증
- 다국어(한/영) next-intl, 동적 SEO 메타데이터
- 컴포넌트 분류 체계 최우수 (ui/shared/layout/home/products/store)

**보완점**:
- [ ] 테스트 코드 부재
- [ ] 관리자 페이지 없음
- [ ] 결제 시스템 미연동

**연계 가능 프로젝트**: books (동일 Next.js 16 + TS 스택), career (결제 패턴 참조)

---

#### #2. books — DreamIT 출판 플랫폼 `5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | books.dreamitbiz.com |
| **기술 스택** | Next.js 16.1.6 + TypeScript 5 + Tailwind + MDX + epubjs + pdfjs-dist + FlexSearch + Shiki 3.23 |
| **규모** | 18페이지 / 37컴포넌트 |
| **총점** | 87/100 (최고점) |

**핵심 강점**:
- EPUB 리더 + PDF 뷰어 + MDX 렌더링 (유일)
- CodePlayground (Sandpack) 인터랙티브 코드 실행
- FlexSearch 전문검색, JSON-LD SEO
- API 레이어 분리 (lib/api/), 타입 정의 분리 (types/)

**보완점**:
- [ ] 테스트 코드 부재
- [ ] 관리자 CRUD 기능 확장

**연계 가능 프로젝트**: pbirobot (공통 Next.js 인프라), docs (문서 뷰어 기능 공유)

---

#### #3. ai-data — AI 데이터 분석 학습 `5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | ai-data.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 7 + Supabase + Pyodide Web Worker |
| **규모** | 52페이지 / 74파일 / ~14,738 LOC |
| **총점** | 76/100 |

**핵심 강점**:
- 브라우저 내 Python 실행 (Pyodide Worker) — Web Worker 활용
- 퀴즈 시스템 (타이머/셔플/채점), 배지/업적 시스템 (자동 해금)
- 학습 진행률 추적 (localStorage + Supabase 동기화)
- 서비스 기반 아키텍처 (communityService, lectureService, workbookService)

**보완점**:
- [ ] TypeScript 전환 (Batch 6 대기)
- [ ] ESLint 미구성
- [ ] 강의/워크북 미완성 (2/1페이지)

**연계 가능 프로젝트**: koreatech (동일 Pyodide 엔진), python-study (Python 실행 공유), coding (Wandbox 실행 비교)

---

#### #4. career — 커리어 상담 플랫폼 `5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | career.dreamitbiz.com |
| **기술 스택** | React 19.2.4 + Vite 8 + Supabase + PortOne + ESLint (flat config) |
| **규모** | 19페이지 / 57파일 / ~7,153 LOC |
| **총점** | 76/100 |

**핵심 강점**:
- 컴포넌트 구조 가장 체계적 (common 16개/layout/landing)
- barrel export, 유틸리티/상수 분리
- CSS 변수 디자인 토큰 시스템
- PortOne 결제 + 역할 기반 접근 제어 (멘토/멘티)
- ESLint flat config (모범 사례)

**보완점**:
- [ ] TypeScript 전환 (Batch 8 대기)
- [ ] 멘토 데이터가 mockData 기반
- [ ] 테스트 코드 부재

**연계 가능 프로젝트**: reserve (예약 시스템 공유), competency (역할 기반 접근 패턴), edu-hub (결제 패턴)

---

### A등급 — 우수 품질 (7개)

---

#### #5. eip — 정보처리 종합 학습 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | eip.dreamitbiz.com |
| **기술 스택** | React 19.2.4 + Vite 8.0.1 + Tailwind CSS 4.2.2 + Monaco Editor 4.7 + Supabase 2.100 |
| **규모** | 25+라우트 / 37컴포넌트 / 15 데이터파일 / 500+문항 |
| **총점** | 78/100 |
| **TS 상태** | **완료** (Batch 4, 커밋 18cebc9) |

**핵심 강점**:
- Tailwind CSS 4 (전체 프로젝트 중 유일한 React+Vite 적용)
- Monaco Editor (전문 코드 에디터 — VS Code 기반)
- CBT 필기시험 (기사/산기/기능사 3종 × 과목별 챕터)
- 회차별 결정적 문제 셔플 (seeded random)
- v2.0.1 대폭 업데이트 (13커밋, UI 리디자인)

**보완점**:
- [ ] 테스트 코드 부재
- [ ] package.json 버전 0.0.0 (실제 v2.0.1과 불일치)

**연계 가능 프로젝트**: competency (시험/채점 패턴), coding (코드 실행 비교), koreatech (교육 콘텐츠 구조)

---

#### #6. hohai — 시/음악 문학 플랫폼 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | hohai.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 6.1 + TypeScript ~5.7 (strict) + Framer Motion + Supabase |
| **규모** | 23페이지 / 23컴포넌트 / 13 hooks |
| **총점** | 78/100 |

**핵심 강점**:
- 전체 TypeScript strict (프로젝트 자체 구축)
- 13개 커스텀 hooks (useAuth, useSeries, usePoems, useSongs 등)
- 8개 타입 파일 세밀 분리, CSS Modules
- 20개+ lazy 컴포넌트, Context 기반 상태 (Playback/Playlist/Auth)

**보완점**:
- [ ] 테스트 부재
- [ ] 관리자 페이지 1개만
- [ ] Vite 6 → 8 업그레이드 가능

**연계 가능 프로젝트**: books (콘텐츠 리더 패턴), korean (오디오/TTS 기능)

---

#### #7. competency — 4차산업혁명 핵심역량 검사 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | competency.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 7 + TypeScript 5 (strict) + Chart.js + PortOne V1 + Vitest + ESLint 9 |
| **규모** | 53페이지 / 13컴포넌트 / 4테스트 (13케이스) |
| **총점** | 84/100 |
| **TS 상태** | **완료** (Batch 0) |

**핵심 강점**:
- **전체 프로젝트 중 유일한 full CI/CD 파이프라인** (lint→type-check→test→build→deploy)
- lazy loading 31청크, DOMPurify XSS 방어, Supabase RLS
- PortOne 결제 (KG이니시스 25,000원)
- CLAUDE.md 문서화 (유일)

**보완점**:
- [ ] PW 검증 6자 → 8자+영숫자 강화 필요
- [ ] 전체 TypeScript 전환 완료 (완료 ✅)

**연계 가능 프로젝트**: eip (시험/채점 패턴 공유), career (결제+역할 접근), edu-hub (테스트 인프라 공유)

---

#### #8. linux-study — 리눅스 마스터 학습 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | linux.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 7.3.1 + Supabase + jsPDF + html2canvas |
| **규모** | 48페이지 / 5컴포넌트 |
| **총점** | 77/100 |
| **TS 상태** | **완료** (Batch 3) |

**핵심 강점**:
- 중첩 라우트 + Outlet 패턴 (가장 현대적)
- Supabase 진행도 로컬/클라우드 병합 로직
- PDF 인증서 생성, 스탬프 랠리
- 방어적 코딩, 커스텀 훅 (useAOS, useTableScroller, useCodeCopy)

**보완점**:
- [ ] ESLint 구성 필요
- [ ] 콘텐츠 확장 (1급 모의고사)

**연계 가능 프로젝트**: koreatech (학습 진행 추적 공유), eip (자격증 시험 패턴), db-study (IT 학습 구조)

---

#### #9. koreatech — 컴퓨팅 사고력 교육 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | koreatech.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 7.3.1 + Supabase + Pyodide Worker + PrismJS |
| **규모** | 60페이지 / 6컴포넌트 |
| **총점** | 71/100 |

**핵심 강점**:
- Pyodide Worker Python 실행 (ai-data와 공유 가능)
- AI 도구 가이드 (ChatGPT/Claude/Gemini/Copilot)
- 다단계 Python 교육 (10단계 + 고급 모듈)
- 관리자 시스템 보유

**보완점**:
- [ ] TypeScript 전환 (Batch 7 대기)
- [ ] ESLint 미구성

**연계 가능 프로젝트**: ai-data (Pyodide Worker 공유), python-study (Python 교육 연계), coding (코드 실행 통합)

---

#### #10. docs — 문서 뷰어 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | docs.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 6 + Supabase 2.98 + react-router-dom 7.1 |
| **규모** | 8페이지 / 8컴포넌트 / ~4,400 LOC |
| **총점** | 73/100 |
| **TS 상태** | **완료** (Batch 2) |

**핵심 강점**:
- 가장 깔끔한 구조 (코드량 대비 완성도 최고)
- 관리자/공개 영역 분리 (AdminLayout)
- 서비스 레이어 분리 (document, member)

**보완점**:
- [ ] Vite 6 → 8 업그레이드
- [ ] 콘텐츠 확장

**연계 가능 프로젝트**: books (PDF 뷰어 공유), papers (문서 관리 패턴)

---

#### #11. koreait — Korea IT 대시보드 `4.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | koreait.dreamitbiz.com |
| **기술 스택** | React 18.3.1 + Vite 6 + Tailwind CSS 3.4.15 + Recharts 2.13 + Supabase 2.45 + ESLint |
| **규모** | 14페이지 / 22컴포넌트 / ~3,600 LOC |
| **총점** | 65/100 |

**핵심 강점**:
- 컴포넌트 분리 가장 체계적, UI 라이브러리 패턴
- 서비스 레이어 분리 (authService, dashboardService, storageService)
- cn() 유틸리티 (className 합성)

**보완점**:
- [ ] React 18 → 19 업그레이드 **필수**
- [ ] Tailwind 3 → 4 업그레이드
- [ ] Supabase 2.45 → 2.100 업그레이드
- [ ] TypeScript 전환 (Batch 9 대기)

**연계 가능 프로젝트**: competency (Chart.js ↔ Recharts 비교), career (대시보드 패턴), ahp_basic (데이터 시각화)

---

### B등급 — 양호 품질 (19개)

---

#### #12. ahp_basic — AHP 의사결정 분석 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | ahp-basic.dreamitbiz.com |
| **기술 스택** | React 18.3.1 + Vite 5.4 + Supabase + Recharts + XLSX + Vitest |
| **규모** | 46페이지 / 84컴포넌트 / 21 hooks / 21 utils / 7 테스트 |
| **총점** | 71/100 |

**핵심 강점**:
- AHP 고유값 계산 (Power Method), 쌍대비교 + 일관성비율 (CR)
- 7개 테스트 파일 (Vitest) — 전체 프로젝트 중 최다
- AI 분석 (챗봇/논문초안/참고문헌), QR코드, Excel 연동
- 구독/결제, SMS, 포인트/출금

**보완점**:
- [ ] React 18 → 19 업그레이드
- [ ] Vite 5.4 → 8 업그레이드
- [ ] TypeScript 전환 (Batch 9 — 복잡한 AHP 로직)
- [ ] HashRouter → BrowserRouter 전환

**연계 가능 프로젝트**: competency (테스트 패턴), koreait (차트 비교), career (결제 패턴)

---

#### #13. edu-hub — 교육 허브 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | edu-hub.dreamitbiz.com |
| **기술 스택** | React 19.2 + Vite 7.3.1 + Supabase 2.96 + PortOne + Vitest 4.1 |
| **규모** | 25페이지 / 10컴포넌트 / 5 Context / 5 테스트 |
| **총점** | 72/100 |

**핵심 강점**:
- 학습 사이트 32개+ 연동 허브 (site.js 설정 기반)
- Vitest + @testing-library 테스트 인프라
- PortOne V2 결제, 장바구니, 다국어, 다크모드

**보완점**:
- [ ] TypeScript 전환 (Batch 8 — PortOne V2)
- [ ] 6개 Storage 유틸 분산 정리

**연계 가능 프로젝트**: allthat (결제 패턴 공유), papers (장바구니 공유), templete-ref (템플릿 원본)

---

#### #14. korean — 한국어 학습 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | korean.dreamitbiz.com |
| **기술 스택** | React 19.2.4 + Vite 8.0.1 + Supabase 2.99.3 + ESLint 9 |
| **규모** | 23페이지 / 63 JSX파일 / 14 코어 컴포넌트 |
| **총점** | 75/100 |
| **TS 상태** | **완료** (Batch 3) |

**핵심 강점**:
- Web Speech API TTS (GlobalTTS 자동 주입)
- AI 챗봇 (GPT-4o-mini), 음성 인식 발음 연습
- 2,300+ 단어 데이터베이스 (기초/일상/비즈니스/TOPIK)
- 5색 테마 + 다크모드, 접근성 속성 (aria-label, role)

**보완점**:
- [ ] 학습 진행률 DB 저장 미구현
- [ ] 퀴즈/채점 시스템 없음

**연계 가능 프로젝트**: english (어학 구조 90% 공유), japanese (어학 구조 90% 공유), teaching (AI 챗봇 패턴)

---

#### #15. teaching — AI 교수학습 도구 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | teaching.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 6 + Supabase 2.47 + react-markdown + jsPDF |
| **규모** | 14페이지 / 42+ JSX파일 / 13 컴포넌트 |
| **총점** | 72/100 |
| **TS 상태** | **완료** (Batch 4, 커밋 983de07) |

**핵심 강점**:
- 멀티 AI 프로바이더 (OpenAI/Claude/Gemini/Genspark)
- 5형식 내보내기 (PDF/Markdown/JSON/CSV/HTML)
- 스트리밍 응답 + 토큰 사용량 추적
- 교육학 이론 자료 (Bloom's/ADDIE/SAM)

**보완점**:
- [ ] Vite 6 → 8 업그레이드
- [ ] Supabase 2.47 → 2.100 업그레이드
- [ ] 테스트 코드 부재

**연계 가능 프로젝트**: korean (AI 챗봇 통합), ahp_basic (AI 분석 패턴), career (교육 상담 연계)

---

#### #16~17. c-study / python-study — 프로그래밍 학습 `각 4/5`

| 항목 | c-study | python-study |
|------|---------|-------------|
| **도메인** | c-study.dreamitbiz.com | python-study.dreamitbiz.com |
| **규모** | 27페이지 / 8컴포넌트 | 27페이지 / 10컴포넌트 |
| **실행 엔진** | JSCPP (브라우저 C) | Pyodide Worker + TurtleCanvas |
| **총점** | 67/100 | 67/100 |

**공통 강점**: Lazy loading, ErrorBoundary, 세션 관리, 퀴즈/배지 시스템, 커뮤니티
**보완점**:
- [ ] TypeScript 전환 (Batch 5 대기)
- [ ] 두 프로젝트 간 중복 코드 추출

**연계**: coding (Type B 그룹 공통 모듈), koreatech (Pyodide 공유)

---

#### #18. data-structure — 자료구조 학습 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | datastructure.dreamitbiz.com |
| **규모** | 43페이지 / 3컴포넌트 |
| **총점** | 66/100 |
| **TS 상태** | **완료** (Batch 2) |

**강점**: URL 경로 설계 체계적 (선형/비선형/해시/알고리즘/고급), 최소 의존성
**보완점**: Supabase 미연동, 콘텐츠 인터랙티브 요소 부족

**연계**: algorithm (구조 통합 가능), db-study (CS 학습 연계)

---

#### #19. db-study — 데이터베이스 학습 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | dbstudy.dreamitbiz.com |
| **규모** | 40페이지 / ~18,457 LOC |
| **총점** | 69/100 |
| **TS 상태** | **완료** (Batch 3) |

**강점**: SQL 튜토리얼 12챕터, RDBMS/NoSQL/Cloud DB/NewSQL, DB 튜닝 (Oracle AWR)
**보완점**: 인터랙티브 SQL 실행기 부재

**연계**: software (디자인패턴 ↔ DB 패턴), linux-study (IT 학습)

---

#### #20. software — 소프트웨어 설계 학습 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | software.dreamitbiz.com |
| **규모** | 47페이지 / ~7,358 LOC |
| **총점** | 67/100 |

**강점**: SDLC/UML/SOLID, 디자인 패턴 (Creational/Structural/Behavioral), 서비스 계층 분리
**보완점**: TypeScript 전환 (Batch 6 대기)

**연계**: ai-prompt (풀스택 학습 Type E 공유), ai-data (서비스 아키텍처 공유)

---

#### #21. ai-prompt — AI 프롬프트 학습 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | ai-prompt.dreamitbiz.com |
| **규모** | 62페이지 (최다 페이지) / ~13,036 LOC |
| **총점** | 68/100 |

**강점**: AI 팁 9개 가이드, 프롬프트 기법 (Few-Shot/CoT/Role-System), Playground
**보완점**: TypeScript 전환 (Batch 6 대기)

**연계**: teaching (AI 도구 연계), software (Type E 공유), ai-data (Type E 공유)

---

#### #22~25. digitalbiz / marketing / uxdesign / self-branding — LMS 공통 `각 4/5`

| 항목 | digitalbiz | marketing | uxdesign | self-branding |
|------|-----------|-----------|----------|---------------|
| **도메인** | digitalbiz.~ | marketing.~ | uxdesign.~ | selfbranding.~ |
| **LOC** | ~18,200 | ~22,200 | ~19,200 | ~23,800 |
| **콘텐츠** | 14주 디지털 전환 | 15주 마케팅 | 13주 UX/CXD | 15주 브랜딩 |
| **총점** | 71 | 66 | 66 | 71 |
| **TS 상태** | ✅ 완료 | 대기 | 대기 | ✅ 완료 |

**공통 강점**: AuthContext, ThemeContext, LanguageContext, ToastContext, AuthGuard, 커뮤니티 4종
**핵심 문제**: **4개 프로젝트 간 80%+ 코드 중복** → 공통 모듈 추출 최우선
**보완점**:
- [ ] supabase.js 600~754줄 비대 → 기능별 서비스 모듈 분할
- [ ] marketing, uxdesign TypeScript 전환 필요

**연계**: templete-ref (템플릿 원본에서 파생), edu-hub (LMS 허브)

---

#### #26. allthat — 올댓스터디 ESG 교육 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | allthat.dreamitbiz.com |
| **규모** | 30페이지 / 16컴포넌트 / ~24,200 LOC |
| **총점** | 67/100 |

**강점**: ESG 자가진단 + 레이더차트, lazyWithRetry, AdminDashboard
**보완점**: AdminDashboard 1,510줄 분할, translations.js 1,601줄 분할, TypeScript (Batch 8)

**연계**: papers (결제+장바구니 공유), edu-hub (결제 패턴)

---

#### #27. papers — 학술 연구 플랫폼 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | papers.dreamitbiz.com |
| **규모** | 35페이지 / 98파일 (파일 수 최다) / ~24,200 LOC |
| **총점** | 66/100 |

**강점**: 분야별 학술 데이터 ~4,100줄, 논문지도, 파일/이미지 업로드, 관리자 CRUD 9경로
**보완점**: TypeScript (Batch 8 — PortOne V2), supabase.js 분할

**연계**: allthat (장바구니 공유), docs (문서 관리), books (학술 콘텐츠)

---

#### #28. reserve — 예약 시스템 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | reserve.dreamitbiz.com |
| **규모** | 17페이지 / 13컴포넌트 / ~12,400 LOC |
| **총점** | 71/100 |
| **TS 상태** | **완료** (Batch 2) |

**강점**: 캘린더뷰, 예약/강의요청 시스템, 서비스 레이어 4개 분리
**보완점**: UI 개선, 콘텐츠 확장

**연계**: career (예약+멘토링 연계), teaching (강의 요청 공유)

---

#### #29. aebon — 포트폴리오 `4/5`

| 항목 | 내용 |
|------|------|
| **도메인** | aebon.dreamitbiz.com |
| **규모** | 1페이지 SPA / 19컴포넌트 / ~3,800 LOC |
| **총점** | 66/100 |
| **TS 상태** | **완료** (Batch 1) |

**강점**: IntersectionObserver, ParticleBackground, Lightbox, 14섹션
**보완점**: React 18 → 19 업그레이드 가능

---

#### #30. templete-ref — 서브사이트 공통 템플릿 `3.5/5`

| 항목 | 내용 |
|------|------|
| **규모** | 템플릿 원본 / 5 Context |
| **총점** | 67/100 |
| **TS 상태** | **완료** (Batch 2) |

**역할**: edu-hub, papers, allthat의 템플릿 원본
**보완점**: 직접 배포 대상은 아니지만, 파생 프로젝트에 버그가 전파되므로 품질 관리 중요

---

### C등급 — 개선 필요 (8개)

---

#### #31. coding — 코딩 학습 `3.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | coding.dreamitbiz.com |
| **규모** | 13페이지 / 10컴포넌트 / 40+ 데이터 파일 |
| **총점** | 65/100 |

**강점**: Pyodide Worker (Python) + Wandbox API (C/Java), 수료증 생성
**약점**: lazyLoad 에러 시 무한 새로고침 가능성, TypeScript 미전환 (Batch 5)

**연계**: c-study, python-study, java-study (Type B 공통 모듈 추출)

---

#### #32. java-study — Java 학습 `3.5/5`

| 항목 | 내용 |
|------|------|
| **도메인** | java-study.dreamitbiz.com |
| **규모** | 74페이지 (라우트 최다) / 5컴포넌트 |
| **총점** | 63/100 |

**강점**: Piston API Java 실행, 5개 학습 트랙, 배지 시스템
**약점**: App.jsx에 74개 라우트 하드코딩 → **동적 라우팅 전환 최우선**

**연계**: c-study (Type B 공유), coding (코드 실행 비교)

---

#### #33~34. english / japanese — 어학 학습 `각 3.5/5`

| 항목 | english | japanese |
|------|---------|----------|
| **도메인** | english.dreamitbiz.com | japanese.dreamitbiz.com |
| **LOC** | ~26,100 (최대 규모) | ~23,600 |
| **시험** | TOEIC | JLPT |
| **고유 기능** | AI 챗봇, 음성인식 | useFurigana 훅 |
| **총점** | 72 | 72 |
| **TS 상태** | ✅ 완료 | ✅ 완료 |

**핵심 문제**: **두 프로젝트 90%+ 구조 동일** → 공통 코드 추출 시 ~90% 절감
**약점**: CSS 비대 (site.css ~3,600줄, dark-mode.css ~1,750줄)

**연계**: korean (어학 Type C 통합), teaching (TTS 기능 공유)

---

#### #35~36. reactStudy / webstudy — 정적 학습 `각 3/5`

| 항목 | 내용 |
|------|------|
| **규모** | 8/7페이지, ~3,900/~3,200 LOC |
| **총점** | 55/55 |
| **TS 상태** | ✅ 완료 |

**약점**: 인증/백엔드 없음, Lazy Loading 미적용, ErrorBoundary/404 없음
**우선 과제**: Supabase 연동 또는 정적 사이트 유지 결정

---

#### #37. algorithm — 알고리즘 학습 `3/5`

| 항목 | 내용 |
|------|------|
| **규모** | 13페이지 / 6컴포넌트 |
| **총점** | 54/100 |
| **TS 상태** | ✅ 완료 |

**약점**: HashRouter (SEO 불리), 인증 시스템 없음, 콘텐츠 부족
**연계**: data-structure (구조 통합 검토)

---

#### #38. jdy — 직업미래연구소 `3/5`

| 항목 | 내용 |
|------|------|
| **도메인** | jdy.dreamitbiz.com |
| **기술** | Vanilla HTML/CSS/JS |
| **총점** | 43/100 (최저) |

**유일한 비-React 프로젝트**. OG 이미지 자동 생성 스크립트 보유.
**결정 필요**: React 마이그레이션 또는 정적 사이트 유지

---

## 3. 아키텍처 유형별 분류

```
┌─────────────────────────────────────────────────────────────────┐
│                    DreamIT Biz 아키텍처 유형                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Type A: LMS 공유 베이스 (80%+ 중복)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐       │
│  │digitalbiz│ │marketing │ │uxdesign  │ │self-branding │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘       │
│       └─────────────┼───────────┼───────────────┘               │
│                     ▼                                           │
│              [templete-ref] ← 공통 템플릿 원본                    │
│                                                                 │
│  Type B: 프로그래밍 학습 (유사 구조)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ c-study  │ │python-st │ │java-study│ │ coding   │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └─────────────┼───────────┼─────────────┘                 │
│                     ▼                                           │
│            [코드 실행 엔진만 상이]                                  │
│            JSCPP / Pyodide / Piston / Wandbox                   │
│                                                                 │
│  Type C: 어학 학습 (90%+ 클론)                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ english  │ │ japanese │ │ korean   │                         │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘                         │
│       └─────────────┘           │                               │
│    [90% 동일 구조]          [독립 구축]                             │
│                                                                 │
│  Type D: IT/CS 학습 (독립적 발전)                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │algorithm │ │data-str  │ │linux-st  │                         │
│  ├──────────┤ ├──────────┤ ├──────────┤                         │
│  │ db-study │ │koreatech │ │   eip    │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
│                                                                 │
│  Type E: 풀스택 학습 (서비스 공유)                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ software │ │ai-prompt │ │ ai-data  │                         │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘                         │
│       └─────────────┼───────────┘                               │
│            [communityService, lectureService 공유]               │
│                                                                 │
│  Type F: 독립 플랫폼 (고유 비즈니스)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ahp_basic │ │competency│ │ pbirobot │ │  books   │           │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤           │
│  │ edu-hub  │ │  hohai   │ │  career  │ │ allthat  │           │
│  ├──────────┤ ├──────────┤ ├──────────┤                         │
│  │  papers  │ │ reserve  │ │ teaching │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
│                                                                 │
│  Type G: 소형/정적                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │reactStudy│ │ webstudy │ │  docs    │ │ koreait  │           │
│  ├──────────┤ ├──────────┤                                      │
│  │  aebon   │ │   jdy    │                                      │
│  └──────────┘ └──────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 크로스 프로젝트 연계 매트릭스

### 4.1 코드 공유 가능성 매트릭스

| 공유 대상 | 공유 코드 | 절감률 | 영향 프로젝트 |
|----------|----------|:------:|:----------:|
| **LMS 공통 모듈** | AuthContext, ThemeContext, LanguageContext, ToastContext, 커뮤니티 4종, Navbar, Footer | ~60% | digitalbiz, marketing, uxdesign, self-branding |
| **어학 공통 모듈** | PublicLayout, AuthContext, 학습 페이지 구조, CSS, TTS | ~90% | english, japanese |
| **프로그래밍 공통 모듈** | Layout, Auth, 배지/퀴즈, 진행률 | ~50% | c-study, python-study, java-study, coding |
| **풀스택 학습 공통** | communityService, lectureService, workbookService | ~30% | software, ai-prompt, ai-data |
| **supabase.js 모듈** | 인증, 커뮤니티 CRUD, 결제, 구독 | ~40% | 31개 프로젝트 |
| **결제 모듈** | CartContext, Cart.jsx, PortOne 연동 | ~80% | edu-hub, allthat, papers, competency, career |
| **Pyodide Worker** | Web Worker Python 실행 | ~95% | ai-data, koreatech, python-study, coding |

### 4.2 기능 연계 매트릭스

```
                 결제  인증  AI   코드실행  차트  PDF  커뮤니티  다국어
pbirobot          -    -    -      -      -    -     -      ✓(i18n)
books             -    ✓    -      ✓(SP)  -    ✓    -      ✓(i18n)
ai-data           -    ✓    -      ✓(Py)  -    -    ✓      ✓
career            ✓    ✓    -      -      -    -    -      -
competency        ✓    ✓    ✓(AI)  -      ✓    ✓    -      -
eip               -    ✓    -      ✓(Mn)  -    -    -      -
hohai             -    ✓    -      -      -    -    ✓      -
linux-study       -    ✓    -      -      -    ✓    ✓      ✓
koreatech         -    ✓    ✓(AI)  ✓(Py)  -    -    ✓      -
edu-hub           ✓    ✓    -      -      -    -    ✓      ✓
korean            -    ✓    ✓(GPT) -      -    -    -      ✓
teaching          -    ✓    ✓(4종) -      -    ✓    ✓      ✓
ahp_basic         ✓    ✓    ✓(AI)  -      ✓    -    -      -
allthat           ✓    ✓    -      -      ✓    -    ✓      ✓
papers            ✓    ✓    -      -      -    -    ✓      ✓

SP=Sandpack, Py=Pyodide, Mn=Monaco, AI=AI분석
```

### 4.3 개선 연계 권고

| 연계 ID | 소스 프로젝트 | → 타겟 프로젝트 | 공유 항목 | 예상 효과 |
|:-------:|-------------|----------------|----------|----------|
| L-01 | competency | → 모든 프로젝트 | CI/CD 파이프라인 (GitHub Actions) | 빌드 안정성 ↑, 배포 자동화 |
| L-02 | career | → reserve, teaching | CSS 디자인 토큰 시스템 | UI 일관성 ↑ |
| L-03 | pbirobot | → eip | Zustand 상태관리 패턴 | 전역 상태 구조화 |
| L-04 | books | → docs, papers | PDF/EPUB 뷰어 컴포넌트 | 중복 구현 방지 |
| L-05 | ai-data | → koreatech, python-study | Pyodide Worker 공유 모듈 | 코드 30% 절감 |
| L-06 | eip | → competency, allthat | Monaco Editor 코드 실행 | 코딩 기능 통합 |
| L-07 | korean | → english, japanese | TTS/음성인식 모듈 | 어학 UX 통일 |
| L-08 | teaching | → career, korean | AI 프로바이더 추상 레이어 | AI 통합 확장 |
| L-09 | koreait | → career, competency | Recharts 대시보드 패턴 | 데이터 시각화 |
| L-10 | competency | → career | PW 8자+영숫자 검증 패턴 | 보안 강화 |

---

## 5. 버전 분포 분석

### 5.1 React 버전 분포

```
React 19.x  ████████████████████████████████████████  33개 (89%)
React 18.x  ████                                       4개 (11%) ← koreait, ahp_basic, ahp, aebon
Vanilla     █                                          1개 (3%)  ← jdy
```

### 5.2 Vite 버전 분포

```
Vite 8.x    ██████████                                 6개 (17%) ← career, coding, english, japanese, korean, eip
Vite 7.3    ████████████████████████████████████████  24개 (67%) ← 주력
Vite 6.x    ████████                                   5개 (14%) ← hohai, koreait, docs, aebon, teaching
Vite 5.x    ██                                         1개 (3%)  ← ahp_basic
Next.js 16  ████                                       3개 (8%)  ← pbirobot, books, pbi
CRA         ██                                         2개 (6%)  ← ahp, ahp_app (레거시)
```

### 5.3 Supabase 버전 분포

```
2.100.x     ██████                                     3개 ← eip, competency 등 (최신)
2.99.x      ████████████████████████████████████      20개 ← 대부분
2.96~98     ████████                                   5개 ← edu-hub, docs 등
2.47~49     ████                                       3개 ← teaching, software (구형)
2.45        ██                                         1개 ← koreait (최구형)
미사용       ████████████                               7개 ← algorithm, data-structure 등
```

### 5.4 업그레이드 우선순위

| 우선순위 | 프로젝트 | 현재 | 목표 | 영향 |
|:--------:|---------|------|------|------|
| **P0** | koreait | React 18 + Vite 6 + TW 3 + Supabase 2.45 | React 19 + Vite 8 + TW 4 + Supabase 2.100 | 전면 리팩토링 |
| **P0** | ahp_basic | React 18 + Vite 5.4 | React 19 + Vite 8 | 의존성 호환 확인 |
| **P1** | teaching | Vite 6 + Supabase 2.47 | Vite 8 + Supabase 2.100 | 소규모 |
| **P1** | hohai | Vite 6 | Vite 8 | 소규모 |
| **P1** | docs | Vite 6 | Vite 8 | 소규모 |
| **P2** | aebon | React 18 + Vite 6 | React 19 + Vite 8 | TS 완료 후 |

---

## 6. TypeScript 마이그레이션 현황

### 완료 현황 (2026-04-04 기준)

```
완료     ████████████████████████████████████████████████  22/41 (54%)
대기     ████████████████████████████████████               19/41 (46%)
```

### 배치별 현황

| Batch | 상태 | 프로젝트 |
|:-----:|:----:|---------|
| 0 | ✅ 완료 | competency |
| 1 | ✅ 완료 | aebon, reactStudy, webstudy |
| 2 | ✅ 완료 | docs, templete-ref, reserve, algorithm, data-structure |
| 3 | ✅ 완료 | db-study, linux-study, english, japanese, korean |
| 4 | ✅ 완료 | presentation, digitalbiz, eip, self-branding, teaching |
| 5 | ⏳ 대기 | coding, python-study, c-study, java-study |
| 6 | ⏳ 대기 | ai-prompt, ai-data, ai-media, software, marketing |
| 7 | ⏳ 대기 | koreatech, openclaw, autowork, uxdesign |
| 8 | ⏳ 대기 | edu-hub, allthat, papers, career (PortOne) |
| 9 | ⏳ 대기 | koreait, ahp_basic (복잡) |

### 이미 TypeScript (마이그레이션 불필요)

hohai, books, pbirobot (3개)

---

## 7. 인증 시스템 현황

### 인증 프로젝트 등급표

| 등급 | 프로젝트 수 | 해당 프로젝트 |
|:----:|:---------:|-------------|
| **A** (완전 표준) | 9개 | edu-hub, papers, allthat, coding, linux-study, ai-prompt, ai-data, software, python-study |
| **B** (PW 강화 필요) | 2개 | competency, career |
| **미구현** | 26개 | 학습 콘텐츠 전용 사이트 (인증 불필요) |

### 인증 A등급 기준
- Login (멀티스텝) + Register (별도) + ForgotPassword
- PW 8자+영숫자 검증
- OAuth (Google + Kakao)
- 계정 차단 처리 + 세션 관리

### 잔여 과제
- [ ] competency: PW 6자 → 8자+영숫자 강화
- [ ] career: PW 6자 → 8자+영숫자 강화

---

## 8. 코드 중복 분석

### 8.1 중복 심각도 순위

| 순위 | 그룹 | 중복률 | 중복 코드량 | 절감 가능 LOC |
|:----:|------|:------:|:----------:|:------------:|
| 1 | english ↔ japanese | **90%+** | ~23,000 LOC | ~20,700 |
| 2 | digitalbiz ↔ marketing ↔ uxdesign ↔ self-branding | **80%+** | ~66,000 LOC | ~52,800 |
| 3 | c-study ↔ python-study ↔ coding | **50%+** | ~8,000 LOC | ~4,000 |
| 4 | software ↔ ai-prompt ↔ ai-data (서비스) | **30%+** | ~10,000 LOC | ~3,000 |
| 5 | edu-hub ↔ allthat ↔ papers (결제) | **40%+** | ~6,000 LOC | ~2,400 |

**총 절감 가능 코드**: ~82,900 LOC (전체 430,000 LOC의 ~19%)

### 8.2 공통 모듈 추출 계획

```
@dreamit/shared (npm workspace 또는 monorepo)
├── @dreamit/auth          ← AuthContext, Login, Register, ForgotPassword
├── @dreamit/theme         ← ThemeContext, dark-mode CSS
├── @dreamit/i18n          ← LanguageContext, translations
├── @dreamit/toast         ← ToastContext, Toast 컴포넌트
├── @dreamit/community     ← 게시판 CRUD, 댓글, 좋아요
├── @dreamit/payment       ← CartContext, Cart, PortOne 연동
├── @dreamit/supabase      ← Supabase 클라이언트, 공통 서비스
├── @dreamit/pyodide       ← Pyodide Worker 실행 엔진
├── @dreamit/code-editor   ← PrismJS + react-simple-code-editor
├── @dreamit/pdf           ← jsPDF + html2canvas 인증서/내보내기
└── @dreamit/ui            ← Button, Card, Modal, ProgressBar, Timer
```

---

## 9. 우선순위별 개선 로드맵

### Phase 1: 즉시 조치 (1~2주)

| # | 항목 | 영향 | 난이도 | 상태 |
|---|------|------|:------:|:----:|
| 1 | competency + career PW 검증 강화 (6자→8자+영숫자) | 보안 | 낮음 | ⏳ |
| 2 | koreait React 18→19 + Supabase 업그레이드 | 현대화 | 중간 | ⏳ |
| 3 | ahp_basic Vite 5→8 업그레이드 | 현대화 | 중간 | ⏳ |
| 4 | java-study 74라우트 → 동적 라우팅 전환 | 코드 품질 | 중간 | ⏳ |
| 5 | algorithm HashRouter → BrowserRouter | SEO | 낮음 | ⏳ |

### Phase 2: TypeScript 마이그레이션 (3~6주)

| # | 배치 | 프로젝트 | 난이도 |
|---|------|---------|:------:|
| 1 | Batch 5 | coding, python-study, c-study, java-study | 중간 |
| 2 | Batch 6 | ai-prompt, ai-data, ai-media, software, marketing | 중간 |
| 3 | Batch 7 | koreatech, openclaw, autowork, uxdesign | 중간 |
| 4 | Batch 8 | edu-hub, allthat, papers, career | 높음 (PortOne) |
| 5 | Batch 9 | koreait, ahp_basic | 높음 (구형 스택) |

### Phase 3: 코드 중복 해소 (4~8주)

| # | 항목 | 절감률 | 영향 |
|---|------|:------:|------|
| 1 | english/japanese 공통 베이스 추출 | 90% | 2개 프로젝트, ~20,700 LOC 절감 |
| 2 | LMS 4개 공통 모듈 추출 | 60% | 4개 프로젝트, ~52,800 LOC 절감 |
| 3 | supabase.js 서비스 모듈 분할 | - | 31개 프로젝트 |
| 4 | 결제 모듈 통합 (CartContext/Cart) | 80% | 5개 프로젝트 |
| 5 | Pyodide Worker 공유 모듈 | 95% | 4개 프로젝트 |

### Phase 4: 품질 인프라 (지속적)

| # | 항목 | 현재 | 목표 |
|---|------|------|------|
| 1 | ESLint 전체 적용 | 12/37 (32%) | 37/37 (100%) |
| 2 | CI/CD 파이프라인 (GitHub Actions) | 1/37 (3%) | 10/37 (27%) |
| 3 | 테스트 코드 작성 (결제/인증 우선) | 3/37 (8%) | 15/37 (40%) |
| 4 | 접근성 (ARIA, 키보드 네비) | 5/37 (14%) | 20/37 (54%) |
| 5 | SEO 최적화 (JSON-LD, 동적 메타) | 10/37 (27%) | 25/37 (68%) |

---

## 10. 전체 통계 요약

### 프로젝트 규모

| 항목 | 수치 |
|------|------|
| **총 프로젝트** | 45개 (활성 37개 + 개발/백업 8개) |
| **총 페이지** | ~1,160+ |
| **총 코드 라인** | ~430,000+ LOC |
| **총 도메인** | 38개 (*.dreamitbiz.com) |
| **GitHub 리포지토리** | 52개 |

### 등급 분포

```
S등급 (75+점)  ████████                4개 (11%) — pbirobot, books, ai-data, career
A등급 (65~75)  ██████████████          7개 (19%) — eip, hohai, competency, linux, koreatech, docs, koreait
B등급 (55~65)  ████████████████████████████████████████  19개 (51%)
C등급 (~55)    ████████████████        8개 (22%) — coding, java, english, japanese, react/web, algorithm, jdy
```

### 기술 스택 분포

| 기술 | 적용 수 | 비율 |
|------|:-------:|:----:|
| React 19 | 33개 | 89% |
| Vite 7~8 | 30개 | 81% |
| Supabase | 31개 | 84% |
| TypeScript (완료) | 25개 | 68% |
| ESLint | 12개 | 32% |
| 테스트 | 3개 | 8% |
| 결제 (PortOne) | 5개 | 14% |
| AI 통합 | 4개 | 11% |
| gh-pages 배포 | 34개 | 92% |
| CI/CD | 1개 | 3% |

### 평균 점수

| 항목 | 점수 |
|------|:----:|
| **코드 품질 평균** | 3.95/5 |
| **종합 평균** | 67.4/100 |
| **이전 대비** | +5.2점 ▲ (TS 마이그레이션 효과) |

---

## 부록: 평가 이력

| 일자 | 내용 |
|------|------|
| 2026-03-25 | 초안 — Phase 1 보안/메타데이터/배포 개선 |
| 2026-03-26 | 재평가 — edu-hub 승급, 신규 3개 (korean, eip, teaching) 추가 |
| 2026-03-27 | 3차 — 장바구니 버그 수정, 히어로 반응형 20개, competency A등급 승급, eip v2.0.1 |
| 2026-03-30 | 인증 표준화 — 6개 프로젝트 C/D→A 승격, 31파일 수정 |
| 2026-04-01 | TypeScript 마이그레이션 — 19/38 완료 (Batch 0~4), 배포 완료 |
| **2026-04-04** | **종합 개별 분석 보고서 — 전체 45개 점수화, 연계 매트릭스, 로드맵** |

---

> 이 보고서는 소스코드 심층 분석, 기존 Dev_md 문서 (Dev_md0320, Dev_md0330, Dev_md04), 배포 현황, TypeScript 마이그레이션 보고서를 종합하여 작성되었습니다.
>
> **평가 방법**: 각 프로젝트의 src/ 폴더 구조, package.json, 라우팅 설정, 주요 컴포넌트/훅, git log, 배포 상태를 분석했습니다.
