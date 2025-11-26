"use server"
import { redirect } from "next/navigation";
import { RegisterActionState, registrationSchema } from "./app/validationSchema";
import { createServerSupabaseClient } from "./lib/supabase/server";

export async function RegisterAction(
  _prev:RegisterActionState,
  formData:FormData
):Promise<RegisterActionState>{
  const formEntries = Object.fromEntries(formData) as Record<string,string>;
  const form = 
  { email:formEntries.email,
    password:formEntries.password,
    confirmPassword:formEntries.confirmPassword,
    name:formEntries.name };
  const validationResult = registrationSchema.safeParse(formEntries);
  if(!validationResult.success){
    return{
      form,
      errors:validationResult.error.flatten().fieldErrors
    }
  }
  const supabase = await createServerSupabaseClient();
  const {error} = await supabase.auth.signUp({
    email:validationResult.data.email,
    password:validationResult.data.password,
    options:{
      data:{name:validationResult.data.name}
    }
  });
  if(error){
    return{
      form,
      errors:{
        email:['Invalid email'],
        password:['Invalid password'],
        confirmPassword:['Invalid confirm password'],
        name:['Invalid name']
      },
      formError:error.message
    }
  }
  redirect("/login")
}