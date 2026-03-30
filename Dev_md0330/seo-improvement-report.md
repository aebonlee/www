# 전체 웹 프로젝트 SEO 개선 작업 보고서

**작성일**: 2026-03-31
**작업자**: Claude Opus 4.6

---

## 1. 개요

DreamIT 전체 45개 웹 프로젝트 중 40개 배포 프로젝트에 대해 SEO 기본 요소를 일괄 개선하는 작업입니다.

### 작업 전 현황

| SEO 항목 | 보유율 | 비고 |
|----------|--------|------|
| CNAME | 90%+ | 대부분 보유 |
| meta description | 90%+ | 대부분 보유 |
| og:title/description | ~80% | 일부 누락 |
| og:image | ~75% | 일부 누락 |
| twitter:card | ~15% | 대부분 없음 |
| robots.txt | ~10% | 거의 없음 |
| sitemap.xml | ~5% | 거의 없음 |
| 404.html (SPA redirect) | ~40% | 절반 이상 없음 |
| canonical URL | ~10% | 거의 없음 |
| meta robots | ~10% | 거의 없음 |

### 목표 현황 (작업 후)

모든 배포 프로젝트에서 위 항목 100% 보유

---

## 2. 제외 대상 (5개)

| 프로젝트 | 사유 |
|----------|------|
| database_test | 개발 테스트용 |
| ahp_app | CNAME 없음, 미배포 |
| ahp | CNAME 없음, 미배포 |
| jdy | CNAME 없음, 미배포 |
| pbi | 불확실 |

---

## 3. 작업 대상 (40개)

### Vite+React 프로젝트 (38개)
edu-hub, openclaw, ai-media, autowork, career, competency, allthat, papers, teaching, coding, ai-prompt, ai-data, software, python-study, linux-study, db-study, data-structure, algorithm, marketing, self-branding, uxdesign, digitalbiz, koreatech, english, japanese, korean, presentation, reactStudy, webstudy, eip, reserve, docs, templete-ref, c-study, java-study, aebon, ahp_basic, koreait, hohai

### Next.js 프로젝트 (2개)
pbirobot, books

### 이미 완비된 프로젝트 (스킵)
- **ai-media**: robots.txt, sitemap.xml, 404.html, 전체 OG/Twitter 태그 완비
- **autowork**: robots.txt, sitemap.xml, 404.html, 전체 OG/Twitter 태그 완비

---

## 4. 프로젝트별 작업 내용

### 4.1 robots.txt (신규 생성)
```
User-agent: *
Allow: /

Sitemap: https://{domain}/sitemap.xml
```

### 4.2 sitemap.xml (신규 생성)
- 각 프로젝트의 라우터 파일 분석하여 공개 경로 나열
- 홈(/) = priority 1.0, 주요 페이지 = 0.8, 보조 페이지 = 0.6
- changefreq: 홈=weekly, 콘텐츠=monthly, 커뮤니티=daily

### 4.3 404.html (GitHub Pages SPA 리다이렉트)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{사이트명}</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

### 4.4 index.html 메타태그 보강
부족한 항목만 추가 (기존 태그 유지):
- `<meta name="robots" content="index, follow" />`
- `<link rel="canonical" href="https://{domain}/" />`
- `<meta property="og:type" content="website" />`
- `<meta property="og:url" content="https://{domain}/" />`
- `<meta property="og:site_name" content="{사이트명}" />`
- `<meta property="og:locale" content="ko_KR" />`
- `<meta property="og:image:width" content="1200" />`
- `<meta property="og:image:height" content="630" />`
- Twitter 카드 메타태그 전체 (summary_large_image)

---

## 5. 프로젝트 도메인/사이트명 매핑

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

---

## 6. 배치 실행 계획

| 배치 | 프로젝트 | 상태 |
|------|----------|------|
| Batch 1 | edu-hub, openclaw, career, allthat, papers, teaching, coding, ai-prompt | 진행중 |
| Batch 2 | ai-data, software, python-study, linux-study, db-study, data-structure, algorithm, marketing | 대기 |
| Batch 3 | self-branding, uxdesign, digitalbiz, koreatech, english, japanese, korean, presentation | 대기 |
| Batch 4 | reactStudy, webstudy, eip, reserve, docs, templete-ref, c-study, java-study | 대기 |
| Batch 5 | aebon, ahp_basic, koreait, hohai, competency | 대기 |
| Batch 6 | books, pbirobot (Next.js) | 대기 |

---

## 7. 검증 방법

1. `npx vite build` 성공 확인
2. `https://{domain}/robots.txt` 접근 가능 확인
3. `https://{domain}/sitemap.xml` 접근 가능 확인
4. 카카오톡/슬랙 링크 미리보기 OG 이미지 표시 확인
