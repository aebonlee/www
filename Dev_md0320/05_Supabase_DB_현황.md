# DreamIT Biz - Supabase DB 현황

**최종 업데이트**: 2026-03-29
**Supabase 프로젝트**: hcmgdztsgjtzcyxyayaj (전체 공유)

---

## 1. 공유 구조

모든 프로젝트가 **단일 Supabase 프로젝트**를 공유:
- 동일 `VITE_SUPABASE_URL` 및 `VITE_SUPABASE_ANON_KEY`
- `user_profiles` 테이블 공유 (cross-site 유저 추적)
- 프로젝트별 게시판은 별도 테이블 (prefix 분리)

---

## 2. 공통 테이블

### user_profiles (전체 공유)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  api_keys JSONB DEFAULT '{}',
  signup_domain TEXT,           -- 최초 가입 도메인
  visited_sites JSONB DEFAULT '[]',  -- 방문한 사이트 목록
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 자동 트리거
| 트리거 | 설명 |
|--------|------|
| `handle_new_user()` | 신규 가입 시 user_profiles 자동 생성 |
| `update_updated_at()` | 레코드 수정 시 updated_at 자동 갱신 |
| `check_user_status()` | RPC: 계정 상태 확인 (차단 여부) |

---

## 3. 프로젝트별 게시판 테이블

| 프로젝트 | Posts 테이블 | Comments 테이블 | 카테고리 |
|----------|-------------|----------------|----------|
| teaching | teaching_board_posts | teaching_board_comments | notice/tip/question/free/showcase |
| openclaw | openclaw_board_posts | openclaw_board_comments | notice/tip/question/free/showcase |
| **autowork** | **autowork_board_posts** | **autowork_board_comments** | **notice/tip/question/free/showcase** |
| 기타 프로젝트 | (teaching 공유 또는 자체) | (동일) | 프로젝트별 상이 |

### 게시판 테이블 구조 (공통)
```sql
CREATE TABLE {prefix}_board_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'free'
    CHECK (category IN ('notice','tip','question','free','showcase')),
  views INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE {prefix}_board_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES {prefix}_board_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 조회수 RPC (프로젝트별)
```sql
-- teaching
CREATE FUNCTION increment_post_views(post_id UUID)

