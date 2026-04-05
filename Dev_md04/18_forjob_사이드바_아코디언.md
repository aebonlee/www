# 18. ForJob — 학습요약 데스크톱 사이드바 + 아코디언 드롭다운

**작업일**: 2026-04-06
**프로젝트**: forjob (직업상담사 2급 시험 준비 플랫폼)
**배포**: https://forjob.dreamitbiz.com/summary

---

## 개요

학습요약(`/summary`) 페이지에 데스크톱 전용 좌측 사이드바를 추가하고, 과목별 드롭다운 메뉴를 아코디언 방식으로 구현.

## 변경 파일

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `src/pages/learn/StudySummary.tsx` | 수정 | 사이드바 레이아웃 + 아코디언 토글 로직 |
| `src/styles/learn.css` | 수정 | `.summary-sidebar` 관련 스타일 추가 |

## 기능 상세

### 1. 데스크톱 사이드바 (1024px+)
- 좌측 고정 사이드바 (width: 260px)
- 과목 카테고리별 드롭다운 메뉴
- 스크롤 시 `position: sticky` (상단 고정)
- 모바일에서는 숨김 → 기존 가로 필터 탭 유지

### 2. 아코디언 방식 드롭다운
- **하나만 열림**: 과목 클릭 시 다른 과목 자동 접힘
- 열린 과목 재클릭 → 접힘 (토글)
- 드롭다운 내 세부 주제 목록 표시
- 주제 클릭 → 해당 카드로 스크롤 이동 + 아코디언 펼침

### 3. 상태 관리
```tsx
const [openSidebarCat, setOpenSidebarCat] = useState<string | null>(null);

const toggleSidebarCat = (catId: string) => {
  setOpenSidebarCat(prev => prev === catId ? null : catId);
};
```

### 4. CSS 구조
```css
.summary-layout {
  display: flex;
  gap: 2rem;
}
.summary-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
.summary-main {
  flex: 1;
  min-width: 0;
}
```

## 커밋 이력

```
8a8d6bd fix: 사이드바 드롭다운 아코디언 방식으로 변경 (하나만 열림)
83b2100 feat: 학습요약 페이지 데스크톱 왼쪽 사이드바 과목별 드롭다운 메뉴 추가
```

## 검증

- [x] 데스크톱(1024px+): 좌측 사이드바 표시, 아코디언 동작
- [x] 모바일(<1024px): 사이드바 숨김, 가로 필터 탭 표시
- [x] 주제 클릭 → 해당 카드 스크롤 이동 정상
- [x] 빌드 성공 → gh-pages 배포 완료
