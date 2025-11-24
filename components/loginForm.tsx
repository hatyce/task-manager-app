"use client"
import { useActionState, useState, useTransition } from "react";
import { ValidatedInput } from "./validatedInput";
import { LoginAction } from "@/app/loginAction";
import { LoginActionState, loginSchema } from "@/app/validationSchema";
import { useAuthLogin } from "@/hooks/use-auth-login";

const initialState: LoginActionState = { form: {}, errors: {} };
const isMockAuth = process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true";

export default function LoginForm(){
  const [state, action, isPending] = useActionState(LoginAction, initialState);
  const [isSubmitted,setIsSubmitted] = useState<boolean>(false);
  const [clientErrors,setClientErrors] = useState<Record<string,string[]>>({});
  const [formError,setFormError] = useState<string | null>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const { isLoading: isMockLoading, login: mockLogin } = useAuthLogin();

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setIsSubmitted(true);
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const validationResult = loginSchema.safeParse(data);
    if(!validationResult.success){
      setClientErrors(validationResult.error.flatten().fieldErrors);
      return;
    }
    setClientErrors({});

    if(isMockAuth){
      const errorMessage = await mockLogin(validationResult.data);
      if(errorMessage){
        setFormError(errorMessage);
        return;
      }
      event.currentTarget.reset();
      return;
    }

    startTransition(()=>{
      action(formData);
    });
  }

  const mergedErrors = isMockAuth
    ? clientErrors
    : {
        email: clientErrors.email ?? state.errors?.email,
        password: clientErrors.password ?? state.errors?.password
      };
  const isBusy = isMockAuth ? isMockLoading : (isPending || isTransitionPending);
  const formErrorMessage = isMockAuth ? formError : state.formError;
  const defaultEmail = isMockAuth ? undefined : state.form?.email;
  return(
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="mt-20 space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
            <div className="mt-2">
              <ValidatedInput type="email"
              name="email"
              isSubmitted={isSubmitted}
              fieldSchema={loginSchema.shape["email"]}
              defaultValue={defaultEmail}
              errors={mergedErrors.email}
              className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white focus:outline-indigo-500 sm:text-sm/6"/>
            </div> 
          </div>
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
            <div className="mt-2">
              <ValidatedInput type="password"
              name="password"
              isSubmitted={isSubmitted}
              fieldSchema={loginSchema.shape["password"]}
              errors={mergedErrors.password}
              className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          {formErrorMessage && (
            <p className="text-sm text-red-500" role="alert">{formErrorMessage}</p>
          )}
          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold hover:bg-indigo-400
             focus-visible:outline-2 focus-visible:bg-indigo-500"
             disabled={isBusy}>
             {isBusy ? "Signing in...": "Sign In"}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
