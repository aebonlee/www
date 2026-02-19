/**
 * boardStorage.js
 * 게시판/블로그/갤러리 CRUD — Supabase 전용 (localStorage 사용 안 함)
 */

import getSupabase from './supabase';

// ── snake_case ↔ camelCase 변환 헬퍼 ──

function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnakeKey(key) {
  return key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

function toCamel(row) {
  if (!row) return null;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamelKey(k)] = v;
  }
  return out;
}

function toSnake(obj) {
  if (!obj) return null;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[toSnakeKey(k)] = v;
  }
  return out;
}

// ── Board CRUD ──

export async function getBoardPosts() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('board_posts')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('getBoardPosts error:', error);
    return [];
  }
  return (data || []).map(toCamel);
}

export async function getBoardPost(id) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('board_posts')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) {
    console.error('getBoardPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function createBoardPost({ category, title, content, author }) {
  const client = getSupabase();
  if (!client) return null;
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('board_posts')
    .insert({
      category,
      title,
      content,
      author,
      date: now.slice(0, 10),
      views: 0
    })
    .select()
    .single();
  if (error) {
    console.error('createBoardPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function updateBoardPost(id, updates) {
  const client = getSupabase();
  if (!client) return null;
  const snaked = toSnake(updates);
  snaked.updated_at = new Date().toISOString();
  const { data, error } = await client
    .from('board_posts')
    .update(snaked)
    .eq('id', Number(id))
    .select()
    .single();
  if (error) {
    console.error('updateBoardPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function deleteBoardPost(id) {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client
    .from('board_posts')
    .delete()
    .eq('id', Number(id));
  if (error) {
    console.error('deleteBoardPost error:', error);
    return false;
  }
  return true;
}

export async function incrementBoardViews(id) {
  const client = getSupabase();
  if (!client) return;
  const { data } = await client
    .from('board_posts')
    .select('views')
    .eq('id', Number(id))
    .single();
  if (!data) return;
  await client
    .from('board_posts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', Number(id));
}

// ── Blog CRUD ──

export async function getBlogPosts() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('getBlogPosts error:', error);
    return [];
  }
  return (data || []).map(toCamel);
}

export async function getBlogPost(id) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) {
    console.error('getBlogPost error:', error);
    return null;
  }
  return toCamel(data);
}

// ── Gallery CRUD ──

export async function getGalleryItems() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('gallery_items')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('getGalleryItems error:', error);
    return [];
  }
  return (data || []).map(toCamel);
}

export async function getGalleryItem(id) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('gallery_items')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) {
    console.error('getGalleryItem error:', error);
    return null;
  }
  return toCamel(data);
}
