import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./api-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Middleware to automatically include cookies in all requests
 * This ensures Better Auth session cookies are sent with every API call
 */
const cookieMiddleware: Middleware = {
  async onRequest({ request }) {
    // In browser, cookies are automatically included with credentials: "include"
    // But we need to ensure credentials are set for fetch
    // openapi-fetch handles this, but we can add additional logic here if needed
    // Get cookies from headers
    //make sure we are on the server side so we can get the cookies from the headers
    if (typeof window === "undefined") {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      const cookie = headersList.get("cookie") || null;
      if (cookie) {
        request.headers.set("Cookie", cookie);
      }
    }
    return request;
  },
  async onResponse({ response }) {
    // Handle response if needed (e.g., refresh tokens, error handling)
    console.log("API Response:", response);
    return response;
  },
  async onError({ error }) {
    // Log errors or handle them globally
    console.error("API Error:", error);
    return undefined;
  },
};

/**
 * Type-safe OpenAPI client with automatic cookie handling
 *
 * Usage:
 * ```ts
 * import { apiClient } from "@/lib/api-client";
 *
 * const { data, error } = await apiClient.GET("/api/todos", {
 *   params: { query: { page: 1, limit: 10 } }
 * });
 * ```
 */
export const apiClient = createClient<paths>({
  baseUrl: API_URL,
  credentials: "include", // Automatically includes cookies (Better Auth session)
});

// Register cookie middleware
apiClient.use(cookieMiddleware);

/**
 * Server-side API client for use in Server Components and API routes
 * Passes cookies from the request headers
 */
export function createServerApiClient(cookieHeader?: string | null) {
  const client = createClient<paths>({
    baseUrl: API_URL,
    credentials: "include",
  });

  // Middleware to add cookies from server-side request
  const serverCookieMiddleware: Middleware = {
    async onRequest({ request }) {
      if (cookieHeader) {
        request.headers.set("Cookie", cookieHeader);
      }
      return request;
    },
  };

  client.use(serverCookieMiddleware);
  client.use(cookieMiddleware);

  return client;
}
