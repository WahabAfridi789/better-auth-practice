import { Response } from "express";
import { HttpStatus, type HttpStatusCode } from "../constants/index.js";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginationMeta,
  ResponseMeta,
} from "../types/index.js";

/**
 * Response Builder - Fluent API for building consistent API responses
 * 
 * @example
 * // Simple success response
 * ApiResponse.success(res).data(user).send();
 * 
 * @example
 * // Created response with message
 * ApiResponse.created(res).data(todo).message("Todo created successfully").send();
 * 
 * @example
 * // Paginated response
 * ApiResponse.success(res).data(todos).paginate(pagination).send();
 * 
 * @example
 * // Error response
 * ApiResponse.error(res).notFound("User not found").send();
 */
class ResponseBuilder<T = unknown> {
  private res: Response;
  private statusCode: HttpStatusCode = HttpStatus.OK;
  private responseData: T | undefined;
  private responseMessage: string | undefined;
  private responseMeta: ResponseMeta | undefined;

  constructor(res: Response) {
    this.res = res;
  }

  /**
   * Set the HTTP status code
   */
  status(code: HttpStatusCode): this {
    this.statusCode = code;
    return this;
  }

  /**
   * Set the response data
   */
  data<D>(data: D): ResponseBuilder<D> {
    (this as unknown as ResponseBuilder<D>).responseData = data;
    return this as unknown as ResponseBuilder<D>;
  }

  /**
   * Set a success message
   */
  message(msg: string): this {
    this.responseMessage = msg;
    return this;
  }

  /**
   * Add metadata to the response
   */
  meta(meta: ResponseMeta): this {
    this.responseMeta = { ...this.responseMeta, ...meta };
    return this;
  }

  /**
   * Add pagination metadata
   */
  paginate(pagination: PaginationMeta): this {
    this.responseMeta = {
      ...this.responseMeta,
      pagination,
    };
    return this;
  }

  /**
   * Send the success response
   */
  send(): Response {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data: this.responseData as T,
      ...(this.responseMessage && { message: this.responseMessage }),
      ...(this.responseMeta && { meta: this.responseMeta }),
    };

    return this.res.status(this.statusCode).json(response);
  }

  /**
   * Send with no content (204)
   */
  noContent(): Response {
    return this.res.status(HttpStatus.NO_CONTENT).send();
  }
}

/**
 * Error Response Builder
 */
class ErrorResponseBuilder {
  private res: Response;
  private statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  private errorMessage = "An error occurred";
  private errorCode = "INTERNAL_ERROR";
  private errorDetails: unknown;
  private customMessage: string | undefined;

  constructor(res: Response) {
    this.res = res;
  }

  /**
   * Set custom status code
   */
  status(code: HttpStatusCode): this {
    this.statusCode = code;
    return this;
  }

  /**
   * Set error code
   */
  code(code: string): this {
    this.errorCode = code;
    return this;
  }

  /**
   * Set error details
   */
  details(details: unknown): this {
    this.errorDetails = details;
    return this;
  }

  /**
   * Set custom message
   */
  message(msg: string): this {
    this.customMessage = msg;
    return this;
  }

  // ============ Preset Error Methods ============

  /**
   * 400 Bad Request
   */
  badRequest(message = "Bad request"): this {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.errorMessage = message;
    this.errorCode = "BAD_REQUEST";
    return this;
  }

  /**
   * 401 Unauthorized
   */
  unauthorized(message = "Unauthorized"): this {
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.errorMessage = message;
    this.errorCode = "UNAUTHORIZED";
    return this;
  }

  /**
   * 403 Forbidden
   */
  forbidden(message = "Forbidden"): this {
    this.statusCode = HttpStatus.FORBIDDEN;
    this.errorMessage = message;
    this.errorCode = "FORBIDDEN";
    return this;
  }

  /**
   * 404 Not Found
   */
  notFound(message = "Resource not found"): this {
    this.statusCode = HttpStatus.NOT_FOUND;
    this.errorMessage = message;
    this.errorCode = "NOT_FOUND";
    return this;
  }

  /**
   * 409 Conflict
   */
  conflict(message = "Resource already exists"): this {
    this.statusCode = HttpStatus.CONFLICT;
    this.errorMessage = message;
    this.errorCode = "CONFLICT";
    return this;
  }

  /**
   * 422 Unprocessable Entity (Validation Error)
   */
  validation(message = "Validation failed", details?: unknown): this {
    this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    this.errorMessage = message;
    this.errorCode = "VALIDATION_ERROR";
    if (details) this.errorDetails = details;
    return this;
  }

  /**
   * 429 Too Many Requests
   */
  tooManyRequests(message = "Too many requests"): this {
    this.statusCode = HttpStatus.TOO_MANY_REQUESTS;
    this.errorMessage = message;
    this.errorCode = "TOO_MANY_REQUESTS";
    return this;
  }

  /**
   * 500 Internal Server Error
   */
  internal(message = "Internal server error"): this {
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this.errorMessage = message;
    this.errorCode = "INTERNAL_ERROR";
    return this;
  }

  /**
   * Send the error response
   */
  send(): Response {
    const response: ApiErrorResponse = {
      success: false,
      error: this.errorMessage,
      code: this.errorCode,
      ...(this.customMessage && { message: this.customMessage }),
      ...(this.errorDetails && { details: this.errorDetails }),
    };

    return this.res.status(this.statusCode).json(response);
  }
}

/**
 * API Response Factory
 * Main entry point for building API responses
 */
export const ApiResponse = {
  /**
   * Start building a success response (200 OK)
   */
  success: <T = unknown>(res: Response): ResponseBuilder<T> => {
    return new ResponseBuilder<T>(res).status(HttpStatus.OK);
  },

  /**
   * Start building a created response (201 Created)
   */
  created: <T = unknown>(res: Response): ResponseBuilder<T> => {
    return new ResponseBuilder<T>(res).status(HttpStatus.CREATED);
  },

  /**
   * Start building an accepted response (202 Accepted)
   */
  accepted: <T = unknown>(res: Response): ResponseBuilder<T> => {
    return new ResponseBuilder<T>(res).status(HttpStatus.ACCEPTED);
  },

  /**
   * Send a no content response (204)
   */
  noContent: (res: Response): Response => {
    return res.status(HttpStatus.NO_CONTENT).send();
  },

  /**
   * Start building an error response
   */
  error: (res: Response): ErrorResponseBuilder => {
    return new ErrorResponseBuilder(res);
  },

  // ============ Quick Error Methods ============

  /**
   * Quick 400 Bad Request
   */
  badRequest: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).badRequest(message).send();
  },

  /**
   * Quick 401 Unauthorized
   */
  unauthorized: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).unauthorized(message).send();
  },

  /**
   * Quick 403 Forbidden
   */
  forbidden: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).forbidden(message).send();
  },

  /**
   * Quick 404 Not Found
   */
  notFound: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).notFound(message).send();
  },

  /**
   * Quick 409 Conflict
   */
  conflict: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).conflict(message).send();
  },

  /**
   * Quick 500 Internal Error
   */
  internal: (res: Response, message?: string): Response => {
    return new ErrorResponseBuilder(res).internal(message).send();
  },
};

/**
 * Helper to calculate pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPrevious: page > 1,
  };
}
