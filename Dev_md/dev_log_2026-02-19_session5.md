# 개발 로그 - 2026-02-19 (세션 5)

## 작업자: Claude Opus 4.6

---

## 세션 15: 히어로 슬라이드 텍스트 줄바꿈 조정

**커밋**: `614f358` fix: 히어로 슬라이드 텍스트 줄바꿈 조정

### 문제

- **슬라이드 2** ("웹개발 · 호스팅 · 디자인"): 두 번째 줄 "강력한 디지털 존재감을 구축합니다"에서 마지막 글자 "다"만 다음 줄로 넘어감
- **슬라이드 3** ("연구개발 & 컨설팅"): "데이터 기반 혁신 컨설팅으로 성장합니다"에서 "성장합니다"를 의도적으로 다음 줄로 배치 요청

### 해결

#### 1. 슬라이드 2 — max-width 확대

| 파일 | 변경 |
|------|------|
| `src/styles/hero.css` | `.hero-content` max-width: `800px` → `880px` |

60px 폰트에서 약 15자+공백의 한글 텍스트가 800px 안에 들어가지 않아 1글자가 넘어가는 문제. 80px 확대로 해결.

#### 2. 슬라이드 3 — line4 필드 추가

| 파일 | 변경 |
|------|------|
| `src/components/HeroCarousel.jsx` | `line4` 조건부 렌더링 추가 |
| `src/utils/translations.js` | 슬라이드 3 `line3: '으로'`, `line4: '성장합니다'` |

```jsx
{slides[current].line4 && (
  <span className="title-line">{slides[current].line4}</span>
)}
```

기존 슬라이드에는 영향 없음 (line4 미설정 시 렌더링 안 됨).

---

## 세션 16: 메뉴명 변경 및 사이트 전반 개선

**커밋**: `8d0c9cb` feat: 메뉴명 및 본문 다수 개선

### 변경 내역 총 7건

---

### 1. 디자인 → "디자인 & 디지털콘텐츠"

메뉴명 변경과 함께 서비스 범위를 디지털 콘텐츠(영상, SNS)까지 확장.

#### 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/utils/translations.js` | `services.design`, `homeServices.design` 한/영 메뉴명 + 설명 변경 |
| `src/data/serviceDetails.js` | title, subtitle, overview, designServices(4→6개), process, tools(6→8개), CTA 전면 수정 |
| `src/pages/Services.jsx` | 카드 description/features 변경 |
| `src/pages/ServiceDetail.jsx` | 섹션 제목 변경 ("디자인 서비스"→"서비스 영역", "디자인 도구"→"제작 도구", "디자인 프로세스"→"제작 프로세스") |

#### 서비스 영역 변경 (designServices 배열)

| 변경 전 (4개) | 변경 후 (6개) |
|--------------|--------------|
| 브랜드 디자인 | 브랜드 디자인 |
| UI/UX 디자인 | UI/UX 디자인 |
| 편집 디자인 | **영상 & 모션그래픽** (신규) |
| 웹/앱 디자인 | **SNS 콘텐츠** (신규) |
| | 편집 디자인 |
| | 웹/앱 디자인 |

#### 도구 목록 변경

| 변경 전 | 변경 후 (추가분) |
|---------|----------------|
| Figma, Photoshop, Illustrator, XD, Sketch, InDesign | + **Premiere Pro**, **After Effects**, **Canva** (XD → 제거 안 하고 유지는 안 됨... Sketch 제거) |

최종: Figma, Photoshop, Illustrator, Premiere Pro, After Effects, XD, Canva, InDesign (8개)

---

### 2. 책 → "도서 & 교육교재"

#### 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/utils/translations.js` | `publishing.book`, `publishing.bookTitle`, `publishing.bookDesc` 한/영 변경 |
| `src/utils/translations.js` | `shop.book` 한/영 변경 |
| `src/data/publishingDetails.js` | `book.title`, `book.titleEn`, `book.subtitle`, `book.subtitleEn` 변경 |

---

### 3. 푸터 DreamIT Biz 컬러 가독성 개선

#### 문제

