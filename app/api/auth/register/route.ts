import { registrationSchema } from "@/app/validationSchema";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try{
 const body = await request.json()
 const validateData = registrationSchema.parse(body)
 const supabase = await createServerSupabaseClient()
 const {data, error} = await supabase.auth.signUp({
  email:validateData.email,
  password:validateData.password,
  options:{
    emailRedirectTo:`${request.nextUrl.origin}/auth/callback`,
  }
 })
 if(error) throw error
 return NextResponse.json({data})
 }catch(error){
 return NextResponse.json(
  {error: error instanceof Error ? error.message : "Failed to register"},
  {status:400}
 )
  }
}