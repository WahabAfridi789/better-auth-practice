import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description
 *         completed:
 *           type: boolean
 *           description: Whether the todo is completed
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           description: Priority level
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Optional due date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *     CreateTodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         description:
 *           type: string
 *           maxLength: 1000
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           default: MEDIUM
 *         dueDate:
 *           type: string
 *           format: date-time
 *     UpdateTodoInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         description:
 *           type: string
 *           maxLength: 1000
 *         completed:
 *           type: boolean
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         dueDate:
 *           type: string
 *           format: date-time
 *     TodoStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         completed:
 *           type: integer
 *         pending:
 *           type: integer
 *         completionRate:
 *           type: integer
 *         byPriority:
 *           type: object
 *           properties:
 *             LOW:
 *               type: integer
 *             MEDIUM:
 *               type: integer
 *             HIGH:
 *               type: integer
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: better-auth.session_token
 */

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management API
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         description: Filter by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, dueDate, priority, title]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of todos with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *                 - meta
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 meta:
 *                   type: object
 *                   required:
 *                     - pagination
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       required:
 *                         - page
 *                         - limit
 *                         - total
 *                         - totalPages
 *                         - hasMore
 *                         - hasPrevious
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 100
 *                         totalPages:
 *                           type: integer
 *                           example: 10
 *                         hasMore:
 *                           type: boolean
 *                           example: true
 *                         hasPrevious:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized
 */
router.get("/", (req, res, next) => todoController.findAll(req, res, next));

/**
 * @swagger
 * /api/todos/stats:
 *   get:
 *     summary: Get todo statistics for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Todo statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TodoStats'
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", (req, res, next) => todoController.getStats(req, res, next));

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", (req, res, next) => todoController.findById(req, res, next));

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoInput'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", (req, res, next) => todoController.create(req, res, next));

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoInput'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", (req, res, next) => todoController.update(req, res, next));

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", (req, res, next) => todoController.delete(req, res, next));

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Toggle todo completion status
 *     tags: [Todos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/toggle", (req, res, next) => todoController.toggleComplete(req, res, next));

export default router;
