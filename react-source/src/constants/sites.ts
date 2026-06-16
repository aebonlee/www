/**
 * sites.ts — 사이트 옵션/이름/색상 공유 상수
 * ⚠️ 사이트 목록은 단일 소스 siteRegistry.ts(SITES)에서 파생됨.
 *    새 사이트는 siteRegistry.ts에만 추가하면 여기 자동 반영.
 */
import { SITES } from './siteRegistry';

/** 가입 출처/필터용 옵션 — 레지스트리에서 파생 */
export const SITE_OPTIONS = SITES.map((s) => ({
  value: s.domain,
  label: s.name,
  color: s.color,
}));

/** 사이트명 → 색상 맵 — 레지스트리에서 파생 (+ localhost) */
const SITE_COLOR_MAP: Record<string, string> = {
  ...Object.fromEntries(SITES.map((s) => [s.name, s.color])),
  www: 'yellow',
  localhost: 'gray',
};

/** signup_domain에서 사이트 이름 추출 — 예: hohai.dreamitbiz.com → hohai */
export function getSiteName(domain: string | null | undefined): string {
  if (!domain) return '-';
  const d = domain.toLowerCase();
  if (d.endsWith('.dreamitbiz.com')) {
    const sub = d.replace('.dreamitbiz.com', '');
    return sub || 'www';
  }
  if (d === 'dreamitbiz.com' || d === 'www.dreamitbiz.com') return 'www';
  if (d.includes('localhost') || d.includes('127.0.0.1')) return 'localhost';
  return d;
}

/** 사이트별 뱃지 색상 */
export function getSiteColor(siteName: string): string {
  return SITE_COLOR_MAP[siteName] || 'gray';
}
