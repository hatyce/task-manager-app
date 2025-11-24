import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "./lib/supabase/server";

export async function middleware(request:NextRequest){
  const response = NextResponse.next({
    request:{
      headers:request.headers,
    }
  })
  const supabase = await createServerSupabaseClient();
  const {
    data:{session}}=await supabase.auth.getSession();
    const isAuthRoute=request.nextUrl.pathname.startsWith('auth');
    if(isAuthRoute && session){
      return NextResponse.redirect(new URL('/',request.url))
    }
    return response;
}
export const config = {
  matcher:[
    "/api/:path*",
    "/((?!api|_next/static|_next/image).*)",
  ]
}