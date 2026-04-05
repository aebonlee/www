import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllOrders } from '../../utils/adminStorage';
import { updateOrderStatus } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';
import { formatDate, formatPrice } from '../../utils/format';

const STATUS_LABELS = { paid: '결제완료', pending: '대기', failed: '실패', cancelled: '취소', refunded: '환불' };
const STATUS_COLORS = { paid: 'green', pending: 'yellow', failed: 'red', cancelled: 'gray', refunded: 'purple' };
const METHOD_LABELS = { card: '카드결제', transfer: '계좌이체' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [cancelMemo, setCancelMemo] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus, memo = '') => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, null, memo);
      showToast('주문 상태가 변경되었습니다.', 'success');
      setDetail(null);
      await load();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('UPDATE_NO_ROWS')) {
        showToast('업데이트 권한 없음 — Supabase orders 테이블에 UPDATE 정책을 추가하세요.', 'error');
      } else {
        showToast(`상태 변경 실패: ${msg || '알 수 없는 오류'}`, 'error');
      }
      console.error('Order status update error:', err);
    }
    setUpdating(false);
  };

  const handleCancel = async (order) => {
    if (!cancelMemo.trim()) {
      showToast('취소 사유를 입력해주세요.', 'error');
      return;
    }
    await handleStatusChange(order.id, 'cancelled', cancelMemo.trim());
    setCancelMemo('');
  };

  const statusFilters = useMemo(() => {
    const all = orders.map((o) => o.payment_status || 'pending');
    const unique = [...new Set(all)];
    // fixed order
    const order = ['paid', 'pending', 'cancelled', 'failed', 'refunded'];
    return order.filter(s => unique.includes(s));
  }, [orders]);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => (o.payment_status || 'pending') === filter);
  }, [orders, filter]);

  // Summary stats
  const summary = useMemo(() => {
    const paid = orders.filter(o => o.payment_status === 'paid');
    const cancelled = orders.filter(o => o.payment_status === 'cancelled');
    return {
      totalOrders: orders.length,
      paidCount: paid.length,
      paidAmount: paid.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
      cancelledCount: cancelled.length,
      cancelledAmount: cancelled.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
    };
  }, [orders]);

  const columns = [
    { key: 'order_number', label: '주문번호', className: 'td-title' },
    { key: 'user_name', label: '주문자', width: '100px', render: (val, row) => val || row.user_email?.split('@')[0] || '-' },
    {
      key: 'total_amount', label: '금액', width: '110px',
      render: (val) => formatPrice(val)
    },
    { key: 'payment_method', label: '결제수단', width: '90px', render: (val) => METHOD_LABELS[val] || val || '-' },
    {
      key: 'payment_status', label: '상태', width: '90px',
      render: (val) => {
        const st = val || 'pending';
        return <span className={`td-badge ${STATUS_COLORS[st] || 'gray'}`}>{STATUS_LABELS[st] || st}</span>;
      }
    },
    {
      key: 'created_at', label: '주문일시', width: '140px',
      render: (val) => formatDate(val)
    }
  ];

  const expandRow = (row) => {
    const items = row.order_items || [];
    const st = row.payment_status || 'pending';
    return (
      <div className="admin-order-expand">
        <div className="admin-order-detail-grid">
          {/* Left: 주문 정보 */}
          <div className="admin-order-detail-info">
            <h4>주문 정보</h4>
            <dl className="admin-order-dl">
              <dt>주문번호</dt><dd>{row.order_number}</dd>
              <dt>주문자</dt><dd>{row.user_name || '-'}</dd>
              <dt>이메일</dt><dd>{row.user_email || '-'}</dd>
              <dt>전화번호</dt><dd>{row.user_phone || '-'}</dd>
              <dt>결제수단</dt><dd>{METHOD_LABELS[row.payment_method] || row.payment_method || '-'}</dd>
              <dt>결제금액</dt><dd style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{formatPrice(row.total_amount || 0)}</dd>
              {row.portone_payment_id && <><dt>결제 ID</dt><dd style={{ fontSize: '11px', fontFamily: 'monospace' }}>{row.portone_payment_id}</dd></>}
              {row.paid_at && <><dt>결제일시</dt><dd>{new Date(row.paid_at).toLocaleString('ko-KR')}</dd></>}
              {row.cancelled_at && <><dt>취소일시</dt><dd style={{ color: '#dc2626' }}>{new Date(row.cancelled_at).toLocaleString('ko-KR')}</dd></>}
              {row.cancel_reason && <><dt>취소사유</dt><dd style={{ color: '#dc2626' }}>{row.cancel_reason}</dd></>}
            </dl>
          </div>

          {/* Right: 주문 항목 */}
          <div className="admin-order-detail-items">
            <h4>주문 항목 ({items.length}건)</h4>
            {items.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>항목 없음</p>
            ) : (
              <table className="admin-order-item-table">
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>소계</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.product_title}</td>
                      <td>{formatPrice(item.unit_price || 0)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.subtotal || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="admin-order-actions">
          <div className="admin-order-status-group">
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>상태 변경:</span>
            {['pending', 'paid', 'cancelled', 'failed', 'refunded'].map(s => (
              <button
                key={s}
                className={`admin-order-status-btn ${st === s ? 'active' : ''}`}
                data-status={s}
                disabled={st === s || updating}
                onClick={(e) => {
                  e.stopPropagation();
                  if (s === 'cancelled') {
                    setDetail(row);
                  } else {
                    handleStatusChange(row.id, s);
                  }
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Cancel form inline */}
          {detail?.id === row.id && (
            <div className="admin-cancel-form" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                placeholder="취소 사유를 입력하세요..."
                value={cancelMemo}
                onChange={e => setCancelMemo(e.target.value)}
                className="admin-cancel-input"
              />
              <button
                className="admin-cancel-btn confirm"
                disabled={updating || !cancelMemo.trim()}
                onClick={() => handleCancel(row)}
              >
                취소 확정
              </button>
              <button
                className="admin-cancel-btn dismiss"
                onClick={() => { setDetail(null); setCancelMemo(''); }}
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="admin-page-header">
        <h2>주문 관리</h2>
        <button className="admin-refresh-btn" onClick={load} disabled={loading}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Summary cards */}
      <div className="admin-order-summary">
        <div className="admin-order-summary-card">
          <span className="admin-order-summary-label">전체 주문</span>
          <span className="admin-order-summary-value">{summary.totalOrders}건</span>
        </div>
        <div className="admin-order-summary-card paid">
          <span className="admin-order-summary-label">결제완료</span>
          <span className="admin-order-summary-value">{summary.paidCount}건 / {summary.paidAmount.toLocaleString()}원</span>
        </div>
        <div className="admin-order-summary-card cancelled">
          <span className="admin-order-summary-label">취소</span>
          <span className="admin-order-summary-value">{summary.cancelledCount}건 / {summary.cancelledAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="admin-filter-tabs">
        <button className={`admin-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          전체<span className="admin-filter-count">({orders.length})</span>
        </button>
        {statusFilters.map((st) => {
          const count = orders.filter((o) => (o.payment_status || 'pending') === st).length;
          return (
            <button key={st} className={`admin-filter-tab ${filter === st ? 'active' : ''}`} onClick={() => setFilter(st)}>
              {STATUS_LABELS[st] || st}<span className="admin-filter-count">({count})</span>
            </button>
          );
        })}
      </div>

      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKeys={['order_number', 'user_name', 'user_email', 'user_phone']}
        expandRow={expandRow}
      />
    </>
  );
};

export default AdminOrders;
