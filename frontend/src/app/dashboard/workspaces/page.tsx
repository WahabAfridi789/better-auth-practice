'use client';

import PageContainer from '@/components/layout/page-container';
import { useTheme } from 'next-themes';
import { workspacesInfoContent } from '@/config/infoconfig';
import { authClient, organization, useListOrganizations } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import Link from 'next/link';


export default function WorkspacesPage() {
  const { data: organizations, isPending, refetch: refetchOrganizations } = useListOrganizations()
  const { data: activeOrganization, isPending: isActiveOrganizationPending, refetch: refetchActiveOrganization } = authClient.useActiveOrganization()

  const handleSetActive = async (orgId: string) => {
    try {
      await organization.setActive({ organizationId: orgId });
      refetchActiveOrganization();
      refetchOrganizations();

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to set active organization");
      } else {
        toast.error("Failed to set active organization");
      }
    }
  };


  if (organizations?.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-6 8v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No organizations yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Create your first organization to get started
        </p>
        <Link
          href="/dashboard/workspaces/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Organization
        </Link>
      </div>
    );
  }


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

      <div className="space-y-3">
        {organizations?.map((org) => (
          <div
            key={org.id}
            className={`p-4 bg-white dark:bg-gray-800 rounded-xl border transition-colors ${org.metadata?.active
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {org.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {org.slug}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded capitalize">
                      {org.metadata?.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeOrganization?.id === org.id ? (
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetActive(org.id)}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Set Active
                  </button>
                )}
                <Link
                  href={`/dashboard/workspaces/${org.id}`}
                  className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
