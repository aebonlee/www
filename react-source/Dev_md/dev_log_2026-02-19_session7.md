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

---

## 세션 28: 카카오 로그인 완료 — KOE205 에러 해결

### 문제 해결 과정

카카오 로그인 시 **KOE205** 에러 발생 → 3단계 해결:

| 단계 | 문제 | 해결 |
|------|------|------|
| 1 | Supabase에 Client Secret 미등록 | Supabase Dashboard에서 직접 변경 |
| 2 | 카카오 로그인 Redirect URI 미등록 | **앱 설정 → 플랫폼** 에서 `https://hcmgdztsgjvzcyxyayaj.supabase.co/auth/v1/callback` 등록 |
| 3 | 동의항목 `profile_image`, `profile_nickname` 미설정 | **카카오 로그인 → 동의항목** 에서 프로필 정보 동의 활성화 |

**결과**: 카카오 로그인 정상 작동 확인 완료.

### 카카오 Developers 최종 설정 요약

| 항목 | 값 |
|------|-----|
| 앱 ID | 1389048 |
| REST API 키 (Client ID) | `c71805c94a02e91c2c1ea4ff50c0d159` |
| 클라이언트 시크릿 | `MarqHiHS1z9Inlq8KGDn2ka7eLgSROBc` |
| 카카오 로그인 | 활성화 ON |
| Redirect URI | `https://hcmgdztsgjvzcyxyayaj.supabase.co/auth/v1/callback` |
| 동의항목 | 프로필 정보(닉네임/사진) + 이메일 |

---

## 세션 29: 네비바 로그인 버튼 위치 이동

**커밋**: `99fcc72` fix: 로그인 버튼을 테마(낮/밤) 오른쪽으로 이동

### 변경 내용

네비바 `nav-actions` 영역 내 요소 순서 변경.

| Before | After |
|--------|-------|
| 유저아이콘/로그인 → 장바구니 → 언어 → 컬러 → 테마 → 모바일토글 | 장바구니 → 언어 → 컬러 → 테마 → **유저아이콘/로그인** → 모바일토글 |

---

## 세션 30: 로그인 페이지 구글 스타일 전면 리디자인

**커밋**: `e31addf` feat: 로그인 페이지를 구글 스타일로 전면 리디자인

### 디자인 컨셉

구글 로그인 페이지와 동일한 **2-step 카드형 UI**:

**Step 1 — 로그인 방법 선택**
- DreamIT Biz 로고
- "로그인" 제목 + "계정에 로그인하세요" 부제
- Google / Kakao / Email 3개 버튼 (왼쪽 아이콘 + 텍스트)
- 하단 "계정이 없으신가요? 회원가입" 링크

**Step 2 — 이메일 로그인 (Email 클릭 시)**
- 이메일 + 비밀번호 입력 필드
- "뒤로" / "로그인" 버튼 (좌우 배치)

### 신규 CSS 클래스

