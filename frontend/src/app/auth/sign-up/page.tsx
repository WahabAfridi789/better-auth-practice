import PageContainer from '@/components/layout/page-container';
import { SignUpView } from '@/features/auth/sign-up/signup-view';

import React from 'react';

const SignUpPage = () => {
  return (
    <PageContainer scrollable={false}>
      <SignUpView />
    </PageContainer>
  );
};

export default SignUpPage;
