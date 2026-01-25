/**
 * Success messages for API responses
 * Organized by resource/module
 */
export const SuccessMessage = {
  // Generic
  OK: "Operation successful",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",

  // Auth
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    SIGNUP_SUCCESS: "Account created successfully",
    PASSWORD_RESET: "Password reset successfully",
    EMAIL_VERIFIED: "Email verified successfully",
  },

  // Todo
  TODO: {
    CREATED: "Todo created successfully",
    UPDATED: "Todo updated successfully",
    DELETED: "Todo deleted successfully",
    COMPLETED: "Todo marked as completed",
    PENDING: "Todo marked as pending",
    TOGGLED: (completed: boolean) => `Todo marked as ${completed ? "completed" : "pending"}`,
    FETCHED: "Todo retrieved successfully",
    LIST_FETCHED: "Todos retrieved successfully",
    STATS_FETCHED: "Statistics retrieved successfully",
  },

  // User
  USER: {
    PROFILE_UPDATED: "Profile updated successfully",
    PASSWORD_CHANGED: "Password changed successfully",
    AVATAR_UPDATED: "Avatar updated successfully",
  },
} as const;

/**
 * Resource names for dynamic messages
 */
export const ResourceName = {
  TODO: "Todo",
  USER: "User",
  SESSION: "Session",
} as const;

/**
 * Generate a "not found" message for a resource
 */
export const notFoundMessage = (resource: string) => `${resource} not found`;

/**
 * Generate a "created" message for a resource
 */
export const createdMessage = (resource: string) => `${resource} created successfully`;

/**
 * Generate an "updated" message for a resource
 */
export const updatedMessage = (resource: string) => `${resource} updated successfully`;

/**
 * Generate a "deleted" message for a resource
 */
export const deletedMessage = (resource: string) => `${resource} deleted successfully`;
