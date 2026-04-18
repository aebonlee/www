/**
 * adminStorage.ts
 * 관리자 대시보드 전용 데이터 조회 — Supabase
 */

import getSupabase from './supabase';

interface DashboardCounts {
  users: number;
  blogPosts: number;
  galleryItems: number;
  boardPosts: number;
  syllabi: number;
  products: number;
  orders: number;
}

/** 대시보드 통계 카운트 (7개 테이블) */
export async function getDashboardCounts(): Promise<DashboardCounts> {
  const client = getSupabase();
  const counts: DashboardCounts = {
    users: 0,
    blogPosts: 0,
    galleryItems: 0,
    boardPosts: 0,
    syllabi: 0,
    products: 0,
    orders: 0
  };
  if (!client) return counts;

  const tables: { key: keyof DashboardCounts; table: string }[] = [
    { key: 'users', table: 'user_profiles' },
    { key: 'blogPosts', table: 'blog_posts' },
    { key: 'galleryItems', table: 'gallery_items' },
    { key: 'boardPosts', table: 'board_posts' },
    { key: 'syllabi', table: 'syllabi' },
    { key: 'products', table: 'products' },
    { key: 'orders', table: 'orders' }
  ];

  const results = await Promise.allSettled(
    tables.map(({ table }) =>
      client.from(table).select('id', { count: 'exact', head: true })
    )
  );

  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && !result.value.error) {
      counts[tables[i].key] = result.value.count || 0;
    }
  });

  return counts;
}

/** 전체 회원 목록 — admin_get_all_users RPC로 RLS 우회 */
export async function getAllUsers() {
  const client = getSupabase();
  if (!client) return [];

  // 1차: SECURITY DEFINER RPC로 RLS 우회
  const { data: rpcData, error: rpcError } = await client.rpc('admin_get_all_users');
  if (!rpcError) return rpcData || [];

  console.warn('getAllUsers(rpc) failed, fallback to direct SELECT:', rpcError.message);

  // 2차 fallback: 직접 SELECT (RLS 정책에 따라 일부만 반환될 수 있음)
  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (error) {
    console.error('getAllUsers(fallback) error:', error);
    return [];
  }
  return data || [];
}

/** 전체 주문 목록 (www orders + jobpath forjob_orders 통합) */
export async function getAllOrders() {
  const client = getSupabase();
  if (!client) return [];
  const [wwwRes, jobpathRes] = await Promise.all([
    client.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
    client.from('forjob_orders').select('*').order('created_at', { ascending: false }),
  ]);
  if (wwwRes.error) console.error('getAllOrders(www) error:', wwwRes.error);
  if (jobpathRes.error) console.error('getAllOrders(jobpath) error:', jobpathRes.error);
  const wwwOrders = (wwwRes.data || []).map(o => ({ ...o, site: 'www' }));
  const jobpathOrders = (jobpathRes.data || []).map(o => ({ ...o, site: 'jobpath' }));
  return [...wwwOrders, ...jobpathOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

interface PaymentStats {
  paidCount: number;
  totalAmount: number;
  cancelledCount: number;
  cancelledAmount: number;
  refundedCount: number;
  refundedAmount: number;
}

/** 결제 통계 (www + jobpath 통합, 결제완료/취소/환불 건수 + 금액) */
export async function getPaymentStats(): Promise<PaymentStats> {
  const client = getSupabase();
  const empty: PaymentStats = { paidCount: 0, totalAmount: 0, cancelledCount: 0, cancelledAmount: 0, refundedCount: 0, refundedAmount: 0 };
  if (!client) return empty;
  const [wwwRes, jobpathRes] = await Promise.all([
    client.from('orders').select('total_amount, payment_status'),
    client.from('forjob_orders').select('total_amount, payment_status'),
  ]);
  if (wwwRes.error) console.error('getPaymentStats(www) error:', wwwRes.error);
  if (jobpathRes.error) console.error('getPaymentStats(jobpath) error:', jobpathRes.error);
  const rows = [...(wwwRes.data || []), ...(jobpathRes.data || [])];
  const paid = rows.filter(r => r.payment_status === 'paid');
  const cancelled = rows.filter(r => r.payment_status === 'cancelled');
  const refunded = rows.filter(r => r.payment_status === 'refunded');
  return {
    paidCount: paid.length,
    totalAmount: paid.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0),
    cancelledCount: cancelled.length,
    cancelledAmount: cancelled.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0),
    refundedCount: refunded.length,
    refundedAmount: refunded.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0)
  };
}

/** 회원 등급(role) 변경 — RLS 우회를 위해 rpc() 사용 */
export async function updateUserRole(userId: string, role: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('update_user_role', {
    target_user_id: userId,
    new_role: role,
  });
  if (error) {
    console.error('updateUserRole error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('updateUserRole denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 회원 가입 사이트(signup_domain) 변경 — RLS 우회를 위해 rpc() 사용 */
export async function updateUserSignupDomain(userId: string, domain: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('update_user_signup_domain', {
    target_user_id: userId,
    new_domain: domain,
  });
  if (error) {
    console.error('updateUserSignupDomain error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('updateUserSignupDomain denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 관리자 수동 방문 사이트 추가 — rpc() 사용 */
export async function addVisitedSite(userId: string, domain: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('admin_add_visited_site', {
    target_user_id: userId,
    site_domain: domain,
  });
  if (error) {
    console.error('addVisitedSite error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('addVisitedSite denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 회원 상태 변경 (정지/차단/복구/소프트삭제) — rpc() 사용 */
export async function updateUserStatus(userId: string, status: string, reason: string | null = null, suspendedUntil: string | null = null) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('admin_update_user_status', {
    target_user_id: userId,
    new_status: status,
    reason,
    suspend_until: suspendedUntil,
  });
  if (error) {
    console.error('updateUserStatus error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('updateUserStatus denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 관리자 프로필 수정 (display_name + phone) — rpc() 사용 */
export async function adminUpdateUserProfile(userId: string, displayName: string, phone?: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('admin_update_user_profile', {
    target_user_id: userId,
    new_display_name: displayName,
    new_phone: phone ?? null,
  });
  if (error) {
    console.error('adminUpdateUserProfile error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('adminUpdateUserProfile denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 회원 완전 삭제 (auth.users CASCADE) — rpc() 사용 */
export async function deleteUser(userId: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('admin_delete_user', {
    target_user_id: userId,
  });
  if (error) {
    console.error('deleteUser error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('deleteUser denied:', data.error);
    return { error: data.error };
  }
  return { success: true };
}

/** 유료 결제 완료 회원 ID 목록 (www + jobpath) */
export async function getPaidUserIds(): Promise<Set<string>> {
  const client = getSupabase();
  if (!client) return new Set();
  const [wwwRes, jobpathRes] = await Promise.all([
    client.from('orders').select('user_id').eq('payment_status', 'paid'),
    client.from('forjob_orders').select('user_id').eq('payment_status', 'paid'),
  ]);
  const ids = new Set<string>();
  (wwwRes.data || []).forEach((o: any) => { if (o.user_id) ids.add(o.user_id); });
  (jobpathRes.data || []).forEach((o: any) => { if (o.user_id) ids.add(o.user_id); });
  return ids;
}

/** 최근 주문 N건 */
export async function getRecentOrders(limit = 5) {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getRecentOrders error:', error);
    return [];
  }
  return data || [];
}
