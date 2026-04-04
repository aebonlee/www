# DreamIT Biz - Supabase 테이블 접두어 마이그레이션

**작업일**: 2026-04-04
**작업자**: Claude Opus 4.6
**프로젝트 관리**: Ph.D Aebon Lee, DreamIT Biz
**대상**: 14개 프로젝트 (Supabase 테이블 충돌 해소)

---

## 1. 배경 및 목적

### 1.1 문제 발견

DreamIT Biz의 37개+ 프로젝트가 **단일 Supabase 인스턴스**(`hcmgdztsgjvzcyxyayaj.supabase.co`)를 공유하고 있음. 이 중 14개 프로젝트가 접두어 없이 동일한 bare 테이블명(`posts`, `comments`, `orders` 등)을 사용하여 **데이터 충돌** 발생.

### 1.2 충돌 유형

| 유형 | 설명 | 예시 |
|------|------|------|
| **5중 충돌** | 템플릿 기반 5개 사이트가 동일 9개 테이블 공유 | `posts`, `comments`, `lectures`, `gallery` 등 |
| **3중 충돌** | coding, gemini, docs가 `profiles` 테이블 공유 | `profiles` |
| **2중 충돌** | 여러 프로젝트가 `orders`, `board_posts` 등 공유 | `orders`, `board_posts`, `gallery_items` |

### 1.3 해결 방안

각 프로젝트에 고유 접두어를 부여하여 테이블을 분리. `user_profiles`는 공유 인증 테이블이므로 변경하지 않음.

---

## 2. 접두어 매핑 (14개 프로젝트)

| # | 프로젝트 | 접두어 | 테이블 수 | 방식 | 비고 |
|---|----------|--------|-----------|------|------|
| 1 | koreatech | `kt_` | 9 | CREATE | 템플릿 그룹 |
| 2 | digitalbiz | `digb_` | 9 | CREATE | 템플릿 그룹 |
| 3 | marketing | `mkt_` | 9 | CREATE | 템플릿 그룹 |
| 4 | self-branding | `brand_` | 9 | CREATE | `sb_`는 eip가 사용 중 |
| 5 | uxdesign | `ux_` | 9 | CREATE | 템플릿 그룹 |
| 6 | gemini | `gemini_` | 3 | CREATE | posts, comments, profiles |
| 7 | coding | `coding_` | 2 | RENAME | profiles, user_progress |
| 8 | docs | `docs_` | 2 | CREATE | profiles, documents |
| 9 | koreait | `ki_` | 7 | RENAME+CREATE | courses 등 |
| 10 | edu-hub | `eh_` | 10 | CREATE | 결제 포함 |
| 11 | reserve | `rsv_` | 6 | RENAME+CREATE | 예약 시스템 |
| 12 | allthat | `at_` | 16 | CREATE | 가장 복잡 |
| 13 | papers | `pp_` | 11 | CREATE | 논문 관련 |
| 14 | competency | `comp_` | 17 | RENAME | 가장 많은 테이블 |

**총 변경**: 테이블 119개 + RPC 함수 27개

---

## 3. 코드 변경 상세

### 3.1 템플릿 그룹 (5개 프로젝트, 동일 구조)

koreatech, digitalbiz, marketing, self-branding, uxdesign

**변경 파일** (각 프로젝트 1개):
- `src/utils/supabase.js` (또는 `.ts`)

**변경 테이블** (9개):
```
posts → {prefix}_posts
comments → {prefix}_comments
lectures → {prefix}_lectures
gallery → {prefix}_gallery
gallery_comments → {prefix}_gallery_comments
portfolio → {prefix}_portfolio
portfolio_comments → {prefix}_portfolio_comments
websites → {prefix}_websites
websites_comments → {prefix}_websites_comments
```

**변경 RPC 함수** (5개 x 5 프로젝트 = 25개):
```
increment_views → {prefix}_increment_views
increment_lecture_views → {prefix}_increment_lecture_views
increment_gallery_views → {prefix}_increment_gallery_views
increment_portfolio_views → {prefix}_increment_portfolio_views
increment_website_views → {prefix}_increment_website_views
```

**공유 테이블 (변경 없음)**: `user_profiles`, `update_last_login`

---

