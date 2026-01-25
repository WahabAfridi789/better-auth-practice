import type { HttpStatusCode } from "../constants/index.js";
import type { ErrorCodeType } from "../constants/index.js";

/**
 * Base API Response structure
 */
export interface ApiResponseBase {
  success: boolean;
  timestamp?: string;
}

/**
 * Successful API Response
 */
export interface ApiSuccessResponse<T = unknown> extends ApiResponseBase {
  success: true;
  data: T;
  message?: string;
  meta?: ResponseMeta;
}

/**
 * Error API Response
 */
export interface ApiErrorResponse extends ApiResponseBase {
  success: false;
  error: string;
  code: ErrorCodeType | string;
  message?: string;
  details?: unknown;
  stack?: string;
}

/**
 * Paginated response meta
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

/**
 * Generic response meta
 */
export interface ResponseMeta {
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: {
    pagination: PaginationMeta;
  };
}

/**
 * Union type for any API response
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Response builder options
 */
export interface ResponseOptions<T = unknown> {
  statusCode?: HttpStatusCode;
  message?: string;
  data?: T;
  meta?: ResponseMeta;
}

/**
 * Error response options
 */
export interface ErrorResponseOptions {
  statusCode?: HttpStatusCode;
  error?: string;
  code?: ErrorCodeType | string;
  message?: string;
  details?: unknown;
}

/**
 * Pagination input params
 */
export interface PaginationInput {
  page?: number;
  limit?: number;
}

/**
 * Pagination result for service layer
 */
export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
