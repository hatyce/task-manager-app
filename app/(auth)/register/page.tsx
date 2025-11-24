import RegisterForm from '@/components/registerForm';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title:"Register",
  description:"Create anew account"
};
export default function RegisterPage(){
  return(
    <div><RegisterForm/></div>
  )
}