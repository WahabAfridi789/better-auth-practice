'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
// import { $api } from '@/lib/api-client';
import { LoadingSwap } from '@/components/ui/loading-swap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthHeader from '../components/auth-header';
import { authSchemas, type LoginFormData } from '../lib/auth.schema';

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { mutateAsync: loginMutation } = $api.useMutation('post', '/auth/login');

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

        // await loginMutation(
        //   {
        //     body: {
        //       email: value.email,
        //       password: value.password,
        //     },
        //   },
        //   {
        //     onSuccess: (data) => {
        //       console.log(data);
        //       toast.success(data.message, {
        //         description: data.data?.message,
        //       });
        //       // Redirect to home or callback URL
        //       setIsSubmitting(false);
        //       const params = new URLSearchParams(window.location.search);
        //       const callbackUrl = params.get('callbackUrl') || '/admin';
        //       router.push(callbackUrl);
        //       router.refresh(); // Refresh to update server components
        //     },
        //     onError: (error) => {
        //       console.error('Login error:', error);
        //       toast.error('Operation failed', {
        //         description: error.error?.message || error.message,
        //       });
        //       setIsSubmitting(false);
        //     },
        //   }
        // );
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
      <CardContent>
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
