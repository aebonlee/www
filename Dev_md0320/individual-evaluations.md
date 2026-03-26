# 개별 프로젝트 심층 평가 보고서

> 작성일: 2026-03-26 (재평가)
> 평가 대상: DreamIT Biz 전체 37개 활성 프로젝트
> 평가 방법: 소스코드 심층 분석 (구조, 라우팅, 컴포넌트, 코드 품질, 완성도)
> 이전 평가 대비 변경사항: Phase 1 보안/메타데이터/배포 개선 반영, edu-hub 콘텐츠 확장, career 푸터 표준화, 어학 사이트 TTS 기능 정정, 신규 3개 프로젝트 추가 (korean, eip, teaching)

---

## 종합 비교표 (전체 37개 프로젝트)

| # | 프로젝트 | 코드 품질 | 완성도 | 코드 규모 | 언어 | 프레임워크 | 변동 |
|---|---------|:---------:|:------:|:---------:|:----:|:----------:|:----:|
| 1 | pbirobot | **5/5** | 높음 | 중 | TS | Next.js 16 | - |
| 2 | books | **5/5** | 높음 | 대 | TS | Next.js 16 | - |
| 3 | ai-data | **5/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 4 | career | **5/5** | 높음 | 중 | JS | React 19+Vite 8 | ▲ 푸터 표준화 |
| 5 | eip | **4.5/5** | 높음 | 대 | JS | React 19+Vite 8+TW4 | ★ 신규 |
| 6 | hohai | **4.5/5** | 높음 | 중~대 | TS | React 19+Vite 6 | - |
| 7 | linux-study | **4.5/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 8 | koreatech | **4.5/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 9 | koreait | **4.5/5** | 중간 | 소 | JS | React 18+Vite 6 | - |
| 10 | docs | **4.5/5** | 높음 | 소 | JS | React 19+Vite 6 | - |
| 11 | ahp_basic | **4/5** | 높음 | 대 | JS | React 18+Vite 5 | - |
| 12 | competency | **4/5** | 높음 | 대 | JS(부분TS) | React 19+Vite 7 | - |
| 13 | edu-hub | **4/5** | 높음 | 중 | JS | React 19+Vite 7 | ▲ 3.5→4 |
| 14 | korean | **4/5** | 높음 | 중~대 | JS | React 19+Vite 8 | ★ 신규 |
| 15 | teaching | **4/5** | 높음 | 중 | JS | React 19+Vite 6 | ★ 신규 |
| 16 | c-study | **4/5** | 높음 | 중 | JS | React 19+Vite 7 | - |
| 17 | python-study | **4/5** | 높음 | 중 | JS | React 19+Vite 7 | - |
| 18 | data-structure | **4/5** | 중간 | 중 | JS | React 19+Vite 7 | - |
| 19 | db-study | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 20 | software | **4/5** | 높음 | 중 | JS | React 19+Vite 7 | - |
| 21 | ai-prompt | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 22 | digitalbiz | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 23 | marketing | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 24 | uxdesign | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 25 | self-branding | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 26 | allthat | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 27 | papers | **4/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 28 | reserve | **4/5** | 높음 | 중 | JS | React 19+Vite 7 | - |
| 29 | aebon | **4/5** | 높음 | 소 | JS | React 18+Vite 6 | - |
| 30 | coding | **3.5/5** | 중~높 | 중 | JS | React 19+Vite 8 | - |
| 31 | java-study | **3.5/5** | 높음 | 대 | JS | React 19+Vite 7 | - |
| 32 | english | **3.5/5** | 높음 | 대 | JS | React 19+Vite 8 | ▲ ESLint 추가 |
| 33 | japanese | **3.5/5** | 높음 | 대 | JS | React 19+Vite 8 | ▲ ESLint 추가 |
| 34 | reactStudy | **3/5** | 중간 | 소 | JS | React 19+Vite 7 | ▲ ESLint 추가 |
| 35 | webstudy | **3/5** | 중간 | 소 | JS | React 19+Vite 7 | ▲ ESLint 추가 |
| 36 | algorithm | **3/5** | 중간 | 소 | JS | React 19+Vite 7 | - |
| 37 | jdy | **3/5** | 중간 | 소 | JS | Vanilla HTML/CSS | - |

---

## Phase 1 전체 공통 개선사항 (2026-03-25~26)

모든 프로젝트에 아래 항목이 일괄 적용됨:

| 항목 | 상세 |
|------|------|
| **보안 점검** | `npm audit fix` 실행, CRITICAL/HIGH 취약점 해결 |
| **API 키 보안** | .gitignore에 .env 포함 확인 (3개 프로젝트 추가 완료) |
| **메타데이터** | package.json에 `description` + `homepage` 추가 (32개 프로젝트) |
| **배포 스크립트** | `predeploy` + `deploy` 스크립트 추가 (15개 프로젝트) |

