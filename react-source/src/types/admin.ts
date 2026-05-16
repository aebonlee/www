/**
 * types/admin.ts — 관리자 전용 타입 정의
 */

import { ReactNode } from 'react';

export interface AdminColumn<T = any> {
  key: string;
  label: ReactNode;
  width?: string;
  className?: string;
  render?: (value: any, row: T) => ReactNode;
}

export interface AdminStatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  color: string;
}

export interface AdminDataTableProps<T = any> {
  columns: AdminColumn<T>[];
  data: T[];
  loading: boolean;
  searchKeys?: string[];
  actions?: (row: T) => ReactNode;
  pageSize?: number;
  toolbarExtra?: ReactNode;
  expandRow?: (row: T) => ReactNode;
  showRowNumbers?: boolean;
}

export interface DashboardCounts {
  totalUsers: number;
  todayUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalPosts: number;
}

export interface PaymentStats {
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
  cancelledCount: number;
}

export type UserStatus = 'active' | 'banned' | 'deleted';
export type UserRole = 'member' | 'admin' | 'superadmin' | 'evaluator';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'cancelled' | 'refunded';
