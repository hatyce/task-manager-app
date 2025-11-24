import LoginForm from '@/components/loginForm';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title:"Login",
  description:"Login to your account"

};
export default function LoginPage(){
  return(
    <div>
      <LoginForm/>
    </div>
  )
}