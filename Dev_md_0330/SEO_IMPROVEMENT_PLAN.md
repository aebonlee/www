# 전체 웹 프로젝트 SEO 개선 작업

**작성일**: 2026-03-30
**상태**: 진행 중

## 개요

DreamIT Biz 전체 45개 프로젝트 중 40개 배포 프로젝트에 대한 SEO 기본 요소 일괄 개선 작업.
ai-media, autowork만 robots.txt + sitemap.xml을 갖추고 있었고, 나머지 프로젝트는 대부분 부족한 상태였음.

## 조사 결과 (작업 전)

| 항목 | 보유율 | 비고 |
|------|--------|------|
| CNAME | 90%+ | 대부분 있음 |
| index.html meta description | 90%+ | 대부분 있음 |
| og:title/description | ~80% | 일부 누락 |
| og:image | ~75% | 일부 누락 |
| twitter:card | ~15% | 대부분 없음 |
| robots.txt | ~10% | 거의 없음 |
| sitemap.xml | ~5% | 거의 없음 |
| 404.html | ~40% | 절반 이상 없음 |
| canonical URL | ~10% | 거의 없음 |
| meta robots | ~10% | 거의 없음 |

## 작업 내용

각 프로젝트에 대해 아래 4가지 파일 추가/수정:

### 1. `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://{domain}/sitemap.xml
```

### 2. `public/sitemap.xml`
- 각 프로젝트의 라우터를 분석하여 공개 경로 나열
- 홈(/) = priority 1.0, 주요 페이지 = 0.8, 보조 페이지 = 0.6
- changefreq: 홈=weekly, 콘텐츠=monthly, 커뮤니티=daily

### 3. `public/404.html`
- GitHub Pages SPA 리다이렉트 스크립트
- `pathSegmentsToKeep = 0`

### 4. `index.html` 메타태그 보강
부족한 항목만 추가:
- `<meta name="robots" content="index, follow" />`
- `<link rel="canonical" href="https://{domain}/" />`
- `<meta property="og:type" content="website" />`
- `<meta property="og:url" content="https://{domain}/" />`
- `<meta property="og:site_name" content="{사이트명}" />`
- `<meta property="og:locale" content="ko_KR" />`
- `<meta property="og:image:width" content="1200" />`
- `<meta property="og:image:height" content="630" />`
- Twitter 카드 메타 태그 (summary_large_image)

## 작업 대상 프로젝트 (40개)

### 제외 대상 (5개)
- `database_test` — 개발 테스트용
- `ahp_app` — CNAME 없음, 미배포
- `ahp` — CNAME 없음, 미배포
- `jdy` — CNAME 없음, 미배포
- `pbi` — 불확실

### Vite+React 프로젝트 (38개)
edu-hub, openclaw, ai-media, autowork, career, competency, allthat, papers, teaching, coding, ai-prompt, ai-data, software, python-study, linux-study, db-study, data-structure, algorithm, marketing, self-branding, uxdesign, digitalbiz, koreatech, english, japanese, korean, presentation, reactStudy, webstudy, eip, reserve, docs, templete-ref, c-study, java-study, aebon, ahp_basic, koreait, hohai

### Next.js 프로젝트 (2개)
pbirobot, books

## 프로젝트별 도메인/사이트명 매핑

| 프로젝트 | 도메인 | 사이트명 |
|----------|--------|----------|
| edu-hub | edu-hub.dreamitbiz.com | DreamIT Edu Hub |
| openclaw | openclaw.dreamitbiz.com | OpenClaw |
| ai-media | ai-media.dreamitbiz.com | AI Media Lab |
| autowork | autowork.dreamitbiz.com | AutoWork |
| career | career.dreamitbiz.com | Career Navigator |
| competency | competency.dreamitbiz.com | MyCoreCompetency |
| allthat | allthat.dreamitbiz.com | AllThat ESG |
| papers | papers.dreamitbiz.com | Papers |
| teaching | teaching.dreamitbiz.com | Teaching AI |
| coding | coding.dreamitbiz.com | DreamIT 코딩 |
| ai-prompt | ai-prompt.dreamitbiz.com | AI Prompt |
| ai-data | ai-data.dreamitbiz.com | AI Data |
| software | software.dreamitbiz.com | SW Design |
| python-study | python-study.dreamitbiz.com | PyMaster |
| linux-study | linux-study.dreamitbiz.com | Linux Study |
| db-study | db-study.dreamitbiz.com | DB Study |
| data-structure | data-structure.dreamitbiz.com | Data Structure |
| algorithm | algorithm.dreamitbiz.com | Algorithm Study |
| marketing | marketing.dreamitbiz.com | Marketing |
| self-branding | self-branding.dreamitbiz.com | 셀프 브랜딩 마케팅 |
| uxdesign | uxdesign.dreamitbiz.com | 고객경험디자인 |
| digitalbiz | digitalbiz.dreamitbiz.com | Digital Biz |
| koreatech | koreatech.dreamitbiz.com | KoreaTech |
| english | english.dreamitbiz.com | English Pro |
| japanese | japanese.dreamitbiz.com | Japanese Pro |
| korean | korean.dreamitbiz.com | Korean Pro |
| presentation | presentation.dreamitbiz.com | DreamIT 프레젠테이션 |
| reactStudy | reactstudy.dreamitbiz.com | React Study |
| webstudy | webstudy.dreamitbiz.com | Vibe Backend Study |
| eip | eip.dreamitbiz.com | EIP 정보처리 |
| reserve | reserve.dreamitbiz.com | Reserve |
| docs | docs.dreamitbiz.com | Docs Library |
| templete-ref | templete.dreamitbiz.com | DreamIT Books |
| c-study | c-study.dreamitbiz.com | C Programming |
| java-study | java-study.dreamitbiz.com | JavaMaster |
| aebon | aebon.dreamitbiz.com | 이애본 |
| ahp_basic | ahp-basic.dreamitbiz.com | AHP Basic |
| koreait | koreait.dreamitbiz.com | 코리아IT아카데미 |
| hohai | hohai.dreamitbiz.com | 호해 |
| books | books.dreamitbiz.com | DreamIT Books |
| pbirobot | pbirobot.dreamitbiz.com | PBI Robot |

## 배치 구성

- **Batch 1** (8개): edu-hub, openclaw, career, allthat, papers, teaching, coding, ai-prompt
- **Batch 2** (8개): ai-data, software, python-study, linux-study, db-study, data-structure, algorithm, marketing
- **Batch 3** (8개): self-branding, uxdesign, digitalbiz, koreatech, english, japanese, korean, presentation
- **Batch 4** (8개): reactStudy, webstudy, eip, reserve, docs, templete-ref, c-study, java-study
- **Batch 5** (6개): aebon, ahp_basic, koreait, hohai, competency, ai-media(스킵), autowork(스킵)
- **Batch 6** (2개): books, pbirobot (Next.js — 별도 처리)
