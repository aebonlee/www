/**
 * adminConstants.ts — 관리자 공용 상수 (역할, 상태, 프로바이더, 주문상태)
 */

export const ROLE_OPTIONS = [
  { value: 'member', label: '일반회원', color: 'blue' },
  { value: 'admin', label: '관리자', color: 'red' },
  { value: 'superadmin', label: '최고관리자', color: 'red' },
  { value: 'evaluator', label: '평가자', color: 'purple' },
];

export const STATUS_OPTIONS = [
  { value: 'active', label: '정상', color: 'green' },
  { value: 'banned', label: '차단', color: 'red' },
  { value: 'deleted', label: '탈퇴', color: 'gray' },
];

export const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  kakao: 'Kakao',
  email: 'Email',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  paid: '결제완료',
  pending: '대기',
  failed: '실패',
  cancelled: '취소',
  refunded: '환불',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  paid: 'green',
  pending: 'yellow',
  failed: 'red',
  cancelled: 'gray',
  refunded: 'purple',
};
