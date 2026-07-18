/**
 * MemberNotice.tsx — 전 사이트 공통 안내 레이어 팝업 (전역 CLAUDE.md §3.3, §3.4 재사용 표준)
 *
 * App 최상단에 1회 배치. 상태별 동작:
 * - 비로그인            → 로그인·정확한 기본 정보 입력 안내 + LoginButtons 내장
 * - 로그인 + 프로필 미완성 → 기본 정보 입력 안내 + [정보 입력하기](온보딩 폼 즉시 표시)
 * - 완성 회원            → 렌더 안 함
 *
 * 역할 분리(2026-07-18 대표 확정): 이 팝업은 "안내"만 담당한다.
 * "오늘 하루 보지 않기"로 팝업을 닫아도 회원 콘텐츠 차단은 MemberGate(화면)와
 * RLS·Storage 정책(서버)이 그대로 유지한다 — 팝업 닫기 ≠ 접근 허용.
 */
import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { supabase } from '../lib/supabaseClient';
import LoginButtons from './LoginButtons';
import OnboardingGate from './OnboardingGate';

// [수정] 안내 문구 상수 — 사이트별 조정 지점 (워드랩은 §6 표준: keep-all + overflow-wrap)
const MSG = {
  guestTitle: '로그인 안내',
  guestBody:
    '이 사이트는 로그인 후 이용할 수 있습니다.\n가입 시 기본 정보(이름·연락처·이메일)를 정확히 입력하지 않으면 이용할 수 없습니다.',
  incompleteTitle: '기본 정보 입력 안내',
  incompleteBody: '기본 정보(이름·연락처·이메일)를 입력해야 이용할 수 있습니다.',
  fillButton: '정보 입력하기',
  hideToday: '오늘 하루 보지 않기',
  close: '닫기',
};

const HIDE_KEY = 'member_notice_hide_date'; // 값 = 'YYYY-MM-DD' (해당 날짜 하루만 숨김)

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 12, padding: '28px 24px', width: '100%',
    maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,.18)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    textAlign: 'center', wordBreak: 'keep-all', overflowWrap: 'break-word',
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  body: { margin: 0, fontSize: 14, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.6 },
  fillBtn: {
    padding: '11px 22px', borderRadius: 8, border: 'none', background: '#2563eb',
    color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginTop: 4, fontSize: 13, color: '#666',
  },
  hideLabel: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
  closeBtn: {
    padding: '6px 14px', borderRadius: 6, border: '1px solid #d5d8dd',
    background: '#fff', fontSize: 13, cursor: 'pointer',
  },
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** OnboardingGate의 children은 프로필 완성 시에만 렌더됨 — 완성 시점 감지용 */
function CompletionProbe({ onComplete }: { onComplete: () => void }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return null;
}

export default function MemberNotice() {
  const [status, setStatus] = useState<'loading' | 'guest' | 'incomplete' | 'complete'>('loading');
  const [closed, setClosed] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) { setStatus('guest'); return; }
    const { data: row } = await supabase
      .from('www_profiles')
      .select('is_complete')
      .eq('user_id', user.id)
      .maybeSingle();
    setStatus(row?.is_complete ? 'complete' : 'incomplete');
  }, []);

  useEffect(() => {
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { void refresh(); });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const close = () => {
    if (hideToday) localStorage.setItem(HIDE_KEY, todayStr());
    setClosed(true);
  };

  const onOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    setStatus('complete');
  }, []);

  // [정보 입력하기] — OnboardingGate가 미완성 상태에서 전 화면 온보딩 폼을 띄운다.
  // CompletionProbe(children)는 완성 후에만 렌더되므로 완성 시점에 팝업을 정리한다.
  if (showOnboarding) {
    return (
      <OnboardingGate>
        <CompletionProbe onComplete={onOnboardingComplete} />
      </OnboardingGate>
    );
  }

  if (status === 'loading' || status === 'complete' || closed) return null;
  if (localStorage.getItem(HIDE_KEY) === todayStr()) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>{status === 'guest' ? MSG.guestTitle : MSG.incompleteTitle}</h2>
        <p style={styles.body}>{status === 'guest' ? MSG.guestBody : MSG.incompleteBody}</p>

        {status === 'guest' && <LoginButtons />}
        {status === 'incomplete' && (
          <button type="button" style={styles.fillBtn} onClick={() => setShowOnboarding(true)}>
            {MSG.fillButton}
          </button>
        )}

        <div style={styles.footer}>
          <label style={styles.hideLabel}>
            <input type="checkbox" checked={hideToday} onChange={(e) => setHideToday(e.target.checked)} />
            {MSG.hideToday}
          </label>
          <button type="button" style={styles.closeBtn} onClick={close}>{MSG.close}</button>
        </div>
      </div>
    </div>
  );
}
