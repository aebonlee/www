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

/** 10개 결제 사이트 전체 주문 통합 (Promise.allSettled 병렬) */
export async function getAllOrdersAll() {
  const client = getSupabase();
  if (!client) return [];

  const sites: { site: string; table: string; select: string }[] = [
    { site: 'www', table: 'orders', select: '*, order_items(*)' },
    { site: 'jobpath', table: 'forjob_orders', select: '*' },
    { site: 'ahp_basic', table: 'ah_orders', select: '*' },
    { site: 'edu-hub', table: 'eh_orders', select: '*' },
    { site: 'allthat', table: 'at_orders', select: '*' },
    { site: 'papers', table: 'pp_orders', select: '*' },
    { site: 'cs-hub', table: 'csh_orders', select: '*' },
    { site: 'basic-hub', table: 'bsh_orders', select: '*' },
    { site: 'exam-hub', table: 'exh_orders', select: '*' },
    { site: 'career-hub', table: 'crh_orders', select: '*' },
    { site: 'jobexam', table: 'jobexam_orders', select: '*' },
    { site: 'biz-hub', table: 'biz_orders', select: '*' },
  ];

  const results = await Promise.allSettled(
    sites.map(({ table, select }) =>
      client.from(table).select(select).order('created_at', { ascending: false })
    )
  );

  const allOrders: any[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && !result.value.error) {
      const rows = (result.value.data || []).map((o: any) => ({ ...o, site: sites[i].site }));
      allOrders.push(...rows);
    } else if (result.status === 'fulfilled' && result.value.error) {
      console.warn(`getAllOrdersAll [${sites[i].site}] RLS/query error:`, result.value.error.message);
    } else if (result.status === 'rejected') {
      console.warn(`getAllOrdersAll [${sites[i].site}] rejected:`, (result as PromiseRejectedResult).reason);
    }
  });

  return allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

/** 관리자 수동 방문 사이트 제거 — rpc() 사용 */
export async function removeVisitedSite(userId: string, domain: string) {
  const client = getSupabase();
  if (!client) return { error: 'Supabase client not available' };
  const { data, error } = await client.rpc('admin_remove_visited_site', {
    target_user_id: userId,
    site_domain: domain,
  });
  if (error) {
    console.error('removeVisitedSite error:', error);
    return { error: error.message };
  }
  if (data?.error) {
    console.error('removeVisitedSite denied:', data.error);
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

/** 실제 유료 결제 완료 회원 ID 목록 (www + jobpath, total_amount > 0) */
export async function getPaidUserIds(): Promise<Set<string>> {
  const client = getSupabase();
  if (!client) return new Set();
  const [wwwRes, jobpathRes] = await Promise.all([
    client.from('orders').select('user_id, total_amount').eq('payment_status', 'paid'),
    client.from('forjob_orders').select('user_id, total_amount').eq('payment_status', 'paid'),
  ]);
  const ids = new Set<string>();
  (wwwRes.data || []).forEach((o: any) => { if (o.user_id && Number(o.total_amount) > 0) ids.add(o.user_id); });
  (jobpathRes.data || []).forEach((o: any) => { if (o.user_id && Number(o.total_amount) > 0) ids.add(o.user_id); });
  return ids;
}

/** 쿠폰 사용 회원 ID 목록 (forjob_coupon_redemptions) */
export async function getCouponUserIds(): Promise<Set<string>> {
  const client = getSupabase();
  if (!client) return new Set();
  const { data, error } = await client
    .from('forjob_coupon_redemptions')
    .select('user_id');
  if (error) {
    console.warn('getCouponUserIds error:', error.message);
    return new Set();
  }
  const ids = new Set<string>();
  (data || []).forEach((r: any) => { if (r.user_id) ids.add(r.user_id); });
  return ids;
}

/** 최근 6개월 월별 신규 가입자 수 (JS 집계, getAllUsers 재사용) */
export async function getMonthlySignups(): Promise<{ month: string; count: number }[]> {
  const users = await getAllUsers();
  const now = new Date();
  const months: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getMonth() + 1}월`;
    const count = users.filter((u: any) => (u.created_at || '').slice(0, 7) === key).length;
    months.push({ month: label, count });
  }
  return months;
}

/** 최근 6개월 월별 매출 (www + jobpath, paid 주문 기준) */
export async function getMonthlyRevenue(): Promise<{ month: string; amount: number }[]> {
  const orders = await getAllOrders();
  const paidOrders = orders.filter((o: any) => o.payment_status === 'paid');
  const now = new Date();
  const months: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getMonth() + 1}월`;
    const amount = paidOrders
      .filter((o: any) => (o.created_at || '').slice(0, 7) === key)
      .reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);
    months.push({ month: label, amount });
  }
  return months;
}