-- autowork
CREATE FUNCTION increment_autowork_post_views(post_id UUID)
```

### 댓글 수 트리거 (프로젝트별)
```sql
-- INSERT 시 comment_count + 1
-- DELETE 시 comment_count - 1
CREATE TRIGGER update_{prefix}_comment_count
AFTER INSERT OR DELETE ON {prefix}_board_comments
```

---

## 4. Supabase 연동 프로젝트 전체 목록 (33개)

| # | 프로젝트 | SDK 버전 | 게시판 테이블 | 특수 테이블 |
|---|----------|----------|-------------|------------|
| 1 | teaching | 2.47.0 | teaching_board_* | - |
| 2 | openclaw | 2.47.0 | openclaw_board_* | - |
| 3 | autowork | 2.47.0 | autowork_board_* | - |
| 4 | docs | 2.98.0 | - | - |
| 5 | edu-hub | 2.96.0 | - | 결제/주문 |
| 6 | papers | 2.96.0 | - | 결제/주문 |
| 7 | allthat | 2.96.0 | - | 결제/주문 |
| 8 | competency | 2.97.0 | - | 검사결과 |
| 9 | career | 2.99.2 | - | 상담/예약 |
| 10 | eip | 2.100.0 | - | - |
| 11 | ai-media | 2.100.1 | - | - |
| 12 | koreatech | 2.96.0 | - | - |
| 13 | marketing | 2.96.0 | - | - |
| 14 | digitalbiz | 2.96.0 | - | - |
| 15 | uxdesign | 2.96.0 | - | - |
| 16 | self-branding | 2.96.0 | - | - |
| 17 | reserve | 2.96.0 | - | 예약 |
| 18 | templete-ref | 2.96.0 | - | 결제/주문 |
| 19 | korean | 2.99.3 | - | - |
| 20 | english | 2.99.3 | - | - |
| 21 | japanese | 2.99.3 | - | - |
| 22 | coding | 2.99.1 | - | - |
| 23 | python-study | 2.99.2 | - | - |
| 24 | java-study | 2.99.2 | - | - |
| 25 | c-study | 2.99.2 | - | - |
| 26 | linux-study | 2.99.2 | - | - |
| 27 | ai-prompt | 2.49.4 | - | - |
| 28 | ai-data | 2.49.4 | - | - |
| 29 | software | 2.49.4 | - | - |
| 30 | books | 2.98.0 | - | - |
| 31 | hohai | 2.49.0 | - | - |
| 32 | ahp_basic | 2.45.0 | - | - |
| 33 | koreait | 2.45.0 | - | - |

---

## 5. RLS 정책 (공통 패턴)

### user_profiles
```sql
-- 본인만 조회/수정/삽입 가능
SELECT: auth.uid() = id
UPDATE: auth.uid() = id
INSERT: auth.uid() = id
```

### 게시판
```sql
-- 누구나 조회, 작성자만 수정/삭제
SELECT: true (공개)
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
DELETE: auth.uid() = user_id
```

---

## 6. 인증 Provider

| Provider | 상태 | 비고 |
|----------|------|------|
| Email/Password | 활성 | 기본 |
| Google OAuth | 활성 | 소셜 로그인 |
| Kakao OAuth | 활성 | 소셜 로그인 |

### Redirect URLs (등록 필요)
모든 프로젝트 도메인을 Supabase Auth > URL Configuration에 등록:
```
https://dreamitbiz.com
https://teaching.dreamitbiz.com
https://openclaw.dreamitbiz.com
https://autowork.dreamitbiz.com
https://eip.dreamitbiz.com
https://edu-hub.dreamitbiz.com
https://papers.dreamitbiz.com
https://allthat.dreamitbiz.com
https://competency.dreamitbiz.com
https://career.dreamitbiz.com
https://coding.dreamitbiz.com
https://python-study.dreamitbiz.com
https://java-study.dreamitbiz.com
https://c-study.dreamitbiz.com
https://linux-study.dreamitbiz.com
https://korean.dreamitbiz.com
https://english.dreamitbiz.com
https://japanese.dreamitbiz.com
https://koreatech.dreamitbiz.com
https://marketing.dreamitbiz.com
https://digitalbiz.dreamitbiz.com
https://uxdesign.dreamitbiz.com
https://self-branding.dreamitbiz.com
https://reserve.dreamitbiz.com
https://ai-prompt.dreamitbiz.com
https://ai-data.dreamitbiz.com
https://software.dreamitbiz.com
https://docs.dreamitbiz.com
https://books.dreamitbiz.com
https://hohai.dreamitbiz.com
https://koreait.dreamitbiz.com
```

---

## 7. 환경변수

### 필수 (.env)
```
VITE_SUPABASE_URL=https://hcmgdztsgjtzcyxyayaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### 주의사항
- `.env`는 `.gitignore`에 포함 → git에 올라가지 않음
- 각 개발 머신마다 `.env` 별도 생성 필요
- GitHub Secrets는 GitHub Actions 전용 (로컬 빌드에 미사용)
- `.env` 없으면 `placeholder.supabase.co`로 빌드 → 로그인 불가

---

## 8. SQL 재설정 시 주의사항

1. `CREATE TABLE IF NOT EXISTS` 사용 → 기존 데이터 보존
2. `DROP TABLE` 사용 금지 → 데이터 소실
3. RLS 정책: DROP IF EXISTS → CREATE 순서로 재생성
4. 트리거: DROP IF EXISTS → CREATE 순서로 재생성
5. **백필 쿼리**: auth.users에 있지만 user_profiles에 없는 유저 자동 복구

```sql
-- 프로필 백필 (schema.sql 섹션 11)
INSERT INTO user_profiles (id, display_name, avatar_url, role)
SELECT au.id, COALESCE(...), COALESCE(...), 'user'
FROM auth.users au LEFT JOIN user_profiles up ON up.id = au.id
WHERE up.id IS NULL ON CONFLICT (id) DO NOTHING;
```

---

*최종 업데이트: 2026-03-29*
*작성: Claude Opus 4.6*
*프로젝트 관리: Ph.D Aebon Lee, DreamIT Biz*
