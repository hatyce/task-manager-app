import { RegisterFormData, registrationSchema } from "@/app/validationSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseAuthRegister{
  isLoading:boolean,
  register:(data: RegisterFormData) => Promise<string|null>
}
export function useAuthRegister():UseAuthRegister {
  const [isLoading,setIsLoading] = useState(false);
  const router = useRouter();
  const register = async (data:RegisterFormData):Promise<string|null> =>{
    const validationResult = registrationSchema.safeParse(data);
    if(!validationResult.success){
      return validationResult.error.issues[0]?.message ?? "Invalid input"
    }
    try{
      setIsLoading(true);
      const response = await fetch('/api/auth/register',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })
      const payload = await response.json();
      if(!response.ok){
        return payload?.error ?? "Failed to register"
      }
      router.push("/dashboard");
      return null;
    }catch(error){
      return error instanceof Error ? error.message : "Failed to register"
    }finally{
      setIsLoading(false)
    }
  }
  return {isLoading, register}
}