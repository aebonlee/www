import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getOrderByNumber } from '../utils/supabase';
import useAOS from '../hooks/useAOS';

const OrderConfirmation = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const isEn = language === 'en';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useAOS();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }
      try {
        const data = await getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderNumber]);

  const formatPrice = (price) => {
    return isEn
      ? `₩${price.toLocaleString()}`
      : `${price.toLocaleString()}${t('shop.currency')}`;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return t('order.paid');
      case 'pending': return t('order.pending');
      case 'failed': return t('order.failed');
      default: return status;
    }
  };

  if (loading) {
    return (
      <section className="page-header">
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('order.title')}</h1>
        </div>
      </section>

      <section className="order-section">
        <div className="container">
          <div className="order-confirmation" data-aos="fade-up">
            <div className="order-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2>{t('order.success')}</h2>

            {orderNumber && (
              <div className="order-info-box">
                <div className="order-info-row">
                  <span className="order-info-label">{t('order.orderNumber')}</span>
                  <span className="order-info-value">{orderNumber}</span>
                </div>
                {order && (
                  <div className="order-info-row">
                    <span className="order-info-label">{t('order.paymentStatus')}</span>
                    <span className={`order-status-badge ${order.payment_status || 'paid'}`}>
                      {getStatusLabel(order.payment_status || 'paid')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {order?.items && order.items.length > 0 && (
              <div className="order-details">
                <h3>{t('order.orderDetails')}</h3>
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>{t('order.productName')}</th>
                      <th>{t('order.unitPrice')}</th>
                      <th>{t('order.quantity')}</th>
                      <th>{t('order.subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.product_title}</td>
                        <td>{formatPrice(item.unit_price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3">{t('order.totalAmount')}</td>
                      <td className="order-total-cell">{formatPrice(order.total_amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="order-actions">
              <Link to="/shop" className="btn btn-primary">{t('order.backToShop')}</Link>
              <Link to="/" className="btn btn-secondary">{t('order.backToHome')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderConfirmation;
