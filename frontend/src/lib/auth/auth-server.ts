import { headers } from "next/headers";

/**
 * Get session on the server side (Server Components, Route Handlers, etc.)
 * This calls your Express backend to verify the session.
 */
export async function getServerSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    if (!cookie) {
      return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie: cookie,
      },
      cache: "no-store", // Don't cache session data
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text || text === "null" || text === "{}") {
      return null;
    }

    const data = JSON.parse(text);
    return data?.session ? data : null;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}
