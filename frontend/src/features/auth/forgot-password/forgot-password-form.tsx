'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { useState } from 'react';
import { authSchemas, ResetPasswordRequestFormData } from '../lib/auth.schema';
import { requestPasswordReset } from '@/lib/auth/auth-client';


export function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useAppForm({
    defaultValues: {
      email: '',
    } satisfies ResetPasswordRequestFormData,
    validators: {
      onSubmit: authSchemas.resetPasswordRequest,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);

        const result = await requestPasswordReset({
          email: value.email,
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
        console.error('Forgot password error:', error);
        toast.error('An error occurred. Please try again.');
        setIsSubmitting(false);
      }
    },
  });


  return (
    <Card className="w-full ">
      <AuthHeader
        title="Forgot Password"
        description="Enter your email address and we'll send you a link to reset your password."
      />
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

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