### 3.2 gemini (`gemini_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/utils/posts.js` | `posts`→`gemini_posts`, `comments`→`gemini_comments`, RPC `increment_view_count`→`gemini_increment_view_count` |
| `src/contexts/AuthContext.jsx` | `profiles`→`gemini_profiles` |

**조인 참조 수정**: `comment_count:comments(count)` → `comment_count:gemini_comments(count)`

---

### 3.3 coding (`coding_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/contexts/AuthContext.tsx` | `profiles`→`coding_profiles` (3회) |
| `src/contexts/ProgressContext.tsx` | `user_progress`→`coding_user_progress` (5회) |
| `src/pages/Progress.tsx` | `user_progress`→`coding_user_progress` (1회) |

---

### 3.4 docs (`docs_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/services/documents.ts` | `documents`→`docs_documents` (10회) |
| `src/services/members.ts` | `profiles`→`docs_profiles` (2회) |

---

### 3.5 koreait (`ki_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/hooks/useCourses.js` | `courses`→`ki_courses` |
| `src/hooks/useNews.js` | `news`→`ki_news` |
| `src/services/dashboardService.js` | 7개 테이블: `kpi_stats`→`ki_kpi_stats`, `enrollment_stats`→`ki_enrollment_stats`, `employment_stats`→`ki_employment_stats`, `courses`→`ki_courses`, `news`→`ki_news`, `partners`→`ki_partners`, `activity_log`→`ki_activity_log` |

---

### 3.6 edu-hub (`eh_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/utils/supabase.js` | `orders`→`eh_orders`, `order_items`→`eh_order_items`, 조인: `order_items(*)`→`eh_order_items(*)` |
| `src/utils/adminApi.js` | `orders`→`eh_orders`, `products`→`eh_products`, 조인: `eh_order_items(*)` |
| `src/utils/commentStorage.js` | `comments`→`eh_comments` |
| `src/utils/noticeStorage.js` | `notices`→`eh_notices` (8회) |
| `src/utils/productStorage.js` | `products`→`eh_products` |
| `src/utils/qnaStorage.js` | `qna_posts`→`eh_qna_posts`, `comments`→`eh_comments` |
| `src/utils/searchStorage.js` | `blog_posts`→`eh_blog_posts`, `board_posts`→`eh_board_posts`, `gallery_items`→`eh_gallery_items` |
| `src/pages/Franchise.jsx` | `franchise_applications`→`eh_franchise_applications` |

---

### 3.7 reserve (`rsv_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/utils/lectureRequestService.ts` | `lecture_requests`→`rsv_lecture_requests` (7회) |
| `src/utils/reservationService.ts` | `reservations`→`rsv_reservations` (8회), 조인: `schedules(*)`→`rsv_schedules(*)` |
| `src/utils/scheduleService.ts` | `schedules`→`rsv_schedules` (6회) |
| `src/utils/searchStorage.ts` | `blog_posts`→`rsv_blog_posts`, `board_posts`→`rsv_board_posts`, `gallery_items`→`rsv_gallery_items` |

---

### 3.8 allthat (`at_`) — 가장 복잡

| 파일 | 변경 내용 |
|------|-----------|
| `src/utils/supabase.js` | `orders`→`at_orders`, `order_items`→`at_order_items`, 조인: `at_order_items(*)` |
| `src/utils/adminQueries.js` | 12개 테이블 + 조인 참조 + JS 속성 접근 변경 |
| `src/utils/supabaseQueries.js` | 12개 테이블 + 조인 참조 + RPC `at_increment_view_count` |
| `src/utils/searchStorage.js` | `blog_posts`, `board_posts`, `gallery_items` |

**allthat 전체 테이블 (16개)**:
```
at_orders, at_order_items, at_blog_posts, at_board_posts, at_gallery_items,
at_learning_contents, at_courses, at_recruitment_rounds, at_applications,
at_enrollments, at_materials, at_board_comments, at_quizzes, at_quiz_questions,
at_quiz_results, at_self_assessments
```

**JS 속성 접근 변경**:
```js
// Before
c.recruitment_rounds?.[0]?.count
r.applications?.[0]?.count

// After
c.at_recruitment_rounds?.[0]?.count
r.at_applications?.[0]?.count
```

---

### 3.9 papers (`pp_`)

