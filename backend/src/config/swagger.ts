import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Better Auth Todo API",
      version: "1.0.0",
      description: "A Todo API with Better Auth authentication",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "better-auth.session_token",
          description: "Session cookie from Better Auth",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/routes/*.js",
    "./src/routes/organization.routes.ts", // Organization endpoints documentation
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
