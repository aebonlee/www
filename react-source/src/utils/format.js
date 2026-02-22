/** 날짜 포맷 — 25.02.23 14:30 형태 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

/** 날짜만 (2025-02-23) */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '-';
  return dateStr.slice(0, 10);
};

/** 금액 포맷 — 1,000원 */
export const formatPrice = (amount) => {
  if (amount == null) return '-';
  return `${Number(amount).toLocaleString()}원`;
};
