# 개발 로그 - 2026-02-19 (세션 7)

## 작업자: Claude Opus 4.6

---

## 세션 22: 종합 기능 개발 6 Phase 완료 (인증 + CRUD + 주문)

**커밋**: `40eb110` feat: 종합 기능 개발 — 인증, 블로그/갤러리/스토어 CRUD, 주문이력

### 개발 개요

DreamIT Biz React SPA에 **인증 시스템이 전무**하고, 블로그·갤러리는 읽기 전용, 스토어 상품은 하드코딩 JS 파일 정의 상태에서 다음 6개 Phase를 일괄 구현.

### 6 Phase 구현 내역

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 0 | **인증 시스템** — Supabase Auth + Google/Kakao 소셜 로그인 + 이메일 가입 | 완료 |
| Phase 1 | **블로그 CRUD** — 관리자 전용 글쓰기/수정/삭제 | 완료 |
| Phase 2 | **갤러리 CRUD** — 이미지 업로드 + Supabase Storage | 완료 |
| Phase 3 | **스토어 DB 전환** — 하드코딩 → DB + 상품 관리 + 판매완료 | 완료 |
| Phase 4 | **게시판 인증 연동** — 로그인 글쓰기, 본인/관리자 수정/삭제 | 완료 |
| Phase 5 | **주문 이력 + 마이페이지** — user_id 연동, 주문 조회 | 완료 |

### 신규 파일 (15개)

| # | 파일 | Phase | 용도 |
|---|------|-------|------|
| 1 | `src/contexts/AuthContext.jsx` | 0 | 세션 관리, 로그인/로그아웃, 프로필, isAdmin |
| 2 | `src/utils/auth.js` | 0 | signInWithGoogle/Kakao, signInWithEmail, signUp, signOut |
| 3 | `src/components/AuthGuard.jsx` | 0 | 인증 필요 라우트 래퍼 |
| 4 | `src/components/AdminGuard.jsx` | 0 | 관리자 전용 라우트 래퍼 |
| 5 | `src/pages/Login.jsx` | 0 | 소셜 로그인 2종 + 이메일/비밀번호 폼 |
| 6 | `src/pages/Register.jsx` | 0 | 이메일 회원가입 폼 |
| 7 | `src/pages/MyPage.jsx` | 0 | 프로필 조회/수정 |
| 8 | `src/styles/auth.css` | 0 | 로그인/가입/마이페이지 스타일 |
| 9 | `src/pages/BlogWrite.jsx` | 1 | 블로그 글쓰기/수정 폼 |
| 10 | `src/pages/GalleryWrite.jsx` | 2 | 갤러리 등록/수정 + 이미지 업로드 |
| 11 | `src/components/ImageUpload.jsx` | 2 | 재사용 이미지 업로드 (드래그앤드롭) |
| 12 | `src/utils/storage.js` | 2 | Supabase Storage 업로드/삭제 헬퍼 |
| 13 | `src/utils/productStorage.js` | 3 | 상품 CRUD |
| 14 | `src/pages/ProductWrite.jsx` | 3 | 관리자 상품 등록/수정 폼 |
| 15 | `src/pages/OrderHistory.jsx` | 5 | 내 주문 목록 + 상세 보기 |

### Supabase 최종 상태

| 유형 | 내용 |
|------|------|
| 테이블 | `user_profiles`, `products`, `blog_posts`, `board_posts`, `gallery_items`, `orders`, `order_items` (7개) |
| Storage | `media` 버킷 (public: true) |
| RLS 정책 | 22개 |
| 트리거 | `on_auth_user_created` → 프로필 자동 생성 |
| Auth 프로바이더 | Google, Kakao, Email |

---

## 세션 23: OAuth 프로바이더 설정 + 네이버 제거

**커밋**: `d054506` deploy: 네이버 로그인 제거 + OAuth 프로바이더 설정 완료

### 변경 사항

네이버(Naver) 로그인은 Supabase에서 네이티브 미지원으로 확인 → 코드에서 완전 제거.