| 클래스 | 용도 |
|--------|------|
| `.auth-fullpage` | 전체 화면 중앙 배치 (min-height: calc(100vh - 70px)) |
| `.auth-center-wrapper` | max-width 420px 래퍼 |
| `.auth-card-google` | 구글 스타일 카드 (둥근 모서리, 가벼운 그림자) |
| `.auth-logo-area` | DreamIT Biz 로고 영역 |
| `.auth-heading` | 얇은 폰트(400) 제목 |
| `.auth-methods` | 로그인 방법 버튼 그룹 |
| `.auth-method-btn` | 개별 로그인 방법 버튼 (아이콘 + 텍스트) |
| `.auth-email-form` | 이메일 입력 폼 |
| `.auth-form-actions` | 뒤로/로그인 버튼 행 |
| `.auth-back-btn` | 텍스트형 뒤로 버튼 |
| `.auth-next-btn` | primary 색상 로그인 버튼 |
| `.auth-bottom-link` | 하단 회원가입 링크 |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/pages/Login.jsx` | 전면 재작성 — step 상태 관리, 2단계 UI |
| `src/styles/auth.css` | 구글 스타일 CSS 추가 (기존 Register용 스타일 보존) |
| `src/utils/translations.js` | `auth.back` 번역 키 추가 (ko: '뒤로', en: 'Back') |

---

## 금일 커밋 이력 (세션 7 전체)

| 순서 | 커밋 해시 | 내용 |
|------|----------|------|
| 1 | `40eb110` | feat: 종합 기능 개발 — 인증, 블로그/갤러리/스토어 CRUD, 주문이력 |
| 2 | `d054506` | deploy: 네이버 로그인 제거 + OAuth 프로바이더 설정 완료 |
| 3 | `d81d9d8` | deploy: 최신 빌드를 루트로 배포 |
| 4 | `f151236` | docs: 세션 4 개발일지 업데이트 |
| 5 | `663e6c1` | docs: Dev_md 누락 문서 10개 통합 |
| 6 | `b3753fe` | deploy: Dev_md 문서 통합 후 최신 빌드 배포 |
| 7 | `e5e776f` | fix: 네비바 유저 표시를 이름 첫글자 원형 아이콘으로 변경 |
| 8 | `3098de8` | deploy: 유저 아이콘 간소화 빌드 배포 |
| 9 | `28684cc` | fix: 사용자 드롭다운 메뉴 디자인 개선 — 아이콘 + 유저 헤더 추가 |
| 10 | `8665544` | deploy: 사용자 드롭다운 메뉴 디자인 개선 빌드 배포 |
| 11 | `99fcc72` | fix: 로그인 버튼을 테마(낮/밤) 오른쪽으로 이동 + 세션7 개발일지 |
| 12 | `add02d7` | deploy: 로그인 버튼 위치 이동 + 개발일지 빌드 배포 |
| 13 | `e31addf` | feat: 로그인 페이지를 구글 스타일로 전면 리디자인 |
| 14 | `0608d00` | deploy: 구글 스타일 로그인 페이지 빌드 배포 |
| 15 | `d576152` | docs: 세션7 개발일지 업데이트 |
| 16 | `c242980` | fix: Login/Register 레이아웃 + Navbar 로그인 버튼 개선 |

---

## 세션 31: Login/Register 레이아웃 수정 + Navbar 로그인 버튼 개선

**커밋**: `c242980` fix: Login/Register 페이지 레이아웃 + Navbar 로그인 버튼 개선

### 문제점

1. **CSS 충돌**: `auth-section auth-fullpage` 이중 클래스 사용 시, `.auth-section`이 CSS 파일 뒤에 선언되어 `.auth-fullpage`의 `min-height`, `padding`을 덮어씌움 → 로그인/회원가입 페이지가 navbar-footer 사이에 여백 없이 짧게 표시
2. **Navbar 밑줄**: "로그인" 텍스트에 링크 밑줄이 표시됨
3. **일관성 부족**: Login은 fullpage 카드 레이아웃인데 Register는 page-header + auth-section 구식 레이아웃

### 해결

| 파일 | 변경 |
|------|------|
| `src/pages/Login.jsx` | `auth-section auth-fullpage` → `auth-fullpage`만 사용 (CSS 충돌 제거) |
| `src/pages/Register.jsx` | Login과 동일한 fullpage 카드 레이아웃으로 전면 재작성 — `auth-fullpage` + `auth-card-google` + `auth-email-form` |
| `src/styles/auth.css` | `.auth-fullpage`: `min-height: 100vh`, `padding-top: calc(var(--nav-height) + 40px)` — navbar 오프셋 반영 |
| `src/styles/auth.css` | `.auth-btn-full`: 전체 너비 버튼 변형 클래스 추가 |
| `src/styles/auth.css` | `.nav-login-btn`: `border-radius: 20px`, `text-decoration: none !important`, `::after { display: none }` — 밑줄 완전 제거 + 라운드 버튼 |
| `src/styles/auth.css` | 모바일 반응형 `.auth-fullpage` 패딩 조정 |
| `src/components/layout/Navbar.jsx` | 로그인 버튼 텍스트: `{t('auth.login')}` → **"Login"** (영어 고정) |
| `src/components/layout/Navbar.jsx` | 드롭다운 로그아웃: `{t('auth.logout')}` → **"Logout"** (영어 고정) |

### Register 페이지 신규 레이아웃

```
┌─────────────────────────────┐
│      DreamIT Biz 로고        │
│      회원가입 제목            │
│      부제                    │
│  ┌─────────────────────────┐│
│  │ 이름 입력                ││
│  │ 이메일 입력              ││
│  │ 비밀번호 입력            ││
│  │ 비밀번호 확인            ││
│  │ [    회원가입 버튼   ]   ││
│  └─────────────────────────┘│
│  이미 계정이 있으신가요? 로그인│
└─────────────────────────────┘
```

---

## 세션 32: 다크모드 유저 드롭다운 + CSS 로딩 버그 수정

**커밋**: `ff5c104` fix: 유저 드롭다운 다크모드 + 애니메이션 수정
**커밋**: `b8451a7` fix: Navbar 유저 메뉴 CSS를 전역 로딩 navbar.css로 이동

### 문제점

1. **다크모드 드롭다운**: `.nav-user-dropdown`에 다크모드 스타일 없어 흰 배경에 흰 글씨 → 내용 불가시
2. **애니메이션 충돌**: `tooltip-fade-in` 키프레임에 `translateX(-50%)`가 있어 드롭다운이 왼쪽으로 밀림
3. **CSS 로딩 버그 (핵심)**: 유저 아바타 원형(`.nav-user-avatar-placeholder`) + 풍선 드롭다운(`.nav-user-dropdown`) 스타일이 `auth.css`에만 존재 → `auth.css`는 Login/Register/MyPage 등 lazy-loaded 페이지에서만 import → **Home 등 다른 페이지에서 CSS 미로딩** → 작은 네모 + 깨진 드롭다운

### 해결

| 변경 | 상세 |
|------|------|
| `dark-mode.css` | 드롭다운 다크모드 스타일 추가 (배경 `#1F2937`, 텍스트 `#F9FAFB`, 화살표 등) |
| `dark-mode.css` | auth 페이지 다크모드 스타일 추가 (카드, 입력필드, 소셜 버튼 등) |
| `auth.css` → `navbar.css` | `.nav-user-menu`, `.nav-user-btn`, `.nav-user-avatar-placeholder`, `.nav-user-dropdown` (화살표 포함), `@keyframes user-dropdown-fade`, `.dropdown-user-header/avatar/info/name/email`, `.dropdown-menu-item` (호버/로그아웃 변형), `.nav-user-dropdown .divider`, `.nav-login-btn` (+호버/::after) — **전부 navbar.css로 이동** |
| `navbar.css` | 모바일 반응형 `.nav-user-avatar-placeholder` (28px) 추가 |
| `auth.css` | 이동된 스타일 전부 제거, auth 페이지 전용 스타일만 유지 |

