# ForJob 학습요약 필기/실기/핵심노트 탭 분리

**날짜**: 2026-04-06
**프로젝트**: forjob (직업상담사 2급 시험 준비)
**페이지**: `/summary` (StudySummary)

## 변경 개요

학습 요약 페이지(`/summary`)에 **필기/실기/핵심노트 3개 탭**을 추가하여 세 영역의 데이터를 별도로 학습할 수 있도록 개선.

### 기존 상태
- `/summary` → 필기 빈출 60개 주제만 표시
- 실기 데이터(`silgiFrequent.js` 201문항)는 별도 페이지에서만 접근 가능

### 변경 후 (3탭 구성)
- **필기 탭**: 기존 60개 빈출 주제 (변경 없음)
- **실기 탭**: 201문항을 빈출 횟수 내림차순으로 정렬하여 표시
- **핵심노트 탭**: 에듀윌 D-1 빈출개념 노트 120개 개념 (PDF에서 추출)

## 변경 파일

### 1. `src/data/keynoteData.js` (신규)

- 에듀윌 2026 직업상담사 2급 D-1 빈출개념 노트 PDF에서 120개 핵심 개념 추출
- 5과목 분류: 직업심리(01-33), 직업상담및취업지원(34-60), 직업정보(61-80), 노동시장(81-100), 고용노동관계법규(101-120)
- 각 개념에 ★ 중요도(1~5) 포함
- KEYNOTE_CATEGORIES, KEYNOTE_DATA, getKeynoteByCategory(), getKeynoteCounts() export

### 2. `src/pages/learn/StudySummary.tsx`

**주요 변경사항:**
- `activeTab` state: `'pilgi' | 'silgi' | 'keynote'` (3개 탭)
- `KeynoteCard` 컴포넌트 신규 추가 (★ 중요도 표시, 핵심 내용)
- 탭 전환 시 모든 state 초기화

**카드 렌더링 차이:**
| 항목 | 필기 (PilgiCard) | 실기 (SilgiCard) | 핵심노트 (KeynoteCard) |
|------|------------------|------------------|----------------------|
| 번호 | Q{num} | #{rank} (빈출순) | {num} |
| 본문 | topic.summary | topic.answer | topic.content |
| 상단 라벨 | "출제빈도" | "출제 이력" | "중요도" |
| 내용 라벨 | "핵심 요약" | "상세 해설" | "핵심 내용" |
| 배지 | keyword | keyword + N회출제 | ★ 중요도 |

### 3. `src/styles/silgi.css`

- `.summary-tabs`, `.summary-tab`, `.summary-tab.active`: 탭 스타일
- `.sq-badge--freq`: 실기 출제 횟수 배지
- `.sq-badge--stars`: 핵심노트 ★ 중요도 배지

### 4. `src/styles/dark-mode.css`

- 탭, 배지 다크모드 스타일

### 5. 변경 없는 파일
- `src/data/silgiFrequent.js` — 기존 201문항 그대로 사용
- `src/data/pilgiFrequent.js` — 기존 60개 주제 그대로 사용
- `src/App.tsx` — 라우트 변경 없음 (`/summary` 유지)

## 핵심노트 데이터 구조

```js
{
  num: 4, category: 'psychology', stars: 5,
  title: '긴즈버그의 진로발달이론',
  content: `<ul>
    <li><strong>특징</strong>: 직업선택은 하나의 발달과정...</li>
    <li><strong>발달단계</strong>: 환상기 → 잠정기 → 현실기</li>
  </ul>`
}
```

- `stars`: 1~5 (★★★☆☆ ~ ★★★★★)
- `content`: HTML 형식 (ul/li, table, p, strong 등)
- `category`: psychology, counseling, jobinfo, labor_market, labor_law

## 검증 체크리스트

- [x] `npm run build` 성공
- [x] 필기 탭 기본 표시 (60개 주제, 기존 동작 유지)
- [x] 실기 탭 전환 → 201문항 빈출순 표시
- [x] 핵심노트 탭 전환 → 120개 개념 표시
- [x] 핵심노트 5과목 카테고리 필터 정상
- [x] 사이드바 탭별 카테고리/주제 목록 전환
- [x] 검색/펼치기/접기 3탭 모두 정상
- [x] 탭 전환 시 state 초기화
- [x] 다크모드 탭/배지 스타일
