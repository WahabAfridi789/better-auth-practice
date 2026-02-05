import { Metadata } from 'next';
import { LoginForm } from './login-form';


export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export function SignInView() {
  return <LoginForm />
}
