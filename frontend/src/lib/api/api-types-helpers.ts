/**
 * Utility types extracted from OpenAPI schema
 * These types make optional properties required where needed
 */

import type { paths, components } from "./api-types";

// Extract the todos GET response type
type TodosGetResponse = paths["/api/todos"]["get"]["responses"]["200"]["content"]["application/json"];

// Extract pagination type from meta.pagination in the response
export type PaginationMeta = NonNullable<
  NonNullable<TodosGetResponse["meta"]>["pagination"]
>;

// Backend always returns pagination with all required fields, so we can use it directly
// But we make it Required for type safety
export type RequiredPaginationMeta = Required<PaginationMeta>;

// Re-export commonly used types
export type Todo = components["schemas"]["Todo"];
export type TodoStats = components["schemas"]["TodoStats"];
