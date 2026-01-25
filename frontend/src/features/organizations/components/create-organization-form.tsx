"use client";

import { useState } from "react";
import { organization } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const checkSlug = async (slug: string) => {
    if (!slug) return true;
    try {
      const result = await organization.checkSlug({ slug });
      // Response can be { available: boolean } or { status: string }
      // Handle both cases
      if (typeof result.data === "object" && result.data !== null) {
        if ("available" in result.data) {
          return result.data.available as boolean;
        }
        if ("status" in result.data) {
          return result.data.status === "available" || result.data.status === true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if slug is available
      const isAvailable = await checkSlug(formData.slug);
      if (!isAvailable) {
        setError("This organization slug is already taken");
        setLoading(false);
        return;
      }

      const result = await organization.create({
        name: formData.name,
        slug: formData.slug,
        logo: formData.logo || undefined,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create organization");
      } else {
        router.push("/organizations");
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create organization");
      } else {
        setError("Failed to create organization");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Organization Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="My Organization"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Organization Slug
        </label>
        <input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) =>
            setFormData({ ...formData, slug: generateSlug(e.target.value) })
          }
          required
          pattern="[a-z0-9-]+"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="my-organization"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Used in URLs. Only lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <div>
        <label
          htmlFor="logo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Logo URL (Optional)
        </label>
        <input
          id="logo"
          type="url"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.name || !formData.slug}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? "Creating..." : "Create Organization"}
      </button>
    </form>
  );
}
