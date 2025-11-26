"use client"
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "./use-auth-store";
import { createClientSupabaseClient } from "./supabase/client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    setUser,
    setLoading,
    clearSession,
    setSessionExpiry,
    sessionExpiry,
  } = useAuthStore();

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      setSessionExpiry(session?.expires_at ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (session) {
          setUser(session.user ?? null);
          setSessionExpiry(session.expires_at ?? null);
        } else {
          clearSession();
        }
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setLoading, clearSession, setSessionExpiry]);

  useEffect(() => {
    if (!sessionExpiry) return;

    const checkInterval = setInterval(() => {
      if (sessionExpiry && Date.now() / 1000 >= sessionExpiry) {
        clearSession();
        window.location.href = "/login";
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [sessionExpiry, clearSession]);

  return <>{children}</>;
}