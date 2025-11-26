"use client"
import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  user: User | null,
  isLoading: boolean,
  sessionExpiry: number | null,
  setUser: (user: User | null) => void,
  setLoading: (isLoading: boolean) => void,
  setSessionExpiry: (expiry: number | null) => void,
  clearSession: () => void,
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProviderContext({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry]=useState<number|null>(null);
  const clearSession=()=>{
    setUser(null);
    setSessionExpiry(null);
  }
  return ( 
    <AuthContext.Provider value={{ user, isLoading, sessionExpiry, setUser, setLoading, setSessionExpiry, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used inside AuthProviderContext')
  return context
}
