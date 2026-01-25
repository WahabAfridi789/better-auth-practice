import { Router, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import { ApiResponse } from "../utils/index.js";
import { z } from "zod";

const router = Router();

// Schema for set-password
const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * @swagger
 * /api/user/set-password:
 *   post:
 *     summary: Set password for OAuth users
 *     description: Allows users who signed up via OAuth to set a password for their account
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: The new password to set
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/set-password",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = setPasswordSchema.parse(req.body);

      // Use Better Auth's setPassword API
      await auth.api.setPassword({
        headers: req.headers as any,
        body: {
          newPassword,
        },
      });

      ApiResponse.success(res)
        .data({ success: true })
        .message("Password set successfully")
        .send();
    } catch (error) {
      next(error);
    }
  },
);

// Get current authenticated user
/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [System]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 */
router.get("/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  ApiResponse.success(res)
    .data({ user: req.user })
    .message("User fetched successfully")
    .send();
});

export default router;
