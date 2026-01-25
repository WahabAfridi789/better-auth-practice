
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form";
import Link from "next/link";

export default async function NewOrganizationPage() {


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link
                href="/organizations"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to Organizations
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Organization
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Create a New Organization
          </h2>
          <CreateOrganizationForm />
        </div>
      </div>
    </main>
  );
}
