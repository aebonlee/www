/**
 * adminStorage.js
 * 관리자 대시보드 전용 데이터 조회 — Supabase
 */

import getSupabase from './supabase';

/** 대시보드 통계 카운트 (7개 테이블) */
export async function getDashboardCounts() {
  const client = getSupabase();
  const counts = {
    users: 0,
    blogPosts: 0,
    galleryItems: 0,
    boardPosts: 0,
    syllabi: 0,
    products: 0,
    orders: 0
  };
  if (!client) return counts;

  const tables = [
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

/** 전체 회원 목록 */
export async function getAllUsers() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllUsers error:', error);
    return [];
  }
  return data || [];
}

/** 전체 주문 목록 (order_items 포함) */
export async function getAllOrders() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllOrders error:', error);
    return [];
  }
  return data || [];
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
