# 전체 프로젝트 배포 현황

**작성일**: 2026-04-01
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

---

## 프로젝트별 배포 상태 (2026-04-01 기준)

### TypeScript 마이그레이션 완료 + 배포 완료

| # | 프로젝트 | 도메인 | TS 상태 | 최근 배포 |
|---|----------|--------|---------|-----------|
| 1 | competency | competency.dreamitbiz.com | strict TS | 2026-03-30 |
| 2 | aebon | aebon.dreamitbiz.com | strict TS | 2026-03-30 |
| 3 | reactStudy | react.dreamitbiz.com | strict TS | 2026-03-30 |
| 4 | webstudy | webstudy.dreamitbiz.com | strict TS | 2026-03-30 |
| 5 | docs | docs.dreamitbiz.com | strict TS | 2026-03-30 |
| 6 | templete-ref | templete.dreamitbiz.com | strict TS | 2026-03-30 |
| 7 | reserve | reserve.dreamitbiz.com | strict TS | 2026-03-30 |
| 8 | algorithm | algorithm.dreamitbiz.com | strict TS | 2026-03-30 |
| 9 | data-structure | datastructure.dreamitbiz.com | strict TS | 2026-03-30 |
| 10 | db-study | dbstudy.dreamitbiz.com | strict TS | 2026-03-31 |
| 11 | linux-study | linux.dreamitbiz.com | strict TS | 2026-03-31 |
| 12 | english | english.dreamitbiz.com | strict TS | 2026-03-31 |
| 13 | japanese | japanese.dreamitbiz.com | strict TS | 2026-03-31 |
| 14 | korean | korean.dreamitbiz.com | strict TS | 2026-03-31 |
| 15 | presentation | presentation.dreamitbiz.com | strict TS | 2026-03-31 |
| 16 | digitalbiz | digitalbiz.dreamitbiz.com | strict TS | 2026-04-01 |
| 17 | eip | eip.dreamitbiz.com | strict TS | 2026-04-01 |
| 18 | self-branding | selfbranding.dreamitbiz.com | strict TS | 2026-04-01 |

### TypeScript 마이그레이션 진행 중

| # | 프로젝트 | 남은 에러 | 상태 |
|---|----------|-----------|------|
| 19 | teaching | 120 | 수정 중 |

### 마이그레이션 대기 (JavaScript)

| # | 프로젝트 | Batch | 비고 |
|---|----------|-------|------|
| 20 | coding | 5 | |
| 21 | python-study | 5 | |
| 22 | c-study | 5 | |
| 23 | java-study | 5 | |
| 24 | ai-prompt | 6 | |
| 25 | ai-data | 6 | |
| 26 | ai-media | 6 | |
| 27 | software | 6 | |
| 28 | marketing | 6 | |
| 29 | koreatech | 7 | |
| 30 | openclaw | 7 | |
| 31 | autowork | 7 | |
| 32 | uxdesign | 7 | |
| 33 | edu-hub | 8 | PortOne V2 |
| 34 | allthat | 8 | PortOne V2 |
| 35 | papers | 8 | PortOne V2 |
| 36 | career | 8 | PortOne V1 |
| 37 | koreait | 9 | React 18 / Vite 6 |
| 38 | ahp_basic | 9 | 복잡한 AHP 로직 |

### 이미 TypeScript (마이그레이션 불필요)

| # | 프로젝트 | 프레임워크 |
|---|----------|-----------|
| 39 | hohai | React + Vite |
| 40 | books | Next.js 16 |
| 41 | pbirobot | Next.js 16 |

### 기타 (배포 대상 아님)

| 프로젝트 | 비고 |
|----------|------|
| www | 메인 사이트 (정적) |
| Dev_md, Dev_md0320, Dev_md0330, Dev_md04 | 개발 문서 |