navbar.css의 `.brand-it` (color: `--text-primary` = #111827)과 `.brand-biz` (color: `--primary-blue-dark` = #002E8A)가 어두운 푸터 배경(#111827~#0A0F1A)에서 보이지 않음.

#### 해결

| 파일 | 변경 |
|------|------|
| `src/styles/footer.css` | `.footer-brand .brand-it { color: #FFFFFF; }` 추가 |
| `src/styles/footer.css` | `.footer-brand .brand-biz { color: #93C5FD; }` 추가 |

결과: Dream(연파랑) **IT**(흰색) **Biz**(밝은 파랑) — 어두운 배경에서 명확한 가독성

---

### 4. 푸터 연락처 "419호" 줄바꿈 방지

#### 문제

`footer-content` 그리드가 `2fr 1.5fr 1fr`로 연락처 컬럼이 좁아 "경기도 수원시 팔달구 매산로 45, 419호"의 "419호"가 다음줄로 넘어감.

#### 해결

| 파일 | 변경 |
|------|------|
| `src/styles/footer.css` | `grid-template-columns: 2fr 1.5fr 1fr` → `2fr 1.5fr 1.3fr` |

---

### 5. 고객후기 이름 중간글자 마스킹

개인정보 보호를 위해 3글자 한국 이름의 가운데 글자를 ○으로 마스킹.

| 파일 | 변경 |
|------|------|
| `src/pages/Home.jsx` | 고객후기 6명 이름 변경 |

| 변경 전 | 변경 후 |
|---------|---------|
| 김민수 | 김○수 |
| 박지영 | 박○영 |
| 이상훈 | 이○훈 |
| 최윤아 | 최○아 |
| 정수현 | 정○현 |
| 강동원 | 강○원 |

---

### 6. 연구개발 회사명 표기 변경

| 파일 | 변경 |
|------|------|
| `src/pages/RnD.jsx` | 한국어: "드림아이티(현 드림아이티비즈의 전신)" → "드림아이티(DreamIT)" |
| `src/pages/RnD.jsx` | 영어: "DreamIT (predecessor of DreamIT Biz)" → "DreamIT" |

---

### 7. 연구개발 통계 4개 항목 인라인(1줄) 표시

#### 문제

`.about-stats` 그리드가 `repeat(3, 1fr)`로 설정되어 4번째 통계 항목("100% 정부지원 과제")이 두 번째 줄로 떨어짐.

#### 해결

| 파일 | 변경 |
|------|------|
| `src/pages/RnD.jsx` | `className="about-stats"` → `className="about-stats rnd-stats"` |
| `src/styles/about.css` | `.about-stats.rnd-stats { grid-template-columns: repeat(4, 1fr); }` 추가 |
| `src/styles/responsive.css` (1024px) | `.about-stats.rnd-stats { grid-template-columns: repeat(4, 1fr); }` |
| `src/styles/responsive.css` (480px) | `.about-stats.rnd-stats { grid-template-columns: repeat(2, 1fr); }` |

통계 4개: `5 연구개발 과제` | `44 개월 연구 수행` | `6 년간 R&D 수행` | `100% 정부지원 과제`

모바일에서는 2×2 그리드로 폴백.

---

## 수정 파일 종합

| 파일 | 세션 15 | 세션 16 |
|------|---------|---------|
| `src/styles/hero.css` | max-width 변경 | |
| `src/components/HeroCarousel.jsx` | line4 렌더링 | |
| `src/utils/translations.js` | 슬라이드 3 line4 | 디자인, 책, 스토어 메뉴명 한/영 |
| `src/data/serviceDetails.js` | | 디자인 서비스 전면 수정 |
| `src/pages/Services.jsx` | | 카드 설명/features |
| `src/pages/ServiceDetail.jsx` | | 섹션 제목 3곳 |
| `src/data/publishingDetails.js` | | 책 title/subtitle |
| `src/styles/footer.css` | | brand-it/biz 컬러, 그리드 너비 |
| `src/pages/Home.jsx` | | 고객후기 이름 마스킹 |
| `src/pages/RnD.jsx` | | 회사명 표기, rnd-stats 클래스 |
| `src/styles/about.css` | | rnd-stats 4열 그리드 |
| `src/styles/responsive.css` | | rnd-stats 반응형 |

---

## 다음 작업 예정

- Supabase 연동 (게시판/블로그/갤러리 데이터 DB 전환)
- 갤러리 실제 이미지 업로드 (Supabase Storage)
- 블로그 글쓰기/수정 기능
- 인증 시스템 (Supabase Auth)
- 댓글 기능
