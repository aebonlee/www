import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getOrdersByUser } from '../utils/supabase';
import '../styles/auth.css';

const OrderHistory = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEn = language === 'en';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(false);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders(data);
    } catch (err) {
      console.error('OrderHistory load error:', err);
      setError(true);
      showToast(t('auth.orderLoadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast, t]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatPrice = (price) => {
    return isEn
      ? `₩${price?.toLocaleString()}`
      : `${price?.toLocaleString()}${t('shop.currency')}`;
  };

  const statusBadge = (status) => {
    const labels = {
      paid: t('order.paid'),
      pending: t('order.pending'),
      failed: t('order.failed')
    };
    return (
      <span className={`order-status-badge ${status}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('auth.orderHistory')}</h1>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
                {t('community.loading') || '로딩 중...'}
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '15px' }}>
                  {t('auth.orderLoadError')}
                </p>
                <button
                  onClick={loadOrders}
                  className="btn btn-primary"
                  style={{ marginRight: '12px' }}
                >
                  {t('auth.retry')}
                </button>
                <Link to="/mypage" className="board-btn">{t('auth.myPage')}</Link>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>{t('auth.noOrders')}</p>
                <Link to="/shop" className="btn btn-primary">{t('order.backToShop')}</Link>
              </div>
            ) : (
              <div className="order-history-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-history-card">
                    <div className="order-history-header">
                      <div>
                        <span className="order-info-label">{t('order.orderNumber')}</span>
                        <span className="order-info-value" style={{ marginLeft: '8px' }}>
                          {order.order_number}
                        </span>
                      </div>
                      {statusBadge(order.payment_status)}
                    </div>
                    <div className="order-history-meta">
                      <span>{t('auth.orderDate')}: {new Date(order.created_at).toLocaleDateString()}</span>
                      <span>{t('auth.orderAmount')}: {formatPrice(order.total_amount)}</span>
                    </div>
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="order-history-items">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="order-history-item">
                            <span>{item.product_title} {item.quantity > 1 ? `× ${item.quantity}` : ''}</span>
                            <span>{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/mypage" className="board-btn">{t('auth.myPage')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderHistory;
