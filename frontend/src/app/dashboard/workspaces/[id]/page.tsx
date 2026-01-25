
import OrganizationDetailView from "@/features/organizations/components/organization-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <OrganizationDetailView organizationId={id} />
  );
}
