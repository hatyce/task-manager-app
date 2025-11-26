import { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "./supabase/server";

export async function WithAuth(
  request:NextRequest,
  handler:(user: User | null)=>Promise<NextResponse>
){
  try{
    const supabase = await createServerSupabaseClient();
    const {data:{user},error} = await supabase.auth.getUser();
    if(error || !user){
      return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      )
    }
    return await handler(user);
  }catch(error){
    console.log(error);
    return NextResponse.json(
      {error:"Internal server error"},
      {status:500}
    )
  }
}