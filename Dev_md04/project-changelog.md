# 프로젝트별 변경 이력 (2026-03-30 ~ 2026-04-05)

**작성일**: 2026-04-05 (최종 갱신)
**작업자**: Claude Opus 4.6

---

## 전체 작업 타임라인

### 2026-03-30: SEO 개선 + License 추가 + Batch 0~2

#### SEO 일괄 개선 (40개 프로젝트)
- robots.txt, sitemap.xml 생성
- 404.html (SPA redirect) 추가
- twitter:card, canonical URL, meta robots 추가
- og:image 누락 프로젝트 보완

#### MIT License 일괄 추가 (40개 리포지토리)
- 5개 배치로 나누어 모든 리포지토리에 LICENSE 파일 추가

#### TypeScript 마이그레이션 시작
- **Batch 0** (competency): 52개 pages + 10개 components .jsx → .tsx
- **Batch 1** (aebon, reactStudy, webstudy): 가장 단순한 프로젝트 완료
- **Batch 2** (docs, templete-ref, reserve, algorithm, data-structure): 소규모 Supabase 프로젝트 완료

### 2026-03-31: Batch 3~4

#### Batch 3 완료
- db-study, linux-study, english, japanese, korean
- 학습 사이트 특유의 대규모 페이지 파일 처리
- linux-study: Exam/Progress/Community 관련 대형 파일들

#### Batch 4 진행
- **presentation**: 완료/배포
- **digitalbiz**: Context 파일 4개 수동 재작성 (AuthContext, ThemeContext, LanguageContext, ToastContext), 78 files changed
- **eip**: 58 files changed, 211 TS 에러 수정 (CodeEditor, PassPrediction, MockTest 등)
- **self-branding**: 160+ files, supabase.ts .catch() 패턴 수정
- **teaching**: AIChecklist.tsx(1070줄), PromptPractice.tsx, Resources.tsx 대형 파일

### 2026-04-01: Batch 4 완료 + 문서화

#### self-branding 완료
- 마지막 6개 에러 수정 (Lectures.tsx, WebsiteWrite.tsx)
- 빌드/커밋/푸시/배포

#### teaching 완료
- 120개 에러 (3개 파일: PromptPractice.tsx, Resources.tsx, AIChecklist.tsx) 전부 수정
- 빌드/커밋/푸시/배포

### 2026-04-04: Supabase 접두어 마이그레이션 + 긴급 수정

#### Supabase 테이블 접두어 마이그레이션 (14개 프로젝트)
공유 Supabase 인스턴스에서 프로젝트 간 테이블 충돌 방지를 위해 고유 접두어 적용:
- **koreatech** (kt_): posts, comments, members, quiz_results, attendance
- **digitalbiz** (digb_): posts, comments, members
- **marketing** (mkt_): posts, comments, members
- **self-branding** (brand_): posts, comments, members, lectures, resources, websites, portfolios 등
- **uxdesign** (ux_): posts, comments, members, projects
- **gemini** (gemini_): posts, comments
- **coding** (coding_): posts, comments
- **docs** (docs_): documents, members
- **koreait** (ki_): posts, comments, members, quiz_results
- **edu-hub** (eh_): posts, comments, members, courses
- **reserve** (rsv_): reservations, services, settings, schedules
- **allthat** (at_): posts, comments, members
- **papers** (pp_): posts, comments, members
- **competency** (comp_): posts, comments, members, assessments
- SQL 마이그레이션 스크립트: `07_Supabase_접두어_마이그레이션.md` 참조
- 전체 14개 프로젝트 빌드 성공 후 gh-pages 배포 완료

#### CNAME 누락 수정 (4개 프로젝트)
GitHub Pages 커스텀 도메인 미작동 문제 해결:
- **korean**: `public/CNAME` → `korean.dreamitbiz.com`
- **english**: `public/CNAME` → `english.dreamitbiz.com`
- **japanese**: `public/CNAME` → `japanese.dreamitbiz.com`
- **gemini**: `public/CNAME` → `gemini.dreamitbiz.com`
- 4개 모두 빌드 + 배포 완료

#### CSS/UI 긴급 개선 (3개 프로젝트)

**docs** (평가 UI/UX 4/10 → 개선):
- glassmorphism 디자인 시스템 전면 적용
- 14개 CSS 파일 수정/생성 (+664줄)
- base.css, hero.css, category.css, document.css, navbar.css, footer.css
- animations.css, dark-mode.css, responsive.css, site.css
- auth.css, toast.css, viewer.css
- index.html: Pretendard 폰트 추가
- 배포 완료

**reserve** (평가 UI/UX 4/10 → 개선):
- admin.css: +470줄 (관리자 대시보드, 예약 관리, dark mode, responsive)
- site.css: +358줄 (캘린더 UI, 예약 카드, 그라데이션, 접근성)
- 배포 완료

