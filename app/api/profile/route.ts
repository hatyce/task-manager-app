import { profileSchema } from "@/app/validationSchema";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WithAuth } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
  return WithAuth(request, async (user) => {
 if(!user){
   return NextResponse.json(
    {error:"Unauthrorized"},
    {status:401}
   )
 }
 return NextResponse.json({data:user})
  })
}
export async function PUT(request:NextRequest){
  return WithAuth(request, async () => {
    try{
      const body = await request.json();
      const validatedData = profileSchema.parse(body);
      const supabase = await createServerSupabaseClient();
      const {error}= await supabase.auth.updateUser({
        data:{
          ...validatedData
        }
      });
      if(error) throw error;
      return NextResponse.json({message: "Profile updated successfully"})
    }catch(error){
      console.log(error);
      return NextResponse.json(
        {error:"Failed to update profile"},
        {status:500}
      )
    }
  })
}