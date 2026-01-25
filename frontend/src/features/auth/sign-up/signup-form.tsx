'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { signIn, signUp } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { authSchemas, type SignUpFormData } from '../lib/auth.schema';


export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    } satisfies SignUpFormData,
    validators: {
      onSubmit: authSchemas.signUp,
    },
    onSubmit: async ({ value }: { value: SignUpFormData }) => {
      try {
        setIsSubmitting(true);

        const result = await signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: '/dashboard/overview',
        });

        if (result.error) {
          toast.error('Sign up failed', {
            description: result.error.message,
          });
        } else {
          toast.success('Sign up successful', {
            description: 'You are now logged in',
          });
          router.push('/dashboard/overview');
        }


      } catch (error) {
        console.error('Sign up error:', error);
        setIsSubmitting(false);
      }
      finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full">
      <AuthHeader title="Sign Up" description="Welcome! Please enter your details." />
      <CardContent className='space-y-6'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full"
        >
          <FieldGroup>

            <form.AppField name="name">
              {(field) => <field.Input label="Name" placeHolder="John Doe" />}
            </form.AppField>


            <form.AppField name="email">
              {(field) => <field.Input label="Email" placeHolder="you@example.com" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <field.PasswordInput label="Password" />



                  <p className="text-sm text-muted-foreground">
                    Already have an account?
                    <Link
                      href="/auth/sign-in"
                      className="text-sm ml-2 font-semibold text-primary hover:underline transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>

                </div>
              )}
            </form.AppField>

            <Button variant={"default"} type="submit" disabled={isSubmitting} className="w-full">
              <LoadingSwap isLoading={isSubmitting}>Sign Up</LoadingSwap>
            </Button>
          </FieldGroup>
        </form>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>

        </div>
        <div className=' w-full'>
          <SocialAuthButtons callbackUrl="/dashboard/overview" />
        </div>
      </CardContent>
    </Card>
  );
}
