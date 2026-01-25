import PageContainer from '@/components/layout/page-container';
import { ResetPasswordForm } from './reset-password-form';

export function ResetPasswordView() {
  return (
    <PageContainer scrollable={false}>
      <ResetPasswordForm />
    </PageContainer>
  );
}