---

## 등급별 분류

### S등급 (코드 품질 5/5) - 4개 프로젝트

#### 1. pbirobot (PBI 로봇 플랫폼) - 5/5
- **설명**: AI 로봇 수영장 청소기 기업 홍보 웹사이트
- **페이지/컴포넌트**: 11페이지 / 30컴포넌트
- **기술 스택**: Next.js 16.1.6 + TypeScript 5 + Tailwind CSS 4 + next-intl 4.8.3 + Framer Motion + Zustand 5.0.11 + Zod + react-hook-form 7.71.2
- **특수 기능**: 다국어(한/영, next-intl), 제품 비교표, 견적요청 폼(Zod+react-hook-form), 장바구니(Zustand), ScrollReveal, SEO 동적 메타데이터, SSG(generateStaticParams)
- **강점**: 전체 TypeScript strict mode, Next.js 16 최신 App Router, Tailwind CSS 4, Zustand 상태관리, Zod 폼 검증, 컴포넌트 기능별 분류(ui/shared/layout/home/products/store), i18n 라우팅/네비게이션 분리
- **개선 필요**: 테스트 코드 부재, 관리자 페이지 없음

#### 2. books (DreamIT 출판 플랫폼) - 5/5
- **설명**: 출판물 소개, 전자도서 리더, 커머스 기능
- **페이지/컴포넌트**: 18페이지 / 37컴포넌트
- **기술 스택**: Next.js 16.1.6 + TypeScript 5 + Tailwind CSS + next-intl + MDX (next/mdx 16.1.6) + Supabase + epubjs + pdfjs-dist + FlexSearch + Shiki 3.23.0 + Velite 0.3.1
- **특수 기능**: EPUB 리더(epubjs), PDF 뷰어(pdfjs-dist), MDX 렌더링, CodePlayground(Sandpack), FlexSearch 전문검색, JSON-LD SEO, 장바구니/결제(PortOne), 다국어(한/영), Shiki 코드 하이라이팅
- **강점**: 전체 TypeScript strict, API 레이어 분리(lib/api/), 타입 정의 분리(types/book 등), UI 컴포넌트 라이브러리 패턴, 라우트별 layout 분리, Context API(AuthContext, CartContext) 활용
- **개선 필요**: 테스트 코드 부재

#### 3. ai-data (AI 데이터 분석 학습) - 5/5
- **설명**: AI 데이터 분석 학습 플랫폼 (LMS)
- **페이지/컴포넌트**: 52페이지 / 74파일
- **코드 규모**: ~14,738 LOC
- **기술 스택**: React 19 + Vite 7 + Supabase + Pyodide Web Worker
- **특수 기능**: 브라우저 내 Python 실행(Pyodide Worker), 퀴즈 시스템(타이머/셔플/채점), 배지/업적 시스템(자동 해금), 학습 진행률 추적(localStorage+Supabase 동기화), 실전 프로젝트 6개, AICE 자격증 준비, SVG 차트 출력
- **강점**: Web Worker 활용, Context 4중 중첩이 논리적, 데이터 분리 우수(quizzes.js 495줄, badges.js 158줄), 체계적 에러 처리, 서비스 기반 아키텍처(communityService, lectureService, workbookService)
- **개선 필요**: TypeScript 미사용, ESLint 미구성, 강의/워크북 미완성(2/1페이지), Pyodide CDN 오프라인 폴백

#### 4. career (커리어 상담 플랫폼) - 5/5
- **설명**: 멘토-멘티 매칭 커리어 상담 플랫폼
- **페이지/컴포넌트**: 19페이지 / 57파일
- **코드 규모**: ~7,153 LOC
- **기술 스택**: React 19.2.4 + Vite 8 + Supabase + PortOne + ESLint (flat config)
- **특수 기능**: PortOne 결제, 역할 기반 접근 제어(멘토/멘티 대시보드 분리), Supabase Realtime 실시간 알림, 멘토 검색/필터/정렬, 예약 시스템, 리뷰(StarRating), 파일 업로드, CSS 변수 디자인 토큰
- **강점**: 컴포넌트 구조 가장 체계적(common 16개/layout/landing), barrel export, 유틸리티/상수 분리, mountedRef 에러 처리 패턴, CSS 변수/리셋/타이포 체계적 분류, ESLint flat config 구성
- **2026-03-26 변경**: 푸터 고객지원 정보 dreamitbiz 표준으로 통일 (이메일/전화/카카오톡/저작권)
- **개선 필요**: 멘토 데이터 mockData 기반, 테스트 코드 부재

---

