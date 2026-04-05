# ForJob 학습요약 필기/실기 탭 분리

**날짜**: 2026-04-06
**프로젝트**: forjob (직업상담사 2급 시험 준비)
**페이지**: `/summary` (StudySummary)

## 변경 개요

학습 요약 페이지(`/summary`)에 **필기/실기 탭**을 추가하여 두 영역의 빈출 데이터를 별도로 학습할 수 있도록 개선.

### 기존 상태
- `/summary` → 필기 빈출 60개 주제만 표시
- 실기 데이터(`silgiFrequent.js` 201문항)는 별도 페이지에서만 접근 가능

### 변경 후
- `/summary` → 필기/실기 탭 전환 가능
- 필기 탭: 기존 60개 주제 (변경 없음)
- 실기 탭: 201문항을 **빈출 횟수 내림차순**으로 정렬하여 표시

## 변경 파일

### 1. `src/pages/learn/StudySummary.tsx`

**주요 변경사항:**
- `activeTab` state 추가 (`'pilgi' | 'silgi'`, 기본값 `'pilgi'`)
- `silgiFrequent.js`에서 `FREQUENT_CATEGORIES`, `SILGI_FREQUENT`, `getQuestionsByCategory`, `getCategoryCounts` import
- `PilgiCard` / `SilgiCard` 두 개의 카드 컴포넌트로 분리
- `sortedSilgi`: frequency 문자열의 쉼표 수로 출제 횟수 계산 → 내림차순 정렬
- 탭 전환 시 모든 state 초기화 (activeCategory, openTopics, searchTerm, expandedSidebarCats)
- SEO 메타, page-header, 사이드바, 카테고리 필터, 카드 렌더링, 하단 네비게이션 모두 탭에 따라 분기

**카드 렌더링 차이:**
| 항목 | 필기 (PilgiCard) | 실기 (SilgiCard) |
|------|------------------|------------------|
| 번호 | Q{num} | #{rank} (빈출순) |
| 본문 | `topic.summary` | `topic.answer` |
| 빈도 라벨 | "출제빈도" | "출제 이력" |
| 내용 라벨 | "핵심 요약" | "상세 해설" |
| 추가 배지 | - | "{N}회 출제" (불꽃 아이콘) |

**하단 네비게이션:**
| 필기 탭 | 실기 탭 |
|---------|---------|
| 과목별 학습 (/learn) | 실기 시험 (/silgi) |
| 필기 CBT (/pilgi) | 기출문제 해설 (/silgi/frequent) |

### 2. `src/styles/silgi.css`

- `.summary-tabs`: 탭 컨테이너 (flex, border-bottom)
- `.summary-tab`: 탭 버튼 (padding, font, transition)
- `.summary-tab.active`: 활성 탭 (primary 색상, border-bottom)
- `.sq-badge--freq`: 실기 출제 횟수 배지 (노란 배경)

### 3. `src/styles/dark-mode.css`

- `.summary-tabs`, `.summary-tab`, `.summary-tab.active`: 다크모드 색상
- `.sq-badge--freq`: 다크모드 빈출 배지

### 4. 변경 없는 파일
- `src/data/silgiFrequent.js` — 기존 201문항 그대로 사용
- `src/data/pilgiFrequent.js` — 기존 60개 주제 그대로 사용
- `src/App.tsx` — 라우트 변경 없음 (`/summary` 유지)

## 빈출 정렬 로직

```tsx
const sortedSilgi = useMemo(() => {
  return [...SILGI_FREQUENT]
    .map((q) => ({
      ...q,
      freqCount: (q.frequency.match(/,/g) || []).length + 1,
    }))
    .sort((a, b) => b.freqCount - a.freqCount);
}, []);
```

- `frequency` 문자열 (예: `'24-3, 22-3, 21-3, 21-1, 20-2'`)에서 쉼표 수 + 1 = 출제 횟수
- 출제 횟수 내림차순 정렬
- 실기 탭에서 `#{rank}` (1부터 시작)으로 빈출순 표시

## 검증 체크리스트

- [x] `npm run build` 성공
- [x] 필기 탭 기본 표시 (60개 주제, 기존 동작 유지)
- [x] 실기 탭 전환 → 201문항 빈출순 표시
- [x] 실기 탭 카테고리 필터 (4과목, labor_law 없음)
- [x] 사이드바 탭별 카테고리/주제 목록 전환
- [x] 검색/펼치기/접기 양 탭 정상 작동
- [x] 탭 전환 시 state 초기화
- [x] 다크모드 탭/배지 스타일
