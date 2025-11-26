import z from "zod";

export const loginSchema= z.object({
  email: z.string()
  .email({message:"Please enter a valid email address."})
  .min(1,({message:"Be at least one characters long"}))
  .max(30,({message:"Be less than 30 characters long"}))
  .trim(),
  password: z.string()
  .min(8,({message:"Be at least 8 characters long"}))
  .max(30,({message:"Be less than 30 characters long"}))
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,({message:"Contain at least one uppercase,lowercase and number character"}))
  .regex(/[^a-zA-Z0-9]/,({message:"Contain at least one special character"})).trim()
});
export const registrationSchema = loginSchema.extend({
  confirmPassword: z.string(),
  name:z.string()
  .min(2,({message:"Be at least 2 characters long"}))
  .max(40,({message:"Be less than 40 characters long"}))
  .regex(/^[a-zA-Z\s]+$/,({message:"Contain only letters and spaces"}))
}).refine((data)=> data.password === data.confirmPassword,{
  message:"Password don't match",
  path:["confirmPassword"],
})
export const profileSchema = z.object({
  full_name:z.string().min(2,({message:"Be at least 2 characters"}))
  .max(30,({message:"Be less than 30 characters long"})),
  username:z.string().min(2,({message:"Be at least 2 characters"}))
  .max(30,({message:"Be less than 30 characters long"})),
  bio:z.string().max(160).optional(),
  preferred_theme:z.enum(["system","light","dark"]),
})
export const resetPasswordSchema = z.object({
  email:z.string().email({message:"Please enter a valid email address"})
})
export type LoginActionState= {
  form?:{
    email?: string
    password?: string
  }
  errors?:{
    email?: string[] 
    password?: string[]
  }
  formError?: string
}
export type RegisterActionState={
  form?:{
    email?:string,
    password?:string
    confirmPassword?:string
    name?:string
  }
  errors?:{
    email?:string[]
    password?:string[]
    confirmPassword?:string[]
    name?:string[]
  }
  formError?:string
}
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registrationSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>