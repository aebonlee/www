# ForJob 실기 서술형 연습 개선 (모범답안 비교)

**날짜**: 2026-04-06
**프로젝트**: forjob (직업상담사 2급 시험 준비)
**페이지**: `/silgi/practice` (PracticeMode)

## 변경 개요

실기 서술형 연습 페이지를 전면 개편하여:
- Supabase 의존 → **로컬 데이터(silgiFrequent.js 201문항)** 전환
- 문제 선택 화면 (과목/빈출등급/문제수 필터)
- 나란히 비교 (내 답안 vs 모범답안)
- 키워드 하이라이팅 + 점수 산출
- 결과 요약 + Supabase에 점수 저장
- **대시보드에 실기 합격 비율 표시**

## 변경 파일

### 1. `src/pages/silgi/PracticeMode.tsx` (전면 재작성)

**3 Phase 구조:**

| Phase | 화면 | 기능 |
|-------|------|------|
| `setup` | 문제 선택 | 과목 필터, 빈출 등급, 문제 수 선택 |
| `practice` | 문제 풀이 | 답안 작성 → 모범답안 확인 → 키워드 매칭 |
| `result` | 결과 요약 | 총점, 과목별 점수, 약점 분석, Supabase 저장 |

**핵심 기능:**
- `extractKeywords()`: 모범답안 HTML에서 `<strong>` 태그 텍스트 추출 → 키워드 목록
- `matchKeywords()`: 사용자 답안에서 키워드 포함 여부 검사 (대소문자/공백 무시)
- `highlightKeywords()`: 사용자 답안에서 일치 키워드를 `<mark>` 태그로 하이라이팅
- 나란히 비교: CSS Grid 2컬럼 레이아웃 (내 답안 | 모범답안)
- 점수: `(일치 키워드 / 전체 키워드) × 100`
- 합격 기준: 60%

**Supabase 저장 (EXAM_SESSIONS):**
```js
{
  user_id, exam_type: 'silgi_practice',
  score_total: 키워드 일치율 평균,
  correct_count: 60% 이상 문제 수,
  total_questions: 풀이 문제 수,
  time_spent_sec, is_pass, score_by_subject,
  completed_at, status: 'completed'
}
```

### 2. `src/pages/dashboard/Dashboard.tsx` (수정)

- **실기 연습 데이터 추가 로드**: `exam_type='silgi_practice'` 쿼리
- **실기 Stats 카드 4개**: 연습 수, 키워드 일치율, 실기 합격률, 합격 횟수
- **최근 실기 연습 테이블**: 최근 5회 실기 연습 기록
- **연속 학습 스트릭**: 필기 + 실기 통합 계산
- **섹션 구분**: h2 제목으로 "필기 시험" / "실기 연습" 구분

### 3. `src/pages/silgi/PracticeResult.tsx` (수정)

- 간소화 — 실기 연습 시작 링크 + 대시보드 링크

### 4. `src/App.tsx` (수정)

- `/silgi/practice/:id` → `/silgi/practice` (파라미터 제거)
- `/silgi/result/:id` → `/silgi/result`

### 5. `src/pages/silgi/SilgiHome.tsx` (수정)

- 링크 `/silgi/practice/1` → `/silgi/practice`

### 6. `src/styles/silgi.css` (수정)

새로 추가된 CSS:
- `.practice-setup`, `.practice-setup-section`, `.practice-setup-btn`: 문제 선택 화면
- `.practice-topbar`, `.practice-progress-bar`: 진행 표시바
- `.practice-comparison`, `.practice-comparison-col`: 나란히 비교 레이아웃
- `mark.kw-highlight`: 키워드 하이라이팅
- `.practice-result-banner`, `.practice-result-stats`: 결과 배너/통계
- `.practice-result-subject-row`, `.practice-result-bar-*`: 과목별 점수 바
- `.practice-result--weak`: 약점 분석 카드
- 반응형: 768px 이하 1컬럼 비교, 2컬럼 통계

### 7. `src/styles/dark-mode.css` (수정)

- `.practice-setup-section`, `.practice-setup-btn` 다크모드
- `mark.kw-highlight` 다크모드 (노란색 투명도 조절)
- `.practice-result-banner`, `.practice-result-stat` 다크모드

### 8. `src/styles/dashboard.css` (수정)

- `.dashboard-section-title` 스타일 추가

## 데이터 흐름

```
silgiFrequent.js (201문항)
  ↓ 필터 (과목/빈출등급)
  ↓ 랜덤 셔플 + 문제 수 제한
PracticeMode (practice phase)
  ↓ 사용자 답안 작성
  ↓ 모범답안 키워드 추출 (extractKeywords)
  ↓ 키워드 매칭 (matchKeywords)
  ↓ 점수 산출 (일치율%)
PracticeMode (result phase)
  ↓ 과목별/총점 계산
  ↓ Supabase EXAM_SESSIONS에 저장
Dashboard
  ↓ exam_type='silgi_practice' 쿼리
  ↓ 실기 합격률/평균 표시
```

## 검증 체크리스트

- [x] `npm run build` 성공
- [x] `/silgi/practice` 문제 선택 화면 표시
- [x] 과목/빈출등급/문제수 필터 정상
- [x] 연습 시작 → 문제 표시 → 답안 작성
- [x] 모범답안 확인 → 나란히 비교 + 키워드 하이라이팅
- [x] 다음/이전 문제 네비게이션
- [x] 연습 종료 → 결과 요약 (총점, 과목별, 약점)
- [ ] 결과 저장 → Supabase (로그인 필요)
- [x] 대시보드 실기 합격률 카드 표시
- [x] 대시보드 최근 실기 연습 테이블
