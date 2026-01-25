/**
 * Error Codes - Application-specific error codes
 * Used for client-side error handling and i18n
 */
export const ErrorCode = {
  // Authentication & Authorization
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",

  // Resource
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",
  GONE: "GONE",

  // Database
  DB_ERROR: "DB_ERROR",
  UNIQUE_CONSTRAINT_VIOLATION: "UNIQUE_CONSTRAINT_VIOLATION",
  FOREIGN_KEY_VIOLATION: "FOREIGN_KEY_VIOLATION",
  RECORD_NOT_FOUND: "RECORD_NOT_FOUND",

  // Rate Limiting
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  BAD_GATEWAY: "BAD_GATEWAY",

  // Request
  BAD_REQUEST: "BAD_REQUEST",
  INVALID_JSON: "INVALID_JSON",
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Default error messages mapped to error codes
 */
export const ErrorMessage: Record<ErrorCodeType, string> = {
  [ErrorCode.UNAUTHORIZED]: "You must be logged in to access this resource",
  [ErrorCode.FORBIDDEN]: "You do not have permission to access this resource",
  [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCode.TOKEN_EXPIRED]: "Your session has expired. Please log in again",
  [ErrorCode.TOKEN_INVALID]: "Invalid authentication token",
  [ErrorCode.SESSION_EXPIRED]: "Your session has expired",
  [ErrorCode.VALIDATION_ERROR]: "Invalid request data",
  [ErrorCode.INVALID_INPUT]: "The provided input is invalid",
  [ErrorCode.MISSING_REQUIRED_FIELD]: "A required field is missing",
  [ErrorCode.INVALID_FORMAT]: "Invalid data format",
  [ErrorCode.NOT_FOUND]: "The requested resource was not found",
  [ErrorCode.ALREADY_EXISTS]: "A resource with this identifier already exists",
  [ErrorCode.CONFLICT]: "The request conflicts with the current state",
  [ErrorCode.GONE]: "The requested resource is no longer available",
  [ErrorCode.DB_ERROR]: "A database error occurred",
  [ErrorCode.UNIQUE_CONSTRAINT_VIOLATION]: "A record with this value already exists",
  [ErrorCode.FOREIGN_KEY_VIOLATION]: "Referenced record does not exist",
  [ErrorCode.RECORD_NOT_FOUND]: "The requested record was not found",
  [ErrorCode.TOO_MANY_REQUESTS]: "Too many requests. Please try again later",
  [ErrorCode.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",
  [ErrorCode.INTERNAL_ERROR]: "An unexpected error occurred",
  [ErrorCode.SERVICE_UNAVAILABLE]: "Service temporarily unavailable",
  [ErrorCode.BAD_GATEWAY]: "Bad gateway",
  [ErrorCode.BAD_REQUEST]: "Bad request",
  [ErrorCode.INVALID_JSON]: "Invalid JSON in request body",
  [ErrorCode.ROUTE_NOT_FOUND]: "Route not found",
  [ErrorCode.METHOD_NOT_ALLOWED]: "Method not allowed",
};