/** 사이트별 회원 분포 (상위 10개, visited_sites 기반) */
export async function getSiteDistribution(): Promise<{ site: string; count: number }[]> {
  const users = await getAllUsers();
  const siteMap: Record<string, number> = {};
  users.forEach((u: any) => {
    const sites = Array.isArray(u.visited_sites) && u.visited_sites.length > 0
      ? u.visited_sites
      : u.signup_domain ? [u.signup_domain] : [];
    sites.forEach((domain: string) => {
      const name = domain.replace('.dreamitbiz.com', '') || 'www';
      siteMap[name] = (siteMap[name] || 0) + 1;
    });
  });
  return Object.entries(siteMap)
    .map(([site, count]) => ({ site, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
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

/** ─── 사이트별 방문 통계 (site_visit_log 기반) ─── */

interface SiteVisitStat {
  site_domain: string;
  count: number;
}

/** 최근 N일간 사이트별 방문 횟수 집계 */
export async function getSiteVisitStats(days = 30): Promise<SiteVisitStat[]> {
  const client = getSupabase();
  if (!client) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await client
    .from('site_visit_log')
    .select('site_domain, visited_at')
    .gte('visited_at', since.toISOString());

  if (error) {
    console.warn('getSiteVisitStats error:', error.message);
    return [];
  }

  const map: Record<string, number> = {};
  (data || []).forEach((r: any) => {
    map[r.site_domain] = (map[r.site_domain] || 0) + 1;
  });

  return Object.entries(map)
    .map(([site_domain, count]) => ({ site_domain, count }))
    .sort((a, b) => b.count - a.count);
}

/** 특정 사이트의 일별 방문 추이 (최근 N일) */
export async function getDailySiteVisits(domain: string, days = 30): Promise<{ date: string; count: number }[]> {
  const client = getSupabase();
  if (!client) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await client
    .from('site_visit_log')
    .select('visited_at')
    .eq('site_domain', domain)
    .gte('visited_at', since.toISOString())
    .order('visited_at', { ascending: true });

  if (error) {
    console.warn('getDailySiteVisits error:', error.message);
    return [];
  }

  const map: Record<string, number> = {};
  (data || []).forEach((r: any) => {
    const day = (r.visited_at || '').slice(0, 10);
    if (day) map[day] = (map[day] || 0) + 1;
  });

  // 모든 날짜 채우기
  const result: { date: string; count: number }[] = [];
  const cursor = new Date(since);
  const today = new Date();
  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10);
    result.push({ date: key, count: map[key] || 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

/** 사이트별 종합 요약 (visited_sites 기반 회원 수 + visit_log 기반 방문 수) */
export async function getSiteVisitSummary(): Promise<{
  domain: string;
  totalMembers: number;
  weekVisits: number;
  monthVisits: number;
  newSignupsMonth: number;
  growth: number;
}[]> {
  const client = getSupabase();
  if (!client) return [];

  // 1) 회원 데이터 (visited_sites 기반)
  const users = await getAllUsers();
  const memberMap: Record<string, number> = {};
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const signupMap: Record<string, number> = {};

  users.forEach((u: any) => {
    const sites = Array.isArray(u.visited_sites) && u.visited_sites.length > 0
      ? u.visited_sites
      : u.signup_domain ? [u.signup_domain] : [];
    sites.forEach((d: string) => {
      memberMap[d] = (memberMap[d] || 0) + 1;
      if (u.created_at && new Date(u.created_at) >= monthAgo) {
        signupMap[d] = (signupMap[d] || 0) + 1;
      }
    });
  });

  // 2) 방문 로그 (최근 60일 — 이번달 + 저번달 비교용)
  const since60 = new Date();
  since60.setDate(since60.getDate() - 60);
  const { data: logs } = await client
    .from('site_visit_log')
    .select('site_domain, visited_at')
    .gte('visited_at', since60.toISOString());

  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const weekMap: Record<string, number> = {};
  const monthMap: Record<string, number> = {};
  const prevMonthMap: Record<string, number> = {};

  (logs || []).forEach((r: any) => {
    const d = r.site_domain;
    const t = new Date(r.visited_at);
    if (t >= weekAgo) weekMap[d] = (weekMap[d] || 0) + 1;
    if (t >= monthStart) monthMap[d] = (monthMap[d] || 0) + 1;
    if (t >= prevMonthStart && t < monthStart) prevMonthMap[d] = (prevMonthMap[d] || 0) + 1;
  });

  // 3) 모든 도메인 합치기
  const allDomains = new Set([
    ...Object.keys(memberMap),
    ...Object.keys(weekMap),
    ...Object.keys(monthMap),
  ]);

  return Array.from(allDomains).map((domain) => {
    const prev = prevMonthMap[domain] || 0;
    const curr = monthMap[domain] || 0;
    const growth = prev > 0 ? Math.round((curr - prev) / prev * 100) : (curr > 0 ? 100 : 0);
    return {
      domain,
      totalMembers: memberMap[domain] || 0,
      weekVisits: weekMap[domain] || 0,
      monthVisits: curr,
      newSignupsMonth: signupMap[domain] || 0,
      growth,
    };
  }).sort((a, b) => b.totalMembers - a.totalMembers);
}
