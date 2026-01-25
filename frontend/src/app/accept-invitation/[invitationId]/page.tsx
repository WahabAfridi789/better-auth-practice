import { getServerSession } from "@/lib/auth/auth-server";
import { AcceptInvitationView } from "./accept-invitation-view";
import { BetterAuthSession } from "@/lib/api/api-types-helpers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function AcceptInvitationPage({ params }: PageProps) {
  const { invitationId } = await params;
  const session = await getServerSession<BetterAuthSession>();

  // If not authenticated, redirect to signup/login with invitation ID in callback
  if (!session.user) {
    const callbackUrl = `/accept-invitation/${invitationId}`;
    redirect(`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  console.log("Session,", session)

  // Always render the view - it will handle loading the invitation
  return <AcceptInvitationView invitationId={invitationId} />;


}
