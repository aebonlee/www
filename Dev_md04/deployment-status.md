# 전체 프로젝트 배포 현황

**작성일**: 2026-04-05 (최종 갱신)
**작업자**: Claude Opus 4.6

---

## 배포 인프라

| 항목 | 값 |
|------|-----|
| 호스팅 | GitHub Pages (gh-pages) |
| 배포 명령 | `npx gh-pages -d dist` |
| 도메인 | `*.dreamitbiz.com` |
| GitHub 계정 | `aebonlee` |
| 빌드 도구 | Vite 7~8 (React), Next.js 16 (books, pbirobot) |
| DB | Supabase (공유 인스턴스, 프로젝트별 테이블 접두어) |

---

## 프로젝트별 배포 상태 (2026-04-05 기준)

### TypeScript 마이그레이션 완료 + 배포 완료

| # | 프로젝트 | 도메인 | TS 상태 | DB 접두어 | 최근 배포 |
|---|----------|--------|---------|-----------|-----------|
| 1 | competency | competency.dreamitbiz.com | strict TS | comp_ | 2026-04-05 |
| 2 | aebon | aebon.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 3 | reactStudy | react.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 4 | webstudy | webstudy.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 5 | docs | docs.dreamitbiz.com | strict TS | docs_ | 2026-04-05 |
| 6 | templete-ref | templete.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 7 | reserve | reserve.dreamitbiz.com | strict TS | rsv_ | 2026-04-05 |
| 8 | algorithm | algorithm.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 9 | data-structure | datastructure.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 10 | db-study | dbstudy.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 11 | linux-study | linux.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 12 | english | english.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 13 | japanese | japanese.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 14 | korean | korean.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 15 | presentation | presentation.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 16 | digitalbiz | digitalbiz.dreamitbiz.com | strict TS | digb_ | 2026-04-05 |
| 17 | eip | eip.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 18 | self-branding | selfbranding.dreamitbiz.com | strict TS | brand_ | 2026-04-05 |
| 19 | teaching | teaching.dreamitbiz.com | strict TS | — | 2026-04-05 |
| 20 | koreatech | koreatech.dreamitbiz.com | JS | kt_ | 2026-04-05 |
| 21 | marketing | marketing.dreamitbiz.com | JS | mkt_ | 2026-04-05 |
| 22 | uxdesign | uxdesign.dreamitbiz.com | JS | ux_ | 2026-04-05 |
| 23 | gemini | gemini.dreamitbiz.com | JS | gemini_ | 2026-04-05 |
| 24 | coding | coding.dreamitbiz.com | JS | coding_ | 2026-04-05 |
| 25 | koreait | koreait.dreamitbiz.com | JS | ki_ | 2026-04-05 |
| 26 | edu-hub | eduhub.dreamitbiz.com | JS | eh_ | 2026-04-05 |
| 27 | allthat | allthat.dreamitbiz.com | JS | at_ | 2026-04-05 |
| 28 | papers | papers.dreamitbiz.com | JS | pp_ | 2026-04-05 |
| 29 | genspark | genspark.dreamitbiz.com | JS | genspark_ | 2026-04-05 |

### 추가 배포 프로젝트

| # | 프로젝트 | 도메인 | TS 상태 | 최근 배포 |
|---|----------|--------|---------|-----------|
| 30 | career | career.dreamitbiz.com | JS | 2026-04-05 |
| 31 | software | software.dreamitbiz.com | JS | 2026-04-05 |
| 32 | ai-prompt | aiprompt.dreamitbiz.com | JS | 2026-04-05 |
| 33 | ai-data | aidata.dreamitbiz.com | JS | 2026-04-05 |
| 34 | ai-media | aimedia.dreamitbiz.com | JS | 2026-04-05 |
| 35 | ai-agents | aiagents.dreamitbiz.com | JS | 2026-04-05 |
| 36 | chatgpt | chatgpt.dreamitbiz.com | JS | 2026-04-05 |
| 37 | claude | claude.dreamitbiz.com | JS | 2026-04-05 |
| 38 | fine-tuning | finetuning.dreamitbiz.com | JS | 2026-04-05 |
| 39 | openclaw | openclaw.dreamitbiz.com | JS | 2026-04-05 |
| 40 | autowork | autowork.dreamitbiz.com | JS | 2026-04-05 |
| 41 | ahp_basic | ahpbasic.dreamitbiz.com | JS | 2026-04-05 |
| 42 | planning | planning.dreamitbiz.com | JS | 2026-04-05 |
| 43 | hohai | hohai.dreamitbiz.com | TS | 2026-04-05 |