**digitalbiz** (SPA 라우팅 문제):
- CSS는 이미 koreatech과 동일 수준 (템플릿 기반)
- 실제 문제: GitHub Pages SPA redirect handler 누락
- index.html에 `/?/path` 쿼리스트링 디코딩 스크립트 추가
- 배포 완료

#### genspark Supabase 통합 (신규 기능)
- 인증 시스템: Google OAuth, Kakao OAuth, 이메일 로그인/회원가입
- AuthContext, Login.jsx, Register.jsx 생성
- 커뮤니티 게시판: CRUD (목록, 상세, 작성, 수정, 삭제)
- Supabase 클라이언트: supabase.js, auth.js, posts.js
- `genspark-supabase-setup.sql` 수동 실행 (Supabase Dashboard)
  - genspark_posts, genspark_comments 테이블
  - RLS 정책, 인덱스, updated_at 트리거, view_count RPC
- 배포 완료

#### TypeScript 마이그레이션 (별도 VS Code)
- **python-study**: strict TS 마이그레이션 완료
- **c-study**: strict TS 마이그레이션 완료
- **java-study**: strict TS 마이그레이션 완료

### 2026-04-05: 인증 시스템 점검 + OG 이미지 통일 + 파비콘 생성

#### 인증 시스템 전체 점검 및 수정 (9개 프로젝트)
36개 인증 프로젝트 전수 조사 후 P0/P1/P2 이슈 일괄 수정:

**P0 (치명적 — 기능 미작동):**
- **career**: OAuth redirectTo 누락, `career_profiles` → `user_profiles` 테이블명 수정, 프로필 생성 로직 추가
- **software, ai-data, ai-prompt**: signUp 후 user_profiles 프로필 생성 누락 수정
- **koreait**: signUp 후 user_profiles 프로필 생성 누락 수정
- **ahp_basic**: signUp 후 user_profiles 프로필 생성 누락 수정

**P1 (중요 — 일관성/보안):**
- **software, ai-data, ai-prompt**: signUp 메타데이터 `display_name` → `full_name` 통일
- **koreait, teaching, digitalbiz**: AuthContext에 OAuth 메서드(signInWithGoogle/signInWithKakao) 미노출 → 노출
- **digitalbiz**: Register 페이지에 Google/Kakao OAuth 버튼 추가
- **competency**: 비밀번호 정책 6자 → 8자+영문+숫자 강화 (Register, InviteRegister)

**P2 (개선 — 도메인 추적):**
- **career, software, ai-data, ai-prompt, koreait, ahp_basic**: onAuthStateChange SIGNED_IN 이벤트에서 visited_sites 배열 자동 추적
- Supabase `user_profiles` 테이블에 `signup_domain`, `visited_sites`, `last_sign_in_at` 컬럼 추가 (수동 SQL 실행 완료)

전체 9개 프로젝트 빌드/커밋/푸시/배포 완료.

#### OG 이미지 생성 및 메타 태그 통일 (49개 프로젝트)
sharp 0.34.5로 1200×630 PNG OG 이미지 일괄 생성 + 배포:

