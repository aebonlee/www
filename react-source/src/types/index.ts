/**
 * types/index.ts — 공유 도메인 타입 정의
 */

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string | null;
  name?: string | null;
  phone?: string | null;
  role: string;
  status?: string;
  provider?: string;
  signup_domain?: string | null;
  visited_sites?: string[];
  avatar_url?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  last_active_at?: string | null;
  suspended_until?: string | null;
  status_reason?: string | null;
}

export interface Order {
  id: string;
  order_number?: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  items_summary?: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  site?: string;
  created_at?: string;
  updated_at?: string;
  cancel_memo?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface BlogPost {
  id: number;
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
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardPost {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  date?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: number;
  category: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  authorId?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  postId: number;
  postType: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  discountPrice?: number;
  category?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteOption {
  value: string;
  label: string;
  color: string;
}

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}
