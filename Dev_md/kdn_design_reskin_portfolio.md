# 메인 사이트 KDN(Hanbit) 디자인 리스킨 + 포트폴리오 개편

> 작업일: 2026-06-27 ~ 06-28

## 1. 개요

Claude Design으로 제작한 **KDN(Hanbit University College) 디자인 시스템**을 www 메인 사이트(홈·헤더·푸터)에 적용하고, 포트폴리오 "기타 프로젝트" 섹션을 실제 납품 교육 사이트 쇼케이스로 개편했다. **콘텐츠·기능은 그대로 두고 디자인만 변경**(design-only reskin)하는 원칙으로 진행.

> 참고: 처음엔 NOVAWORKS 디자인을 시도했으나 톤이 맞지 않아 롤백 후, 더 정제된 KDN(네이비/블루 institutional) 디자인으로 재진행함.

## 2. KDN 디자인 리스킨 (홈·헤더·푸터)

- 디자인 토큰: 딥네이비 `#1B2A4A` · 로열블루 `#0046C8` · 네이비→블루 히어로 그라데이션 · Pretendard · Font Awesome 6.5.2. → `src/styles/kdn.css` 신규(토큰 + 컴포넌트 레이어), `index.html`에 Pretendard·FA CDN 추가.
- **CSS-first 리스킨**: 기존 클래스(`.navbar`·`.section-title`·`.service-card`·`.portfolio-card` 등)를 재스타일링해 마크업·콘텐츠·기능(검색·장바구니·언어·테마토글·컬러피커·인증·모바일메뉴·캐러셀)을 그대로 보존.
- 헤더: 상단 네이비 유틸리티 바 + 메인 내비, 액센트 언더라인, KDN 드롭다운, 그라데이션 로그인 버튼.
- 히어로: 네이비→블루 그라데이션, 정제된 대형 타이틀, 액센트 룰 섹션 타이틀, KDN 서피스 카드.
- 푸터: 네이비. 이모지(`★ → ✉ ‹ ›`) → Font Awesome 아이콘. 다크 테마 보존.

## 3. 히어로 장식 효과 제거

- `HeroBackground.tsx`의 떠다니는 사각 박스/도형(`GeometricBg`)·입자(`ParticlesBg`) JS 장식 제거 → 클린 그라데이션 히어로. 배경은 `.hero { background: var(--hero-bg) }` CSS가 담당하므로 영향 없음.

## 4. 상단 메뉴 정리

- `Navbar.tsx` menuItems: **"홈" 삭제**, **회사소개를 맨 앞**으로 이동.
- 순서: 회사소개 · IT서비스 · R&D · 컨설팅 · 교육 · 출판 · 쇼핑몰 · 커뮤니티. (로고 클릭 = 홈 유지)

## 5. 다크 모드 섹션 대비 개선

- 문제: 다크 테마에서 카드 배경(`--bg-light-gray #1F2937`)이 섹션 밴드와 같은 색이라 카드가 묻힘(특히 후기 밴드).
- 해결: `kdn.css` 다크 블록에서 홈 서비스·포트폴리오·후기 카드를 **elevated 서피스(`#27314A`) + 테두리(`#3A4663`) + 그림자**로 분리, hover 강조. 액센트 텍스트(태그·링크·회사명·통계)를 밝은 블루로.

## 6. 포트폴리오 "기타 프로젝트" → "드림아이티비즈 교육사이트"

- 섹션 제목: `기타 프로젝트` → **`드림아이티비즈(DreamIT Biz) 교육사이트`**, 부제 갱신.
- 기존 generic placeholder 6개(중소기업 리뉴얼·E커머스·브랜딩·교육·컨설팅·출판) **전체 삭제**.
- **실제 납품/운영 사이트 6개를 클릭 가능한 스크린샷 카드로 추가**(클릭 시 새 탭):
  | 카드 | URL |
  |------|-----|
  | 다스코 생성형 AI 교육 | dasco.dreamitbiz.com |
  | 조선대학교 교원 교육 | chosun.dreamitbiz.com |
  | 휴넷 AI 홍보 실무 워크숍 | contents.dreamitbiz.com |
  | 서울과학기술대학교 생성형 AI 강의 | seoultech.dreamitbiz.com |
  | DreamIT 부트캠프(28챕터 146강) | bootcamp.dreamitbiz.com |
  | DreamIT 디자인 샘플 갤러리 | sample.dreamitbiz.com |
- 카드 렌더: `project.img` 있으면 `<img>`, `project.url` 있으면 `<a target=_blank>`. `Portfolio.tsx`만 수정.

### 스크린샷 캡처 방법(재현용)
- 로컬 Playwright Chromium(`~/Library/Caches/ms-playwright/chromium-1228/...`)으로 라이브 사이트를 `--window-size=1280,800 --virtual-time-budget`로 캡처 → `react-source/public/assets/images/portfolio/<name>.png`.
- **라이트 모드 강제**: 시간기반 auto 테마는 `TZ=UTC`(낮시간)로 캡처. 자체 테마 저장(localStorage) 사이트는 **CDP(DevTools Protocol)** 로 테마키를 light 설정 후 리로드 캡처 — 예: sample은 `localStorage['sample-gallery-theme']='light'`.
- 이미지는 `public/` → 빌드 시 `dist/assets/images/portfolio/`로 복사 → 배포 시 gh-pages `assets/images/`에 추가(기존 이미지 보존).

## 7. 배포

- 라이브는 **gh-pages 브랜치** 서빙(main root 미사용). 모든 변경은 ① main(소스+빌드) ② gh-pages(`index.html`+`assets` js/css 교체, **`assets/images`·CNAME 보존**)로 배포.
- 매 빌드 `.env`(VITE_IMP_CODE·VITE_PG_PROVIDER) 포함 → 결제 청크에 PortOne 값 인라인 확인(결제 깨짐 방지).

## 8. 주의 — 캐시

- GitHub Pages는 CDN 캐시가 있어 배포 후에도 이전 화면이 보일 수 있음. 확인 시 **강력 새로고침(⌘+Shift+R)** 또는 시크릿 창. (검증은 `?cb=` 캐시버스터 + Playwright 클린 캡처로 수행)
