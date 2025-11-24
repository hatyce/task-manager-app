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
  .min(2,({message:"Be at leaqst 2 characters long"}))
  .max(40,({message:"Be less than 40 characters long"}))
  .regex(/^[a-zA-Z\s]+$/,({message:"Contain only letters and spaces"}))
}).refine((data)=> data.password === data.confirmPassword,{
  message:"Password don't match",
  path:["confirmPassword"],
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
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registrationSchema>