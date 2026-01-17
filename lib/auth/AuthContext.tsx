import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { signInWithGoogle } from './googleAuth';
import type { AuthUser, AuthContextValue } from '@/types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let initialCheckDone = false;

    const setAuthUser = (supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          name: (supabaseUser.user_metadata?.full_name as string) ?? null,
          avatar_url: (supabaseUser.user_metadata?.avatar_url as string) ?? null,
        });
      } else {
        setUser(null);
      }
    };

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setAuthUser(session?.user ?? null);
          setIsLoading(false);
          initialCheckDone = true;
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
          initialCheckDone = true;
        }
      }
    };

    checkSession();

    // Listen to auth changes (for subsequent updates only)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted || !initialCheckDone) return;
        setAuthUser(session?.user ?? null);
        setError(null);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
