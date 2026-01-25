import { z } from "zod";

// Priority enum
export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type Priority = z.infer<typeof PriorityEnum>;

// Create Todo Schema
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  priority: PriorityEnum.optional().default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

// Update Todo Schema
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  completed: z.boolean().optional(),
  priority: PriorityEnum.optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

// Query Params Schema
export const todoQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 1 ? 10 : parsed;
    }),
  completed: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined,
    ),
  priority: PriorityEnum.optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "dueDate", "priority", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type TodoQueryInput = z.infer<typeof todoQuerySchema>;

// Todo ID Param Schema
export const todoIdSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
});

// Todo Response Schema (for documentation)
export const todoResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  priority: PriorityEnum,
  dueDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
