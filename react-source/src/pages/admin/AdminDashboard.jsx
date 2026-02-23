import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { getDashboardCounts, getRecentOrders, getPaymentStats } from '../../utils/adminStorage';
import { getBlogPosts, getBoardPosts, getGalleryItems } from '../../utils/boardStorage';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatPrice } from '../../utils/format';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const [counts, setCounts] = useState(null);
  const [payment, setPayment] = useState({ paidCount: 0, totalAmount: 0, cancelledCount: 0, cancelledAmount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, pay, orders, blogs, boards, galleries] = await Promise.all([
      getDashboardCounts(),
      getPaymentStats(),
      getRecentOrders(5),
      getBlogPosts(),
      getBoardPosts(),
      getGalleryItems()
    ]);
    setPayment(pay);
    setCounts(c);
    setRecentOrders(orders);
    setGalleryCount(galleries?.length || 0);
    const allPosts = [
      ...blogs.slice(0, 5).map((p) => ({ ...p, type: '블로그' })),
      ...boards.slice(0, 5).map((p) => ({ ...p, type: '게시판' }))
    ].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
    setRecentPosts(allPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !counts) {
    return <div className="admin-loading"><div className="loading-spinner"></div></div>;
  }

  // --- Derived data ---
  const totalRevenue = payment.totalAmount + (payment.cancelledAmount || 0);
  const paidRatio = totalRevenue > 0 ? (payment.totalAmount / totalRevenue) * 100 : 0;
  const cancelRatio = totalRevenue > 0 ? ((payment.cancelledAmount || 0) / totalRevenue) * 100 : 0;
  const totalTx = payment.paidCount + (payment.cancelledCount || 0);
  const successRate = totalTx > 0 ? ((payment.paidCount / totalTx) * 100).toFixed(1) : '0.0';
  const avgOrder = payment.paidCount > 0 ? Math.round(payment.totalAmount / payment.paidCount) : 0;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '관리자';
  const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  // Content distribution
  const contentItems = [
    { label: '블로그', count: counts.blogPosts, color: '#8B5CF6' },
    { label: '갤러리', count: galleryCount || counts.galleryItems, color: '#EC4899' },
    { label: '게시판', count: counts.boardPosts, color: '#F59E0B' },
    { label: '강의계획서', count: counts.syllabi, color: '#10B981' },
    { label: '상품', count: counts.products, color: '#EF4444' }
  ];
  const totalContent = contentItems.reduce((s, c) => s + c.count, 0);

  // Icons
  const icons = {
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    blog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    gallery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    board: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    syllabus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    product: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    revenue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    paid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    order: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    cancel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    refresh: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
  };

  const statusLabel = (s) => {
    const map = { paid: '결제완료', pending: '대기', failed: '실패', cancelled: '취소', refunded: '환불' };
    return map[s] || s || '대기';
  };

  const statusColor = (s) => {
    const map = { paid: 'green', pending: 'yellow', failed: 'red', cancelled: 'red', refunded: 'purple' };
    return map[s] || 'gray';
  };

  const typeIcon = (type) => {
    if (type === '블로그') return icons.blog;
    return icons.board;
  };

  // Quick action links
  const quickActions = [
    { label: '상품 관리', to: '/admin/products', icon: icons.product, color: '#EF4444' },
    { label: '주문 관리', to: '/admin/orders', icon: icons.order, color: '#06B6D4' },
    { label: '블로그 관리', to: '/admin/blog', icon: icons.blog, color: '#8B5CF6' },
    { label: '회원 관리', to: '/admin/users', icon: icons.users, color: '#3B82F6' },
    { label: '갤러리 관리', to: '/admin/gallery', icon: icons.gallery, color: '#EC4899' },
    { label: '게시판 관리', to: '/admin/board', icon: icons.board, color: '#F59E0B' }
  ];

  return (
    <div className="dash-container">
      {/* ── ZONE 1: Welcome Header ── */}
      <div className="dash-welcome">
        <div className="dash-welcome-content">
          <div className="dash-welcome-text">
            <h2>안녕하세요, {displayName}님</h2>
            <p className="dash-welcome-date">{todayStr}</p>
            <p className="dash-welcome-summary">
              주문 {counts.orders.toLocaleString()}건 · 결제완료 {payment.paidCount.toLocaleString()}건 · 회원 {counts.users.toLocaleString()}명
            </p>
          </div>
          <button className="dash-refresh-btn" onClick={load} disabled={loading}>
            {icons.refresh}
            새로고침
          </button>
        </div>
      </div>

      {/* ── ZONE 2: Commerce Hero Stats ── */}
      <div className="dash-hero-stats">
        <AdminStatCard icon={icons.revenue} value={formatPrice(payment.totalAmount)} label="총 매출" color="#D97706" />
        <AdminStatCard icon={icons.paid} value={payment.paidCount} label="결제완료" color="#059669" />
        <AdminStatCard icon={icons.order} value={counts.orders} label="총 주문" color="#06B6D4" />
        <AdminStatCard icon={icons.cancel} value={`${(payment.cancelledCount || 0)}건 / ${formatPrice(payment.cancelledAmount || 0)}`} label="취소/환불" color="#DC2626" />
      </div>

      {/* ── ZONE 3: Content Stats + Revenue ── */}
      <div className="dash-split-row">
        {/* Zone 3a: 콘텐츠 & 회원 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>콘텐츠 & 회원</h3>
          </div>
          <div className="dash-compact-stats">
            <AdminStatCard icon={icons.users} value={counts.users} label="회원" color="#3B82F6" />
            <AdminStatCard icon={icons.blog} value={counts.blogPosts} label="블로그" color="#8B5CF6" />
            <AdminStatCard icon={icons.gallery} value={galleryCount || counts.galleryItems} label="갤러리" color="#EC4899" />
            <AdminStatCard icon={icons.board} value={counts.boardPosts} label="게시판" color="#F59E0B" />
            <AdminStatCard icon={icons.syllabus} value={counts.syllabi} label="강의계획서" color="#10B981" />
            <AdminStatCard icon={icons.product} value={counts.products} label="상품" color="#EF4444" />
          </div>
        </div>

        {/* Zone 3b: 매출 현황 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>매출 현황</h3>
          </div>
          <div className="dash-panel-body dash-revenue">
            <div className="dash-revenue-bars">
              <div className="dash-bar-group">
                <div className="dash-bar-label">
                  <span>결제</span>
                  <span className="dash-bar-value">{formatPrice(payment.totalAmount)}</span>
                </div>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill dash-bar-paid" style={{ width: `${paidRatio}%` }}></div>
                </div>
              </div>
              <div className="dash-bar-group">
                <div className="dash-bar-label">
                  <span>취소</span>
                  <span className="dash-bar-value">{formatPrice(payment.cancelledAmount || 0)}</span>
                </div>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill dash-bar-cancel" style={{ width: `${cancelRatio}%` }}></div>
                </div>
              </div>
            </div>
            <div className="dash-revenue-metrics">
              <div className="dash-metric">
                <span className="dash-metric-value">{totalTx.toLocaleString()}건</span>
                <span className="dash-metric-label">총 거래</span>
              </div>
              <div className="dash-metric">
                <span className="dash-metric-value">{successRate}%</span>
                <span className="dash-metric-label">결제 성공률</span>
              </div>
              <div className="dash-metric">
                <span className="dash-metric-value">{formatPrice(avgOrder)}</span>
                <span className="dash-metric-label">평균 주문</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ZONE 4: Recent Orders + Content Distribution ── */}
      <div className="dash-split-row">
        {/* Zone 4a: 최근 주문 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>최근 주문</h3>
            <Link to="/admin/orders">전체보기</Link>
          </div>
          <div className="dash-panel-body dash-panel-body-flush">
            {recentOrders.length === 0 ? (
              <div className="admin-empty"><p>최근 주문이 없습니다.</p></div>
            ) : (
              <ul className="admin-recent-list">
                {recentOrders.map((order) => (
                  <li key={order.id} className="admin-recent-item">
                    <div className="admin-recent-info">
                      <div className="admin-recent-title">{order.order_number}</div>
                      <div className="admin-recent-meta">
                        {order.user_name || order.user_email} · {formatPrice(order.total_amount)} · {formatDate(order.created_at)}
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

        {/* Zone 4b: 콘텐츠 분포 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>콘텐츠 분포</h3>
            <span className="dash-panel-sub">총 {totalContent.toLocaleString()}건</span>
          </div>
          <div className="dash-panel-body">
            {totalContent > 0 ? (
              <>
                <div className="dash-stack-bar">
                  {contentItems.map((item) => (
                    item.count > 0 && (
                      <div
                        key={item.label}
                        className="dash-stack-segment"
                        style={{ width: `${(item.count / totalContent) * 100}%`, background: item.color }}
                        title={`${item.label}: ${item.count}건`}
                      ></div>
                    )
                  ))}
                </div>
                <div className="dash-legend">
                  {contentItems.map((item) => (
                    <div key={item.label} className="dash-legend-item">
                      <span className="dash-legend-dot" style={{ background: item.color }}></span>
                      <span className="dash-legend-label">{item.label}</span>
                      <span className="dash-legend-count">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="admin-empty"><p>등록된 콘텐츠가 없습니다.</p></div>
            )}
          </div>
        </div>
      </div>

      {/* ── ZONE 5: Recent Content + Quick Actions ── */}
      <div className="dash-split-row">
        {/* Zone 5a: 최근 콘텐츠 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>최근 콘텐츠</h3>
            <Link to="/admin/blog">전체보기</Link>
          </div>
          <div className="dash-panel-body dash-panel-body-flush">
            {recentPosts.length === 0 ? (
              <div className="admin-empty"><p>최근 글이 없습니다.</p></div>
            ) : (
              <ul className="admin-recent-list">
                {recentPosts.map((post) => (
                  <li key={`${post.type}-${post.id}`} className="admin-recent-item">
                    <div className="dash-type-icon" style={{ color: post.type === '블로그' ? '#8B5CF6' : '#F59E0B' }}>
                      {typeIcon(post.type)}
                    </div>
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

        {/* Zone 5b: 바로가기 */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>바로가기</h3>
          </div>
          <div className="dash-panel-body">
            <div className="dash-quick-actions">
              {quickActions.map((action) => (
                <Link key={action.to} to={action.to} className="dash-quick-btn">
                  <span className="dash-quick-icon" style={{ background: action.color }}>
                    {action.icon}
                  </span>
                  <span className="dash-quick-label">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
