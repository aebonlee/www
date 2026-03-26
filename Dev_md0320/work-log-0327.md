# 작업 로그 - 2026-03-27

> www 프로젝트 푸터 영역 개편

---

## 1. 푸터 구조 개편

### 변경 전
- **1열 (footer-brand)**: 로고 + 태그라인 + 사업자 정보 (company-info)
- **3열 (footer-contact)**: 주소 + 이메일 + 전화 + 카카오톡 + 영업시간 + Family Site
- **하단 (footer-bottom)**: `© 2020-{year} DreamIT Biz. All rights reserved.`

### 변경 후
- **1열 (footer-brand)**: 로고 + 태그라인 (company-info 제거 → 하단으로 이동)
- **3열 (footer-contact)**: 이메일(✉️ 아이콘 + mailto 링크) + 전화 + 카카오톡 + 영업시간 + Family Site (주소 제거)
- **하단 (footer-bottom)**:
  - `© 2025 드림아이티비즈(DreamIT Biz). All rights reserved.`
  - `Designed by Ph.D Aebon Lee | 대표이사: 이애본 | 사업자등록번호: 601-45-20154 | 통신판매신고번호: 제2024-수원팔달-0584호 | 출판사 신고번호: 제2026-000026호`

### 수정 파일
| 파일 | 변경 내용 |
|------|----------|
| `react-source/src/components/layout/Footer.jsx` | 구조 개편 (company-info 제거, 주소 제거, 하단 사업자 정보 추가) |
| `react-source/src/styles/footer.css` | `.footer-email`, `.footer-bottom-info` 스타일 추가 |
| `subsite-template/src/components/layout/Footer.jsx` | 동일 적용 |
| `subsite-template/src/styles/footer.css` | 동일 적용 |

## 2. 이메일 링크 스타일 개선

- 이메일에 ✉️ 아이콘 추가
- `mailto:` 링크 적용 (클릭 시 메일 클라이언트 열림)
- 호버 시 파란색(`#93C5FD` → `#BFDBFE`) 강조 + 밑줄

### CSS 추가
```css
.footer-email { display: flex; align-items: center; gap: 8px; }
.footer-email a { color: #93C5FD; font-weight: 500; }
.footer-email a:hover { color: #BFDBFE; text-decoration: underline; }
.footer-bottom-info { font-size: 12px; color: rgba(255,255,255,0.4); }
```

## 3. 커밋 이력

| 커밋 | 메시지 |
|------|--------|
| `f40247d` | fix: 푸터 연락처 이메일 스타일 개선 |
| `853c7bf` | fix: 푸터 이메일 aebon@dreamitbiz.com 복원 + 이메일 링크 스타일 개선 |
| `fc75de1` | refactor: 푸터 구조 개편 - 사업자 정보를 하단으로 이동, 주소 제거 |