### TypeScript 마이그레이션 완료 (별도 VS Code에서 작업)

| # | 프로젝트 | 도메인 | TS 상태 | 배포 |
|---|----------|--------|---------|------|
| 44 | python-study | python.dreamitbiz.com | strict TS | 2026-04-05 |
| 45 | c-study | cstudy.dreamitbiz.com | strict TS | 2026-04-05 |
| 46 | java-study | java.dreamitbiz.com | strict TS | 2026-04-05 |

### 마이그레이션 대기 (JavaScript)

| # | 프로젝트 | Batch | 비고 |
|---|----------|-------|------|
| 33 | ai-prompt | 6 | |
| 34 | ai-data | 6 | |
| 35 | ai-media | 6 | |
| 36 | software | 6 | |
| 37 | openclaw | 7 | |
| 38 | autowork | 7 | |
| 39 | career | 8 | PortOne V1 |
| 40 | ahp_basic | 9 | 복잡한 AHP 로직 |

### 이미 TypeScript (마이그레이션 불필요)

| # | 프로젝트 | 프레임워크 |
|---|----------|-----------|
| 41 | hohai | React + Vite |
| 42 | books | Next.js 16 |
| 43 | pbirobot | Next.js 16 |

### 기타 (배포 대상 아님)

| 프로젝트 | 비고 |
|----------|------|
| www | 메인 사이트 (정적) |
| Dev_md, Dev_md0320, Dev_md0330, Dev_md04 | 개발 문서 |

---

## 2026-04-04 배포 이력

### Supabase 접두어 마이그레이션 배포 (14개 프로젝트)
코드 내 Supabase 테이블명에 프로젝트별 고유 접두어 적용 후 일괄 배포:
- koreatech (kt_), digitalbiz (digb_), marketing (mkt_), self-branding (brand_)
- uxdesign (ux_), gemini (gemini_), coding (coding_), docs (docs_)
- koreait (ki_), edu-hub (eh_), reserve (rsv_), allthat (at_)
- papers (pp_), competency (comp_)

### CNAME 추가 + 재배포 (4개 프로젝트)
GitHub Pages 커스텀 도메인 CNAME 파일 누락 수정:
- korean, english, japanese, gemini

### CSS/UI 개선 + 재배포 (3개 프로젝트)
- **docs**: glassmorphism, animations, dark mode, responsive (+664줄, 14파일)
- **reserve**: admin 페이지, calendar UI, dark mode (+828줄, 2파일)
- **digitalbiz**: SPA redirect handler 추가 (index.html)

### Supabase 통합 + 배포 (1개 프로젝트)
- **genspark**: 인증(Google/Kakao OAuth + 이메일), 커뮤니티 게시판 CRUD, Supabase 클라이언트
- SQL 스크립트: `genspark-supabase-setup.sql` (수동 실행 완료)

---

## 2026-04-05 배포 이력

### 인증 시스템 수정 + 배포 (9개 프로젝트)
전체 36개 인증 프로젝트 감사 후 P0/P1/P2 이슈 수정:
- **career**: OAuth redirectTo, 테이블명 수정, 프로필 생성, 도메인 추적
- **software, ai-data, ai-prompt**: 프로필 생성, 메타데이터 통일, 도메인 추적
- **koreait**: OAuth 컨텍스트 노출, 프로필 생성, 도메인 추적
- **ahp_basic**: 프로필 생성, 도메인 추적
- **teaching, digitalbiz**: AuthContext OAuth 메서드 노출
- **competency**: 비밀번호 정책 강화 (8자+영문+숫자)

### OG 이미지 생성 + 배포 (49개 프로젝트)
sharp로 1200×630 PNG 일괄 생성, 5가지 컬러 테마 적용:
- 49개 프로젝트 og-image.png 교체/생성
- 22개 프로젝트 index.html OG 메타 태그 수정
- 상세: `08_OG이미지_파비콘_작업내역.md` 참조

### 파비콘 생성 + 배포 (7개 프로젝트)
sharp로 SVG + PNG(32/192) + ICO 생성:
- koreait, genspark, chatgpt, english, eip, aebon, html

### 정적 사이트 (빌드 없이 push만)
- **www**: OG 이미지 교체 (main 브랜치에서 직접 서빙)
- **html, jdy**: OG 이미지 교체 (main 브랜치에서 직접 서빙)
