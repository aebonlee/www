# ForJob - 북마크 버튼 + 문항 네비게이션 개선

> 작성일: 2026-04-06
> 프로젝트: ForJob (직업상담사 2급 시험 준비 플랫폼)
> 배포: https://forjob.dreamitbiz.com

---

## 작업 요약

| 항목 | 내용 |
|------|------|
| 목표 1 | 북마크 아이콘 1.5배 확대 + 풍선 도움말 추가 |
| 목표 2 | 시험 모드 북마크를 Supabase에 연동 (영구 저장) |
| 목표 3 | 문항 네비게이션 답변 색상 표시 + 클래스명 통일 |

---

## 1. 북마크 버튼 개선

### 변경 전
- 아이콘 크기: ~20px (기본 FontAwesome 크기)
- 도움말: 브라우저 기본 `title` 속성 (지연 표시, 스타일 없음)
- 시험 모드: 로컬 상태만 (페이지 새로고침 시 소실)

### 변경 후
- 아이콘 크기: **30px** (1.5배)
- 도움말: **CSS 풍선 도움말** (즉시 표시, 스타일드 말풍선)
- 시험 모드: **Supabase 연동** (북마크 페이지와 동기화)

### 수정 파일

#### `src/components/BookmarkButton.tsx`
- `title` 속성 제거 → `<span className="bookmark-tooltip">` 풍선 도움말
- hover 시 위쪽에 말풍선 표시 (화살표 포함)
- 상태별 메시지: "북마크 추가" / "북마크 해제"

#### `src/styles/exam.css` — `.bookmark-btn` 스타일 신규 추가

| 클래스 | 설명 |
|--------|------|
| `.bookmark-btn` | 기본 스타일 (30px, 투명 배경) |
| `.bookmark-btn:hover` | 노란색 + scale(1.15) |
| `.bookmark-btn.active` | 채워진 노란색 (#F59E0B) |
| `.bookmark-tooltip` | 풍선 도움말 (상단 표시) |
| `.bookmark-tooltip::after` | 말풍선 화살표 (삼각형) |

#### `src/styles/dark-mode.css` — 다크모드 대응
- 풍선 배경: 밝은 색 (#F8FAFC), 글씨: 어두운 색 (#1E293B)
- 라이트 모드와 반전된 대비

#### `src/pages/pilgi/ExamMode.tsx` — Supabase 연동

| 변경 전 | 변경 후 |
|---------|---------|
| `useState([])` 로컬만 | 마운트 시 Supabase에서 북마크 로드 |
| 토글: 로컬 상태만 변경 | 토글: Supabase INSERT/DELETE + 로컬 상태 |
| 페이지 이탈 시 소실 | 영구 저장, 북마크 페이지 연동 |

---

## 2. 문항 네비게이션 개선

### 문제점
1. `QuestionNav.tsx`에서 `.question-nav-item` 클래스 사용 → CSS는 `.question-nav-btn` 정의 → **스타일 미적용**
2. 범례 클래스도 `legend-item`/`legend-dot` → CSS는 `nav-legend-item`/`nav-legend-dot` → **불일치**
3. 답변 완료 색상이 미답변과 구분 어려움 (회색 vs 흰색)

### 수정 내용

#### `src/components/QuestionNav.tsx`
- 클래스명 통일: `question-nav-item` → `question-nav-btn`
- 범례 클래스 통일: `legend-item` → `nav-legend-item`, `legend-dot` → `nav-legend-dot`
- 우선순위 정리: current > bookmarked > answered > 미답변

#### `src/styles/exam.css` — 답변 색상 강화

| 상태 | 변경 전 | 변경 후 |
|------|---------|---------|
| 미답변 | 흰색 배경, 회색 테두리 | (변경 없음) |
| 답변 완료 | 연한 회색 (`--bg-medium-gray`) | **파란 배경** (`#DBEAFE`), 파란 텍스트 (`#1E40AF`) |
| 북마크 | 노란 배경 | (변경 없음) |
| 현재 | 파란 배경 (solid) | (변경 없음) |

#### 다크모드 답변 색상
- 배경: `rgba(59, 130, 246, 0.2)`, 텍스트: `#93C5FD`

---

## 풍선 도움말 디자인

```
         ┌─────────────┐
         │ 북마크 추가   │  ← .bookmark-tooltip
         └──────┬──────┘
                ▼          ← ::after (삼각형)
             🔖            ← .bookmark-btn (30px)
```

- 위치: 버튼 위 10px
- 배경: `#1E293B` (다크), `#F8FAFC` (다크모드 시)
- 폰트: 12px, bold
- 애니메이션: opacity + scale 0.2s
- 화살표: border 삼각형 기법

---

## 커밋 이력

| 커밋 | 내용 |
|------|------|
| (이번 커밋) | feat: 북마크 1.5배 확대 + 풍선도움말 + Supabase 연동 + 네비게이션 답변색상 |

---

## 관련 문서

- [12_forjob_디스플레이_설정.md](./12_forjob_디스플레이_설정.md) — 문항 네비게이션 기본 구현
- [15_forjob_다크모드_보기표지문.md](./15_forjob_다크모드_보기표지문.md) — 다크모드 스타일링
