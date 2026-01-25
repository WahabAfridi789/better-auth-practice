import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  HttpStatus,
  HttpStatusMessage,
  ErrorCode,
  ErrorMessage,
  isDevelopment,
  type HttpStatusCode,
  type ErrorCodeType,
} from "../constants/index.js";

/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly code: ErrorCodeType | string;
  public readonly details?: unknown;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    options?: {
      code?: ErrorCodeType | string;
      isOperational?: boolean;
      details?: unknown;
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.code = options?.code ?? ErrorCode.INTERNAL_ERROR;
    this.details = options?.details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // ============ Factory Methods ============

  static badRequest(message?: string, details?: unknown) {
    return new ApiError(HttpStatus.BAD_REQUEST, message ?? ErrorMessage.BAD_REQUEST, {
      code: ErrorCode.BAD_REQUEST,
      details,
    });
  }

  static unauthorized(message?: string) {
    return new ApiError(HttpStatus.UNAUTHORIZED, message ?? ErrorMessage.UNAUTHORIZED, {
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  static forbidden(message?: string) {
    return new ApiError(HttpStatus.FORBIDDEN, message ?? ErrorMessage.FORBIDDEN, {
      code: ErrorCode.FORBIDDEN,
    });
  }

  static notFound(message?: string) {
    return new ApiError(HttpStatus.NOT_FOUND, message ?? ErrorMessage.NOT_FOUND, {
      code: ErrorCode.NOT_FOUND,
    });
  }

  static conflict(message?: string, details?: unknown) {
    return new ApiError(HttpStatus.CONFLICT, message ?? ErrorMessage.CONFLICT, {
      code: ErrorCode.CONFLICT,
      details,
    });
  }

  static validation(message?: string, details?: unknown) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message ?? ErrorMessage.VALIDATION_ERROR, {
      code: ErrorCode.VALIDATION_ERROR,
      details,
    });
  }

  static tooManyRequests(message?: string) {
    return new ApiError(HttpStatus.TOO_MANY_REQUESTS, message ?? ErrorMessage.TOO_MANY_REQUESTS, {
      code: ErrorCode.TOO_MANY_REQUESTS,
    });
  }

  static internal(message?: string) {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message ?? ErrorMessage.INTERNAL_ERROR, {
      code: ErrorCode.INTERNAL_ERROR,
      isOperational: false,
    });
  }
}

/**
 * Formatted Zod validation issue
 */
interface FormattedValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Format Zod validation errors into a readable structure
 */
function formatZodError(error: z.ZodError): FormattedValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
    code: issue.code,
  }));
}

/**
 * Build error response object
 */
function buildErrorResponse(options: {
  error: string;
  code: string;
  message?: string;
  details?: unknown;
  stack?: string;
}): Record<string, unknown> {
  const response: Record<string, unknown> = {
    success: false,
    error: options.error,
    code: options.code,
  };

  if (options.message) response.message = options.message;
  if (options.details) response.details = options.details;
  if (isDevelopment() && options.stack) response.stack = options.stack;

  return response;
}

/**
 * Global error handler middleware
 * Must be the last middleware in the chain
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  console.error(`[${new Date().toISOString()}] Error:`, {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: isDevelopment() ? err.stack : undefined,
  });

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    res.status(HttpStatus.BAD_REQUEST).json(
      buildErrorResponse({
        error: HttpStatusMessage[HttpStatus.BAD_REQUEST],
        code: ErrorCode.VALIDATION_ERROR,
        message: ErrorMessage.VALIDATION_ERROR,
        details: formatZodError(err),
      })
    );
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      buildErrorResponse({
        error: err.message,
        code: err.code,
        details: err.details,
        stack: err.stack,
      })
    );
    return;
  }

  // Handle Prisma errors
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };

    switch (prismaError.code) {
      case "P2002": // Unique constraint violation
        res.status(HttpStatus.CONFLICT).json(
          buildErrorResponse({
            error: HttpStatusMessage[HttpStatus.CONFLICT],
            code: ErrorCode.UNIQUE_CONSTRAINT_VIOLATION,
            message: `A record with this ${prismaError.meta?.target?.join(", ") || "value"} already exists`,
          })
        );
        return;
      case "P2025": // Record not found
        res.status(HttpStatus.NOT_FOUND).json(
          buildErrorResponse({
            error: HttpStatusMessage[HttpStatus.NOT_FOUND],
            code: ErrorCode.RECORD_NOT_FOUND,
            message: ErrorMessage.RECORD_NOT_FOUND,
          })
        );
        return;
      default:
        // Fall through to generic error
        break;
    }
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && "body" in err) {
    res.status(HttpStatus.BAD_REQUEST).json(
      buildErrorResponse({
        error: HttpStatusMessage[HttpStatus.BAD_REQUEST],
        code: ErrorCode.INVALID_JSON,
        message: ErrorMessage.INVALID_JSON,
      })
    );
    return;
  }

  // Generic error response for unhandled errors
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    buildErrorResponse({
      error: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      code: ErrorCode.INTERNAL_ERROR,
      message: isDevelopment() ? err.message : ErrorMessage.INTERNAL_ERROR,
      stack: err.stack,
    })
  );
}

/**
 * 404 Not Found handler middleware
 * Should be placed after all routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(HttpStatus.NOT_FOUND).json(
    buildErrorResponse({
      error: HttpStatusMessage[HttpStatus.NOT_FOUND],
      code: ErrorCode.ROUTE_NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    })
  );
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: app.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