### A등급 (코드 품질 4.5/5) - 6개 프로젝트

#### 5. eip (정보처리 종합 학습 플랫폼) - 4.5/5 ★ 신규
- **설명**: 정보처리기사/산업기사/프로그래밍기능사 종합 학습 플랫폼
- **페이지/컴포넌트**: 25+라우트 / 37컴포넌트 / 15 데이터 파일
- **기술 스택**: React 19.2.4 + Vite 8.0.1 + Tailwind CSS 4.2.2 + Monaco Editor 4.7.0 + Supabase 2.100.0 + ESLint 9
- **특수 기능**: CBT 필기시험(자격증 3종×과목별 챕터 이론+모의고사), 실기시험(SQL/알고리즘/단답형), Monaco 코딩실습(Wandbox API로 C/Java/Python 실행), YouTube 강의 플레이어, 회차별 결정적 문제 셔플(seeded), 합격 예측, 마이페이지(시험이력/코딩이력)
- **데이터 규모**: 500+문항, 코딩 연습 20+, 강의 15+, 챕터 이론 12과목(기사5+산기4+기능사3)
- **강점**: Tailwind CSS 4 (전체 프로젝트 중 유일), Monaco Editor(전문 코드 에디터), 자격증별 데이터 완전 분리, 재사용 UI 컴포넌트(Button/Card/Timer/ProgressBar/Modal), OAuth(Google/Kakao), 마크다운 테이블 렌더링
- **개선 필요**: TypeScript 미전환(@types 설치됨), 커뮤니티 기능 미완성, 테스트 코드 부재

#### 6. hohai (호해 - 시/음악 플랫폼) - 4.5/5
- **설명**: 시(Poem)와 AI 음악(Suno) 콘텐츠 문학/음악 플랫폼
- **페이지/컴포넌트**: 23페이지 / 23컴포넌트 / 13 hooks
- **기술 스택**: React 19 + Vite 6.1.0 + TypeScript ~5.7 (strict, ES2020) + react-router-dom 7 + Supabase + Framer Motion
- **특수 기능**: YouTube 임베드+재생 관리, Suno AI 음악 임베드, 가사 플레이어(LyricsPlayer), 시 리더 모드, 플레이리스트 관리, 좋아요/댓글/조회수, 기분(mood) 필터링, 페이지 전환 애니메이션, Canvas 시각 효과
- **강점**: 전체 TypeScript strict, 8개 타입 파일 세밀 분리(poems, songs, playlists, interactions, galleries), 13개 커스텀 hooks(useAuth, useSeries, usePoems, useSongs, usePlaylist, useLikes, useSearch 등), CSS Modules, 20개+ lazy 컴포넌트, Context 기반 상태(PlaybackContext, PlaylistContext, AuthContext)
- **개선 필요**: 테스트 부재, 관리자 페이지 1개만

#### 6. linux-study (리눅스 마스터 학습) - 4.5/5
- **페이지/컴포넌트**: 48페이지 / 5컴포넌트
- **기술 스택**: React 19 + Vite 7.3.1 + Supabase + jsPDF + html2canvas
- **특수 기능**: lazyLoad 에러 복구, Supabase 진행도 로컬/클라우드 병합, 페이지 추적(usePageTracker), 스탬프 랠리, PDF 인증서 생성, 2급/1급 모의고사, 커뮤니티 6채널
- **강점**: 중첩 라우트+Outlet 패턴(가장 현대적), 진행도 병합 로직 우수, 방어적 코딩, 커스텀 훅(useAOS, useTableScroller, useCodeCopy) 활용
- **개선 필요**: TypeScript 미사용, ESLint 미구성

#### 7. koreatech (컴퓨팅 사고력 교육) - 4.5/5
- **페이지/컴포넌트**: 60페이지 / 6컴포넌트
- **기술 스택**: React 19 + Vite 7.3.1 + Supabase + Pyodide Worker + PrismJS + react-simple-code-editor
- **특수 기능**: Pyodide Worker Python 실행, CT 교육, AI 도구 가이드(ChatGPT/Claude/Gemini/Copilot), 커뮤니티 4채널, Toast 알림, SEO, 다단계 Python 교육과정(10단계+고급 모듈), 관리자 시스템
- **강점**: 관심사 분리 우수(App→PublicLayout), Hook 패턴 활용(useCodeRunner), 에러 처리 일관적, 데이터 기반 설계(pythonSteps)
- **개선 필요**: TypeScript 미사용, ESLint 미구성

