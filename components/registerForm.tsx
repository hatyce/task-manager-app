"use client"
import { RegisterActionState, registrationSchema } from "@/app/validationSchema"
import { RegisterAction } from "@/registerAction";
import { useActionState, useState, useTransition } from "react";
import { ValidatedInput } from "./validatedInput";

const initialRegister:RegisterActionState = {form:{},errors:{}};
export default function RegisterForm(){
  const [state, action, isPending] = useActionState(RegisterAction,initialRegister);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [clientError,setClientError] =  useState<Record<string,string[]>>({});
  const [formError,setFormError] = useState<string|null>(null);
  const [isTransitionPending,startTransition] = useTransition();
  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setIsSubmitted(true);
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const validationResult = registrationSchema.safeParse(data);
    if(!validationResult.success){
      setClientError(validationResult.error.flatten().fieldErrors);
      return;
    }
    setClientError({});
    startTransition(()=>{
      action(formData)
    })
  }
  const mergedErrors ={
    name:clientError.name ?? state.errors?.name,
    email:clientError.email ?? state.errors?.email,
    password:clientError.password ?? state.errors?.password,
    confirmPassword:clientError.confirmPassword ?? state.errors?.confirmPassword
  };
  const isBusy = isPending || isTransitionPending;
  const formErrorMessage = formError ?? state.formError;
  const formValues = state.form ?? {};
  return(
    <div className="flex min-h-full flex-col justify-center py-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name"
            className="block text-sm/6 font-medium text-gray-100">Name</label>
            <div>
              <ValidatedInput
               type="text"
               name="name"
               isSubmitted={isSubmitted}
               fieldSchema={registrationSchema.shape['name']}
               defaultValue={formValues.name}
               errors={mergedErrors.name}
               className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6" />            
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
            <div className="mt-2">
              <ValidatedInput 
               type="email"
               name="email"
               isSubmitted={isSubmitted}
               fieldSchema={registrationSchema.shape['email']}
               defaultValue={formValues.email}
               errors={mergedErrors.email}
               className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
            <div className="mt-2">
              <ValidatedInput
                type="password"
                name="password"
                isSubmitted={isSubmitted}
                fieldSchema={registrationSchema.shape['password']}
                defaultValue={formValues.password}
                errors={mergedErrors.password}
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-100">Confirm Password</label>
            <div className="mt-2">
              <ValidatedInput
               type="password"
               name="confirmPassword"
               isSubmitted={isSubmitted}
               fieldSchema={registrationSchema.shape['confirmPassword']}
               defaultValue={formValues.confirmPassword}
               errors={mergedErrors.confirmPassword}
               className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          {formErrorMessage && (
            <p className="text-sm text-red-500" role="alert">
              {formErrorMessage}
            </p>
          )}
          <div>
            <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white
            focus-visible:outline-2 focus-visible:outline-indigo-500" disabled={isBusy}>
              {isBusy ? "Registering ..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}