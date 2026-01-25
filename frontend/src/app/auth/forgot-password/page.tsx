import PageContainer from '@/components/layout/page-container';
import { ForgotPasswordView } from '@/features/auth/forgot-password/forgot-password-view';

const ForgotPasswordPage = () => {
  return (
    <PageContainer scrollable={false}>
      <ForgotPasswordView />
    </PageContainer>
  );
};

export default ForgotPasswordPage;
