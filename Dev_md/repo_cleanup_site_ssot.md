# 리포 루트 정리 + 사이트 목록 SSOT 통합

> 작업일: 2026-06-26

## 1. 배경 — 제기된 3가지 문제점

1. **루트 정리**: 리포 루트에 배포 산출물과 개발 도구가 혼재 — Node 스크립트(`*.js`) 40여 개, TS 마이그레이션 에러 로그(`*-tsc-errors.txt`, `tmp_*_errors.txt`) 39개, 임시 auth json 등.
2. **사이트 목록 분산**: 전체 사이트(120개) 목록이 `siteRegistry.ts`(SSOT)와 별개로 `AdminLinks.tsx`·`RelatedSitesPage.tsx`에 각각 하드코딩되어 수작업 동기화 중.
3. **assets 보존 점검**: gh-pages 루트 배포 시 `assets/images` 누락 위험 확인.

## 2. 루트 정리

- **에러 로그 39개 삭제**: `*-tsc-errors.txt`(20) + `tmp_*_errors.txt`(19) — TS 마이그레이션 완료 후 잔존한 임시 산출물. git 히스토리에 보존되므로 작업트리에서 제거.
- **개발/배포 스크립트 이동**: 루트의 `*.js`·`*.sh`·`*.bat`(44개) + 분석 산출물 `site-evaluation.json`·`site-scores.json` → `scripts/`로 이동. (앱·`index.html`이 참조하지 않음을 확인 후 이동)
- **임시 auth json 추적 해제**: `tmp_auth.json`·`tmp_auth2.json` — 이미 `.gitignore`에 있으나 추적 중이었음 → `git rm --cached`(로컬 파일은 유지).
- **`.gitignore` 보강**: `*-tsc-errors.txt`, `tmp_*_errors.txt`, `tmp_*.json` 패턴 추가로 재발 방지.

→ 루트에는 사이트 발행 파일만 잔존(`index.html`, `404.html`, `assets/`, `CNAME`, `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml`, `sitemap`·구글 인증 파일, `react-source/`, `docs/`, `Dev_md*/`).

## 3. 사이트 목록 SSOT 통합

### 진단 (드리프트 측정)

- **멤버십**: 레지스트리·AdminLinks·RelatedSitesPage 모두 120개로 **이미 일치**(최근 수동 동기화 결과).
- **결제 플래그 드리프트 발견**: `ppt-maker`, `rest06`, `seminar`, `startup` 4개가 AdminLinks=결제 / 레지스트리=비결제로 **충돌**. → 실제 운영(ppt-maker 크레딧·rest06 아임포트 결제) 기준으로 레지스트리가 stale로 판단, **레지스트리를 `hasPayment: true`로 정정**.

### 리팩터 (`siteRegistry.ts`를 단일 사실 소스로)

- **`siteRegistry.ts`**:
  - 4개 사이트 `hasPayment: true`로 수정.
  - `getSite(name)` 추가 — 이름 표기 차이(`ahp_basic` ↔ `ahp-basic`) 흡수하는 단일 조회 진입점.
  - `assertSiteCoverage(label, names)` 추가 — **개발 모드에서만** 페이지 목록과 레지스트리가 어긋나면 콘솔 경고(누락/잉여 사이트 출력).
- **`AdminLinks.tsx`**: 카테고리 멤버십을 **이름 배열**로만 보유, `domain`·결제여부(`pay`)는 `getSite()`로 레지스트리에서 파생. 카테고리 라벨·색상은 관리자 디렉터리 고유 표현이므로 유지.
- **`RelatedSitesPage.tsx`**: 중복되던 `url` 필드 120개 제거 → `getSite()`로 파생. 그룹·이모지·한/영 설명 등 **편집 데이터는 페이지에 유지**(레지스트리에 없는 콘텐츠).

→ 이제 **사이트 추가/결제여부 변경은 `siteRegistry.ts` 한 곳만** 수정. 페이지 동기화 누락은 dev 콘솔 경고로 즉시 노출.

## 4. assets 보존 점검 + 빌드·배포

- 배포 모델: www 루트 = GitHub Pages 발행 대상. 실제 앱은 `react-source/`에서 `vite build` → `dist/`를 루트로 복사(`deploy.cjs` 로직: `index.html` 교체 + 루트 `assets`의 js/css만 교체, **`assets/images` 보존**).
- `npm install` 후 `vite build` 성공 → 루트로 배포(구 js/css 82개 제거, 신규 90개 복사, **images 4개 보존 확인**).
- 루트 `index.html`이 새 빌드 해시(`index-BzkxAXbt.js` / `index-Dr_bReXq.css`) 참조 확인.

## 5. 검증

- 세 목록 멤버십 일치: registry 120 = AdminLinks 120 = RelatedSitesPage 120 (누락·잉여 0).
- `vite build` 성공(타입 컴파일 통과).
- `assets/images` 4개 보존, `CNAME`(www.dreamitbiz.com) 변동 없음.
