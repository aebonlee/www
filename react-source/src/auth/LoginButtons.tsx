/**
 * LoginButtons.tsx — 구글 + 카카오 로그인 버튼 2종 (전역 CLAUDE.md §3.3 로그인 기본값, §3.4 재사용 표준)
 *
 * 파일 복사만으로 사용. 사이트 고유 값은 lib/supabaseClient.ts의 SITE_ID 하나뿐.
 * OAuth 시작 전에 가입 출처(signup_site)를 localStorage에 심어 두고,
 * 온보딩(OnboardingGate) 저장 시점에 www_profiles.signup_site로 옮겨 기록한다.
 * (OAuth 가입은 signUp 메타데이터를 쓸 수 없어 트리거가 null로 생성하기 때문)
 */
import type { CSSProperties } from 'react';
import { supabase, SITE_ID } from '../lib/supabaseClient';

const SIGNUP_SITE_KEY = 'signup_site';

async function startOAuth(provider: 'google' | 'kakao') {
  localStorage.setItem(SIGNUP_SITE_KEY, SITE_ID);
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    alert(`로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.\n(${error.message})`);
  }
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 },
  btn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '12px 16px', borderRadius: 8, fontSize: 15,
    fontWeight: 600, cursor: 'pointer', border: '1px solid transparent',
  },
  google: { background: '#ffffff', color: '#1f1f1f', borderColor: '#dadce0' },
  kakao: { background: '#FEE500', color: '#191919' },
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.77c0 2.76 1.85 5.18 4.63 6.55l-1.18 4.33c-.1.38.33.68.66.46l5.15-3.4c.24.02.49.03.74.03 5.52 0 10-3.48 10-7.77S17.52 3 12 3z" />
  </svg>
);

/** 구글(이메일)+카카오 2종 로그인 — 신규 auth 사이트 기본 탑재 (2026-07-18 대표 확정) */
export default function LoginButtons() {
  return (
    <div style={styles.wrap}>
      <button type="button" style={{ ...styles.btn, ...styles.google }} onClick={() => startOAuth('google')}>
        <GoogleIcon /> 구글로 시작하기
      </button>
      <button type="button" style={{ ...styles.btn, ...styles.kakao }} onClick={() => startOAuth('kakao')}>
        <KakaoIcon /> 카카오로 시작하기
      </button>
    </div>
  );
}
