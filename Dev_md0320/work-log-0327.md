# 작업 로그 - 2026-03-27

## 작업 개요
장바구니/결제 시스템 버그 수정 + 히어로 영역 모바일 반응형 CSS 추가 + 배포

---

## Phase 1: 장바구니/결제 버그 수정 (3개 프로젝트, 9개 파일)

### Fix 1. `_memoryOrders` TDZ 에러 방지 (supabase.js)
- **문제**: `let _memoryOrders = [];`가 파일 끝(216행)에 선언, 37행에서 사용 → Temporal Dead Zone
- **수정**: 선언을 파일 상단 (`let supabase = null;` 아래)으로 이동
- **파일**: edu-hub, papers, templete-ref의 `src/utils/supabase.js`

### Fix 2. 장바구니 합계 NaN 방어 (CartContext.jsx)
- **문제**: `item.price`가 undefined이면 cartTotal이 NaN
- **수정**: `(Number(item.price) || 0) * (Number(item.quantity) || 0)` 가드 추가
- **파일**: edu-hub, papers, templete-ref의 `src/contexts/CartContext.jsx`

### Fix 3. 수량 + 버튼 max 제한 (Cart.jsx)
- **문제**: + 버튼에 max 제한 없음 (- 버튼은 min 제한 있음)
- **수정**: `disabled={item.quantity >= 99}` 추가
- **파일**: edu-hub, papers, templete-ref의 `src/pages/Cart.jsx`

---

## Phase 2: 히어로 CSS 반응형 추가 (20개 프로젝트, 20개 파일)

### Fix 4. 모바일 반응형 미디어쿼리 추가 (hero.css)
- **문제**: hero-title 56~60px 고정 → 모바일에서 텍스트 오버플로우
- **참조**: eip만 유일하게 반응형 구현 → 나머지 20개에 동일 적용

**브레이크포인트**: 1024px (태블릿), 768px (모바일), 480px (소형 모바일)

**대상 프로젝트**: koreatech, allthat, reserve, papers, self-branding, marketing, uxdesign, digitalbiz, db-study, edu-hub, data-structure, linux-study, templete-ref, coding, ai-prompt, ai-data, software, docs, teaching, python-study

---

## Phase 3: 기타 정리 및 배포

### .gitignore 정리
- **software**: `.claude/`, `NUL` 추가 + `public/CNAME` 커밋
- **python-study**: `.claude/` 추가

### 빌드 & 배포 완료 (전 20개 프로젝트)
- 커밋 메시지: `fix: 장바구니/결제 버그 수정 및 히어로 반응형 CSS 추가`
- 전체 `npm run build` → `git push` → `npx gh-pages -d dist` 완료

---

## 트러블슈팅

| 이슈 | 원인 | 해결 |
|------|------|------|
| software `git add -A` 실패 | Windows `NUL` 특수 파일 | `git add src/styles/hero.css`로 특정 파일만 추가 |
| teaching 커밋 실패 | 이미 커밋된 상태 | 배포만 수행 |

---

## 미처리 항목
- `contact@dreamitbiz.com` → `aebon@dreamitbiz.com` 이메일 변경 요청 (소스코드에서 미발견, DB/환경변수 확인 필요)
