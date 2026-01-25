import { z } from 'zod';

/**
 * Authentication validation schemas
 */

const emailSchema = z.email().min(1, 'Email is required');
const passwordSchema = z.string().min(1, 'Password is required');

export const authSchemas = {
  // Login
  login: z.object({
    email: emailSchema,
    password: passwordSchema
  }),

  // Register
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name must be at most 100 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name must be at most 100 characters')
  }),

  // Change password
  changePassword: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, 'Password confirmation is required')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    }),

  // Reset password request
  resetPasswordRequest: z.object({
    email: emailSchema
  }),

  // Reset password
  resetPassword: z
    .object({
      token: z.string().min(1, 'Reset token is required'),
      newPassword: passwordSchema,
      confirmNewPassword: passwordSchema
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'Passwords do not match',
      path: ['confirmNewPassword']
    }),

  // Refresh token
  refreshToken: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
};

export type LoginFormData = z.infer<typeof authSchemas.login>;
export type RegisterFormData = z.infer<typeof authSchemas.register>;
export type ChangePasswordFormData = z.infer<typeof authSchemas.changePassword>;
export type ResetPasswordRequestFormData = z.infer<
  typeof authSchemas.resetPasswordRequest
>;
export type ResetPasswordFormData = z.infer<typeof authSchemas.resetPassword>;
export type RefreshTokenFormData = z.infer<typeof authSchemas.refreshToken>;
