import { loginSchema } from "@/app/validationSchema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
 try{
  const body = await request.json()
  const validateData = loginSchema.parse(body)
  const supabase = await createClientComponentClient()
  const {data,error} = await supabase.auth.signInWithPassword({
    email: validateData.email,
    password: validateData.password
  })
  if(error) throw error
  return NextResponse.json({data})
 }catch(error){
  return NextResponse.json({
    error: error instanceof Error ? error.message : "Failed to login"
   },
   {status: 400}
  )
 }
}