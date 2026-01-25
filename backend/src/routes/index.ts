import { Router, Request, Response } from "express";
import todoRoutes from "./todo.routes.js";
import userRoutes from "./user.routes.js";
import { ApiResponse } from "../utils/response.util.js";

const router = Router();

// Mount routes
router.use("/todos", todoRoutes);
router.use("/user", userRoutes);

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health", (req: Request, res: Response) => {
  ApiResponse.success(res)
    .data({ status: "ok", timestamp: new Date().toISOString() })
    .send();
});

export default router;