**5가지 컬러 테마:**
- **Dark Blue** (#0A1628): www, competency, career, koreatech, koreait, teaching, edu-hub, self-branding (8개)
- **Deep Navy** (#0F172A): ai-prompt, ai-data, ai-media, ai-agents, chatgpt, claude, gemini, genspark, fine-tuning (9개)
- **Midnight Teal** (#042F2E): python-study, java-study, c-study, db-study, linux-study, english, japanese, korean, algorithm, data-structure, coding (11개)
- **Dark Indigo** (#1E1B4B): digitalbiz, marketing, uxdesign, presentation, eip, planning, planning-extract (7개)
- **Dark Slate** (#0C0A09): docs, reserve, allthat, papers, software, openclaw, autowork, ahp_basic, aebon, reactStudy, webstudy, templete-ref, hohai, html, jdy, vibe (16개)

**OG 태그 수정 내역:**
- 누락 og:image 추가 (4개): koreait, papers, linux-study, planning-extract
- SVG → PNG 교체 (3개): data-structure, docs, allthat
- 비표준 경로 통일 (12개): teaching, autowork, openclaw, chatgpt, claude, fine-tuning, gemini, genspark, ai-media, edu-hub, competency, www
- 전체 OG 태그 신규 추가 (2개): templete-ref, vibe
- og:site_name 추가 (1개): hohai

49개 프로젝트 빌드/커밋/푸시/배포 완료 (vibe, planning-extract 제외).

#### 파비콘 생성 (7개 프로젝트)
sharp로 SVG + PNG(32×32, 192×192) + ICO(48×48) 일괄 생성:

| 프로젝트 | 라벨 | 배경색 | 액센트 | 조치 |
|----------|------|--------|--------|------|
| koreait | KIT | #0A1628 | #3B82F6 | 파일 생성 + 태그 추가 |
| genspark | GS | #0F172A | #F59E0B | 파일 생성 + 태그 추가 |
| chatgpt | GPT | #10A37F | #FFFFFF | 파일 생성 + 태그 신규 |
| english | EN | #042F2E | #2DD4BF | 재생성 + 태그 추가 |
| eip | EIP | #1E1B4B | #A78BFA | 파일 생성 + 태그 수정 |
| aebon | AB | #0C0A09 | #F97316 | 파일 생성 + 태그 신규 |
| html | HTML | #E44D26 | #FFFFFF | 파일 생성 + 태그 신규 |

7개 프로젝트 빌드/커밋/푸시/배포 완료.

---

## 프로젝트별 상세 변경 내역

### competency (Batch 0)
- **변경**: .jsx → .tsx (52 pages, 10 components)
- **커밋**: TypeScript strict mode migration
- **배포**: gh-pages

### aebon (Batch 1)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **특이사항**: Supabase/라우터 없는 단순 구조

### reactStudy (Batch 1)
- **변경**: 전체 .jsx → .tsx
- **특이사항**: 라우터만 사용

### webstudy (Batch 1)
- **변경**: 전체 .jsx → .tsx

### docs (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **커밋/배포**: 완료

### templete-ref (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### reserve (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### algorithm (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### data-structure (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### db-study (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### linux-study (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **특이사항**: Exam, Progress, Community 관련 대형 파일

### english (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### japanese (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### korean (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### presentation (Batch 4)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **커밋/배포**: 완료

### digitalbiz (Batch 4)
- **변경**: 78 files, 619 insertions, 336 deletions
- **주요 작업**: 4개 Context 파일 완전 재작성 (타입 인터페이스 추가)
- **커밋**: dea1d9a "Migrate to TypeScript with strict mode"
- **배포**: 완료

### eip (Batch 4)
- **변경**: 58 files, 450 insertions, 210 deletions
- **주요 작업**: CodeEditor Props, PassPrediction 타입, MockTest 상태 타입, CertTypeKey export
- **커밋**: 18cebc9 "fix: resolve all 211 TypeScript errors"
- **배포**: 완료

### self-branding (Batch 4)
- **변경**: ~160 files
- **주요 작업**:
  - Context 4개 재작성 (Auth, Theme, Language, Toast)
  - supabase.ts .catch() → try/catch (6개소)
  - 페이지 unused var 정리, 상태 타입 지정
- **커밋**: fe49ce7 "Migrate to TypeScript with strict mode"
- **배포**: 완료

### teaching (Batch 4)
- **변경**: ~170 files
- **주요 작업**: Context, utils, hooks, config 완료. 3개 대형 페이지 파일 (PromptPractice, Resources, AIChecklist) 수정
- **상태**: 완료 (120 에러 → 0 에러)
- **커밋/배포**: 완료

### koreatech (Supabase 접두어)
- **변경**: Supabase 테이블명 kt_ 접두어 적용
- **배포**: 2026-04-04

### digitalbiz (Supabase 접두어 + SPA fix)
- **변경**: Supabase 테이블명 digb_ 접두어 + SPA redirect handler
- **배포**: 2026-04-04

### marketing (Supabase 접두어)
- **변경**: Supabase 테이블명 mkt_ 접두어 적용
- **배포**: 2026-04-04

### uxdesign (Supabase 접두어)
- **변경**: Supabase 테이블명 ux_ 접두어 적용
- **배포**: 2026-04-04

### gemini (Supabase 접두어 + CNAME)
- **변경**: Supabase 테이블명 gemini_ 접두어 + CNAME 추가
- **배포**: 2026-04-04

### coding (Supabase 접두어)
- **변경**: Supabase 테이블명 coding_ 접두어 적용
- **배포**: 2026-04-04

### koreait (Supabase 접두어)
- **변경**: Supabase 테이블명 ki_ 접두어 적용
- **배포**: 2026-04-04

### edu-hub (Supabase 접두어)
- **변경**: Supabase 테이블명 eh_ 접두어 적용
- **배포**: 2026-04-04

### allthat (Supabase 접두어)
- **변경**: Supabase 테이블명 at_ 접두어 적용
- **배포**: 2026-04-04

### papers (Supabase 접두어)
- **변경**: Supabase 테이블명 pp_ 접두어 적용
- **배포**: 2026-04-04

### docs (CSS 개선)
- **변경**: 14개 CSS 파일 (+664줄), glassmorphism, dark mode, responsive
- **배포**: 2026-04-04

### reserve (CSS 개선)
- **변경**: admin.css (+470줄), site.css (+358줄), dark mode, responsive
- **배포**: 2026-04-04

### genspark (Supabase 통합)
- **변경**: 인증 시스템 + 커뮤니티 게시판 전체 구현
- **신규 파일**: supabase.js, auth.js, posts.js, AuthContext.jsx, Login.jsx, Register.jsx, auth.css, admin.js
- **SQL**: genspark-supabase-setup.sql (수동 실행 완료)
- **배포**: 2026-04-04
