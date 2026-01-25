
import OrganizationDetailView from "@/features/organizations/components/organization-detail-view";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrganizationDetailView organizationId={id} />
      </div>
    </main>
  );
}