| 파일 | 변경 |
|------|------|
| `src/utils/auth.js` | `signInWithNaver()` 함수 제거 |
| `src/pages/Login.jsx` | 네이버 로그인 버튼 JSX 제거 |
| `src/styles/auth.css` | `.social-btn.naver` 스타일은 보존 (재사용 가능) |

### Supabase OAuth 설정 완료

| 프로바이더 | Client ID | 상태 |
|-----------|-----------|------|
| Google | `899974314812-...apps.googleusercontent.com` | 정상 작동 |
| Kakao | `c71805c94a02e91c2c1ea4ff50c0d159` | Client Secret 업데이트 |
| Email | (내장) | 정상 작동 |

---

## 세션 24: Dev_md 문서 통합

**커밋**: `663e6c1` docs: Dev_md 누락 문서 10개 통합

### 통합 내역

루트 `D:\www\Dev_md\`에만 존재했던 문서 9개를 `react-source/Dev_md/`로 복사 + 종합 계획서 1개 신규 작성.

| # | 파일 | 내용 |
|---|------|------|
| 1 | `development_plan.md` | React SPA 복원 계획 |
| 2 | `dev_log_2026-02-19_session2.md` | Hero 캐러셀 + 컬러셋 |
| 3 | `color_theme_system_plan.md` | 5색 테마 시스템 계획 |
| 4 | `dev_log_2026-02-19_session3.md` | 컬러 테마 구현 + 팔레트 UI |
| 5 | `community_system_plan.md` | Board/Blog/Gallery CRUD 계획 |
| 6 | `dev_log_2026-02-19_session4.md` | 커뮤니티 CRUD + Hero 핑퐁 |
| 7 | `dev_log_2026-02-19_session5.md` | 텍스트 조정 + 메뉴 개선 |
| 8 | `dev_log_2026-02-19_session6.md` | Supabase 전환 + 디자인 개선 |
| 9 | `2026-02-19_community_design_improvement.md` | 갤러리 카드 + 블로그 매거진 |
| 10 | `comprehensive_dev_plan.md` | **신규** — 6 Phase 종합 개발 계획서 |

---

## 세션 25: 네비바 유저 아이콘 간소화

**커밋**: `e5e776f` fix: 로그인 후 네비바 유저 표시를 이름 첫글자 원형 아이콘으로 변경

### 변경 이유

구글 로그인 후 프로필 사진 + 이름이 함께 표시되어 네비바 디자인이 깨져 보임.

### 변경 내용

| 항목 | Before | After |
|------|--------|-------|
| 아바타 | 프로필 사진 `<img>` + 이름 텍스트 | 이름 첫글자 원형 아이콘만 |
| 크기 | 가변 (사진+텍스트) | 32px 고정 원형 |
| 모바일 | 28px (사진+텍스트) | 28px 원형 |

**수정 파일**: `Navbar.jsx` (아바타 img + name span 제거), `auth.css` (불필요 스타일 정리)

---

## 세션 26: 카카오 로그인 Client Secret 수정

### 문제

카카오 로그인 클릭 시 에러 발생:
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: missing OAuth secret"}
```

### 원인 분석

Supabase에 등록된 카카오 Client Secret이 잘못된 값이었음. 카카오 Developers 콘솔에서 실제 Client Secret을 확인.

### 해결

카카오 Developers 콘솔 경로: **앱 설정 → 앱 → 키 → 클라이언트 시크릿**

| 키 종류 | 값 |
|---------|-----|
| REST API 키 (Client ID) | `c71805c94a02e91c2c1ea4ff50c0d159` |
| 클라이언트 시크릿 | `MarqHiHS1z9Inlq8KGDn2ka7eLgSROBc` |

Supabase Management API를 통해 `EXTERNAL_KAKAO_SECRET` 업데이트 (HTTP 200 응답 확인).

### 카카오 Developers 설정 확인 사항

