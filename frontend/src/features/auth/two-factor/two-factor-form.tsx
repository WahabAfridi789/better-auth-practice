'use client';

import { useAppForm } from '@/components/form/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { twoFactor } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth-header';
import { authSchemas, type TwoFactorTotpFormData, type TwoFactorBackupFormData } from '../lib/auth.schema';

export function TwoFactorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/overview';
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TOTP Form
  const totpForm = useAppForm({
    defaultValues: {
      code: '',
    } satisfies TwoFactorTotpFormData,
    validators: {
      onChange: authSchemas.twoFactorTotp,
      onSubmit: authSchemas.twoFactorTotp,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);

        const { error: verifyError } = await twoFactor.verifyTotp({
          code: value.code,
          trustDevice: true,
        });

        if (verifyError) {
          toast.error('Verification failed', {
            description: verifyError.message || 'Invalid verification code',
          });
          return;
        }

        toast.success('Verification successful', {
          description: 'You are now logged in',
        });
        router.push(callbackUrl);
        router.refresh();
      } catch (error) {
        console.error('2FA verification error:', error);
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Backup Code Form
  const backupForm = useAppForm({
    defaultValues: {
      code: '',
    } satisfies TwoFactorBackupFormData,
    validators: {
      onSubmit: authSchemas.twoFactorBackup,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);

        const { error: verifyError } = await twoFactor.verifyBackupCode({
          code: value.code,
          trustDevice: true,
        });

        if (verifyError) {
          toast.error('Verification failed', {
            description: verifyError.message || 'Invalid backup code',
          });
          return;
        }

        toast.success('Verification successful', {
          description: 'You are now logged in',
        });
        router.push(callbackUrl);
        router.refresh();
      } catch (error) {
        console.error('2FA backup code verification error:', error);
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleToggleMode = () => {
    setUseBackupCode(!useBackupCode);
    totpForm.reset();
    backupForm.reset();
  };

  return (
    <Card className="w-full">
      <AuthHeader
        title="Two-Factor Authentication"
        description={
          useBackupCode
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'
        }
      />
      <CardContent className="space-y-6">
        {useBackupCode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              backupForm.handleSubmit();
            }}
            className="w-full"
          >
            <FieldGroup>
              <backupForm.AppField name="code">
                {(field) => (
                  <div className="space-y-2">
                    <field.Input
                      label="Backup Code"
                      placeHolder="Enter backup code"
                    />
                  </div>
                )}
              </backupForm.AppField>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>Verify</LoadingSwap>
              </Button>
            </FieldGroup>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              totpForm.handleSubmit();
            }}
            className="w-full"
          >
            <FieldGroup>
              <totpForm.AppField name="code">
                {(field) => (
                  <>
                    <field.OTP
                      label="Verification Code"
                      description="Enter the 6-digit code from your authenticator app"
                      length={6}
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || field.state.value.length !== 6} 
                      className="w-full"
                    >
                      <LoadingSwap isLoading={isSubmitting}>Verify</LoadingSwap>
                    </Button>
                  </>
                )}
              </totpForm.AppField>
            </FieldGroup>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={handleToggleMode}
            className="text-sm text-primary hover:underline transition-colors"
            type="button"
          >
            {useBackupCode ? 'Use authenticator code instead' : 'Use a backup code instead'}
          </button>
        </div>

        <div className="text-center">
          <Link href="/auth/sign-in" className="text-sm text-primary hover:underline transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