#### 8. koreait (Korea IT 대시보드) - 4.5/5
- **페이지/컴포넌트**: 14페이지 / 22컴포넌트
- **코드 규모**: ~3,600 LOC
- **기술 스택**: React 18.3.1 + Vite 6 + Tailwind CSS 3.4.15 + Recharts 2.13.0 + Supabase 2.45.0 + ESLint
- **특수 기능**: 대시보드 레이아웃(Sidebar+TopNav), KPI 섹션, 활동 타임라인, 차트(Recharts), 뉴스 피드
- **강점**: 컴포넌트 분리 가장 체계적, UI 라이브러리 패턴, Tailwind, 서비스 레이어 분리(authService, dashboardService, storageService), cn() 유틸리티, ESLint 구성
- **개선 필요**: React 18.3.1 → 19 업그레이드 필요, Tailwind 3 → 4 업그레이드, Supabase 2.45 → 2.99 업그레이드, 일부 Placeholder 콘텐츠 미완성

#### 9. docs (문서 뷰어) - 4.5/5
- **페이지/컴포넌트**: 8페이지 / 8컴포넌트
- **코드 규모**: ~4,400 LOC
- **기술 스택**: React 19 + Vite 6 + Supabase 2.98.0 + react-router-dom 7.1.0
- **특수 기능**: PDF 뷰어, 문서 카테고리 시스템, 관리자 CRUD, AdminLayout 분리, 소셜 로그인(Kakao/Google), 회원 도메인 추적(visited_sites)
- **강점**: 가장 깔끔한 구조, 관리자/공개 영역 분리, 서비스 레이어(document, member), 코드량 대비 완성도 최고
- **개선 필요**: TypeScript 미사용, ESLint 미구성

---

### B등급 (코드 품질 4/5) - 19개 프로젝트

#### 10. ahp_basic (AHP 의사결정 분석) - 4/5
- **페이지/컴포넌트**: 46페이지 / 84컴포넌트 / 21 hooks / 21 utils / 7 테스트
- **기술 스택**: React 18.3.1 + Vite 5.4 + Supabase + Recharts + XLSX
- **특수 기능**: AHP 고유값 계산(Power Method), 쌍대비교+일관성비율(CR), 민감도 분석, 통계 엔진, AI 분석(챗봇/논문초안/참고문헌), 브레인스토밍, QR코드+Excel, 구독/결제, SMS, 포인트/출금
- **강점**: CSS Modules, 비즈니스 로직/UI 분리, JSDoc, 7개 테스트(Vitest), ErrorBoundary, React.lazy, Guard 패턴(Admin/SuperAdmin/Evaluator/Protected)
- **개선 필요**: TypeScript 미전환, HashRouter→BrowserRouter, Vite 5.4 → 7+ 업그레이드

#### 11. competency (4차산업혁명 핵심역량 검사) - 4/5
- **페이지/컴포넌트**: 53페이지 / 13컴포넌트 / 4테스트(13케이스)
- **기술 스택**: React 19 + Vite 7 + Supabase + Chart.js + PortOne V1 (KG이니시스)
- **특수 기능**: PortOne 결제(KG이니시스 25,000원), 쿠폰, 8대 핵심역량 레이더차트, AI 리포트, 그룹 관리, CSV 내보내기(UserList/CouponList/PurchaseList), OAuth(Google/Kakao), GitHub Actions CI/CD(lint, type-check, test, build, deploy)
- **강점**: lazy loading 31청크, TS 점진 전환 중(contexts, utils, types), CLAUDE.md 문서화, DOMPurify XSS 방어, Supabase RLS 적용, CI/CD 파이프라인 유일하게 보유
- **개선 필요**: 전체 TypeScript 전환 완료 필요 (allowJs: true 상태)

#### 13. korean (한국어 학습) - 4/5 ★ 신규
- **설명**: 외국인 및 다문화 학습자를 위한 한국어 학습 플랫폼
- **페이지/컴포넌트**: 23페이지 / 63 JSX파일 / 14 코어 컴포넌트 / 3 Context
- **기술 스택**: React 19.2.4 + Vite 8.0.1 + Supabase 2.99.3 + ESLint 9.39.4 + Sharp
- **특수 기능**: Web Speech API TTS(GlobalTTS 자동 주입), AI 챗봇(GPT-4o-mini), 음성 인식 발음 연습(SpeechPractice), 2,300+ 단어 데이터베이스(기초/일상/비즈니스/TOPIK), 9개 학습 카테고리(한글/회화/문법/어휘/작문/TOPIK/문화/AI채팅/발음), 다국어(한/영), 5색 테마+다크모드, OAuth(Google/Kakao)
- **강점**: ESLint 구성, lazy loading+Suspense, 커리큘럼 설정 기반(site.js), useAOS 스크롤 애니메이션, 접근성 속성(aria-label, role), useMemo/useCallback 최적화
- **개선 필요**: TypeScript 미전환(@types 설치됨), 학습 진행률 DB 저장 미구현, 퀴즈/채점 시스템 없음

