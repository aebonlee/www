# 사이트 전체 개선 계획 (17개 항목)

## 즉시 수정 (CRITICAL)

### 1. 404 페이지 추가
- PublicLayout.jsx에 catch-all Route 추가
- NotFound 페이지 컴포넌트 생성

### 2. 연락처 폼 실제 전송 구현
- Contact.jsx에 Supabase 테이블 저장 또는 mailto 연동
- contact_messages 테이블 활용

### 3. 삭제 확인 시 제목 표시
- AdminBlog, AdminGallery, AdminBoard, AdminSyllabus의 confirm 메시지에 글 제목 포함

### 4. AdminGuard 비관리자 안내 메시지
- 리다이렉트 전 토스트 메시지 표시: "관리자만 접근 가능합니다"

## 높은 우선순위 (HIGH)

### 5. 장바구니 수량 제한
- CartContext.jsx: 최대 수량 99로 제한
- Cart.jsx: 수량 입력 UI에 max 속성 추가

### 6. 체크아웃 폼 유효성 검증
- 이메일 정규식 검증
- 전화번호 형식 검증 (숫자 + 하이픈)
- 이름 필수 검증

### 7. 결제 완료 후 cart 비우기 타이밍 수정
- Checkout.jsx: 결제 검증 → cart 비우기 → 리다이렉트 순서로 변경

### 8. 관리 페이지 삭제 에러 토스트 추가
- AdminBlog, AdminGallery, AdminBoard, AdminSyllabus에 useToast 적용
- 삭제 실패 시 사용자에게 에러 토스트 표시

### 9. AdminProducts 삭제 기능 추가
- 상품 삭제 버튼 + 확인 다이얼로그
- productStorage.js에 deleteProduct 함수 확인/추가

### 10. 관리자 이메일 중앙 관리
- src/config/admin.js 파일 생성
- AuthContext, AdminUsers, AdminBlog에서 import하여 사용

## 중간 우선순위 (MEDIUM)

### 11. 이미지 업로드 파일 크기 제한
- ImageUpload.jsx: 5MB 제한 + 초과 시 에러 메시지

### 12. 주문 이력 페이지네이션
- OrderHistory.jsx: 페이지당 10건씩 표시

### 13. 대시보드 새로고침 버튼
- AdminDashboard.jsx: 데이터 리로드 버튼 추가

### 14. admin 다크모드 스타일 보완
- dark-mode.css: 누락된 admin 컴포넌트 다크모드 스타일 추가

### 15. 비밀번호 강도 검증 강화
- Register.jsx: 8자 이상 + 영문+숫자 조합 필수

### 16. 이미지 lazy loading 적용
- AdminGallery, AdminProducts: img 태그에 loading="lazy" + onError 핸들러

### 17. 날짜/금액 포맷 유틸 함수
- src/utils/format.js 생성
- formatDate(), formatPrice() 공통 함수
- 각 페이지에서 import하여 사용
