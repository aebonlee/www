# 사이트 전체 점검표: 파비콘 + 간격 + 타이포그래피 최적화

**작성일**: 2026-02-19
**대상 프로젝트**: DreamIT Biz React SPA
**CSS 파일 16개 전수 감사 결과**

---

## 점검 배경

- 파비콘이 Vite 기본 로고(`vite.svg`) 상태
- 섹션 간격·그리드 갭이 불규칙
- 한글 단어 끊김 방지(word-break)가 거의 없음
- 자간(letter-spacing)과 행간(line-height)이 일부 요소에만 설정됨

---

## 점검표

### A. 파비콘

| ID | 항목 | 상태 |
|----|------|------|
| A1 | 파비콘 변경 — Vite 기본 로고 → DreamIT Biz 전용 SVG 파비콘 | 수정 대상 |

- `public/vite.svg` → `public/favicon.svg` 교체
- `index.html` `<link rel="icon">` 경로 수정
- 디자인: "D" 이니셜 + 브랜드 블루(#0046C8) 라운드 아이콘

---

### B. 한글 가독성 (word-break)

| ID | 항목 | 파일 | 상태 |
|----|------|------|------|
| B1 | 글로벌 한글 단어 끊김 방지 — body에 추가 | base.css | 수정 대상 |
| B2 | 제목 요소 줄바꿈 보호 — h1~h4에 명시 추가 | base.css | 수정 대상 |

**B1 상세**: `word-break: keep-all; overflow-wrap: break-word;`
**B2 상세**: `h1, h2, h3, h4 { word-break: keep-all; overflow-wrap: break-word; }`

---

### C. 행간(line-height) 표준화

| ID | 항목 | 파일 | 수정 전 | 수정 후 | 상태 |
|----|------|------|---------|---------|------|
| C1 | 제목 행간 통일 | base.css | body 1.7 상속 | h1:1.3 / h2:1.35 / h3:1.4 / h4:1.45 | 수정 대상 |
| C2 | 블로그 제목 행간 한글 최적화 | blog.css | h3:1.4, h2:1.4 | h3:1.5, h2:1.45 | 수정 대상 |
| C3 | 본문 행간 통일 | community.css | 1.9 | 1.8 | 수정 대상 |

---

### D. 자간(letter-spacing) 보강

| ID | 항목 | 파일 | 수정 전 | 수정 후 | 상태 |
|----|------|------|---------|---------|------|
| D1 | 본문 자간 | base.css | 없음 | -0.01em | 수정 대상 |
| D2 | 소제목 자간 | base.css | 없음 | h3:-0.015em / h4:-0.01em | 수정 대상 |

---

### E. 섹션 간격(padding) 통일

| ID | 항목 | 파일 | 수정 전 | 수정 후 | 비고 | 상태 |
|----|------|------|---------|---------|------|------|
| E1 | 섹션 패딩 변수 | base.css | 100px | 80px | **변수 미사용 - 효과 없음** | 참고 |
| E2 | 히어로 하단 여백 | hero.css | 60px | 80px | | 수정 대상 |
| E3 | 푸터 상단 패딩 | footer.css | 60px 0 24px | 80px 0 32px | | 수정 대상 |

> **E1 참고**: `--section-padding` 변수는 `src/styles/` CSS에서 `var(--section-padding)`로 참조하는 곳이 없음. 변수 정의만 변경해도 시각적 변화 없음. 향후 사용 대비 값 정리 차원.

---

### F. 그리드 갭(gap) 정리

| ID | 항목 | 파일 | 수정 전 | 수정 후 | 상태 |
|----|------|------|---------|---------|------|
| F1 | 소형 갭 통일 — gallery-grid | community.css | 20px | 24px | 수정 대상 |
| F1 | 소형 갭 통일 — ceo-cert-grid | ceo.css | 16px | 24px | 수정 대상 |
| F2 | 대형 갭 축소 — about-wrapper | about.css | 80px | 60px | 수정 대상 |
| F2 | 대형 갭 축소 — project-content | portfolio.css | 60px | 48px | 수정 대상 |
| F2 | 대형 갭 축소 — contact-grid | contact.css | 60px | 48px | 수정 대상 |
| F2 | 대형 갭 축소 — footer-content | footer.css | 60px | 48px | 수정 대상 |

---

### G. 기타 미세 조정

| ID | 항목 | 파일 | 수정 전 | 수정 후 | 상태 |
|----|------|------|---------|---------|------|
| G1 | 카드 패딩 통일 — product-info | shop.css | 20px | 24px | 수정 대상 |
| G2 | 페이지네이션 갭 | community.css | 4px | 6px | 수정 대상 |

---

## 수정 파일 요약

| 파일 | 관련 항목 |
|------|----------|
| `public/favicon.svg` (신규) | A1 |
| `index.html` | A1 |
| `src/styles/base.css` | B1, B2, C1, D1, D2, E1 |
| `src/styles/hero.css` | E2 |
| `src/styles/footer.css` | E3, F2 |
| `src/styles/blog.css` | C2 |
| `src/styles/community.css` | C3, F1, G2 |
| `src/styles/about.css` | F2 |
| `src/styles/portfolio.css` | F2 |
| `src/styles/contact.css` | F2 |
| `src/styles/ceo.css` | F1 |
| `src/styles/shop.css` | G1 |

---

## 검증 체크리스트

- [ ] `npm run build` 성공
- [ ] 파비콘 브라우저 탭 표시 확인
- [ ] 한글 긴 제목 → 단어 단위 줄바꿈 확인
- [ ] 섹션 간 80px 균일 리듬 확인
- [ ] 모바일 480px 반응형 확인
- [ ] 다크모드 전환 시 정상 확인
