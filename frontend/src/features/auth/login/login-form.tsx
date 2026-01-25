'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { signIn } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { authSchemas, type LoginFormData } from '../lib/auth.schema';


export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginFormData,
    validators: {
      onSubmit: authSchemas.login,
    },
    onSubmit: async ({ value }: { value: LoginFormData }) => {
      try {
        setIsSubmitting(true);

        const result = await signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: '/dashboard/overview',
        });

        if (result.error) {
          toast.error('Login failed', {
            description: result.error.message,
          });
        } else {
          toast.success('Login successful', {
            description: 'You are now logged in',
          });
          router.push('/dashboard/overview');
        }


      } catch (error) {
        console.error('Login error:', error);
        setIsSubmitting(false);
      }
      finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full">
      <AuthHeader title="Login" description="Welcome back! Please enter your details." />
      <CardContent className='space-y-6'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full"
        >
          <FieldGroup>
            <form.AppField name="email">
              {(field) => <field.Input label="Email" placeHolder="you@example.com" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <field.PasswordInput label="Password" />

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </form.AppField>


            <Button variant={"default"} type="submit" disabled={isSubmitting} className="w-full">
              <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
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
