/**
 * Application-wide constants
 */

/**
 * Pagination defaults
 */
export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

/**
 * Sort order options
 */
export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrderType = (typeof SortOrder)[keyof typeof SortOrder];

/**
 * Todo Priority levels
 */
export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type PriorityType = (typeof Priority)[keyof typeof Priority];

/**
 * Todo sortable fields
 */
export const TodoSortField = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  DUE_DATE: "dueDate",
  PRIORITY: "priority",
  TITLE: "title",
} as const;

export type TodoSortFieldType = (typeof TodoSortField)[keyof typeof TodoSortField];

/**
 * Environment modes
 */
export const Environment = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type EnvironmentType = (typeof Environment)[keyof typeof Environment];

/**
 * Check if running in development mode
 */
export const isDevelopment = () => process.env.NODE_ENV === Environment.DEVELOPMENT;

/**
 * Check if running in production mode
 */
export const isProduction = () => process.env.NODE_ENV === Environment.PRODUCTION;

/**
 * Check if running in test mode
 */
export const isTest = () => process.env.NODE_ENV === Environment.TEST;
