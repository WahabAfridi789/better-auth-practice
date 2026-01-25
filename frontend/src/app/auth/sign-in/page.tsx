import PageContainer from '@/components/layout/page-container';
import { LoginView } from '@/features/auth/login/login-view';
import React from 'react';

const LoginPage = () => {
  return (
    <PageContainer scrollable={false}>
      <LoginView />
    </PageContainer>
  );
};

export default LoginPage;
