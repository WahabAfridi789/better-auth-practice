"use client";

import { organization, useListOrganizations } from "@/lib/auth/auth-client";
import { Organization } from "better-auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrganizationSwitcher() {

  const router = useRouter();

  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { data: organizations, isPending: loading, refetch } = useListOrganizations();



  const handleSwitchOrganization = async (orgId: string) => {
    try {
      await organization.setActive({ organizationId: orgId });
      setActiveOrg(organizations?.find((org) => org.id === orgId) || null);
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to switch organization:", error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!activeOrg && organizations?.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {activeOrg?.logo ? (
            <img
              src={activeOrg.logo}
              alt={activeOrg.name}
              className="w-6 h-6 rounded"
            />
          ) : (
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {activeOrg?.name?.charAt(0).toUpperCase() || "O"}
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {activeOrg?.name || "No Organization"}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-2">
              {organizations?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No organizations
                </div>
              ) : (
                organizations?.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrganization(org.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeOrg?.id === org.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                  >
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="w-8 h-8 rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {org.name?.charAt(0).toUpperCase() || "O"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {org.name}
                      </div>
                      {org.metadata?.role && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {org.metadata?.role}
                        </div>
                      )}
                    </div>
                    {activeOrg?.id === org.id && (
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/organizations/new");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
