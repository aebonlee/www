/**
 * productStorage.ts — 상품 CRUD (Supabase products 테이블)
 * 하드코딩 데이터 폴백 포함
 */
import getSupabase from './supabase';
import publishingDetails from '../data/publishingDetails';
import educationDetails from '../data/educationDetails';

// 하드코딩 폴백 데이터
const fallbackProducts = [
  ...publishingDetails.book.products.map((p: Record<string, unknown>) => ({ ...p, category: 'book' })),
  ...publishingDetails.ebook.products.map((p: Record<string, unknown>) => ({ ...p, category: 'ebook' })),
  ...publishingDetails.periodical.products.map((p: Record<string, unknown>) => ({ ...p, category: 'periodical' })),
  ...(publishingDetails.material?.products || []).map((p: Record<string, unknown>) => ({ ...p, category: 'book' })),
  ...educationDetails.classroom.courses.map((p: Record<string, unknown>) => ({ ...p, category: 'course' }))
];

interface Product {
  id: unknown;
  slug: string;
  category: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  isSoldOut: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id,
    slug: row.slug as string,
    category: row.category as string,
    title: row.title as string,
    titleEn: row.title_en as string,
    description: row.description as string,
    descriptionEn: row.description_en as string,
    price: row.price as number,
    imageUrl: row.image_url as string,
    isSoldOut: row.is_sold_out as boolean,
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

/** 전체 상품 조회 (활성 상품만) */
export async function getProducts(includeInactive = false) {
  const client = getSupabase();
  if (!client) return fallbackProducts;

  let query = client
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getProducts error:', error);
    return fallbackProducts;
  }
  if (!data || data.length === 0) return fallbackProducts;
  return data.map(toProduct);
}

/** 단일 상품 조회 */
export async function getProduct(id: string | number) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) {
    console.error('getProduct error:', error);
    return null;
  }
  return toProduct(data);
}

interface ProductInput {
  slug: string;
  category: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  imageUrl?: string;
  sortOrder?: number;
  isSoldOut?: boolean;
  isActive?: boolean;
}

/** 상품 등록 */
export async function createProduct(productData: ProductInput) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('products')
    .insert({
      slug: productData.slug,
      category: productData.category,
      title: productData.title,
      title_en: productData.titleEn,
      description: productData.description,
      description_en: productData.descriptionEn,
      price: productData.price,
      image_url: productData.imageUrl,
      sort_order: productData.sortOrder || 0
    })
    .select()
    .single();
  if (error) throw error;
  return toProduct(data);
}

/** 상품 수정 */
export async function updateProduct(id: string | number, updates: Partial<ProductInput>) {
  const client = getSupabase();
  if (!client) return null;
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.titleEn !== undefined) payload.title_en = updates.titleEn;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.descriptionEn !== undefined) payload.description_en = updates.descriptionEn;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.isSoldOut !== undefined) payload.is_sold_out = updates.isSoldOut;
  if (updates.isActive !== undefined) payload.is_active = updates.isActive;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await client
    .from('products')
    .update(payload)
    .eq('id', Number(id))
    .select()
    .single();
  if (error) throw error;
  return toProduct(data);
}

/** 상품 삭제 (소프트 삭제) */
export async function deleteProduct(id: string | number) {
  return updateProduct(id, { isActive: false });
}

/** 판매완료 토글 */
export async function toggleSoldOut(id: string | number, isSoldOut: boolean) {
  return updateProduct(id, { isSoldOut });
}