#### 14. teaching (AI 교수학습 도구) - 4/5 ★ 신규
- **설명**: 교육자를 위한 AI 기반 교수학습 도구 플랫폼
- **페이지/컴포넌트**: 14페이지 / 42+ JSX파일 / 13 컴포넌트 / 4 Context
- **기술 스택**: React 19 + Vite 6 + Supabase 2.47 + react-markdown + remark-gfm + jsPDF
- **특수 기능**: AI 도구 5종(강의계획서/루브릭/과제/피드백/학생평가 생성기), 멀티 AI 프로바이더(OpenAI/Claude/Gemini/Genspark), 스트리밍 응답+토큰 사용량 추적, 5형식 내보내기(PDF/Markdown/JSON/CSV/HTML), AI 역량 체크리스트, 교육학 이론 자료(Bloom's/ADDIE/SAM), 다국어(한/영), 5색 테마+다크모드, 커뮤니티 게시판
- **강점**: Context 4종(Auth/Theme/Language/Toast), AuthGuard+AdminGuard 이중 보호, 코드 스플리팅(vendor/supabase/markdown/pdf 청크), 시간 기반 자동 테마(06~18시 라이트)
- **개선 필요**: TypeScript 미사용, ESLint 미구성, 배포 스크립트 누락, Vite 6→8 업그레이드 필요, Supabase 2.47→2.100 업그레이드 필요

#### 15. edu-hub (교육 허브) - 4/5 ▲ (이전 3.5/5)
- **25페이지 / 10컴포넌트 / 5 Context**
- **기술 스택**: React 19.2.0 + Vite 7.3.1 + Supabase 2.96.0 + PortOne + Vitest 4.1.1 + @testing-library/react
- **특수 기능**: 다크모드, 다국어(한/영), PortOne 결제, 장바구니, 커뮤니티, 가맹점(familySites) 관리, 검색 모달, 학습 사이트 카드 시스템, 카테고리 필터링
- **2026-03-26 변경사항**:
  - 한국어 학습(korean.dreamitbiz.com) 카드 추가
  - 정보처리기사(eip.dreamitbiz.com) 링크 활성화
  - 네비게이션 메뉴 한국어 항목 추가 + 번역 키 추가
  - 어학 4개 사이트 features를 "API 기반 TTS 음성 서비스"로 통일
- **승급 사유**: Vitest + @testing-library 테스트 인프라 보유, 콘텐츠 관리 체계(site.js 설정 기반) 완비, 학습 사이트 32개+ 연동 허브 역할, Phase 1 배포 스크립트 추가
- **개선 필요**: TypeScript 미사용, 6개 Storage 유틸 분산

#### 13-14. c-study / python-study - 각 4/5
- **공통 구조**: 27페이지 / 8~10컴포넌트
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase 2.99.2 + PrismJS + react-simple-code-editor
- **특수 기능**: c-study(JSCPP 브라우저 C 실행), python-study(Pyodide Worker+TurtleCanvas)
- **강점**: Lazy loading, ErrorBoundary, 세션 관리, 역할 기반 접근 제어, 퀴즈/배지 시스템, 커뮤니티
- **개선 필요**: 두 프로젝트 간 중복 코드 다수, TypeScript 미사용

#### 15. data-structure (자료구조 학습) - 4/5
- **페이지/컴포넌트**: 43페이지 / 3컴포넌트
- **기술 스택**: React 19.2 + Vite 7.3.1 + React Router DOM
- **강점**: URL 경로 설계 체계적(선형/비선형/해시/알고리즘/고급), Lazy loading, CNAME 설정, 의존성 최소화
- **개선 필요**: Supabase 미연동, TypeScript 미사용

#### 16. db-study (데이터베이스 학습) - 4/5
- **코드 규모**: ~18,457 LOC (40페이지)
- **기술 스택**: React 19 + Vite 7.3.1 + React Router DOM
- **특수 기능**: SQL 튜토리얼 12챕터, RDBMS/NoSQL/Cloud DB/NewSQL 개념, DB 튜닝(Oracle AWR), 웹 연동(Node-MySQL, Python-DB, ORM), 시험 연습
- **강점**: Context 패턴 일관성, 커스텀 훅 활용, Lazy Loading, SEO Head 컴포넌트
- **개선 필요**: TypeScript 미사용

#### 17. software (소프트웨어 설계 학습) - 4/5
- **코드 규모**: ~7,358 LOC (47페이지)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase 2.49.4 + Sharp
- **특수 기능**: Supabase 풀스택, 커뮤니티(CRUD+댓글), 강의/워크북 11주제, 즐겨찾기, Playground, 디자인 패턴(Creational/Structural/Behavioral), SDLC/UML/SOLID
- **강점**: 서비스 계층 분리(services/), AuthContext 중앙 관리

#### 18. ai-prompt (AI 프롬프트 학습) - 4/5
- **코드 규모**: ~13,036 LOC (62페이지 - 가장 많은 페이지)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase + Sharp
- **특수 기능**: AI 팁 9개 가이드(ChatGPT/Claude/Gemini/Copilot), 프롬프트 기법(Few-Shot/CoT/Role-System), 강의/워크북 8주제, Playground, 프로필/즐겨찾기

#### 19-22. digitalbiz / marketing / uxdesign / self-branding - 각 4/5
- **LMS 공통 아키텍처**: AuthContext, ThemeContext, LanguageContext, ToastContext, AuthGuard, 커뮤니티 4종, 강의자료, Lazy loading
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase + Sharp + Canvas
- **코드 규모**: digitalbiz ~18,200 / marketing ~22,200 / uxdesign ~19,200 / self-branding ~23,800 LOC
- **콘텐츠 특화**: digitalbiz(14주 디지털 전환), marketing(15주 디지털 마케팅), uxdesign(13주 UX/CXD), self-branding(15주 브랜딩+마케팅 도구 8종)
- **개선 필요**: supabase.js 600~754줄 비대, 4개 프로젝트 간 80%+ 코드 중복

#### 23. allthat (올댓스터디 ESG 교육) - 4/5
- **코드 규모**: ~24,200 LOC (30페이지 / 16컴포넌트)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase + PortOne SDK
- **특수 기능**: lazyWithRetry(청크 로딩 실패 재시도), ESG 자가진단+레이더차트, 퀴즈(QuizHome/QuizTake/QuizResult), 수강신청, AdminDashboard 1,510줄, 결제 연동
- **개선 필요**: AdminDashboard 분할, translations.js 1,601줄

#### 24. papers (학술 연구 플랫폼) - 4/5
- **코드 규모**: ~24,200 LOC (35페이지 / 98파일 - 파일 수 최다)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase + PortOne SDK
- **특수 기능**: PortOne 결제, 장바구니(CartContext), 분야별 학술 데이터(인문/의예/과학공학 한영 ~4,100줄), 논문지도, 파일/이미지 업로드, 관리자 CRUD 9경로, 온라인/라이브 강의

#### 25. reserve (예약 시스템) - 4/5
- **코드 규모**: ~12,400 LOC (17페이지 / 13컴포넌트)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase
- **특수 기능**: 캘린더 뷰(CalendarView), 예약/강의요청 시스템, 관리자 대시보드(통계카드, StatsCard), 스케줄 관리(ScheduleForm/ScheduleCard), DatePicker
- **강점**: 서비스 레이어 4개 분리, 컴포넌트 역할 분리 명확(schedule/lectureRequest/admin/common)

#### 26. aebon (포트폴리오) - 4/5
- **코드 규모**: ~3,800 LOC (1페이지 SPA / 19컴포넌트)
- **기술 스택**: React 18.3.1 + Vite 6.0.0 + react-icons
- **특수 기능**: IntersectionObserver 활성 섹션 감지, 스크롤 애니메이션, ParticleBackground, Lightbox 이미지 뷰어, 14개 섹션(Hero/About/Skills/Career/Education/Certifications/Awards/Projects/Publications/Teaching/Testimonials/Gallery/Documents/Contact)
- **강점**: 컴포넌트 분리 체계적(sections/ui/layout), CSS-per-component, 최소 의존성, ThemeToggle(다크/라이트)
- **개선 필요**: React 18 → 19 업그레이드 가능

---

### C등급 (코드 품질 3~3.5/5) - 8개 프로젝트

#### 30. coding (코딩 학습) - 3.5/5
- **13페이지 / 10컴포넌트 / 40+ 데이터 파일**
- **기술 스택**: React 19.2.4 + Vite 8.0.0 + Supabase 2.99.1 + html2canvas + jsPDF + PrismJS + react-simple-code-editor
- **특수 기능**: Pyodide Worker(Python), Wandbox API(C/Java), 난이도 뱃지, 수료증(html2canvas+jsPDF)
- **약점**: TS 미사용, ESLint 미구성, lazyLoad 에러 시 무한 새로고침 가능성

#### 31. java-study (Java 학습) - 3.5/5
- **74페이지 / 5컴포넌트** (가장 많은 라우트 중 하나)
- **기술 스택**: React 19.2 + Vite 7.3.1 + Supabase 2.99.2 + PrismJS + react-simple-code-editor + Sharp
- **특수 기능**: Piston API Java 실행, 5개 학습 트랙(Java/Servlet/Spring/실전/프로젝트)
- **약점**: App.jsx에 74개 라우트 하드코딩, 다국어 미지원, ErrorBoundary 세분화 부족

#### 32-33. english / japanese - 각 3.5/5
- **기술 스택**: React 19.2.4 + Vite 8.0.1 + Supabase 2.99.3 + ESLint 9.39.4 + @types/react
- **english**: ~26,100 LOC (최대 규모), TOEIC, AI 챗봇, 음성 인식/합성, API 기반 TTS 음성 서비스
- **japanese**: ~23,600 LOC, JLPT, useFurigana 커스텀 훅, API 기반 TTS 음성 서비스
- **2026-03-26 변경**: features "원어민 음성 제공" → "API 기반 TTS 음성 서비스"로 정정 (edu-hub 설정)
- **개선 사항**: ESLint 9 구성 완료, @types/react devDep 추가 (TypeScript 전환 준비 상태)
- **약점**: PublicLayout 내 인라인 훅, CSS 비대(site.css ~3,600줄, dark-mode.css ~1,750줄)
- **개선 필요**: 두 프로젝트 90%+ 구조 동일 → 공통 코드 추출, 전체 TypeScript 전환

#### 34-35. reactStudy / webstudy - 각 3/5
- **소규모 정적 학습 사이트**: 8/7페이지, ~3,900/~3,200 LOC
- **기술 스택**: React 19.2 + Vite 7.3.1 + react-icons + ESLint 9.39.1 + @types/react
- **개선 사항**: ESLint 구성 완료, @types/react devDep 추가
- **약점**: 인증/백엔드 없음, Lazy Loading 미적용, ErrorBoundary/404 없음

#### 36. algorithm (알고리즘 학습) - 3/5
- **13페이지 / 6컴포넌트** (가장 작은 규모)
- **기술 스택**: React 19.2 + Vite 7.3.1 + react-icons
- **약점**: ESLint 미구성, Lazy loading 미적용, 404 없음, HashRouter(SEO 불리), 인증 시스템 없음

#### 37. jdy (직업미래연구소) - 3/5
- **유일한 Vanilla HTML/CSS/JS 프로젝트** (정적 단일 페이지)
- **기술 스택**: Vanilla JS + Canvas (OG 이미지 생성용)
- **특수 기능**: OG 이미지 자동 생성 스크립트
- **약점**: React 미사용, 다른 프로젝트와 기술 스택 불일치, 배포 스크립트 없음

---

## 아키텍처 유형별 분류

### Type A: LMS/교육 플랫폼 (공통 베이스코드 공유) - 4개
`digitalbiz`, `marketing`, `uxdesign`, `self-branding`
- 80%+ 코드 중복 (AuthContext, 커뮤니티, 강의/참고자료 시스템)
- 과목별 콘텐츠 페이지만 상이

### Type B: 프로그래밍 학습 (유사 구조) - 4개
`c-study`, `python-study`, `java-study`, `coding`
- Layout, Context, Auth 코드 유사
- 언어별 코드 실행 엔진만 상이 (JSCPP/Pyodide/Wandbox/Piston)

### Type C: 어학 학습 (클론 구조) - 3개
`english`, `japanese`, `korean`
- english/japanese: 90%+ 구조 동일 (TOEIC/JLPT 시험 데이터만 상이)
- korean: 독립 구축 (AI 챗봇, 발음 연습 등 고유 기능)

### Type D: IT/CS 학습 - 6개
`algorithm`, `data-structure`, `linux-study`, `db-study`, `koreatech`, `eip`
- 구조적 유사성 있으나 독립적 발전
- eip: Tailwind CSS 4 + Monaco Editor로 가장 현대적

### Type E: 풀스택 학습 플랫폼 - 3개
`software`, `ai-prompt`, `ai-data`
- 공통 서비스 계층 (communityService, lectureService, workbookService)
- ai-data만 Pyodide/퀴즈/배지 추가

### Type F: 독립 플랫폼 - 11개
`ahp_basic`, `competency`, `pbirobot`, `books`, `edu-hub`, `hohai`, `career`, `allthat`, `papers`, `reserve`, `teaching`
- 각각 고유 비즈니스 로직
- teaching: AI 교수학습 도구 (멀티 프로바이더)

### Type G: 소형/정적 - 6개
`reactStudy`, `webstudy`, `docs`, `koreait`, `aebon`, `jdy`

---

## 전체 통계

| 항목 | 수치 |
|------|------|
| **총 프로젝트** | 37개 활성 |
| **총 페이지** | ~1,160+ |
| **총 코드 라인** | ~430,000+ LOC |
| **TypeScript 프로젝트** | 4개 (pbirobot, books, hohai + competency 부분) |
| **ESLint 구성 프로젝트** | 12개 (pbirobot, books, career, koreait, competency, english, japanese, reactStudy, webstudy, korean, eip + Next.js 프로젝트) |
| **Tailwind CSS 프로젝트** | 3개 (pbirobot, koreait, eip) |
| **테스트 있는 프로젝트** | 3개 (ahp_basic 7파일, competency 4파일, edu-hub 인프라 보유) |
| **결제 연동 프로젝트** | 5개 (competency, edu-hub, career, allthat, papers) |
| **AI 통합 프로젝트** | 4개 (korean AI챗봇, teaching 멀티AI, ahp_basic AI분석, eip 코드실행) |
| **Supabase 연동** | 31개+ |
| **gh-pages 배포** | 34개+ |

---

## 이전 평가 대비 변동 요약

| 프로젝트 | 이전 | 현재 | 변동 사유 |
|---------|:----:|:----:|----------|
| **edu-hub** | 3.5/5 | **4/5** | Vitest 테스트 인프라, 한국어 학습 카드 추가, 정보처리기사 링크 활성화, 네비게이션 메뉴 확장, TTS 기능 통일, 배포 스크립트 추가 |
| **english** | 3.5/5 | 3.5/5 | ESLint 9 + @types/react 추가 (점수 변동 없으나 TypeScript 전환 준비 완료) |
| **japanese** | 3.5/5 | 3.5/5 | ESLint 9 + @types/react 추가 (점수 변동 없으나 TypeScript 전환 준비 완료) |
| **reactStudy** | 3/5 | 3/5 | ESLint 9 + @types/react 추가 |
| **webstudy** | 3/5 | 3/5 | ESLint 9 + @types/react 추가 |
| **career** | 5/5 | 5/5 | 푸터 고객지원 dreamitbiz 표준화 (점수 변동 없음) |
| **korean** | - | **4/5** | ★ 신규 프로젝트 - 한국어 학습 플랫폼 (React 19+Vite 8, AI챗봇, TTS, 2300+단어) |
| **eip** | - | **4.5/5** | ★ 신규 프로젝트 - 정보처리 종합 학습 (Tailwind 4, Monaco Editor, CBT시험, 코딩실습) |
| **teaching** | - | **4/5** | ★ 신규 프로젝트 - AI 교수학습 도구 (멀티AI, 5형식 내보내기, 교육학 이론) |
| **전체** | - | - | Phase 1: npm audit 보안 수정, metadata 보완, deploy 스크립트 추가 |

---

## 핵심 개선 권고사항

### 1. 코드 중복 해소 (최우선)
- Type A (LMS 4개): 공통 모듈 패키지 추출 → ~60% 코드 절감
- Type C (어학 2개): 공통 베이스 추출 → ~90% 코드 절감
- Type E (풀스택 3개): communityService/lectureService 공유

### 2. TypeScript 전환
- 30개 프로젝트가 순수 JavaScript → TypeScript 마이그레이션 필요
- english/japanese/reactStudy/webstudy: @types/react 이미 설치, ESLint 구성 완료 → 전환 준비 상태
- 우선순위: 결제 연동 프로젝트 (competency, edu-hub, career, allthat, papers)

### 3. 테스트 코드 확대
- 34개 중 31개 테스트 부재 (edu-hub은 인프라만 보유)
- 우선순위: 결제/인증 로직 유닛 테스트

### 4. CSS 최적화
- dark-mode.css (~1,200줄), responsive.css (~1,300줄) 반복
- CSS Modules 또는 Tailwind 통합 검토

### 5. supabase.js 리팩토링
- 여러 프로젝트에서 600~754줄 단일 파일
- 기능별 서비스 모듈로 분할 필요

### 6. 동적 라우팅 도입
- java-study (74라우트), koreatech (60라우트) 등
- 개별 파일 → `/lessons/:weekId` 동적 라우팅 전환

### 7. 접근성(a11y) 개선
- ARIA 레이블, 키보드 네비게이션 부재
- skip-nav는 allthat만 적용

### 8. 버전 현대화
- koreait: React 18→19, Tailwind 3→4, Supabase 2.45→2.99
- ahp_basic: Vite 5.4→7+, React 18→19
- aebon: React 18→19

---

> 이 보고서는 소스코드 심층 분석을 기반으로 작성되었습니다.
> 각 프로젝트의 src/ 폴더 구조, package.json, 라우팅 설정, 주요 컴포넌트/훅을 직접 분석했습니다.
> Phase 1 개선사항(2026-03-25) 및 edu-hub/career/어학 사이트 업데이트(2026-03-26) 반영.
> 신규 3개 프로젝트(korean, eip, teaching) 추가 평가(2026-03-26).
