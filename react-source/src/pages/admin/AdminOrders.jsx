import { useState, useEffect, useMemo } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getAllOrders } from '../../utils/adminStorage';
import { updateOrderStatus } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';

const STATUS_LABELS = { paid: '결제완료', pending: '대기', failed: '실패', cancelled: '취소' };
const STATUS_COLORS = { paid: 'green', pending: 'yellow', failed: 'red', cancelled: 'gray' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast('주문 상태가 변경되었습니다.', 'success');
      load();
    } catch {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const statusFilters = useMemo(() => {
    const statuses = [...new Set(orders.map((o) => o.payment_status || 'pending'))];
    return statuses;
  }, [orders]);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => (o.payment_status || 'pending') === filter);
  }, [orders, filter]);

  const columns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'order_number', label: '주문번호', className: 'td-title' },
    { key: 'user_name', label: '주문자', width: '100px', render: (val, row) => val || row.user_email || '-' },
    {
      key: 'total_amount',
      label: '금액',
      width: '110px',
      render: (val) => val != null ? `${Number(val).toLocaleString()}원` : '-'
    },
    { key: 'payment_method', label: '결제수단', width: '100px', render: (val) => val || '-' },
    {
      key: 'payment_status',
      label: '상태',
      width: '120px',
      render: (val, row) => (
        <select
          className="admin-status-select"
          value={val || 'pending'}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">대기</option>
          <option value="paid">결제완료</option>
          <option value="failed">실패</option>
          <option value="cancelled">취소</option>
        </select>
      )
    },
    {
      key: 'created_at',
      label: '주문일시',
      width: '150px',
      render: (val) => val ? val.slice(0, 16).replace('T', ' ') : '-'
    }
  ];

  const expandRow = (row) => {
    const items = row.order_items || [];
    if (items.length === 0) return <div className="admin-order-expand"><p>주문 항목이 없습니다.</p></div>;
    return (
      <div className="admin-order-expand">
        <ul className="admin-order-items">
          {items.map((item, i) => (
            <li key={i}>
              <span>{item.product_title} x {item.quantity}</span>
              <span>{Number(item.subtotal).toLocaleString()}원</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="admin-page-header">
        <h2>주문 관리</h2>
      </div>
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
        searchKeys={['order_number', 'user_name', 'user_email']}
        expandRow={expandRow}
      />
    </>
  );
};

export default AdminOrders;
