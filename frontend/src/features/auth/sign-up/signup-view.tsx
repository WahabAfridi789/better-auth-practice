import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from './signup-form';


export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export function SignUpView() {
  return <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
    <SignUpForm />


    <p className='text-muted-foreground px-8 text-center text-sm'>
      By clicking continue, you agree to our{' '}
      <Link
        href='/terms'
        className='hover:text-primary underline underline-offset-4'
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        href='/privacy'
        className='hover:text-primary underline underline-offset-4'
      >
        Privacy Policy
      </Link>
      .
    </p>
  </div>
}