- **플랫폼**: `https://www.dreamitbiz.com` 등록 필요
- **카카오 로그인 → 일반**: Redirect URI = `https://hcmgdztsgjvzcyxyayaj.supabase.co/auth/v1/callback`
- **동의항목**: 이메일 동의 활성화 필요

---

## 세션 27: 사용자 드롭다운 메뉴 디자인 개선

**커밋**: `28684cc` fix: 사용자 드롭다운 메뉴 디자인 개선 - 아이콘 + 유저 헤더 추가

### 변경 이유

"마이페이지 / 주문 이력 / 로그아웃" 텍스트만 나열된 드롭다운이 밋밋하고 디자인이 안 이쁨.

### 개선 내용

| 항목 | Before | After |
|------|--------|-------|
| 헤더 | 없음 | 아바타 원형 + 이름 + 이메일 표시 |
| 메뉴 아이콘 | 없음 | 마이페이지(사람), 주문 이력(문서), 로그아웃(나가기) SVG 아이콘 |
| 로그아웃 | 기본 색상 | 빨간색 강조 (위험 동작 시각 구분) |
| 카드 디자인 | 180px, 8px padding | 220px, 둥근 모서리, overflow hidden |
| 구분선 | margin 4px | margin 0 (헤더/메뉴 영역 깔끔 분리) |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/components/layout/Navbar.jsx` | 드롭다운에 user-header + SVG 아이콘 메뉴 아이템 추가 |
| `src/styles/auth.css` | `.dropdown-user-header`, `.dropdown-menu-item`, `.logout` 등 새 CSS 규칙 추가 |

---

## 금일 커밋 이력 (세션 7)

| 순서 | 커밋 해시 | 내용 |
|------|----------|------|
| 1 | `40eb110` | feat: 종합 기능 개발 — 인증, 블로그/갤러리/스토어 CRUD, 주문이력 |
| 2 | `d054506` | deploy: 네이버 로그인 제거 + OAuth 프로바이더 설정 완료 |
| 3 | `d81d9d8` | deploy: 최신 빌드를 루트로 배포 |
| 4 | `f151236` | docs: 세션 4 개발일지 업데이트 |
| 5 | `663e6c1` | docs: Dev_md 누락 문서 10개 통합 |
| 6 | `b3753fe` | deploy: Dev_md 문서 통합 후 최신 빌드 배포 |
| 7 | `e5e776f` | fix: 로그인 후 네비바 유저 표시를 이름 첫글자 원형 아이콘으로 변경 |
| 8 | `3098de8` | deploy: 유저 아이콘 간소화 빌드 배포 |
| 9 | `28684cc` | fix: 사용자 드롭다운 메뉴 디자인 개선 — 아이콘 + 유저 헤더 추가 |
| 10 | `8665544` | deploy: 사용자 드롭다운 메뉴 디자인 개선 빌드 배포 |

---

## 프로젝트 현재 상태

### 완료된 기능

- [x] 5색 테마 시스템 (블루/레드/그린/퍼플/오렌지)
- [x] 다크모드/라이트모드/오토 전환
- [x] 한/영 다국어 지원
- [x] Hero 캐러셀 (4슬라이드, 모바일 대응)
- [x] Supabase DB 연동 (게시판/블로그/갤러리/상품/주문)
- [x] Google + Kakao 소셜 로그인 + 이메일 가입
- [x] 블로그 CRUD (관리자 전용)
- [x] 갤러리 CRUD + 이미지 업로드 (관리자 전용)
- [x] 스토어 DB 전환 + 상품 관리 + 판매완료
- [x] 게시판 인증 연동 (본인/관리자 수정/삭제)
- [x] 주문 이력 + 마이페이지
- [x] 장바구니 → 결제 (PortOne V2)
- [x] 네비바 유저 아이콘 (첫글자 원형)
- [x] 드롭다운 메뉴 디자인 (아이콘 + 헤더)

### 확인 필요 사항

- [ ] 카카오 로그인 테스트 (Client Secret 업데이트 후)
- [ ] 카카오 Developers 플랫폼/Redirect URI/동의항목 설정 확인