### 원인 분석

```
index.css → @import './styles/navbar.css'  → 전역 로딩 (모든 페이지)
Login.jsx → import '../styles/auth.css'    → lazy 로딩 (해당 페이지만)
```

Vite가 lazy-loaded 페이지의 CSS import를 코드 스플리팅하여 `auth-*.css` 번들은 Login 등 접근 시에만 로드됨. Navbar는 모든 페이지에 존재하므로 관련 CSS는 전역 번들에 있어야 함.

---

## 세션 33: 종합 사이트 점검 + 평가보고서 + 갤러리 수정/삭제 UI 완성

**커밋**: `dddad5f` docs: 종합 평가보고서 작성
**커밋**: `0b91c33` feat: 갤러리 관리자 수정/삭제 버튼 추가

### 전체 사이트 점검

4개 병렬 탐색 에이전트로 전 영역 점검 실시:
- 블로그 CRUD: 100% 완성 확인
- 갤러리 CRUD: 70% — **수정/삭제 UI 버튼 미구현 발견**
- 게시판 CRUD: 95% 완성 확인
- 스토어 DB 전환: 90% 완성 확인
- 인증 시스템: 95% 완성 확인
- 라우팅 33개: 100% 정상 확인
- CSS/다국어/테마: 90%+ 정상 확인

