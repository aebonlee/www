/**
 * MemberGate.tsx — 회원 전용 페이지·섹션 래퍼 (전역 CLAUDE.md §3.3 접근 3등급, §3.4 재사용 표준)
 *
 * 회원 = 로그인 + www_profiles.is_complete. 로그인만으로는 회원으로 간주하지 않는다.
 * - 비로그인            → 안내문 + LoginButtons
 * - 로그인 + 프로필 미완성 → OnboardingGate에 위임(전 화면 온보딩 폼)
 * - 완성 회원            → children
 *
 * 화면 차단은 3겹 잠금의 1겹일 뿐 — DB는 RLS(www_is_member()), Storage는
 * private 버킷 정책이 서버에서 막는다 (www_member_access.sql 템플릿 참조).
 */
import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import LoginButtons from './LoginButtons';
import OnboardingGate from './OnboardingGate';

// [수정] 사이트 톤에 맞게 문구 조정 가능 (워드랩은 §6 표준: keep-all + overflow-wrap)
const GUEST_TITLE = '회원 전용 콘텐츠입니다';
const GUEST_DESC =
  '로그인 후 이용할 수 있습니다.\n가입 시 기본 정보(이름·연락처·이메일)를 정확히 입력해 주세요.';

const styles: Record<string, CSSProperties> = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    padding: '48px 24px', textAlign: 'center',
    wordBreak: 'keep-all', overflowWrap: 'break-word',
  },
  title: { margin: 0, fontSize: 19, fontWeight: 700 },
  desc: { margin: '0 0 16px', fontSize: 14, color: '#666', whiteSpace: 'pre-line' },
};

interface Props {
  children: ReactNode;
}

export default function MemberGate({ children }: Props) {
  const [state, setState] = useState<'loading' | 'guest' | 'user'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session?.user ? 'user' : 'guest');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session?.user ? 'user' : 'guest');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state === 'loading') return null;

  if (state === 'guest') {
    return (
      <div style={styles.wrap}>
        <h2 style={styles.title}>{GUEST_TITLE}</h2>
        <p style={styles.desc}>{GUEST_DESC}</p>
        <LoginButtons />
      </div>
    );
  }

  // 로그인 상태 — 프로필 완성 판정과 미완성 시 폼 강제는 OnboardingGate가 담당
  return <OnboardingGate>{children}</OnboardingGate>;
}
