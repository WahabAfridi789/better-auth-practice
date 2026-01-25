"use client";

import { useState, useEffect } from "react";
import { organization, useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Invitation } from "better-auth/plugins";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Building2, 
  User, 
  Shield, 
  Calendar,
  Loader2,
  ArrowRight
} from "lucide-react";

interface AcceptInvitationViewProps {
  invitationId: string;
}

// Extended invitation type with additional fields from getInvitation
interface ExtendedInvitation extends Invitation {
  organizationName?: string;
  organizationSlug?: string;
  inviterEmail?: string;
}

export function AcceptInvitationView({
  invitationId,
}: AcceptInvitationViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invitation, setInvitation] = useState<ExtendedInvitation | null>(null);

  useEffect(() => {
    if (session) {
      loadInvitation();
    }
  }, [session, invitationId]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await organization.getInvitation({
        query: { id: invitationId },
      });

      if (result.data) {
        setInvitation(result.data as ExtendedInvitation);
      } else if (result.error) {
        setError(
          result.error.message ||
          "Invalid or expired invitation. Please contact the person who invited you.",
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load invitation");
      } else {
        setError("Failed to load invitation");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      setAccepting(true);
      setError("");
      const result = await organization.acceptInvitation({
        invitationId,
      });

      if (result.error) {
        setError(
          result.error.message ||
          "Failed to accept invitation. It may have expired or been cancelled.",
        );
      } else {
        setSuccess(true);
        // Redirect to the organization after 2 seconds
        setTimeout(() => {
          if (invitation?.organizationId) {
            router.push(`/dashboard/workspaces/${invitation.organizationId}`);
          } else {
            router.push("/dashboard/workspaces");
          }
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to accept invitation");
      } else {
        setError("Failed to accept invitation");
      }
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Invitation Accepted!</CardTitle>
                <CardDescription>
                  You&apos;ve successfully joined{" "}
                  <span className="font-semibold text-foreground">
                    {invitation?.organizationName || "the organization"}
                  </span>
                  . Redirecting you now...
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  if (invitation?.organizationId) {
                    router.push(`/dashboard/workspaces/${invitation.organizationId}`);
                  } else {
                    router.push("/dashboard/workspaces");
                  }
                }}
                className="w-full"
              >
                Go to Organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error && !invitation) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Invalid Invitation</CardTitle>
                <CardDescription>{error}</CardDescription>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!invitation) {
    return null;
  }

  // Check if invitation is expired
  const isExpired = new Date(invitation.expiresAt) < new Date();
  const isEmailMismatch =
    session?.user?.email &&
    session.user.email.toLowerCase() !== invitation.email.toLowerCase();

  const canAccept = !isExpired && !isEmailMismatch && !accepting;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Organization Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isEmailMismatch && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertTitle>Email Mismatch</AlertTitle>
              <AlertDescription>
                This invitation was sent to{" "}
                <strong>{invitation.email}</strong>, but you&apos;re signed in as{" "}
                <strong>{session?.user?.email}</strong>. Please sign in with the
                correct email address to accept this invitation.
              </AlertDescription>
            </Alert>
          )}

          {isExpired && (
            <Alert variant="destructive">
              <Calendar className="h-4 w-4" />
              <AlertTitle>Invitation Expired</AlertTitle>
              <AlertDescription>
                This invitation has expired on{" "}
                {new Date(invitation.expiresAt).toLocaleDateString()}. Please
                contact the organization administrator for a new invitation.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Organization
                  </p>
                  <p className="text-lg font-semibold">
                    {invitation.organizationName || invitation.organizationId}
                  </p>
                  {invitation.organizationSlug && (
                    <p className="text-sm text-muted-foreground">
                      {invitation.organizationSlug}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Invited by
                  </p>
                  <p className="font-medium">
                    {invitation.inviterEmail || invitation.inviterId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Role
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {invitation.role}
                    </Badge>
                    <Badge variant="outline">
                      {invitation.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Expires on {new Date(invitation.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={!canAccept}
              className="flex-1"
              size="lg"
            >
              {accepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              disabled={accepting}
            >
              <Link href="/dashboard">
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