### 평가보고서 작성

`Dev_md/evaluation_report_2026-02-19.md` 저장 — 8개 섹션, 295행의 종합 평가

### 갤러리 수정/삭제 UI 완성

| 파일 | 변경 |
|------|------|
| `Gallery.jsx` | `handleDelete()` — 확인 다이얼로그 + 삭제 + 목록 즉시 갱신 |
| `Gallery.jsx` | `handleEdit()` — stopPropagation + navigate |
| `Gallery.jsx` | 카드 하단: 관리자용 연필/휴지통 아이콘 버튼 |
| `Gallery.jsx` | 라이트박스 내: "수정"/"삭제" 텍스트 버튼 |
| `community.css` | `.gallery-admin-actions`, `.lightbox-admin-actions` 스타일 |

**갤러리 CRUD 완성도: 70% → 100%**

---

## 세션 34: Phase B 품질 개선 — 다국어, AuthGuard, 비밀번호 재설정

### 작업 내역

평가보고서 Phase B 권장 작업 4건 일괄 구현:

#### B4: Contact.jsx 다국어 적용
- `translations.js`에 `contactPage.*` 키 추가 (ko/en 양쪽)
- `Contact.jsx`에 `useLanguage()` 훅 적용, 모든 하드코딩 텍스트 → `t()` 함수로 교체
- 주소/전화/영업시간에 `white-space: pre-line` 적용으로 줄바꿈 보존

#### B5: 게시판 write/edit 라우트에 AuthGuard 추가
- `App.jsx`의 `/community/board/write`, `/community/board/edit/:id` 라우트에 `<AuthGuard>` 래핑
- 비로그인 상태에서 글쓰기 접근 시 로그인 페이지로 리다이렉트

#### B6: 비밀번호 재설정 페이지 구현
- `auth.js`에 `resetPassword(email)` 함수 추가 (Supabase `resetPasswordForEmail`)
- `ForgotPassword.jsx` 신규 생성 — Google 스타일 카드 UI, 전송 완료 시 성공 메시지
- `translations.js`에 `auth.forgotPassword*` 키 추가 (ko/en)
- `App.jsx`에 `/forgot-password` 라우트 + lazy import 추가
- `Login.jsx`에 이메일 입력 단계 하단 "비밀번호를 잊으셨나요?" 링크 추가

#### B7: products 테이블 빈 데이터 폴백 보강
- `productStorage.js`의 `getProducts()`: DB가 빈 배열 반환 시에도 `fallbackProducts`로 폴백하도록 수정

### 수정/생성 파일

| 파일 | 변경 |
|------|------|
| `src/utils/translations.js` | `contactPage.*`, `auth.forgotPassword*` ko/en 키 추가 |
| `src/pages/Contact.jsx` | 전면 다국어 적용 (useLanguage + t()) |
| `src/App.jsx` | Board write/edit AuthGuard 추가, ForgotPassword lazy import + 라우트 |
| `src/utils/auth.js` | `resetPassword()` 함수 추가 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 — 비밀번호 재설정 페이지 |
| `src/pages/Login.jsx` | 비밀번호 찾기 링크 추가 |
| `src/utils/productStorage.js` | 빈 결과 폴백 로직 보강 |

---

## 세션 35: Phase C UX 보강 — 토스트 알림, 에러 UI, 업로드 진행률

### 작업 내역

평가보고서 Phase C 권장 작업 3건 일괄 구현:

#### C8: 토스트 알림 시스템 구현
- `src/contexts/ToastContext.jsx` 신규 — 외부 의존성 없이 커스텀 구현
  - `showToast(message, type, duration)` API 제공 (success/error/info/warning)
  - 자동 해제 타이머 (기본 4초) + 수동 닫기 버튼
  - SVG 아이콘 4종 (체크/X/정보/경고)
