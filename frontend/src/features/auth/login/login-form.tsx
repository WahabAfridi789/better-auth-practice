'use client';

import { useAppForm } from '@/components/form/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { authClient, getSession, signIn } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { authSchemas, type LoginFormData } from '../lib/auth.schema';



export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastMethod = authClient.getLastUsedLoginMethod()


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

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleOneTapSignIn = async () => {
      // Only run One Tap if we have a Google Client ID configured
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        console.error('Google Client ID is not configured');
        return;
      }

      try {
        await authClient.oneTap({
          fetchOptions: {
            onSuccess: () => {
              router.push("/dashboard/overview");
            }
          }
        });
      } catch (error: unknown) {
        // Silently handle errors - One Tap is optional
        // Common causes:
        // - Origin not whitelisted in Google Cloud Console (CORS error)
        // - User has disabled One Tap in browser settings
        // - Browser doesn't support FedCM
        // - User is already signed in to Google with a different account
        console.debug('One Tap initialization failed (non-critical):', error);
      }
    };

    // Check if user is already authenticated to avoid unnecessary One Tap prompt
    getSession().then((session) => {
      if (!session?.data) {
        handleOneTapSignIn();
      }
    }).catch(() => {
      // If session check fails, still try One Tap (user might not be logged in)
      handleOneTapSignIn();
    });
  }, [router]);



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
                  <Link
                    href="/auth/sign-up"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Don't have an account? Sign up
                  </Link>
                </div>
              )}
            </form.AppField>


            <Button variant={"default"} type="submit" disabled={isSubmitting} className="w-full relative !  bg-primary!">
              <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
              {lastMethod === "email" && (
                <Badge variant={"secondary"} className="ml-2 absolute -top-2 -right-2">Last used</Badge>
              )}
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
          {lastMethod === "google" && (
            <Badge variant={"secondary"} className="ml-2">Last used</Badge>
          )}
          <SocialAuthButtons callbackUrl="/dashboard/overview" />
        </div>
      </CardContent>
    </Card>
  );
}
