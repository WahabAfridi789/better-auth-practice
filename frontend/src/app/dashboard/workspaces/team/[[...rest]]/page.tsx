'use client';

import PageContainer from '@/components/layout/page-container';
import { useTheme } from 'next-themes';
import { teamInfoContent } from '@/config/infoconfig';

export default function TeamPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage your workspace team, members, roles, security and more.'
      infoContent={teamInfoContent}
    >
      <div>Team Page</div>
      {/* <OrganizationProfile
        appearance={{
          baseTheme: isDark ? dark : undefined
        }}
      /> */}
    </PageContainer>
  );
}
