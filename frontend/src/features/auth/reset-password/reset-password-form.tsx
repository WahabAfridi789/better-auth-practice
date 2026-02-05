'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { authSchemas, ResetPasswordFormData } from '../lib/auth.schema';
import { resetPassword } from '@/lib/auth/auth-client';
import { useState } from 'react';



export function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();


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
        setIsSubmitting(true);
        const result = await resetPassword({
          newPassword: value.newPassword,
          token: value.token,
        });

        if (result.error) {
          toast.error('Reset password failed', {
            description: result.error.message,
          });
        } else {
          toast.success('Reset password successful', {
            description: 'Your password has been reset successfully',
          });
          router.push('/auth/sign-in');
        }
      } catch (error) {
        console.error('Reset password error:', error);
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
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

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/sign-in" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
