# 개발일지 - 강의계획서(Syllabus) 게시판 구현 (v1.0 완료)

**날짜**: 2026-02-20
**담당**: Claude Opus 4.6
**작업 유형**: 신규 기능 개발
**상태**: v1.0 개발 완료 (고도화 예정)

---

## 작업 요약

교육(Education) 메뉴 하위에 **강의계획서(Syllabus)** 게시판을 추가 구현.
관리자(AdminGuard)만 CRUD 가능하며, 7개 카테고리 분류 + 운영/미운영 상태 + 운영횟수 필드를 포함.
기존 Board(게시판) 패턴을 그대로 따라 일관성 있게 구현.

---

## 변경 파일 목록

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/utils/boardStorage.js` | 수정 | Syllabus CRUD 6개 함수 추가 |
| `src/pages/Syllabus.jsx` | **신규** | 목록 페이지 (7개 카테고리 필터, 상태배지, 운영횟수) |
| `src/pages/SyllabusWrite.jsx` | **신규** | 작성/수정 폼 (카테고리, 상태, 운영횟수 입력) |
| `src/pages/SyllabusDetail.jsx` | **신규** | 상세 페이지 (카테고리/상태 배지, 운영횟수 표시) |
| `src/App.jsx` | 수정 | lazy import 3개 + Route 4개 추가 |
| `src/components/layout/Navbar.jsx` | 수정 | education dropdown에 강의계획서 메뉴 추가 |
| `src/utils/translations.js` | 수정 | ko/en 양쪽에 education.syllabus* + 카테고리 번역 키 추가 |
| `public/sitemap.xml` | 수정 | /education/syllabus URL 추가 |

---

## 기술 상세

### Supabase 테이블 (`syllabi`)

```sql
CREATE TABLE syllabi (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'gen_ai',
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

ALTER TABLE syllabi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read syllabi" ON syllabi FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert syllabi" ON syllabi FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update syllabi" ON syllabi FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete syllabi" ON syllabi FOR DELETE USING (auth.role() = 'authenticated');
```

### 카테고리 (7개)

| DB 키 | 한국어 | English |
|-------|--------|---------|
| `gen_ai` | Gen AI활용 | Gen AI |
| `automation` | 업무자동화 | Automation |
| `certificate` | 자격증강의 | Certification |
| `corporate` | 기업 맞춤강의 | Corporate Training |
| `programming` | 프로그래밍 강의 | Programming |
| `university` | 대학 강의 | University |
| `etc` | 기타 | Others |

### 상태

| DB 값 | 한국어 | English |
|-------|--------|---------|
| `active` | 운영 | Active |
| `inactive` | 미운영 | Inactive |

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

### 번역 키

- `education.syllabus`, `education.syllabusTitle`, `education.syllabusSubtitle`
- `education.catGenAi`, `education.catAutomation`, `education.catCertificate`
- `education.catCorporate`, `education.catProgramming`, `education.catUniversity`, `education.catEtc`
- `education.statusActive`, `education.statusInactive`, `education.runCount`

---

## 커밋 이력

| 커밋 | 설명 |
|------|------|
| `462a063` | feat: 강의계획서(Syllabus) 게시판 구현 — 초기 3개 카테고리 |
| `8e8ee42` | fix: 강의계획서 카테고리 7개로 변경 |

---

## v1.0 완료 상태

- [x] Supabase `syllabi` 테이블 + RLS 정책 생성
- [x] CRUD 6개 함수 (boardStorage.js)
- [x] 목록 페이지 — 7개 카테고리 필터, 상태 배지, 운영횟수
- [x] 작성/수정 폼 — 카테고리, 상태, 운영횟수 입력
- [x] 상세 페이지 — 카테고리/상태 배지, 조회수 자동 증가
- [x] AdminGuard 관리자 전용 CRUD
- [x] 네비게이션 메뉴 (교육 드롭다운)
- [x] 번역 (ko/en)
- [x] sitemap.xml 업데이트
- [x] 빌드 + 배포 + 커밋 + 푸시

---

## 고도화 예정 사항 (추후 계획)

- 첨부파일 업로드 기능
- 내용(content) 리치 텍스트 에디터
- 검색 기능
- 강의 일정/기간 필드
- 수강 대상/인원 필드
- 강의계획서 PDF 다운로드/출력
- 카테고리별 통계 대시보드
