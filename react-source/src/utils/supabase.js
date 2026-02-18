import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase client - initialized only when env vars are set
let supabase = null;

const getSupabase = () => {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

/**
 * Create an order with order items
 * Falls back to localStorage when Supabase is not configured
 */
export const createOrder = async (orderData) => {
  const client = getSupabase();

  if (!client) {
    // Fallback: store order in localStorage for development/demo
    const order = {
      id: crypto.randomUUID(),
      ...orderData,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    orders.push(order);
    localStorage.setItem('dreamitbiz_orders', JSON.stringify(orders));
    return order;
  }

  // Insert order
  const { data: order, error: orderError } = await client
    .from('orders')
    .insert({
      order_number: orderData.order_number,
      user_email: orderData.user_email,
      user_name: orderData.user_name,
      user_phone: orderData.user_phone,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  if (orderData.items && orderData.items.length > 0) {
    const { error: itemsError } = await client
      .from('order_items')
      .insert(
        orderData.items.map(item => ({
          order_id: order.id,
          product_title: item.product_title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal
        }))
      );

    if (itemsError) throw itemsError;
  }

  return order;
};

/**
 * Get order by order number
 * Falls back to localStorage when Supabase is not configured
 */
export const getOrderByNumber = async (orderNumber) => {
  const client = getSupabase();

  if (!client) {
    // Fallback: read from localStorage
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    return orders.find(o => o.order_number === orderNumber) || null;
  }

  const { data: order, error } = await client
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;

  // Fetch order items
  const { data: items } = await client
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  return { ...order, items: items || [] };
};

/**
 * Update order payment status
 */
export const updateOrderStatus = async (orderId, status, paymentId) => {
  const client = getSupabase();

  if (!client) {
    // Fallback: update localStorage
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId || o.order_number === orderId);
    if (idx >= 0) {
      orders[idx].payment_status = status;
      orders[idx].portone_payment_id = paymentId;
      if (status === 'paid') orders[idx].paid_at = new Date().toISOString();
      localStorage.setItem('dreamitbiz_orders', JSON.stringify(orders));
    }
    return orders[idx];
  }

  const { data, error } = await client
    .from('orders')
    .update({
      payment_status: status,
      portone_payment_id: paymentId,
      ...(status === 'paid' ? { paid_at: new Date().toISOString() } : {})
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Verify payment via Edge Function
 */
export const verifyPayment = async (paymentId, orderId) => {
  const client = getSupabase();
  if (!client) {
    // Fallback: auto-approve for dev/demo
    await updateOrderStatus(orderId, 'paid', paymentId);
    return { verified: true };
  }

  const { data, error } = await client.functions.invoke('verify-payment', {
    body: { paymentId, orderId }
  });

  if (error) throw error;
  return data;
};

export default getSupabase;