- `src/styles/toast.css` 신규 — 슬라이드-인 애니메이션, 좌측 색상 보더
- `App.jsx`에 `<ToastProvider>` 래핑
- `dark-mode.css`에 다크모드 토스트 스타일 추가
- 기존 `alert()` 2건 교체:
  - `ImageUpload.jsx` 업로드 에러 → `showToast(err.message, 'error')`
  - `Gallery.jsx` 삭제 에러 → `showToast(msg, 'error')`
- 모바일 반응형: 480px 이하에서 하단 풀폭 표시

#### C9: OrderHistory 에러 상태 UI
- `OrderHistory.jsx` 전면 리팩토링:
  - `error` 상태 추가 + 에러 발생 시 빨간 X 아이콘 + 메시지 + 재시도 버튼
  - `loadOrders()` 콜백으로 분리하여 재시도 가능
  - 에러 발생 시 토스트 알림도 동시 표시
  - 로딩 텍스트 다국어 적용 (`t('community.loading')`)
- `translations.js`에 `auth.orderLoadError`, `auth.retry` 키 추가 (ko/en)

#### C10: 이미지 업로드 진행률 표시 개선
- `ImageUpload.jsx`:
  - `progress` 상태 추가 + 시뮬레이션 프로그레스 바 (0→90% 자동, 완료 시 100%)
  - 기존 "업로드 중..." 텍스트 → 프로그레스 바 + 퍼센트 표시로 교체
  - 업로드 완료 시 성공 토스트 알림
- `toast.css`에 `.upload-progress-*` 스타일 포함
- `translations.js`에 `auth.uploadComplete` 키 추가 (ko/en)

### 수정/생성 파일

| 파일 | 변경 |
|------|------|
| `src/contexts/ToastContext.jsx` | **신규** — 토스트 Context + Provider + useToast 훅 |
| `src/styles/toast.css` | **신규** — 토스트 + 프로그레스 바 스타일 |
| `src/index.css` | `@import './styles/toast.css'` 추가 |
| `src/App.jsx` | `ToastProvider` import + 래핑 |
| `src/components/ImageUpload.jsx` | 진행률 바 + 토스트 교체 |
| `src/pages/Gallery.jsx` | alert → showToast 교체 |
| `src/pages/OrderHistory.jsx` | 에러 UI + 재시도 + 토스트 연동 |
| `src/utils/translations.js` | uploadComplete, orderLoadError, retry 키 추가 |
| `src/styles/dark-mode.css` | `.toast-item` 다크모드 스타일 추가 |

---

## 세션 36: 평가보고서 업데이트

**커밋**: `8174b2a` docs: 평가보고서 업데이트 — Phase A/B/C 완료 반영 (88% → 98%)

### 작업 내역

`Dev_md/evaluation_report_2026-02-19.md` 전면 업데이트:

- **종합 완성도**: 88% → **98%** 상향
- 영역별 평가 전수 갱신 (갤러리 70→100%, 인증 95→100%, 게시판 95→100% 등)
- 이슈 9건 → **전건 해결** (Phase A/B/C별 해결 이력 정리)
- 신규 섹션 추가: UX 시스템 (3.5), 해결 이슈 이력 (4), 커밋 이력 (8)
- 파일 구조: 34개 라우트, 39개 페이지, 18개 CSS, ToastContext/ForgotPassword 등 반영
- 남은 작업: 선택적 품질 개선 5건만 (DB 데이터 마이그레이션, 이미지 최적화 등)

---

## 프로젝트 현재 상태

### 완료된 기능

