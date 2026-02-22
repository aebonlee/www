import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import getSupabase from '../utils/supabase';
import { getProfile, signOut as authSignOut } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const p = await getProfile(authUser.id);
    setProfile(p);
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }

    // 현재 세션 가져오기
    client.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u);
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  const ADMIN_EMAILS = ['aebon@kakao.com', 'aebon@kyonggi.ac.kr'];
  const allEmails = [
    user?.email,
    user?.user_metadata?.email,
    user?.identities?.[0]?.identity_data?.email,
    profile?.email,
  ].filter(Boolean).map((e) => e.toLowerCase());
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e));
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isLoggedIn,
      isAdmin,
      signOut,
      refreshProfile
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
