import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByUser } from '../utils/supabase';
import '../styles/auth.css';

const OrderHistory = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getOrdersByUser(user.id);
        setOrders(data);
      } catch (err) {
        console.error('OrderHistory load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

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
                로딩 중...
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