| 파일 | 변경 내용 |
|------|-----------|
| `src/utils/supabase.js` | `orders`→`pp_orders`, `order_items`→`pp_order_items`, 조인: `pp_order_items(*)` |
| `src/utils/commentStorage.js` | `comments`→`pp_comments` |
| `src/utils/communityStorage.js` | `community_posts`→`pp_community_posts` |
| `src/utils/materialStorage.js` | `lecture_materials`→`pp_lecture_materials` |
| `src/utils/productStorage.js` | `products`→`pp_products` |
| `src/utils/projectStorage.js` | `research_projects`→`pp_research_projects` |
| `src/utils/searchStorage.js` | `blog_posts`, `board_posts`, `gallery_items` |
| `src/utils/thesisGuidanceStorage.js` | `thesis_guidance_applications`→`pp_thesis_guidance_applications` |

---

### 3.10 competency (`comp_`) — 가장 많은 파일 변경

**34개 파일, 17개 테이블, 129회 `.from()` 변경**

| 영역 | 파일 수 | 주요 테이블 |
|------|---------|-------------|
| `src/utils/supabase.ts` | 1 | purchases, eval_list, questions, eval_questions, results, coupons, survey_questions, surveys, ai_reports |
| `src/pages/admin/*.tsx` | 15+ | comp_board_posts, comp_notes, comp_groups 등 |
| `src/pages/user/*.tsx` | 3 | comp_eval_list, comp_results |
| `src/pages/group/*.tsx` | 10+ | comp_groups, comp_group_members, comp_group_subgroups 등 |
| `src/pages/auth/*.tsx` | 1 | comp_coupons |
| `supabase/functions/` | 2 | verify-payment, generate-ai-report (더블 쿼트) |

---

## 4. SQL 마이그레이션 스크립트

**파일**: `D:\dreamit-web\supabase-migration-prefix.sql` (1286줄)

| 섹션 | 줄 범위 | 프로젝트 | 내용 |
|------|---------|----------|------|
| A | 14~462 | 템플릿 5개 | CREATE TABLE 45개 + RLS + 인덱스 + RPC 25개 |
| B | 465~526 | gemini | CREATE TABLE 3개 + RLS + RPC 1개 |
| C | 529~659 | edu-hub | CREATE TABLE 10개 + RLS |
| D | 662~875 | allthat | CREATE TABLE 16개 + RLS + RPC 1개 |
| E | 878~1012 | papers | CREATE TABLE 11개 + RLS |
| F | 1015~1052 | competency | ALTER TABLE RENAME 16개 + CREATE 1개 |
| G | 1055~1112 | reserve | RENAME 3개 + CREATE 3개 + RLS |
| H | 1115~1125 | coding | RENAME 2개 |
| I | 1128~1161 | docs | CREATE TABLE 2개 + RLS |
| J | 1164~1201 | koreait | RENAME 6개 + CREATE 1개 |
| K | 1204~1239 | 데이터 마이그레이션 | INSERT (주석 처리) |
| L | 1242~1265 | 정리 | DROP TABLE (주석 처리) |

### 4.1 실행 순서

```
섹션 I (docs) → 섹션 B (gemini) → 섹션 H (coding RENAME)
→ 섹션 A (템플릿) → 섹션 C~G, J (나머지)
→ 섹션 K (데이터 이관) → 섹션 L (기존 테이블 삭제)
```

**순서가 중요한 이유**: `profiles` 테이블을 coding, gemini, docs가 공유하므로 docs_profiles, gemini_profiles를 먼저 생성한 뒤 profiles를 coding_profiles로 RENAME해야 함.

---

## 5. RPC 함수 목록 (27개)

