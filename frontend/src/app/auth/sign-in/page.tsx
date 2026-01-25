import PageContainer from '@/components/layout/page-container';
import { SignInView } from '@/features/auth/login/login-view';
import React from 'react';

const LoginPage = () => {
  return (
    <PageContainer scrollable={false}>
      <SignInView />
    </PageContainer>
  );
};

export default LoginPage;
