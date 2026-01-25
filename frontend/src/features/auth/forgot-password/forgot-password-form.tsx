'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { $api } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { useState } from 'react';
import {
  authSchemas,
  type ResetPasswordRequestFormData,
} from '../../../../../packages/shared/src/schemas';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: forgotPassword } = $api.useMutation('post', '/auth/forgot-password');

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
        await forgotPassword(
          {
            body: {
              email: value.email,
            },
          },
          {
            onSuccess: (data) => {
              toast.success('Password reset email sent!', {
                description: data.message,
              });
              setIsSubmitting(false);
              // Redirect back to login after a delay
              setTimeout(() => {
                router.push('/auth/login');
              }, 3000);
            },
            onError: (error) => {
              toast.error(error.message);
              setIsSubmitting(false);
            },
          }
        );
      } catch (error) {
        console.error('Forgot password error:', error);
        toast.error('An error occurred. Please try again.');
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
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
            onClick={() => router.push('/auth/login')}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
