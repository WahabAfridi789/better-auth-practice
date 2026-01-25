'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { $api } from '@/lib/api-client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';

import {
  authSchemas,
  type ResetPasswordFormData,
} from '../../../../../packages/shared/src/schemas';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: resetPassword, isPending } = $api.useMutation('post', '/auth/reset-password');

  const token = searchParams.get('token');
  const isValidToken = Boolean(token);

  const form = useAppForm({
    defaultValues: {
      token: token || '',
      newPassword: '',
      confirmNewPassword: '',
    } satisfies ResetPasswordFormData,
    validators: {
      onSubmit: authSchemas.resetPassword,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error('Invalid reset token');
        return;
      }

      try {
        resetPassword(
          {
            body: {
              token: value.token,
              newPassword: value.newPassword,
            },
          },
          {
            onSuccess: (data) => {
              toast.success('Password reset successfully!', {
                description: data.message,
              });
              // Redirect to login after a delay
              setTimeout(() => {
                router.push('/auth/login');
              }, 1000);
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      } catch (error) {
        console.error('Reset password error:', error);
        toast.error('An error occurred. Please try again.');
      }
    },
  });

  if (!isValidToken) {
    return (
      <Card className="w-full">
        <AuthHeader
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired."
        />
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Please request a new password reset link.
            </p>
            <Link href="/auth/forgot-password">
              <Button>Request New Link</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <AuthHeader title="Reset Password" description="Enter your new password below." />
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full"
        >
          <FieldGroup>
            <form.AppField name="newPassword">
              {(field) => <field.PasswordInput label="New Password" />}
            </form.AppField>

            <form.AppField name="confirmNewPassword">
              {(field) => <field.PasswordInput label="Confirm New Password" />}
            </form.AppField>

            <Button disabled={isPending} type="submit">
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
