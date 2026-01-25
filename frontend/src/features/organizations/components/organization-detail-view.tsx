"use client"
import PageContainer from '@/components/layout/page-container'
import React from 'react'
import { useState, useEffect } from "react";
import { organization } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

import { Organization } from "better-auth/client";
import { OrganizationMembers } from './organization-members';
import { OrganizationTeams } from './organization-teams';
const OrganizationDetailView = ({ organizationId }: { organizationId: string }) => {
    const router = useRouter();
    const [org, setOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "members" | "teams">(
        "overview"
    );

    useEffect(() => {
        loadOrganization();
    }, [organizationId]);

    const loadOrganization = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await organization.getFullOrganization({ query: { organizationId } });
            if (result.data) {
                setOrg(result.data);
            } else if (result.error) {
                setError(result.error.message || "Failed to load organization");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to load organization");
            } else {
                setError("Failed to load organization");
            }
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (!org) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="p-4 text-gray-500 dark:text-gray-400">No organization found</div>
            </div>
        );
    }

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Organization Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        {org.logo ? (
                            <img
                                src={org.logo}
                                alt={org.name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                {org.name?.charAt(0).toUpperCase() || "O"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {org.name}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">{org.slug}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex gap-4">
                            {[
                                { id: "overview", label: "Overview" },
                                { id: "members", label: "Members" },
                                { id: "teams", label: "Teams" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as "overview" | "members" | "teams")}
                                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id
                                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Organization Details
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white">{org.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Slug
                                    </label>
                                    <p className="text-gray-900 dark:text-white">{org.slug}</p>
                                </div>
                                {org.logo && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Logo
                                        </label>
                                        <img
                                            src={org.logo}
                                            alt={org.name}
                                            className="mt-2 w-24 h-24 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "members" && (
                        <OrganizationMembers organizationId={organizationId} />
                    )}

                    {activeTab === "teams" && (
                        <OrganizationTeams organizationId={organizationId} />
                    )}
                </div>
            </div>
        </PageContainer>
    )
}

export default OrganizationDetailView