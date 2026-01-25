import { Request, Response, NextFunction } from "express";
import { auth, BetterAuthSession } from "../lib/auth.js";
import { ApiError } from "./error.middleware.js";

export interface AuthenticatedRequest extends Request {
  user?: BetterAuthSession["user"];
  session?: BetterAuthSession["session"];
}

/**
 * Authentication middleware - verifies the session and attaches user to request
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      throw ApiError.unauthorized("You must be logged in to access this resource");
    }

    // Attach user and session to request
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    // Pass ApiError directly to error handler
    if (error instanceof ApiError) {
      return next(error);
    }
    console.error("Auth middleware error:", error);
    next(ApiError.internal("Failed to authenticate request"));
  }
}

/**
 * Optional authentication middleware - attaches user if session exists, but doesn't require it
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
