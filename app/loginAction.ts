"use server"

import { redirect } from "next/navigation";
import { LoginActionState, loginSchema } from "./validationSchema";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function LoginAction(
  _prev: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const formEntries = Object.fromEntries(formData) as Record<string, string>;
  const form = { email: formEntries.email };
  const validationResult = loginSchema.safeParse(formEntries);

  if (!validationResult.success) {
    return {
      form,
      errors: validationResult.error.flatten().fieldErrors
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validationResult.data.email,
    password: validationResult.data.password
  });

  if (error) {
    return {
      form,
      errors: {
        password: ["Invalid email or password"]
      },
      formError: error.message
    };
  }

  redirect("/");
}