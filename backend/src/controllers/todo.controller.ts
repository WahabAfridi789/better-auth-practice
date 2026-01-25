import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ApiError } from "../middleware/error.middleware.js";
import { todoService } from "../services/todo.service.js";
import { ApiResponse } from "../utils/index.js";
import { SuccessMessage, ResourceName, notFoundMessage } from "../constants/index.js";
import {
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema,
  todoIdSchema,
} from "../schemas/todo.schema.js";

export class TodoController {
  /**
   * Create a new todo
   * POST /api/todos
   */
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createTodoSchema.parse(req.body);
      const todo = await todoService.create(req.user!.id, validatedData);

      ApiResponse.created(res)
        .data(todo)
        .message(SuccessMessage.TODO.CREATED)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all todos for the authenticated user
   * GET /api/todos
   */
  async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedQuery = todoQuerySchema.parse(req.query);
      const { data, pagination } = await todoService.findAll(req.user!.id, validatedQuery);

      ApiResponse.success(res)
        .data(data)
        .paginate(pagination)
        .message(SuccessMessage.TODO.LIST_FETCHED)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single todo by ID
   * GET /api/todos/:id
   */
  async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = todoIdSchema.parse(req.params);
      const todo = await todoService.findById(req.user!.id, id);

      if (!todo) {
        throw ApiError.notFound(notFoundMessage(ResourceName.TODO));
      }

      ApiResponse.success(res)
        .data(todo)
        .message(SuccessMessage.TODO.FETCHED)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a todo
   * PUT /api/todos/:id
   */
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = todoIdSchema.parse(req.params);
      const validatedData = updateTodoSchema.parse(req.body);
      const todo = await todoService.update(req.user!.id, id, validatedData);

      if (!todo) {
        throw ApiError.notFound(notFoundMessage(ResourceName.TODO));
      }

      ApiResponse.success(res)
        .data(todo)
        .message(SuccessMessage.TODO.UPDATED)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a todo
   * DELETE /api/todos/:id
   */
  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = todoIdSchema.parse(req.params);
      const todo = await todoService.delete(req.user!.id, id);

      if (!todo) {
        throw ApiError.notFound(notFoundMessage(ResourceName.TODO));
      }

      ApiResponse.success(res)
        .data(todo)
        .message(SuccessMessage.TODO.DELETED)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle todo completion status
   * PATCH /api/todos/:id/toggle
   */
  async toggleComplete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = todoIdSchema.parse(req.params);
      const todo = await todoService.toggleComplete(req.user!.id, id);

      if (!todo) {
        throw ApiError.notFound(notFoundMessage(ResourceName.TODO));
      }

      ApiResponse.success(res)
        .data(todo)
        .message(SuccessMessage.TODO.TOGGLED(todo.completed))
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get todo statistics for the authenticated user
   * GET /api/todos/stats
   */
  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await todoService.getStats(req.user!.id);

      ApiResponse.success(res)
        .data(stats)
        .message(SuccessMessage.TODO.STATS_FETCHED)
        .send();
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const todoController = new TodoController();
