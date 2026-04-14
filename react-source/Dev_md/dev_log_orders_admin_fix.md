# DreamIT Biz - 주문관리/회원관리 버그 수정

## 날짜
2026-04-14

## 문제 상황
- 관리자 대시보드에서 주문 상태 변경 불가
- 주문 취소/환불 처리 시 DB 에러 발생
- 회원 등급 변경 시 superadmin/evaluator 설정 불가

## 근본 원인 분석

### 버그 1: orders UPDATE RLS 정책 누락
- SELECT 정책(관리자+본인)과 INSERT 정책(전체)만 존재
- UPDATE 정책이 없어서 `updateOrderStatus()` 호출 시 항상 실패
- 에러 메시지: "UPDATE_NO_ROWS: 주문 업데이트 권한이 없거나 해당 주문을 찾을 수 없습니다"

### 버그 2: orders 누락 컬럼
- `cancelled_at TIMESTAMPTZ` 컬럼 미존재
- `cancel_reason TEXT` 컬럼 미존재
- `supabase.js`의 `updateOrderStatus()`가 이 컬럼들에 쓰기 시도 → 에러 (fallback으로 동작하긴 하나 불완전)

### 버그 3: payment_status CHECK 제약조건
- 허용: `pending`, `paid`, `failed`, `cancelled`
- `refunded` 누락 → AdminOrders에서 환불 처리 불가

### 버그 4: order_items SELECT 정책 누락
- INSERT 정책만 존재, SELECT 정책 없음
- `getAllOrders()`에서 `select('*, order_items(*)')` 시 order_items가 빈 배열 반환

### 버그 5: user_profiles role CHECK 제약조건
- 허용: `user`, `admin`
- `superadmin`, `evaluator` 누락 → AdminUsers에서 등급 변경 시 DB 에러

## 수정 내용

### SQL 마이그레이션 (`Dev_md/migration_orders_admin_fix.sql`)
1. `cancelled_at`, `cancel_reason` 컬럼 추가
2. `payment_status` CHECK에 `refunded` 추가
3. `user_profiles` role CHECK에 `superadmin`, `evaluator` 추가
4. `orders` UPDATE 정책 추가 (admin/superadmin)
5. `order_items` SELECT 정책 추가 (admin + 본인 주문)
6. 관리자 계정 role 자동 설정

## 배포 후 필수 작업
1. Supabase SQL Editor에서 `migration_orders_admin_fix.sql` 실행
2. 관리자 대시보드에서 주문 상태 변경 테스트
3. 회원 관리에서 등급 변경 테스트
