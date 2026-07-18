/**
 * supabaseClient.ts — 재사용 표준(§3.4) 어댑터, www 전용 분기
 *
 * 템플릿 원본(04-templates/web/src/lib/supabaseClient.ts)은 자체 createClient지만,
 * www는 기존 utils/supabase.ts 클라이언트(PKCE 플로우·SSO 크로스도메인 쿠키)를 재사용한다.
 * 이유: 같은 스토리지 키로 GoTrue 인스턴스가 2개 뜨면 세션 충돌·OAuth 콜백 처리가 꼬인다.
 * auth/ 컴포넌트 4종(LoginButtons·OnboardingGate·MemberGate·MemberNotice)은 템플릿 원본 그대로.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import getSupabase from '../utils/supabase';

export const SITE_ID = 'www';

// utils/supabase.ts가 URL/anon key fallback 하드코딩(§3.2)이므로 null에 도달하지 않는다.
export const supabase = getSupabase() as SupabaseClient;

/** 전 사이트 공용 회원 프로필 행 (www_profiles — 스키마 확정본, 변경 금지) */
export interface WwwProfile {
  user_id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  org: string | null;
  course: string | null;
  signup_site: string | null;
  signup_at: string;
  updated_at: string;
  is_complete: boolean;
}
