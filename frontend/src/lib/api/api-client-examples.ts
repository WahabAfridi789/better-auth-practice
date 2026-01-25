/**
 * Examples of using the type-safe OpenAPI client
 * 
 * This file demonstrates how to use apiClient for type-safe API calls.
 * All requests automatically include cookies for Better Auth authentication.
 */

import { apiClient, createServerApiClient } from "./api-client";

// ============================================
// Example 1: Get all todos with query parameters
// ============================================
export async function getTodosExample() {
  const { data, error, response } = await apiClient.GET("/api/todos", {
    params: {
      query: {
        page: 1,
        limit: 10,
        completed: false,
        priority: "HIGH",
        search: "important",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    },
  });

  if (error) {
    console.error("Error fetching todos:", error);
    return null;
  }

  // `data` is fully typed based on your OpenAPI schema!
  return data;
}

// ============================================
// Example 2: Get a single todo by ID
// ============================================
export async function getTodoByIdExample(id: string) {
  const { data, error } = await apiClient.GET("/api/todos/{id}", {
    params: {
      path: { id },
    },
  });

  if (error) {
    console.error("Error fetching todo:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 3: Create a new todo
// ============================================
export async function createTodoExample() {
  const { data, error } = await apiClient.POST("/api/todos", {
    body: {
      title: "New Todo",
      description: "This is a new todo item",
      priority: "HIGH",
      dueDate: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("Error creating todo:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 4: Update a todo
// ============================================
export async function updateTodoExample(id: string) {
  const { data, error } = await apiClient.PUT("/api/todos/{id}", {
    params: {
      path: { id },
    },
    body: {
      title: "Updated Todo",
      completed: true,
      priority: "MEDIUM",
    },
  });

  if (error) {
    console.error("Error updating todo:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 5: Delete a todo
// ============================================
export async function deleteTodoExample(id: string) {
  const { data, error } = await apiClient.DELETE("/api/todos/{id}", {
    params: {
      path: { id },
    },
  });

  if (error) {
    console.error("Error deleting todo:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 6: Toggle todo completion
// ============================================
export async function toggleTodoExample(id: string) {
  const { data, error } = await apiClient.PATCH("/api/todos/{id}/toggle", {
    params: {
      path: { id },
    },
  });

  if (error) {
    console.error("Error toggling todo:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 7: Get todo statistics
// ============================================
export async function getTodoStatsExample() {
  const { data, error } = await apiClient.GET("/api/todos/stats");

  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 8: Get current user (server-side)
// ============================================
export async function getCurrentUserExample(cookieHeader?: string | null) {
  // Use createServerApiClient for server components/API routes
  const client = createServerApiClient(cookieHeader);

  const { data, error } = await client.GET("/api/user/me");

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 9: Set password (user endpoint)
// ============================================
export async function setPasswordExample(newPassword: string) {
  const { data, error } = await apiClient.POST("/api/user/set-password", {
    body: {
      newPassword,
    },
  });

  if (error) {
    console.error("Error setting password:", error);
    return null;
  }

  return data;
}

// ============================================
// Example 10: Health check
// ============================================
export async function healthCheckExample() {
  const { data, error } = await apiClient.GET("/api/health");

  if (error) {
    console.error("Health check failed:", error);
    return null;
  }

  return data;
}
