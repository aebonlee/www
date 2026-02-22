import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { getDashboardCounts, getRecentOrders, getPaymentStats } from '../../utils/adminStorage';
import { getBlogPosts, getBoardPosts } from '../../utils/boardStorage';

const AdminDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [payment, setPayment] = useState({ paidCount: 0, totalAmount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [c, pay, orders, blogs, boards] = await Promise.all([
        getDashboardCounts(),
        getPaymentStats(),
        getRecentOrders(5),
        getBlogPosts(),
        getBoardPosts()
      ]);
      setPayment(pay);
      setCounts(c);
      setRecentOrders(orders);
      // Merge and sort recent posts
      const allPosts = [
        ...blogs.slice(0, 5).map((p) => ({ ...p, type: '블로그' })),
        ...boards.slice(0, 5).map((p) => ({ ...p, type: '게시판' }))
      ].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
      setRecentPosts(allPosts);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !counts) {
    return <div className="admin-loading"><div className="loading-spinner"></div></div>;
  }

  const stats = [
    { label: '회원', value: counts.users, color: '#3B82F6', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
    )},
    { label: '블로그', value: counts.blogPosts, color: '#8B5CF6', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    )},
    { label: '갤러리', value: counts.galleryItems, color: '#EC4899', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    )},
    { label: '게시판', value: counts.boardPosts, color: '#F59E0B', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    )},
    { label: '강의계획서', value: counts.syllabi, color: '#10B981', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    )},
    { label: '상품', value: counts.products, color: '#EF4444', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    )},
    { label: '주문', value: counts.orders, color: '#06B6D4', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    )},
    { label: '결제완료', value: payment.paidCount, color: '#059669', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )},
    { label: '결제금액', value: `${payment.totalAmount.toLocaleString()}원`, color: '#D97706', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    )}
  ];

  const statusLabel = (s) => {
    const map = { paid: '결제완료', pending: '대기', failed: '실패', cancelled: '취소' };
    return map[s] || s || '대기';
  };

  const statusColor = (s) => {
    const map = { paid: 'green', pending: 'yellow', failed: 'red', cancelled: 'gray' };
    return map[s] || 'gray';
  };

  return (
    <>
      <div className="admin-page-header">
        <h2>대시보드</h2>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <AdminStatCard key={s.label} icon={s.icon} value={s.value} label={s.label} color={s.color} />
        ))}
      </div>

      <div className="admin-dashboard-grid">
        {/* 최근 주문 */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>최근 주문</h3>
            <Link to="/admin/orders">전체보기</Link>
          </div>
          <div className="admin-section-body">
            {recentOrders.length === 0 ? (
              <div className="admin-empty"><p>최근 주문이 없습니다.</p></div>
            ) : (
              <ul className="admin-recent-list">
                {recentOrders.map((order) => (
                  <li key={order.id} className="admin-recent-item">
                    <div className="admin-recent-info">
                      <div className="admin-recent-title">{order.order_number}</div>
                      <div className="admin-recent-meta">
                        {order.user_name || order.user_email} · {Number(order.total_amount).toLocaleString()}원
                      </div>
                    </div>
                    <span className={`td-badge ${statusColor(order.payment_status)}`}>
                      {statusLabel(order.payment_status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 최근 글 */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>최근 콘텐츠</h3>
            <Link to="/admin/blog">전체보기</Link>
          </div>
          <div className="admin-section-body">
            {recentPosts.length === 0 ? (
              <div className="admin-empty"><p>최근 글이 없습니다.</p></div>
            ) : (
              <ul className="admin-recent-list">
                {recentPosts.map((post) => (
                  <li key={`${post.type}-${post.id}`} className="admin-recent-item">
                    <div className="admin-recent-info">
                      <div className="admin-recent-title">{post.title}</div>
                      <div className="admin-recent-meta">
                        {post.type} · {post.date || post.createdAt?.slice(0, 10)}
                      </div>
                    </div>
                    <span className={`td-badge ${post.type === '블로그' ? 'blue' : 'yellow'}`}>
                      {post.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
