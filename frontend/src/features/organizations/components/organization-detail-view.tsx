"use client";

import PageContainer from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { organization } from "@/lib/auth/auth-client";
import { Invitation, Member, Organization, Team } from "better-auth/client";
import { Building2, Calendar, Mail, Users, UsersRound } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationInvitations } from './organization-invitations';
import { OrganizationMembers } from './organization-members';
import { OrganizationTeams } from './organization-teams';

interface FullOrganization extends Organization {
    members?: Array<Member>;
    invitations?: Array<Invitation>;
    teams?: Array<Team>;
}

const OrganizationDetailView = ({ organizationId }: { organizationId: string }) => {
    const router = useRouter();
    const [org, setOrg] = useState<FullOrganization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrganization();
    }, [organizationId]);

    const loadOrganization = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await organization.getFullOrganization({
                query: { organizationId }
            });
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
            <PageContainer>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    if (!org) {
        return (
            <PageContainer>
                <Alert>
                    <AlertDescription>No organization found</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    const memberCount = org.members?.length || 0;
    const invitationCount = org.invitations?.length || 0;
    const teamCount = org.teams?.length || 0;

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Organization Header Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                {org.logo ? (
                                    <AvatarImage src={org.logo} alt={org.name} />
                                ) : (
                                    <AvatarFallback className="text-2xl">
                                        {org.name?.charAt(0).toUpperCase() || "O"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{org.name}</CardTitle>
                                <CardDescription className="mt-1">
                                    <span className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        {org.slug}
                                    </span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Members</p>
                                    <p className="text-2xl font-semibold">{memberCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Invitations</p>
                                    <p className="text-2xl font-semibold">{invitationCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <UsersRound className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Teams</p>
                                    <p className="text-2xl font-semibold">{teamCount}</p>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created:</span>
                                <span>
                                    {(org.createdAt instanceof Date ? org.createdAt : new Date(org.createdAt)).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="members">Members</TabsTrigger>
                                <TabsTrigger value="invitations">Invitations</TabsTrigger>
                                <TabsTrigger value="teams">Teams</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Name
                                                    </label>
                                                    <p className="mt-1 text-sm">{org.name}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Slug
                                                    </label>
                                                    <p className="mt-1 text-sm">{org.slug}</p>
                                                </div>
                                            </div>
                                            {org.logo && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Logo
                                                    </label>
                                                    <div className="mt-2">
                                                        <Avatar className="h-24 w-24">
                                                            <AvatarImage src={org.logo} alt={org.name} />
                                                            <AvatarFallback>
                                                                {org.name?.charAt(0).toUpperCase() || "O"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                </div>
                                            )}
                                            {org.metadata && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Metadata
                                                    </label>
                                                    <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
                                                        {JSON.stringify(org.metadata, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="members" className="mt-6">
                                <OrganizationMembers organizationId={organizationId} />
                            </TabsContent>

                            <TabsContent value="invitations" className="mt-6">
                                <OrganizationInvitations organizationId={organizationId} />
                            </TabsContent>

                            <TabsContent value="teams" className="mt-6">
                                <OrganizationTeams organizationId={organizationId} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default OrganizationDetailView;
