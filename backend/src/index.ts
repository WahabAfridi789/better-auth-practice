import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import routes from "./routes/index.js";
import { swaggerSpec } from "./config/swagger.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "./middleware/auth.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { ApiResponse } from "./utils/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - MUST be before auth handler
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Swagger documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Todo API Documentation",
  }),
);

// Swagger/OpenAPI JSON endpoint
app.get(["/api/docs.json", "/api/openapi.json"], (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Better Auth handler - catches all /api/auth/* routes
// IMPORTANT: Don't use express.json() before this handler
// Express v5 requires named wildcard parameters
app.all("/api/auth/{*splat}", toNodeHandler(auth));

// Now we can use express.json() for other routes
app.use(express.json());

// Mount API routes
app.use("/api", routes);

// 404 handler - catches unmatched routes
app.use(notFoundHandler);

// Global error handler - must be last middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`✅ Todo API: http://localhost:${PORT}/api/todos`);
});
