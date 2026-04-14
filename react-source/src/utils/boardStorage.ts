/**
 * boardStorage.ts
 * 게시판/블로그/갤러리 CRUD — Supabase 전용
 */

import getSupabase from './supabase';

// ── snake_case ↔ camelCase 변환 헬퍼 ──

function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

function toCamel(row: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!row) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamelKey(k)] = v;
  }
  return out;
}

function toSnake(obj: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!obj) return null;
  const out: Record<string, unknown> = {};
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

export async function getBoardPost(id: number | string) {
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

interface CreateBoardPostParams {
  category: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
}

export async function createBoardPost({ category, title, content, author, authorId }: CreateBoardPostParams) {
  const client = getSupabase();
  if (!client) return null;
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    category,
    title,
    content,
    author,
    date: now.slice(0, 10),
    views: 0
  };
  if (authorId) payload.author_id = authorId;
  const { data, error } = await client
    .from('board_posts')
    .insert(payload)
    .select()
    .single();
  if (error) {
    console.error('createBoardPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function updateBoardPost(id: number | string, updates: Record<string, unknown>) {
  const client = getSupabase();
  if (!client) return null;
  const snaked = toSnake(updates)!;
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

export async function deleteBoardPost(id: number | string): Promise<boolean> {
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

export async function incrementBoardViews(id: number | string): Promise<void> {
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
    .update({ views: ((data.views as number) || 0) + 1 })
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

export async function getBlogPost(id: number | string) {
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

interface CreateBlogPostParams {
  category: string;
  categoryEn?: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  icon?: string;
  imageUrl?: string;
  authorId?: string;
}

export async function createBlogPost(postData: CreateBlogPostParams) {
  const client = getSupabase();
  if (!client) return null;
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('blog_posts')
    .insert({
      category: postData.category,
      category_en: postData.categoryEn,
      title: postData.title,
      title_en: postData.titleEn,
      excerpt: postData.excerpt,
      excerpt_en: postData.excerptEn,
      content: postData.content,
      content_en: postData.contentEn,
      icon: postData.icon,
      image_url: postData.imageUrl,
      author_id: postData.authorId,
      date: now.slice(0, 10)
    })
    .select()
    .single();
  if (error) {
    console.error('createBlogPost error:', error);
    return null;
  }
  return toCamel(data);
}

interface UpdateBlogPostParams {
  category?: string;
  categoryEn?: string;
  title?: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  content?: string;
  contentEn?: string;
  icon?: string;
  imageUrl?: string;
}

export async function updateBlogPost(id: number | string, updates: UpdateBlogPostParams) {
  const client = getSupabase();
  if (!client) return null;
  const payload: Record<string, unknown> = {};
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.categoryEn !== undefined) payload.category_en = updates.categoryEn;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.titleEn !== undefined) payload.title_en = updates.titleEn;
  if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
  if (updates.excerptEn !== undefined) payload.excerpt_en = updates.excerptEn;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.contentEn !== undefined) payload.content_en = updates.contentEn;
  if (updates.icon !== undefined) payload.icon = updates.icon;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  payload.updated_at = new Date().toISOString();
  const { data, error } = await client
    .from('blog_posts')
    .update(payload)
    .eq('id', Number(id))
    .select()
    .single();
  if (error) {
    console.error('updateBlogPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function deleteBlogPost(id: number | string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client
    .from('blog_posts')
    .delete()
    .eq('id', Number(id));
  if (error) {
    console.error('deleteBlogPost error:', error);
    return false;
  }
  return true;
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

export async function getGalleryItem(id: number | string) {
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

interface CreateGalleryItemParams {
  category: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  authorId?: string;
}

export async function createGalleryItem(itemData: CreateGalleryItemParams) {
  const client = getSupabase();
  if (!client) return null;
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('gallery_items')
    .insert({
      category: itemData.category,
      title: itemData.title,
      title_en: itemData.titleEn,
      description: itemData.description,
      description_en: itemData.descriptionEn,
      image_url: itemData.imageUrl,
      author_id: itemData.authorId,
      date: now.slice(0, 10)
    })
    .select()
    .single();
  if (error) {
    console.error('createGalleryItem error:', error);
    return null;
  }
  return toCamel(data);
}

interface UpdateGalleryItemParams {
  category?: string;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
}

export async function updateGalleryItem(id: number | string, updates: UpdateGalleryItemParams) {
  const client = getSupabase();
  if (!client) return null;
  const payload: Record<string, unknown> = {};
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.titleEn !== undefined) payload.title_en = updates.titleEn;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.descriptionEn !== undefined) payload.description_en = updates.descriptionEn;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  payload.updated_at = new Date().toISOString();
  const { data, error } = await client
    .from('gallery_items')
    .update(payload)
    .eq('id', Number(id))
    .select()
    .single();
  if (error) {
    console.error('updateGalleryItem error:', error);
    return null;
  }
  return toCamel(data);
}

export async function deleteGalleryItem(id: number | string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client
    .from('gallery_items')
    .delete()
    .eq('id', Number(id));
  if (error) {
    console.error('deleteGalleryItem error:', error);
    return false;
  }
  return true;
}

// ── Syllabus CRUD ──

export async function getSyllabusPosts() {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from('syllabi')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('getSyllabusPosts error:', error);
    return [];
  }
  return (data || []).map(toCamel);
}

export async function getSyllabusPost(id: number | string) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('syllabi')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) {
    console.error('getSyllabusPost error:', error);
    return null;
  }
  return toCamel(data);
}

interface CreateSyllabusPostParams {
  category: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  status?: string;
  runCount?: number;
}

export async function createSyllabusPost({ category, title, content, author, authorId, status, runCount }: CreateSyllabusPostParams) {
  const client = getSupabase();
  if (!client) return null;
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    category,
    title,
    content,
    author,
    status: status || 'active',
    run_count: runCount || 0,
    date: now.slice(0, 10),
    views: 0
  };
  if (authorId) payload.author_id = authorId;
  const { data, error } = await client
    .from('syllabi')
    .insert(payload)
    .select()
    .single();
  if (error) {
    console.error('createSyllabusPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function updateSyllabusPost(id: number | string, updates: Record<string, unknown>) {
  const client = getSupabase();
  if (!client) return null;
  const snaked = toSnake(updates)!;
  snaked.updated_at = new Date().toISOString();
  const { data, error } = await client
    .from('syllabi')
    .update(snaked)
    .eq('id', Number(id))
    .select()
    .single();
  if (error) {
    console.error('updateSyllabusPost error:', error);
    return null;
  }
  return toCamel(data);
}

export async function deleteSyllabusPost(id: number | string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client
    .from('syllabi')
    .delete()
    .eq('id', Number(id));
  if (error) {
    console.error('deleteSyllabusPost error:', error);
    return false;
  }
  return true;
}

export async function incrementSyllabusViews(id: number | string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  const { data } = await client
    .from('syllabi')
    .select('views')
    .eq('id', Number(id))
    .single();
  if (!data) return;
  await client
    .from('syllabi')
    .update({ views: ((data.views as number) || 0) + 1 })
    .eq('id', Number(id));
}
