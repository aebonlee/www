# Supabase 테이블 네이밍 충돌 감사 보고서

> 감사일: 2026-03-26

## 1. 요약

40+개 하위 도메인 사이트가 **하나의 Supabase 프로젝트**를 공유하고 있으며, 일부 사이트는 테이블 접두어 없이 동일한 테이블명을 사용하여 **데이터 혼재** 위험이 존재합니다.

### 위험도 분류

| 수준 | 설명 | 해당 사이트 |
|------|------|-------------|
| **CRITICAL** | 5개 사이트가 동일 테이블을 도메인 필터링 없이 공유 | koreatech, marketing, digitalbiz, self-branding, uxdesign |
| **HIGH** | 2-4개 사이트가 동일 테이블명 사용 | allthat, edu-hub, papers, books, reserve, linux-study, competency |
| **OK** | 고유 접두어 사용 (모범 사례) | ai-data(ad_), ai-prompt(ap_), teaching(teaching_), hohai(hohai_), eip(sb_), career(career_), books(pub_) |
| **SAFE** | user_profiles만 사용 (의도적 공유) | korean, english, japanese, python-study, java-study, c-study |

---

## 2. CRITICAL: 5개 템플릿 사이트 동일 테이블 공유

### 영향 사이트
koreatech, marketing, digitalbiz, self-branding, uxdesign

### 공유 테이블 (9개)
| 테이블명 | 용도 | 도메인 필터링 |
|----------|------|---------------|
| `posts` | 게시글 | **없음** |
| `comments` | 댓글 | **없음** |
| `lectures` | 강의 | **없음** |
| `gallery` | 갤러리 | **없음** |
| `gallery_comments` | 갤러리 댓글 | **없음** |
| `portfolio` | 포트폴리오 | **없음** |
| `portfolio_comments` | 포트폴리오 댓글 | **없음** |
| `websites` | 웹사이트 | **없음** |
| `websites_comments` | 웹사이트 댓글 | **없음** |

**문제점**: 5개 사이트가 모두 같은 `posts` 테이블에 INSERT/SELECT → 한 사이트에서 작성한 게시글이 다른 4개 사이트에도 보임

---

## 3. HIGH: 기타 테이블 충돌

| 테이블명 | 사용 사이트 | 충돌 수 |
|----------|------------|---------|
| `orders` | allthat, books, edu-hub, papers | 4 |
| `order_items` | allthat, books, edu-hub, papers | 4 |
| `comments` | 5개 템플릿 + allthat, edu-hub, papers | 8 |
| `board_posts` | allthat, competency, linux-study, reserve + subsite-template | 5 |
| `gallery_items` | allthat, edu-hub, papers, linux-study, reserve + subsite-template | 6 |
| `blog_posts` | edu-hub, papers, reserve + subsite-template | 4 |
| `products` | edu-hub, papers | 2 |
| `courses` | allthat, koreait | 2 |
| `user_progress` | linux-study, coding | 2 |
| `profiles` | coding, docs | 2 |

---

## 4. 모범 사례 (접두어 사용 사이트)

| 사이트 | 접두어 | 테이블 예시 |
|--------|--------|-------------|
| ai-data | `ad_` | ad_posts, ad_comments, ad_lectures, ad_workbooks |
| ai-prompt | `ap_` | ap_workbooks, ap_lectures, ap_posts, ap_comments |
| teaching | `teaching_` | teaching_syllabi, teaching_rubrics, teaching_board_posts |
| hohai | `hohai_` | hohai_poems, hohai_songs, hohai_series, hohai_categories |
| eip | `sb_` | sb_profiles, sb_study_progress, sb_test_results |
| career | `career_` | career_profiles, career_notifications |
| books | `pub_` | pub_gallery_items, pub_learning_contents, pub_reports |

---

## 5. 해결 방안: `site_domain` 컬럼 추가 (멀티테넌트)

### 왜 접두어 변경이 아닌 site_domain 방식인가?

| 방식 | 장점 | 단점 |
|------|------|------|
| 테이블 접두어 변경 | 완전 분리 | 45+개 테이블 생성, 데이터 마이그레이션, 모든 코드 수정 필요 |
| **site_domain 컬럼 추가** | 기존 테이블 유지, 코드 변경 최소화, RLS로 강제 가능 | 쿼리마다 필터 필요 |

→ **site_domain 방식 채택**: 기존 데이터 보존, 코드 변경 최소, 점진적 적용 가능

### 적용 대상
- 5개 템플릿 사이트 공유 테이블 (9개): `posts`, `comments`, `lectures`, `gallery`, `gallery_comments`, `portfolio`, `portfolio_comments`, `websites`, `websites_comments`
- 다중 사이트 공유 테이블 (6개): `orders`, `order_items`, `board_posts`, `gallery_items`, `blog_posts`, `products`

### SQL 마이그레이션
→ `migration_table_isolation.sql` 파일 참고

---

## 6. user_profiles (의도적 공유 - 변경 불필요)

`user_profiles` 테이블은 **전체 사이트가 공유하는 중앙 인증 테이블**로, 이는 의도된 설계입니다.
- `signup_domain`: 최초 가입 사이트
- `visited_sites`: 방문한 사이트 배열
- `last_active_at`: 마지막 활동 시간

→ 변경 불필요
