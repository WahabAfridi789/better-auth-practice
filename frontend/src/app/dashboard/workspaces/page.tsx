'use client';

import PageContainer from '@/components/layout/page-container';
import { useTheme } from 'next-themes';
import { workspacesInfoContent } from '@/config/infoconfig';

export default function WorkspacesPage() {

  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Manage your workspaces and switch between them'
      infoContent={workspacesInfoContent}
    >
      <div>Workspaces Page</div>
      {/* <OrganizationList
        appearance={{
          baseTheme: isDark ? dark : undefined,
          elements: {
            organizationListBox: 'space-y-2',
            organizationPreview: 'rounded-lg border p-4 hover:bg-accent',
            organizationPreviewMainIdentifier: 'text-lg font-semibold',
            organizationPreviewSecondaryIdentifier:
              'text-sm text-muted-foreground'
          }
        }}
        afterSelectOrganizationUrl='/dashboard/workspaces/team'
        afterCreateOrganizationUrl='/dashboard/workspaces/team'
      /> */}
    </PageContainer>
  );
}
