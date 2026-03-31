# 프로젝트별 변경 이력 (2026-03-30 ~ 2026-04-01)

**작성일**: 2026-04-01
**작업자**: Claude Opus 4.6

---

## 전체 작업 타임라인

### 2026-03-30: SEO 개선 + License 추가 + Batch 0~2

#### SEO 일괄 개선 (40개 프로젝트)
- robots.txt, sitemap.xml 생성
- 404.html (SPA redirect) 추가
- twitter:card, canonical URL, meta robots 추가
- og:image 누락 프로젝트 보완

#### MIT License 일괄 추가 (40개 리포지토리)
- 5개 배치로 나누어 모든 리포지토리에 LICENSE 파일 추가

#### TypeScript 마이그레이션 시작
- **Batch 0** (competency): 52개 pages + 10개 components .jsx → .tsx
- **Batch 1** (aebon, reactStudy, webstudy): 가장 단순한 프로젝트 완료
- **Batch 2** (docs, templete-ref, reserve, algorithm, data-structure): 소규모 Supabase 프로젝트 완료

### 2026-03-31: Batch 3~4

#### Batch 3 완료
- db-study, linux-study, english, japanese, korean
- 학습 사이트 특유의 대규모 페이지 파일 처리
- linux-study: Exam/Progress/Community 관련 대형 파일들

#### Batch 4 진행
- **presentation**: 완료/배포
- **digitalbiz**: Context 파일 4개 수동 재작성 (AuthContext, ThemeContext, LanguageContext, ToastContext), 78 files changed
- **eip**: 58 files changed, 211 TS 에러 수정 (CodeEditor, PassPrediction, MockTest 등)
- **self-branding**: 160+ files, supabase.ts .catch() 패턴 수정
- **teaching**: AIChecklist.tsx(1070줄), PromptPractice.tsx, Resources.tsx 대형 파일

### 2026-04-01: Batch 4 완료 + 문서화

#### self-branding 완료
- 마지막 6개 에러 수정 (Lectures.tsx, WebsiteWrite.tsx)
- 빌드/커밋/푸시/배포

#### teaching 진행중
- 120개 에러 (3개 파일) 수정 중

---

## 프로젝트별 상세 변경 내역

### competency (Batch 0)
- **변경**: .jsx → .tsx (52 pages, 10 components)
- **커밋**: TypeScript strict mode migration
- **배포**: gh-pages

### aebon (Batch 1)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **특이사항**: Supabase/라우터 없는 단순 구조

### reactStudy (Batch 1)
- **변경**: 전체 .jsx → .tsx
- **특이사항**: 라우터만 사용

### webstudy (Batch 1)
- **변경**: 전체 .jsx → .tsx

### docs (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **커밋/배포**: 완료

### templete-ref (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### reserve (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### algorithm (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### data-structure (Batch 2)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### db-study (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### linux-study (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **특이사항**: Exam, Progress, Community 관련 대형 파일

### english (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### japanese (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### korean (Batch 3)
- **변경**: 전체 .js/.jsx → .ts/.tsx

### presentation (Batch 4)
- **변경**: 전체 .js/.jsx → .ts/.tsx
- **커밋/배포**: 완료

### digitalbiz (Batch 4)
- **변경**: 78 files, 619 insertions, 336 deletions
- **주요 작업**: 4개 Context 파일 완전 재작성 (타입 인터페이스 추가)
- **커밋**: dea1d9a "Migrate to TypeScript with strict mode"
- **배포**: 완료

### eip (Batch 4)
- **변경**: 58 files, 450 insertions, 210 deletions
- **주요 작업**: CodeEditor Props, PassPrediction 타입, MockTest 상태 타입, CertTypeKey export
- **커밋**: 18cebc9 "fix: resolve all 211 TypeScript errors"
- **배포**: 완료

### self-branding (Batch 4)
- **변경**: ~160 files
- **주요 작업**:
  - Context 4개 재작성 (Auth, Theme, Language, Toast)
  - supabase.ts .catch() → try/catch (6개소)
  - 페이지 unused var 정리, 상태 타입 지정
- **커밋**: fe49ce7 "Migrate to TypeScript with strict mode"
- **배포**: 완료

### teaching (Batch 4)
- **변경**: ~170 files
- **주요 작업**: Context, utils, hooks, config 완료. 3개 대형 페이지 파일 수정 중
- **상태**: 진행중 (120 에러 → 수정 중)
