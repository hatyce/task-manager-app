"use client"
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "./use-auth-store";
import { createClientSupabaseClient } from "./supabase/client";

export function AuthProvider({children}:{children:ReactNode}){
   const {setUser, setLoading} = useAuthStore()
  
  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      const supabase = createClientSupabaseClient()
      const {data:{session}} = await supabase.auth.getSession()
      if(cancelled) return
      setUser(session?.user ?? null)
      setLoading(false)
    })();
  return ()=>{cancelled=true}
  },[setUser, setLoading]);
  return<>{children}</>
}