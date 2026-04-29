"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, getProfile, Profile, Shop, getShopByOwner } from '@/utils/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  shop: Shop | null;
  loading: boolean;
  refreshShop: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, profile: null, shop: null, loading: true,
  refreshShop: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/** Resolves in max `ms` ms — avoids infinite hangs when DB tables don't exist */
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T | null> {
  return Promise.race([
    promise.catch((err) => {
      console.error('withTimeout caught error:', err);
      return null;
    }),
    new Promise<null>(res => setTimeout(() => {
      console.warn(`withTimeout reached ${ms}ms limit`);
      res(null);
    }, ms)),
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  /** Load profile + shop in PARALLEL with timeouts so we never hang */
  const hydrateUser = useCallback(async (u: User) => {
    const [profileResult, shopResult] = await Promise.all([
      withTimeout(getProfile(u.id)),
      withTimeout(getShopByOwner(u.id)),
    ]);
    setProfile((profileResult as { data: Profile | null } | null)?.data ?? null);
    setShop((shopResult as { data: Shop | null } | null)?.data ?? null);
  }, []);

  const refreshShop = useCallback(async () => {
    if (user) {
      const result = await withTimeout(getShopByOwner(user.id));
      setShop((result as { data: Shop | null } | null)?.data ?? null);
    }
  }, [user]);

  useEffect(() => {
    // Initial session check with timeout
    withTimeout(supabase.auth.getSession(), 8000).then(async (result) => {
      if (!result) {
        console.warn('Initial getSession returned null or timed out');
      }
      const session = result?.data?.session ?? null;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await hydrateUser(session.user);
      }
      setLoading(false);
    });

    // Live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await hydrateUser(session.user);
      } else {
        setProfile(null);
        setShop(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [hydrateUser]);

  return (
    <AuthContext.Provider value={{ user, session, profile, shop, loading, refreshShop }}>
      {children}
    </AuthContext.Provider>
  );
}