- [x] 5색 테마 시스템 (블루/레드/그린/퍼플/오렌지)
- [x] 다크모드/라이트모드/오토 전환
- [x] 한/영 다국어 지원
- [x] Hero 캐러셀 (4슬라이드, 모바일 대응)
- [x] Supabase DB 연동 (게시판/블로그/갤러리/상품/주문)
- [x] Google 소셜 로그인
- [x] Kakao 소셜 로그인
- [x] 이메일 회원가입/로그인
- [x] 블로그 CRUD (관리자 전용)
- [x] 갤러리 CRUD + 이미지 업로드 + 수정/삭제 UI (관리자 전용)
- [x] 스토어 DB 전환 + 상품 관리 + 판매완료
- [x] 게시판 인증 연동 (본인/관리자 수정/삭제)
- [x] 주문 이력 + 마이페이지
- [x] 장바구니 → 결제 (PortOne V2)
- [x] 네비바 유저 아이콘 (첫글자 원형)
- [x] 드롭다운 메뉴 디자인 (아이콘 + 헤더)
- [x] 로그인 페이지 구글 스타일 리디자인 (2-step UI)
- [x] 회원가입 페이지 fullpage 카드 레이아웃 통일
- [x] Navbar "Login" 라운드 버튼 (밑줄 제거)
- [x] Navbar "Logout" 풍선 드롭다운 메뉴
- [x] 다크모드 유저 드롭다운 대응
- [x] 유저 메뉴 CSS 전역 로딩 수정 (navbar.css로 이동)
- [x] 종합 평가보고서 작성 (evaluation_report_2026-02-19.md)
- [x] Contact.jsx 다국어 적용 (ko/en)
- [x] 게시판 write/edit AuthGuard 적용
- [x] 비밀번호 재설정 페이지 (ForgotPassword.jsx)
- [x] products 빈 테이블 폴백 보강
- [x] 토스트 알림 시스템 (커스텀, 외부 의존성 없음)
- [x] OrderHistory 에러 상태 UI + 재시도 버튼
- [x] 이미지 업로드 진행률 바 + 완료 토스트
- [x] 모바일 타이포그래피 & 여백 최적화 (가독성 개선)

---

## 세션 37: 모바일 최적화 — 타이포그래피 & 여백 가독성 개선

### 작업 배경

모바일에서 영역(마진, 패딩)과 폰트(크기, 자간, 줄간)의 가독성 개선 요청.

### 작업 내역

`src/styles/responsive.css`에 768px 및 480px 브레이크포인트에 종합적인 모바일 최적화 규칙 추가:

#### 768px (태블릿/모바일) 추가 규칙

**타이포그래피:**
- `body` letter-spacing: `-0.01em` → `0` (음수 자간 해제, 모바일 가독성 향상)
- `body` line-height: `1.7` → `1.75` (줄간 여유 확보)
- `h1~h4` 줄간·자간 각각 모바일에 맞게 완화
- `.section-subtitle` 15px, `.hero-description` line-height 1.8
- 콘텐츠 영역 line-height 전반 1.85로 상향 (블로그, 게시판, 리뷰, 어바웃, 서비스 상세)

**여백 축소:**
- 주요 섹션 padding: `80px 0` → `48px 0` (shop, cart, checkout, order, contact, service-detail, auth, cta, footer)
- `.section-header` margin-bottom: `72px` → `40px`
- 카드 패딩 일괄 축소: service/feature/pricing/design/value/vision/review/info-box/contact-form/category/course/highlight/company-detail/order-history
- `.hero` min-height auto + padding-bottom 56px

**그리드 gap 축소:**
- services/portfolio/blog/values/reviews/pricing: `32px` → `20px`

#### 480px (소형 모바일) 추가 규칙

**타이포그래피:**
- `body` line-height: `1.8` (더 관대한 줄간)
- `.hero-title`: `34px` → `26px`, line-height 1.3
- `.section-title`: `28px` → `24px`
- `.page-title`: `28px` → `24px`
- `.page-header` padding 축소 (상단/하단 28px)
- 카드별 제목·본문 폰트 사이즈 세분화:
  - service h3: 20px, feature h3: 18px, value h3: 18px, pricing h3: 20px
  - blog h3: 16px, category h3: 18px, course h4: 16px, design h3: 18px
  - vision h3: 20px, timeline h4: 16px, lightbox h3: 18px, auth heading: 20px
- 본문 텍스트: 대부분 14-15px로 통일
- `.blog-detail-content`, `.board-detail-body`: line-height 1.9 (긴 글 최적)

