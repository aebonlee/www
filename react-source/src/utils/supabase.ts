import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* ── SSO 크로스도메인 쿠키 헬퍼 ── */
const SSO_KEY = 'dreamit_sso';
const _isLocal = typeof window !== 'undefined' &&
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
const _cookieDomain = _isLocal ? '' : ';domain=.dreamitbiz.com';

export function setSharedSession(rt: string): void {
  document.cookie = `${SSO_KEY}=${rt}${_cookieDomain};path=/;max-age=2592000;SameSite=Lax${_isLocal ? '' : ';Secure'}`;
}
export function getSharedSession(): string | null {
  const m = document.cookie.match(/(^| )dreamit_sso=([^;]+)/);
  return m ? m[2] : null;
}
export function clearSharedSession(): void {
  document.cookie = `${SSO_KEY}=${_cookieDomain};path=/;max-age=0`;
}

// Supabase client - initialized only when env vars are set
let supabase: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient | null => {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true,
      }
    });
  }
  return supabase;
};

interface OrderItemData {
  product_title: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderData {
  order_number: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
  total_amount: number;
  payment_method: string;
  user_id?: string;
  items?: OrderItemData[];
}

interface MemoryOrder extends OrderData {
  id: string;
  payment_status: string;
  created_at: string;
  portone_payment_id?: string;
  paid_at?: string;
  cancelled_at?: string;
  cancel_reason?: string;
}

/**
 * Create an order with order items
 * Falls back to in-memory store when Supabase is not configured
 */
export const createOrder = async (orderData: OrderData) => {
  const client = getSupabase();

  if (!client) {
    const order: MemoryOrder = {
      id: crypto.randomUUID(),
      ...orderData,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };
    _memoryOrders.push(order);
    return order;
  }

  // Insert order
  const orderPayload: Record<string, unknown> = {
    order_number: orderData.order_number,
    user_email: orderData.user_email,
    user_name: orderData.user_name,
    user_phone: orderData.user_phone,
    total_amount: orderData.total_amount,
    payment_method: orderData.payment_method,
    site_domain: typeof window !== 'undefined' ? window.location.hostname : null
  };
  if (orderData.user_id) orderPayload.user_id = orderData.user_id;

  const { data: order, error: orderError } = await client
    .from('orders')
    .insert(orderPayload)
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
 * Falls back to in-memory store when Supabase is not configured
 */
export const getOrderByNumber = async (orderNumber: string) => {
  const client = getSupabase();

  if (!client) {
    return _memoryOrders.find(o => o.order_number === orderNumber) || null;
  }

  const { data: orders, error } = await client
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .limit(1);

  if (error) throw error;
  if (!orders || orders.length === 0) return null;

  const order = orders[0];

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
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  paymentId?: string,
  cancelReason?: string,
  tableName = 'orders'
) => {
  const client = getSupabase();

  if (!client) {
    const idx = _memoryOrders.findIndex(o => o.id === orderId || o.order_number === orderId);
    if (idx >= 0) {
      _memoryOrders[idx].payment_status = status;
      if (paymentId) _memoryOrders[idx].portone_payment_id = paymentId;
      if (status === 'paid') _memoryOrders[idx].paid_at = new Date().toISOString();
      if (status === 'cancelled') {
        _memoryOrders[idx].cancelled_at = new Date().toISOString();
        if (cancelReason) _memoryOrders[idx].cancel_reason = cancelReason;
      }
    }
    return _memoryOrders[idx];
  }

  const updatePayload: Record<string, unknown> = { payment_status: status };
  if (status === 'paid') updatePayload.paid_at = new Date().toISOString();
  if (status === 'cancelled') {
    updatePayload.cancelled_at = new Date().toISOString();
    if (cancelReason) updatePayload.cancel_reason = cancelReason;
  }
  if (status === 'refunded') {
    updatePayload.cancelled_at = new Date().toISOString();
    if (cancelReason) updatePayload.cancel_reason = cancelReason;
  }
  if (paymentId) updatePayload.portone_payment_id = paymentId;

  const { data: result, error } = await client
    .from(tableName)
    .update(updatePayload)
    .eq('id', orderId)
    .select();

  if (error) throw error;

  if (!result || result.length === 0) {
    throw new Error('UPDATE_NO_ROWS: 주문 업데이트 권한이 없거나 해당 주문을 찾을 수 없습니다. Supabase orders 테이블의 UPDATE RLS 정책을 확인하세요.');
  }

  return result[0];
};

/**
 * Verify payment via Edge Function
 */
export const verifyPayment = async (paymentId: string, orderId: string) => {
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

/**
 * Get orders by user ID
 */
export const getOrdersByUser = async (userId: string) => {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getOrdersByUser error:', error);
    return [];
  }
  return data || [];
};

/** In-memory fallback store (Supabase 미설정 시 dev/demo용) */
let _memoryOrders: MemoryOrder[] = [];

export default getSupabase;
