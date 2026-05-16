/**
 * userHelpers.ts — 유저 관련 공용 헬퍼 함수
 */

import { ADMIN_EMAILS } from '../config/admin';
import { getSiteName } from '../constants/sites';

/** 유저의 실제 role 결정 (ADMIN_EMAILS이면 admin 강제) */
export function resolveRole(user: { email?: string; role?: string }): string {
  if (ADMIN_EMAILS.includes((user.email || '').toLowerCase())) return 'admin';
  return user.role || 'user';
}

/** 유저가 최고관리자(ADMIN_EMAILS)인지 */
export function isProtectedAdmin(user: { email?: string }): boolean {
  return ADMIN_EMAILS.includes((user.email || '').toLowerCase());
}

/** 유저의 visited_sites 배열에서 사이트 이름 목록 추출 */
export function getUserSiteNames(user: { visited_sites?: string[]; signup_domain?: string }): string[] {
  const sites = user.visited_sites;
  if (Array.isArray(sites) && sites.length > 0) {
    return sites.map(getSiteName);
  }
  // visited_sites 비어있으면 signup_domain 폴백
  const name = getSiteName(user.signup_domain);
  return name !== '-' ? [name] : [];
}
