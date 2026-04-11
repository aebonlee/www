import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import getSupabase, { setSharedSession, getSharedSession, clearSharedSession } from '../utils/supabase';
import { getProfile, updateProfile, signOut as authSignOut } from '../utils/auth';
import { ADMIN_EMAILS } from '../config/admin';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  accountBlock: { status: string; reason: string; suspended_until: string | null } | null;
  clearAccountBlock: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accountBlock, setAccountBlock] = useState<{ status: string; reason: string; suspended_until: string | null } | null>(null);

  const loadProfile = useCallback(async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const p = await getProfile(authUser.id);
    if (p) {
      const updates: Record<string, any> = {};
      const currentDomain = window.location.hostname;
      if (!p.signup_domain) updates.signup_domain = currentDomain;
      if (!p.role || p.role === 'user') updates.role = 'member';
      const sites = Array.isArray(p.visited_sites) ? p.visited_sites : [];
      if (!sites.includes(currentDomain)) {
        updates.visited_sites = [...sites, currentDomain];
      }
      if (Object.keys(updates).length > 0) {
        try {
          const updated = await updateProfile(authUser.id, updates);
          setProfile(updated);
        } catch {
          setProfile(p);
        }
      } else {
        setProfile(p);
      }
    }

    try {
      const client = getSupabase();
      if (client) {
        const { data: statusData } = await client.rpc('check_user_status', {
          target_user_id: authUser.id,
          current_domain: window.location.hostname,
        });
        if (statusData && statusData.status && statusData.status !== 'active') {
          setAccountBlock({
            status: statusData.status,
            reason: statusData.reason || '',
            suspended_until: statusData.suspended_until || null,
          });
          await authSignOut();
          setUser(null);
          setProfile(null);
          return;
        }
      }
    } catch {
      // check_user_status 함수 미존재 시 무시
    }
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u);
        if (event === 'SIGNED_IN') {
          client.from('user_profiles')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('id', u.id)
            .then(() => {});
        }
      } else {
        setProfile(null);
      }
      // SSO: INITIAL_SESSION에서 세션 없으면 공유 쿠키로 복원
      if (event === 'INITIAL_SESSION') {
        if (!session) {
          const rt = getSharedSession();
          if (rt) {
            try {
              const { data } = await client.auth.refreshSession({ refresh_token: rt });
              if (!data.session) {
                clearSharedSession();
              } else {
                // refreshSession 성공 → TOKEN_REFRESHED 이벤트에서 loading 해제
                return;
              }
            } catch { clearSharedSession(); }
          }
        }
        setLoading(false);
      }
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setLoading(false);
      }

      // SSO: 쿠키 동기화
      if (session?.refresh_token) setSharedSession(session.refresh_token);
      if (event === 'SIGNED_OUT') clearSharedSession();
    });

    const fallbackTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn('Auth: INITIAL_SESSION timeout, forcing loading=false');
        return false;
      });
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  const allEmails = [
    user?.email,
    user?.user_metadata?.email,
    user?.identities?.[0]?.identity_data?.email,
    profile?.email,
  ].filter(Boolean).map((e: string) => e.toLowerCase());
  const isAdmin = allEmails.some((e: string) => ADMIN_EMAILS.includes(e));
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isLoggedIn,
      isAdmin,
      signOut,
      refreshProfile,
      accountBlock,
      clearAccountBlock: () => setAccountBlock(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
