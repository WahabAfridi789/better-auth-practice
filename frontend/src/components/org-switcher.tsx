'use client';

// import { useAuth, useOrganizationList } from '@clerk/nextjs';
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { authClient, useListOrganizations } from '@/lib/auth/auth-client';
import { Organization } from 'better-auth/plugins';

export function OrgSwitcher() {
  const { isMobile, state } = useSidebar();
  const [active, setActive] = useState<Organization | undefined>(undefined)
  const [organizationDetails, setOrganizationDetails] = useState<Organization | undefined>()
  const router = useRouter();
  const { data: organizations, isPending: isLoading, refetch } = useListOrganizations();
  const { data: activeOrganization, isPending, refetch: refetchActiveOrganization } = authClient.useActiveOrganization()




  const orgId = activeOrganization && activeOrganization?.id

  const fetchOrgMembers = async () => {
    if (orgId) {
      const { data, error } = await authClient.organization.getFullOrganization({
        query: {
          organizationId: orgId,
          organizationSlug: organizations?.find((org) => org.id === orgId)?.slug || '',
          membersLimit: 100,
        },
      });
      setOrganizationDetails(organizationDetails)
      console.log("authClient.organization.getFullOrganization", data)
    }
  }

  useEffect(() => {
    if (orgId)
      fetchOrgMembers()

  }, [])



  // Handle organization switch
  const handleOrganizationSwitch = async (organizationId: string) => {
    console.log('handleOrganizationSwitch', orgId, organizationId);
    if (orgId === organizationId || !setActive) {
      console.log('Already active or setActive not available', orgId, organizationId);
      return; // Already active or setActive not available
    }

    try {
      const { data, error } = await authClient.organization.setActive({
        organizationId: organizationId,
        organizationSlug: organizations?.find((org) => org.id === organizationId)?.slug || '',
      });
      console.log("authClient.organization.setActive", data)
      refetchActiveOrganization()

      await setActive(organizations?.find((org) => org.id === organizationId) || undefined);
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${state === 'collapsed'
                ? 'invisible max-w-0 overflow-hidden opacity-0'
                : 'visible max-w-full opacity-100'
                }`}
            >
              <span className='truncate font-medium'>Loading...</span>
              <span className='text-muted-foreground truncate text-xs'>
                Organizations
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // // Show create organization option if no organizations
  if (!organizations || organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            onClick={() => router.push('/dashboard/workspaces/new')}
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
              <Plus className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${state === 'collapsed'
                ? 'invisible max-w-0 overflow-hidden opacity-0'
                : 'visible max-w-full opacity-100'
                }`}
            >
              <span className='truncate font-medium'>Create organization</span>
              <span className='text-muted-foreground truncate text-xs'>
                Get started
              </span>
            </div>
            <ChevronsUpDown
              className={`ml-auto transition-all duration-200 ease-in-out ${state === 'collapsed'
                ? 'invisible max-w-0 opacity-0'
                : 'visible max-w-full opacity-100'
                }`}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Use active organization or first organization as fallback
  const displayOrganization =
    activeOrganization || organizations[0];

  if (!displayOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {
                displayOrganization.logo ? (
                  <Image
                    src={displayOrganization.logo}
                    alt={displayOrganization.name}
                    width={32}
                    height={32}
                    className='size-full object-cover'
                  />
                ) : (
                  <GalleryVerticalEnd className='size-4' />
                )}
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
                <div>Org Switcher</div>

              </div>
              <div
                className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
                  }`}
              >
                <span className='truncate font-medium'>
                  {displayOrganization.name}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {organizationDetails?.members.find(
                    (m) => m.organizationId === displayOrganization.id
                  )?.role || 'Organization'}
                </span>
              </div>
              <ChevronsUpDown
                className={`ml-auto transition-all duration-200 ease-in-out ${state === 'collapsed'
                  ? 'invisible max-w-0 opacity-0'
                  : 'visible max-w-full opacity-100'
                  }`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Organizations
            </DropdownMenuLabel>
            {organizations.map((organization, index) => {
              const isActive = organization.id === orgId;
              return (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() =>
                    handleOrganizationSwitch(organization.id)
                  }
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center overflow-hidden rounded-md border'>
                    {organization.logo ? (
                      <Image
                        src={organization.logo}
                        alt={organization.name}
                        width={24}
                        height={24}
                        className='size-full object-cover'
                      />
                    ) : (
                      <GalleryVerticalEnd className='size-3.5 shrink-0' />
                    )}
                  </div>
                  {organization.name}
                  {isActive && <Check className='ml-auto size-4' />}
                  {!isActive && (
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => {
                router.push('/dashboard/workspaces');
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
