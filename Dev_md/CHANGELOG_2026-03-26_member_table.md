# Changelog — 2026-03-26

## 회원 관리 v2 + 테이블 격리 마이그레이션

### 1. 회원 관리 재구성 (Member Management v2)

#### 목적
모든 하위 도메인 사이트에서 회원의 가입 사이트, 방문 사이트, 마지막 활동일을 추적하여
www 관리자 패널에서 통합 회원 관리가 가능하도록 재구성.

#### DB 변경 (Supabase)
- `user_profiles.last_active_at` 컬럼 추가 (TIMESTAMPTZ)
- `check_user_status` RPC 개선:
  - 매 호출 시 `last_active_at` 자동 갱신
  - `visited_sites` 배열에 현재 도메인 자동 추가
  - `signup_domain` 자동 설정 (최초 가입 시)
  - 정지 기간 만료 시 자동 복구
- 인덱스 추가: `idx_user_profiles_last_active_at`, `idx_user_profiles_signup_domain`

#### 코드 변경

**www 관리자 패널 (AdminUsers.jsx)**
- SITE_OPTIONS: 13개 → 37개 사이트 확장 (core, education, programming, IT/certs, AI/data, business, language, misc 카테고리)
- getSiteColor: 37개 사이트별 색상 매핑 추가
- 테이블에 `last_active_at` 컬럼 추가 (상대 시간 표시: 오늘, 어제, N일 전)

**subsite-template (AuthContext.jsx)**
- `visited_sites` 자동 추적 추가
- `SIGNED_IN` 이벤트 시 `last_sign_in_at` 갱신

**25+ 하위 사이트 AuthContext 일괄 업데이트**

Category A- (4개 — visited_sites 추가):
- koreatech, allthat, reserve, papers

Mid-pattern (4개 — visited_sites + last_sign_in_at 추가):
- self-branding, marketing, uxdesign, digitalbiz

Independent pattern (9개 — handlePostAuth 패턴 + check_user_status 추가):
- competency, koreait, docs, ahp_basic, linux-study, english, ai-data, software, eip

Remaining (8개 — 사이트별 고유 패턴에 맞춰 적용):
- ai-prompt, career, teaching, korean, japanese, python-study, java-study, c-study

---

### 2. 테이블 격리 마이그레이션 (Table Isolation)

#### 목적
여러 하위 사이트가 동일한 Supabase 테이블을 접두어 없이 공유하여 데이터가 혼재되는 문제 해결.

#### 감사 결과
- **CRITICAL**: 5개 템플릿 사이트(koreatech, marketing, digitalbiz, self-branding, uxdesign)가 9개 테이블을 도메인 필터링 없이 공유
- **HIGH**: orders, board_posts, gallery_items 등 6개 테이블이 2-4개 사이트에서 중복 사용
- **OK**: ai-data(ad_), ai-prompt(ap_), teaching(teaching_), hohai(hohai_), eip(sb_), career(career_), books(pub_) — 이미 접두어 사용

#### 해결 방식
테이블 이름 변경 대신 `site_domain TEXT` 컬럼 추가 (멀티테넌트 방식):
- 기존 데이터 보존
- 코드 변경 최소화
- 점진적 적용 가능

#### DB 변경 (Supabase)
15개 공유 테이블에 `site_domain` 컬럼 + 인덱스 추가:
- Part 1 (템플릿 9개): posts, comments, lectures, gallery, gallery_comments, portfolio, portfolio_comments, websites, websites_comments
- Part 2 (기타 6개): orders, order_items, board_posts, gallery_items, blog_posts, products

#### 코드 변경

**5개 템플릿 사이트 (supabase.js)**
- koreatech, marketing, digitalbiz, self-branding, uxdesign
- `const SITE_DOMAIN = window.location.hostname;` 추가
- 모든 SELECT 쿼리에 `.eq('site_domain', SITE_DOMAIN)` 필터 추가
- 모든 INSERT에 `site_domain: SITE_DOMAIN` 자동 삽입

**subsite-template**
- `searchStorage.js`: blog_posts, board_posts, gallery_items 검색에 site_domain 필터
- `supabase.js`: 주문 생성 시 site_domain 포함

---

### 3. 수정 파일 목록

| 프로젝트 | 파일 | 변경 내용 |
|----------|------|----------|
| www | Dev_md/migration_member_management_v2.sql | last_active_at + RPC 마이그레이션 |
| www | Dev_md/migration_table_isolation.sql | site_domain 컬럼 마이그레이션 |
| www | Dev_md/table_naming_audit.md | 테이블 네이밍 감사 보고서 |
| www | Dev_md/CHANGELOG_2026-03-26_member_table.md | 이 문서 |
| www | subsite-template/src/contexts/AuthContext.jsx | visited_sites + last_sign_in_at |
| www | subsite-template/src/utils/searchStorage.js | site_domain 필터 |
| www | subsite-template/src/utils/supabase.js | orders site_domain |
| www | react-source/src/pages/admin/AdminUsers.jsx | 37개 사이트 + last_active_at |
| koreatech | src/utils/supabase.js | site_domain 필터 (16개 함수) |
| koreatech | src/contexts/AuthContext.jsx | visited_sites 추적 |
| marketing | src/utils/supabase.js | site_domain 필터 |
| marketing | src/contexts/AuthContext.jsx | visited_sites + check_user_status |
| digitalbiz | src/utils/supabase.js | site_domain 필터 |
| digitalbiz | src/contexts/AuthContext.jsx | visited_sites + check_user_status |
| self-branding | src/utils/supabase.js | site_domain 필터 |
| self-branding | src/contexts/AuthContext.jsx | visited_sites + check_user_status |
| uxdesign | src/utils/supabase.js | site_domain 필터 |
| uxdesign | src/contexts/AuthContext.jsx | visited_sites + check_user_status |
| allthat ~ c-study (19개) | src/contexts/AuthContext.jsx | domain tracking + check_user_status |

---

### 4. 모범 사례 참조 (접두어 사용 사이트)

| 사이트 | 접두어 | 예시 |
|--------|--------|------|
| ai-data | ad_ | ad_posts, ad_comments, ad_lectures |
| ai-prompt | ap_ | ap_workbooks, ap_lectures |
| teaching | teaching_ | teaching_syllabi, teaching_board_posts |
| hohai | hohai_ | hohai_poems, hohai_songs |
| eip | sb_ | sb_profiles, sb_study_progress |
| career | career_ | career_profiles, career_notifications |
| books | pub_ | pub_gallery_items, pub_reports |
