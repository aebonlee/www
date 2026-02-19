# 개발일지 - 강의계획서(Syllabus) 게시판 구현

**날짜**: 2026-02-20
**담당**: Claude Opus 4.6
**작업 유형**: 신규 기능 개발

---

## 작업 요약

교육(Education) 메뉴 하위에 **강의계획서(Syllabus)** 게시판을 추가 구현.
관리자(AdminGuard)만 CRUD 가능하며, 카테고리별 분류 + 운영/미운영 상태 + 운영횟수 필드를 포함.
기존 Board(게시판) 패턴을 그대로 따라 일관성 있게 구현.

---

## 변경 파일 목록

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/utils/boardStorage.js` | 수정 | Syllabus CRUD 6개 함수 추가 |
| `src/pages/Syllabus.jsx` | **신규** | 목록 페이지 (필터, 상태배지, 운영횟수) |
| `src/pages/SyllabusWrite.jsx` | **신규** | 작성/수정 폼 |
| `src/pages/SyllabusDetail.jsx` | **신규** | 상세 페이지 |
| `src/App.jsx` | 수정 | lazy import 3개 + Route 4개 추가 |
| `src/components/layout/Navbar.jsx` | 수정 | education dropdown에 강의계획서 메뉴 추가 |
| `src/utils/translations.js` | 수정 | ko/en 양쪽에 education.syllabus* 번역 키 추가 |
| `public/sitemap.xml` | 수정 | /education/syllabus URL 추가 |

---

## 기술 상세

### Supabase 테이블 (`syllabi`)

```sql
CREATE TABLE syllabi (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'ai_basic',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  run_count INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

- **카테고리**: `ai_basic` (AI기초), `application` (활용), `custom_etc` (맞춤특강외)
- **상태**: `active` (운영), `inactive` (미운영)
- **RLS**: 누구나 SELECT 가능, 인증된 사용자만 INSERT/UPDATE/DELETE

### CRUD 함수 (boardStorage.js)

| 함수 | 설명 |
|------|------|
| `getSyllabusPosts()` | 전체 목록 조회 (id 내림차순) |
| `getSyllabusPost(id)` | 단일 조회 |
| `createSyllabusPost({...})` | 신규 생성 |
| `updateSyllabusPost(id, updates)` | 수정 |
| `deleteSyllabusPost(id)` | 삭제 |
| `incrementSyllabusViews(id)` | 조회수 증가 |

### 라우트

| 경로 | 컴포넌트 | 가드 |
|------|----------|------|
| `/education/syllabus` | `Syllabus` | 없음 (공개) |
| `/education/syllabus/write` | `SyllabusWrite` | `AdminGuard` |
| `/education/syllabus/edit/:id` | `SyllabusWrite` | `AdminGuard` |
| `/education/syllabus/:postId` | `SyllabusDetail` | 없음 (공개) |

### 번역 키 추가

- `education.syllabus`, `education.syllabusTitle`, `education.syllabusSubtitle`
- `education.aiBasic`, `education.application`, `education.customEtc`
- `education.statusActive`, `education.statusInactive`, `education.runCount`

---

## 빌드 결과

- `npx vite build` 성공 (4.07s)
- 신규 빌드 파일: `Syllabus-*.js`, `SyllabusWrite-*.js`, `SyllabusDetail-*.js`

---

## 사전 필요 작업

- Supabase SQL Editor에서 위 SQL 실행하여 `syllabi` 테이블 생성 필요 (사용자 직접 실행)

---

## 검증 체크리스트

- [x] `npx vite build` 성공
- [ ] Supabase 테이블 생성 후 `/education/syllabus` 접속 확인
- [ ] 관리자 로그인 → 글쓰기/수정/삭제 동작 확인
- [ ] 비관리자 → 글쓰기 버튼 미표시, /write 접근 시 리다이렉트
- [ ] 카테고리 필터 동작 확인
- [ ] 운영/미운영 상태 배지 표시 확인
- [ ] 운영횟수 표시 및 입력 확인