**여백 축소:**
- 섹션 padding: `48px 0` → `36px 0`
- 카드 패딩: `28px 20px` → `24px 16px` (service/feature/value/pricing/design/review/category/vision/contact-form)
- `.auth-card-google`: `32px 24px` → `24px 16px`
- `.cart-summary/checkout-summary`: `28px` → `20px`
- 푸터: `48px 0 24px` → `36px 0 20px`

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/styles/responsive.css` | 768px: +50 규칙, 480px: +80 규칙 (모바일 타이포그래피·여백·가독성) |

### 커밋 & 배포
- `npx vite build` 성공
- `dist/*` → `D:/www/` 배포 완료

---

## 세션 38: SEO + 마케팅 인프라 고도화 (6단계)

### 작업 배경

DreamIT Biz React SPA(33페이지)가 **HashRouter** 사용 중이라 검색엔진 크롤러가 홈 이외 페이지를 인덱싱 불가. OG 이미지, 동적 타이틀, sitemap, 애널리틱스 등 SEO 필수 요소가 모두 누락된 상태에서 한국(네이버) + 글로벌(Google) 양쪽 검색 노출을 위한 핵심 SEO 인프라 구축.

### 6단계 구현 내역

| 단계 | 내용 | 상태 |
|------|------|------|
| Step 1 | **HashRouter → BrowserRouter 전환** + vite base `/` + SPA decode script + CNAME | 완료 |
| Step 2 | **react-helmet-async + SEOHead 컴포넌트** + HelmetProvider 래핑 | 완료 |
| Step 3 | **index.html 메타 태그 보강** — OG image/locale/site_name, Twitter Card, canonical, theme-color, 네이버 인증, GA4, JSON-LD (Organization + WebSite) | 완료 |
| Step 4 | **robots.txt + sitemap.xml** — 공개 24 URL, 비공개 7 URL Disallow | 완료 |
| Step 5 | **usePageTracking 훅** — GA4 SPA 페이지뷰 추적 + App.jsx 내 PageTracker 컴포넌트 | 완료 |
| Step 6 | **페이지별 SEOHead 삽입** — 공개 13개 (title+description+path) + 비공개 7개 (noindex) | 완료 |

### 신규 파일 (5개)

| # | 파일 | 용도 |
|---|------|------|
| 1 | `src/components/SEOHead.jsx` | 재사용 SEO 메타 컴포넌트 (title, description, canonical, OG, Twitter, noindex, 다국어 lang) |
| 2 | `src/hooks/usePageTracking.js` | GA4 SPA 페이지뷰 추적 (location 변경 시 gtag event 전송) |
| 3 | `public/robots.txt` | 크롤러 지시 (Allow + Disallow + Sitemap URL) |
| 4 | `public/sitemap.xml` | 검색엔진 URL 목록 (24개, priority/changefreq 포함) |
| 5 | `public/assets/images/og-default.svg` | OG 공유 이미지 템플릿 (1200×630, 브랜드 블루 그라데이션) |

### 신규 의존성 (1개)

| 패키지 | 용도 | 크기 |
|--------|------|------|
| `react-helmet-async` | 동적 meta/title 관리 | ~5KB gzipped |

### 수정 파일 (24개)

| 파일 | 변경 |
|------|------|
| `src/App.jsx` | HashRouter→BrowserRouter, usePageTracking import, PageTracker 컴포넌트 추가 |
| `src/main.jsx` | HelmetProvider import + `<App />` 래핑 |
| `index.html` | OG image/width/height/locale/site_name, Twitter Card, canonical, theme-color, 네이버 인증 placeholder, GA4 placeholder (`G-XXXXXXXXXX`), JSON-LD Organization + WebSite, SPA decode script, favicon href `/` 기준 |
| `vite.config.js` | `base: './'` → `base: '/'` |
| `public/CNAME` | **신규** — `www.dreamitbiz.com` |
| `src/pages/Home.jsx` | SEOHead 추가 (path="/") |
| `src/pages/Services.jsx` | SEOHead 추가 (title="IT 서비스") |
| `src/pages/Consulting.jsx` | SEOHead 추가 (title="컨설팅") |
| `src/pages/ConsultingBusiness.jsx` | SEOHead 추가 (title="기업 컨설팅") |
| `src/pages/ConsultingUniversity.jsx` | SEOHead 추가 (title="대학 컨설팅") |
| `src/pages/ConsultingInstitution.jsx` | SEOHead 추가 (title="교육기관 컨설팅") |
| `src/pages/Education.jsx` | SEOHead 추가 (title="교육 서비스") |
| `src/pages/EducationCustom.jsx` | SEOHead 추가 (title="맞춤 교육") |
| `src/pages/Publishing.jsx` | SEOHead 추가 (title="출판 서비스") |
| `src/pages/RnD.jsx` | SEOHead 추가 (title="연구개발") |
| `src/pages/Portfolio.jsx` | SEOHead 추가 (title="포트폴리오") |
| `src/pages/About.jsx` | SEOHead 추가 (title="회사소개") |
| `src/pages/CeoProfile.jsx` | SEOHead 추가 (title="대표 소개") |
| `src/pages/History.jsx` | SEOHead 추가 (title="연혁") |
| `src/pages/Contact.jsx` | SEOHead 추가 (title="문의하기") |
| `src/pages/Shop.jsx` | SEOHead 추가 (title="스토어") |
| `src/pages/Blog.jsx` | SEOHead 추가 (title="블로그") |
| `src/pages/Board.jsx` | SEOHead 추가 (title="게시판") |
| `src/pages/Gallery.jsx` | SEOHead 추가 (title="갤러리") |
| `src/pages/Login.jsx` | SEOHead noindex 추가 + Fragment 래핑 |
| `src/pages/Register.jsx` | SEOHead noindex 추가 + Fragment 래핑 |
| `src/pages/ForgotPassword.jsx` | SEOHead noindex 추가 + Fragment 래핑 |
| `src/pages/MyPage.jsx` | SEOHead noindex 추가 |
| `src/pages/Cart.jsx` | SEOHead noindex 추가 |
| `src/pages/Checkout.jsx` | SEOHead noindex 추가 |
| `src/pages/OrderConfirmation.jsx` | SEOHead noindex 추가 |

### index.html 추가된 SEO 요소

| 요소 | 내용 |
|------|------|
| OG image | `https://www.dreamitbiz.com/assets/images/og-default.png` (1200×630) |
| OG locale | `ko_KR` + alternate `en_US` |
| OG site_name | `DreamIT Biz` |
| Twitter Card | `summary_large_image` |
| Canonical | `https://www.dreamitbiz.com/` |
| Theme Color | `#0046C8` |
| 네이버 인증 | placeholder (`VERIFICATION_CODE`) |
| GA4 | placeholder (`G-XXXXXXXXXX`) |
| JSON-LD | Organization (name, logo, contactPoint) + WebSite (name, url) |

### 빌드 검증

- `npx vite build` 성공 (158 모듈, 4.17초)
- dist/ 출력: robots.txt, sitemap.xml, CNAME, 404.html, og-default.svg 모두 포함
- SEOHead 컴포넌트 별도 청크: `SEOHead-BM77U57q.js` (1.08KB, gzip 0.60KB)

### 사용자 후속 작업 (필수)

1. GA4 Measurement ID: `G-XXXXXXXXXX` → 실제 ID 교체
2. 네이버 인증 코드: `VERIFICATION_CODE` → searchadvisor.naver.com 발급 코드 교체
3. OG 이미지: `og-default.svg` → 1200×630 PNG 변환 후 `og-default.png`으로 저장
4. 네이버 Search Advisor: 사이트 인증 후 sitemap.xml 제출
5. Google Search Console: 사이트 등록 + sitemap.xml 제출

### 프로젝트 현재 상태

- [x] SEO 인프라 — BrowserRouter + 동적 타이틀/메타 + sitemap + robots.txt
- [x] 소셜 공유 — OG + Twitter Card 전 페이지 대응
- [x] 구조화 데이터 — JSON-LD Organization + WebSite
- [x] 애널리틱스 — GA4 SPA 페이지뷰 추적 (ID 교체 필요)
- [x] 검색엔진 — 네이버/구글 인증 placeholder + sitemap (코드 교체 필요)
