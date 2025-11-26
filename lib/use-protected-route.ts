import { useRouter } from "next/navigation";
import { useAuthStore } from "./use-auth-store";
import { useEffect } from "react";

interface useProtectedRouteOptions{
  redirectTo?:string
}
export function useProtectedRoute(options:useProtectedRouteOptions={}){
 const {redirectTo="/auth/login"} = options;
 const {user,isLoading} = useAuthStore();
 const router = useRouter();
 useEffect(()=>{
  if(!isLoading && !user){
    router.replace(redirectTo)
  }
 },[user,isLoading,redirectTo,router]);
 return {isLoading,user}
}