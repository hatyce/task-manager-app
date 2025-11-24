import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({children}:{children:ReactNode}){
 const supabase = await createServerSupabaseClient();
 const {data:{session}} = await supabase.auth.getSession();
 if(session){
  redirect("/");
 }
 return(
  <div>{children}</div>
 )
}