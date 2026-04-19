import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllUsers, getAllOrders } from '../../utils/adminStorage';
import { getCouponUserIds } from '../../utils/adminStorage';
import { formatDate, formatPrice } from '../../utils/format';
import { ADMIN_EMAILS } from '../../config/admin';

const getSiteName = (domain: string) => {
  if (!domain) return '-';
  const d = domain.toLowerCase();
  if (d.endsWith('.dreamitbiz.com')) return d.replace('.dreamitbiz.com', '') || 'www';
  if (d === 'dreamitbiz.com' || d === 'www.dreamitbiz.com') return 'www';
  return d;
};

const STATUS_LABELS: Record<string, string> = { active: '정상', banned: '차단', deleted: '탈퇴' };
const STATUS_COLORS: Record<string, string> = { active: 'green', banned: 'red', deleted: 'gray' };
const ROLE_LABELS: Record<string, string> = { admin: '관리자', superadmin: '최고관리자', evaluator: '평가자', user: '일반회원' };
const ORDER_STATUS_LABELS: Record<string, string> = { paid: '결제완료', pending: '대기', failed: '실패', cancelled: '취소', refunded: '환불' };
const ORDER_STATUS_COLORS: Record<string, string> = { paid: 'green', pending: 'yellow', failed: 'red', cancelled: 'gray', refunded: 'purple' };

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [couponIds, setCouponIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getAllUsers(), getAllOrders(), getCouponUserIds()]).then(([users, allOrders, coupons]) => {
      const found = users.find((u: any) => u.id === id);
      setUser(found || null);
      const userOrders = allOrders.filter((o: any) => o.user_id === id);
      setOrders(userOrders);
      setCouponIds(coupons);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="admin-loading"><div className="loading-spinner"></div></div>;
  }

  if (!user) {
    return (
      <div className="admin-empty" style={{ padding: '40px' }}>
        <p>회원을 찾을 수 없습니다.</p>
        <button className="admin-row-btn" onClick={() => navigate('/admin/users')} style={{ marginTop: '12px' }}>
          회원 목록으로
        </button>
      </div>
    );
  }

  const visitedSites = Array.isArray(user.visited_sites) && user.visited_sites.length > 0
    ? user.visited_sites
    : user.signup_domain ? [user.signup_domain] : [];

  const isAdmin = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
  const role = isAdmin ? 'admin' : (user.role || 'user');
  const status = user.status || 'active';
  const hasCoupon = couponIds.has(user.id);
  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const totalPaid = paidOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', gap: '16px', padding: '8px 0', borderBottom: '1px solid var(--border-color, #e5e7eb)' }}>
      <span style={{ width: '120px', fontSize: '13px', color: 'var(--text-light)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="admin-row-btn" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
          <h2>회원 상세</h2>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
          ID: <code style={{ fontSize: '11px', background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px' }}>{user.id}</code>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* 기본 정보 */}
        <div className="dash-panel">
          <div className="dash-panel-header"><h3>기본 정보</h3></div>
          <div className="dash-panel-body">
            <InfoRow label="이름" value={user.display_name || user.name || <span style={{ color: 'var(--text-light)' }}>-</span>} />
            <InfoRow label="이메일" value={user.email || '-'} />
            <InfoRow label="전화번호" value={user.phone || <span style={{ color: 'var(--text-light)' }}>-</span>} />
            <InfoRow label="상태" value={
              <span className={`td-badge ${STATUS_COLORS[status] || 'gray'}`}>
                {STATUS_LABELS[status] || status}
              </span>
            } />
            <InfoRow label="등급" value={
              <span className={`td-badge ${role === 'admin' || role === 'superadmin' ? 'red' : role === 'evaluator' ? 'purple' : 'blue'}`}>
                {ROLE_LABELS[role] || role}
              </span>
            } />
            <InfoRow label="가입방법" value={
              <span className={`td-badge ${user.provider === 'google' ? 'blue' : user.provider === 'kakao' ? 'yellow' : 'gray'}`}>
                {user.provider || 'email'}
              </span>
            } />
            <InfoRow label="가입 사이트" value={user.signup_domain ? getSiteName(user.signup_domain) : '-'} />
            <InfoRow label="가입일" value={user.created_at ? user.created_at.slice(0, 10) : '-'} />
            <InfoRow label="최종 로그인" value={user.last_sign_in_at ? user.last_sign_in_at.slice(0, 16).replace('T', ' ') : '-'} />
            <InfoRow label="최종 활동" value={user.last_active_at ? user.last_active_at.slice(0, 16).replace('T', ' ') : '-'} />
            {user.status_reason && (
              <InfoRow label="상태 사유" value={<span style={{ color: '#dc2626' }}>{user.status_reason}</span>} />
            )}
          </div>
        </div>

        {/* 결제 & 방문 사이트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 결제 요약 */}
          <div className="dash-panel">
            <div className="dash-panel-header"><h3>결제 현황</h3></div>
            <div className="dash-panel-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6' }}>{orders.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>총 주문</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{paidOrders.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>결제완료</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#D97706' }}>{formatPrice(totalPaid)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>총 결제액</div>
                </div>
              </div>
              {hasCoupon && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: '#d1fae5', borderRadius: '6px', fontSize: '12px', color: '#065f46', fontWeight: 600 }}>
                  쿠폰 사용 이력 있음
                </div>
              )}
            </div>
          </div>

          {/* 방문 사이트 */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <h3>방문 사이트</h3>
              <span className="dash-panel-sub">{visitedSites.length}개</span>
            </div>
            <div className="dash-panel-body">
              {visitedSites.length === 0 ? (
                <div className="admin-empty"><p>방문 사이트 없음</p></div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {visitedSites.map((domain: string) => {
                    const name = getSiteName(domain);
                    const isSignup = domain === user.signup_domain;
                    return (
                      <span
                        key={domain}
                        className="td-badge blue"
                        title={domain}
                        style={isSignup ? { fontWeight: 700, outline: '1px solid currentColor' } : undefined}
                      >
                        {name}{isSignup ? '*' : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 주문 이력 */}
      <div className="dash-panel" style={{ marginTop: '16px' }}>
        <div className="dash-panel-header">
          <h3>주문 이력</h3>
          <span className="dash-panel-sub">{orders.length}건</span>
        </div>
        <div className="dash-panel-body-flush">
          {orders.length === 0 ? (
            <div className="admin-empty"><p>주문 이력이 없습니다.</p></div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover, #f9fafb)' }}>
                  {['사이트', '주문번호', '금액', '상태', '주문일'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <span className="td-badge gray">{order.site || 'www'}</span>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {order.order_number || order.id?.slice(0, 8)}
                    </td>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>
                      {formatPrice(order.total_amount || 0)}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span className={`td-badge ${ORDER_STATUS_COLORS[order.payment_status] || 'gray'}`}>
                        {ORDER_STATUS_LABELS[order.payment_status] || order.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-light)' }}>
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUserDetail;
