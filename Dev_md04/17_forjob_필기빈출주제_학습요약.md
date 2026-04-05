# 17. ForJob — 필기 빈출 주제 정리 (학습요약 페이지)

**작업일**: 2026-04-06
**프로젝트**: forjob (직업상담사 2급 시험 준비 플랫폼)

---

## 개요

필기 기출문제(2010~2022, 39회 시험, 약 3,900문항)를 분석하여 반복 출제되는 핵심 주제 60개를 추출·정리한 **학습요약 페이지** 신규 추가.

기존 실기 빈출 기출정리(`/silgi/frequent`)와 동일한 UI 패턴으로, NAV 메뉴 "학습요약"을 `/summary` 경로로 분리.

## 변경 파일

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `src/data/pilgiFrequent.js` | 신규 | 60개 빈출 주제 데이터 (5과목 × 12개) |
| `src/pages/learn/StudySummary.tsx` | 신규 | 학습요약 페이지 컴포넌트 |
| `src/config/site.js` | 수정 | NAV_ITEMS 학습요약 경로 `/learn` → `/summary` |
| `src/App.tsx` | 수정 | `/summary` 라우트 추가 |

## 데이터 구조 (`pilgiFrequent.js`)

```
PILGI_FREQ_CATEGORIES: 전체 + 5과목 카테고리
PILGI_FREQUENT[]: 60개 항목
  - num, category, title, keyword, frequency, summary (HTML)

헬퍼 함수:
  - getPilgiFreqByCategory(categoryId)
  - getPilgiFreqCounts()
```

### 과목별 주제 수

| 과목 | 코드 | 주제 수 |
|------|------|---------|
| 직업상담학 | counseling | 12 |
| 직업심리학 | psychology | 12 |
| 직업정보론 | jobinfo | 12 |
| 노동시장론 | labor_market | 12 |
| 노동관계법규 | labor_law | 12 |
| **합계** | | **60** |

## 페이지 기능 (`StudySummary.tsx`)

- 아코디언 카드 UI (SilgiFrequent.tsx와 동일 구조)
- 6개 과목 필터 탭 (전체 포함)
- 키워드 검색
- 전체 펼치기/접기
- 기존 `.sq-*`, `.freq-*` CSS 클래스 재활용 (별도 CSS 불필요)
- 하단 네비게이션: 과목별 학습(`/learn`), 필기 CBT(`/pilgi`)

## 라우팅

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/summary` | `StudySummary` | 필기 빈출 주제 정리 |
| `/learn` | `LearnHome` | 과목별 학습 (기존 유지) |

## 검증

- `npm run build` 성공
- `/summary` 접속 → 60개 빈출 주제 카드 표시
- 과목 탭 클릭 → 해당 과목 필터링
- 카드 클릭 → 아코디언 핵심 요약 표시
- 검색 → 키워드 필터링
- NAV "학습요약" → `/summary` 이동
