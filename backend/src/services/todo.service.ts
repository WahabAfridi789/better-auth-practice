import { prisma } from "../lib/prisma.js";
import { createPaginationMeta } from "../utils/index.js";
import type { CreateTodoInput, UpdateTodoInput, TodoQueryInput } from "../schemas/todo.schema.js";
import type { PaginationResult } from "../types/index.js";
import type { Todo } from "../generated/prisma/client.js";

export class TodoService {
  /**
   * Create a new todo for a user
   */
  async create(userId: string, data: CreateTodoInput) {
    return prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        userId,
      },
    });
  }

  /**
   * Get all todos for a user with pagination and filters
   */
  async findAll(userId: string, query: TodoQueryInput): Promise<PaginationResult<Todo>> {
    const { page, limit, completed, priority, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (completed !== undefined) {
      where.completed = completed;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get todos and total count in parallel
    const [data, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  /**
   * Get a single todo by ID (only if it belongs to the user)
   */
  async findById(userId: string, todoId: string) {
    return prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });
  }

  /**
   * Update a todo (only if it belongs to the user)
   */
  async update(userId: string, todoId: string, data: UpdateTodoInput) {
    // First check if todo exists and belongs to user
    const existing = await this.findById(userId, todoId);
    if (!existing) {
      return null;
    }

    return prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      },
    });
  }

  /**
   * Delete a todo (only if it belongs to the user)
   */
  async delete(userId: string, todoId: string) {
    // First check if todo exists and belongs to user
    const existing = await this.findById(userId, todoId);
    if (!existing) {
      return null;
    }

    return prisma.todo.delete({
      where: { id: todoId },
    });
  }

  /**
   * Toggle todo completion status
   */
  async toggleComplete(userId: string, todoId: string) {
    const existing = await this.findById(userId, todoId);
    if (!existing) {
      return null;
    }

    return prisma.todo.update({
      where: { id: todoId },
      data: { completed: !existing.completed },
    });
  }

  /**
   * Get todo statistics for a user
   */
  async getStats(userId: string) {
    const [total, completed, byPriority] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, completed: true } }),
      prisma.todo.groupBy({
        by: ["priority"],
        where: { userId },
        _count: { priority: true },
      }),
    ]);

    const priorityStats = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    byPriority.forEach((p) => {
      priorityStats[p.priority] = p._count.priority;
    });

    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority: priorityStats,
    };
  }
}

// Export singleton instance
export const todoService = new TodoService();
