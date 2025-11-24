"use client"
import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  user: User | null,
  isLoading: boolean,
  setUser: (user: User | null) => void,
  setLoading: (isLoading: boolean) => void
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProviderContext({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true);
  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used inside AuthProviderContext')
  return context
}
