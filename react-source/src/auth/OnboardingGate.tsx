/**
 * OnboardingGate.tsx — 필수 정보 입력 강제 게이트 (재사용 표준)
 *
 * 로그인된 유저의 www_profiles 행을 조회해 is_complete=false면
 * children 대신 온보딩 폼을 전체 화면으로 렌더링해 다른 화면 진입을 차단한다.
 * 라우터 의존 없음 — App 최상단에서 화면 전체를 감싸면 된다.
 *
 * 저장 시 signup_site가 null이면 localStorage 'signup_site'(LoginButtons가 심음)로
 * 채우고 키를 삭제한다. www_profiles 스키마는 확정본 — insert 정책이 없으므로
 * 행 생성은 가입 트리거 전담, 여기서는 update만 수행한다.
 */
import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { WwwProfile } from '../lib/supabaseClient';

const SIGNUP_SITE_KEY = 'signup_site';
const PHONE_RE = /^010-\d{4}-\d{4}$/;

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999, background: '#f5f6f8',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    overflowY: 'auto',
  },
  card: {
    background: '#fff', borderRadius: 12, padding: '32px 28px', width: '100%',
    maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,.08)',
    wordBreak: 'keep-all', overflowWrap: 'break-word',
  },
  title: { margin: '0 0 6px', fontSize: 20, fontWeight: 700 },
  desc: { margin: '0 0 20px', fontSize: 14, color: '#666', whiteSpace: 'pre-line' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, margin: '14px 0 4px' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d5d8dd',
    fontSize: 14, boxSizing: 'border-box',
  },
  error: { color: '#d33', fontSize: 13, margin: '12px 0 0', whiteSpace: 'pre-line' },
  submit: {
    width: '100%', marginTop: 20, padding: '12px 16px', borderRadius: 8,
    border: 'none', background: '#2563eb', color: '#fff', fontSize: 15,
    fontWeight: 600, cursor: 'pointer',
  },
};

interface Props {
  children: ReactNode;
}

export default function OnboardingGate({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<WwwProfile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [course, setCourse] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async (u: User | null) => {
    setLoadError(null);
    if (!u) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('www_profiles')
      .select('*')
      .eq('user_id', u.id)
      .maybeSingle();
    if (error) {
      setLoadError(`프로필 조회에 실패했습니다. 새로고침해 주세요. (${error.message})`);
    } else {
      const p = (data as WwwProfile | null) ?? null;
      setProfile(p);
      if (p && !p.is_complete) {
        setName(p.name ?? '');
        setPhone(p.phone ?? '');
        setEmail(p.email ?? u.email ?? '');
        setOrg(p.org ?? '');
        setCourse(p.course ?? '');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      void loadProfile(u);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      void loadProfile(u);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  async function save() {
    if (!user || !profile) return;
    setFormError(null);
    const errs: string[] = [];
    if (!name.trim()) errs.push('이름을 입력해 주세요.');
    if (!PHONE_RE.test(phone.trim())) errs.push('연락처는 010-0000-0000 형식으로 입력해 주세요.');
    if (!email.trim()) errs.push('이메일을 입력해 주세요.');
    if (errs.length) {
      setFormError(errs.join('\n'));
      return;
    }
    setSaving(true);
    const payload: Partial<WwwProfile> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      org: org.trim() || null,
      course: course.trim() || null,
    };
    if (!profile.signup_site) {
      const fromLogin = localStorage.getItem(SIGNUP_SITE_KEY);
      if (fromLogin) payload.signup_site = fromLogin;
    }
    const { data, error } = await supabase
      .from('www_profiles')
      .update(payload)
      .eq('user_id', user.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      setFormError(`저장에 실패했습니다. 다시 시도해 주세요. (${error.message})`);
      return;
    }
    localStorage.removeItem(SIGNUP_SITE_KEY);
    setProfile(data as WwwProfile);
  }

  // 비로그인·심사 통과는 그대로 통과
  if (loading) return null;
  if (!user) return <>{children}</>;
  if (profile?.is_complete) return <>{children}</>;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>기본 정보 입력</h2>
        <p style={styles.desc}>
          {'원활한 수강 안내를 위해 기본 정보를 입력해 주세요.\n입력 후 모든 화면을 이용할 수 있습니다.'}
        </p>
        {loadError && <p style={styles.error}>{loadError}</p>}
        {!profile && !loadError && (
          <p style={styles.error}>
            {'프로필이 아직 준비되지 않았습니다.\n잠시 후 새로고침해 주세요. 계속되면 관리자에게 문의해 주세요.'}
          </p>
        )}
        {profile && (
          <form onSubmit={(e) => { e.preventDefault(); void save(); }}>
            <label style={styles.label}>이름 (실명) *</label>
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
            <label style={styles.label}>연락처 (휴대폰) *</label>
            <input style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" inputMode="numeric" />
            <label style={styles.label}>이메일 *</label>
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label style={styles.label}>소속 기관 (선택)</label>
            <input style={styles.input} value={org} onChange={(e) => setOrg(e.target.value)} placeholder="회사 / 학교 / 기관" />
            <label style={styles.label}>수강 과정 (선택)</label>
            <input style={styles.input} value={course} onChange={(e) => setCourse(e.target.value)} placeholder="수강 중인 과정명" />
            {formError && <p style={styles.error}>{formError}</p>}
            <button type="submit" style={styles.submit} disabled={saving}>
              {saving ? '저장 중…' : '저장하고 시작하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