| 프로젝트 | 함수명 | 대상 테이블 |
|----------|--------|-------------|
| koreatech | `kt_increment_views` | kt_posts |
| koreatech | `kt_increment_lecture_views` | kt_lectures |
| koreatech | `kt_increment_gallery_views` | kt_gallery |
| koreatech | `kt_increment_portfolio_views` | kt_portfolio |
| koreatech | `kt_increment_website_views` | kt_websites |
| digitalbiz | `digb_increment_views` | digb_posts |
| digitalbiz | `digb_increment_lecture_views` | digb_lectures |
| digitalbiz | `digb_increment_gallery_views` | digb_gallery |
| digitalbiz | `digb_increment_portfolio_views` | digb_portfolio |
| digitalbiz | `digb_increment_website_views` | digb_websites |
| marketing | `mkt_increment_views` | mkt_posts |
| marketing | `mkt_increment_lecture_views` | mkt_lectures |
| marketing | `mkt_increment_gallery_views` | mkt_gallery |
| marketing | `mkt_increment_portfolio_views` | mkt_portfolio |
| marketing | `mkt_increment_website_views` | mkt_websites |
| self-branding | `brand_increment_views` | brand_posts |
| self-branding | `brand_increment_lecture_views` | brand_lectures |
| self-branding | `brand_increment_gallery_views` | brand_gallery |
| self-branding | `brand_increment_portfolio_views` | brand_portfolio |
| self-branding | `brand_increment_website_views` | brand_websites |
| uxdesign | `ux_increment_views` | ux_posts |
| uxdesign | `ux_increment_lecture_views` | ux_lectures |
| uxdesign | `ux_increment_gallery_views` | ux_gallery |
| uxdesign | `ux_increment_portfolio_views` | ux_portfolio |
| uxdesign | `ux_increment_website_views` | ux_websites |
| gemini | `gemini_increment_view_count` | gemini_posts |
| allthat | `at_increment_view_count` | at_board_posts |

---

## 6. 환경변수 (.env) 설정

**공통 값** (전체 프로젝트 동일):
```
VITE_SUPABASE_URL=https://hcmgdztsgjvzcyxyayaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**누락 발견 및 생성** (2개):
- `gemini/.env` — 신규 생성
- `koreait/.env` — 신규 생성

**기존 확인** (36개): 모든 프로젝트 정상 설정 확인

---

## 7. 변경하지 않은 항목

| 항목 | 이유 |
|------|------|
| `user_profiles` 테이블 | 공유 인증 테이블 (크로스 사이트 로그인) |
| `update_last_login` RPC | user_profiles 연동 함수 |
| 이미 접두어가 있는 17개+ 프로젝트 | 충돌 없음 (예: `sb_posts`, `cr_orders` 등) |

---

## 8. 배포 체크리스트

### 8.1 SQL 마이그레이션 (완료)
- [x] 섹션 A~J 실행 (테이블 생성/RENAME)
- [x] Supabase Dashboard에서 실행 완료

### 8.2 프로젝트 빌드 & 배포 (미완료)
- [ ] 14개 프로젝트 `npm run build` 확인
- [ ] 14개 프로젝트 `npx gh-pages -d dist` 배포
- [ ] 사이트별 기능 테스트

### 8.3 데이터 정리 (미완료)
- [ ] 섹션 K 데이터 마이그레이션 실행
- [ ] 각 프로젝트별 불필요 데이터 수동 삭제
- [ ] 섹션 L 기존 테이블 DROP (최종 확인 후)

---

## 9. 트러블슈팅

| 이슈 | 원인 | 해결 |
|------|------|------|
| `profiles` RENAME 순서 | coding, gemini, docs가 공유 | docs→gemini 먼저 CREATE 후 coding RENAME |
| `brand_` 접두어 선택 | self-branding의 `sb_`가 eip와 충돌 | `brand_`로 변경 |
| allthat 추가 테이블 누락 | adminQueries.js에 12개 추가 테이블 존재 | 전수 조사 후 수정 |
| 조인 참조 미수정 | `.select('*, table(*)')` 패턴 | 조인 내 테이블명도 접두어 적용 |
| JS 속성 접근 미수정 | `r.applications?.[0]?.count` 패턴 | `r.at_applications?.[0]?.count`로 변경 |

---

## 10. 영향도 요약

| 항목 | 수량 |
|------|------|
| 수정 프로젝트 | 14개 |
| 수정 파일 | 70+ 개 |
| 수정 `.from()` 호출 | 400+ 회 |
| 수정 `.rpc()` 호출 | 30+ 회 |
| 수정 조인 참조 | 10+ 회 |
| 신규 테이블 | 100+ 개 |
| RENAME 테이블 | 19개 |
| 신규 RPC 함수 | 27개 |
| 신규 .env 파일 | 2개 |
| SQL 마이그레이션 | 1286줄 |

---

*최종 업데이트: 2026-04-04*
*작성: Claude Opus 4.6*
*프로젝트 관리: Ph.D Aebon Lee, DreamIT Biz*
