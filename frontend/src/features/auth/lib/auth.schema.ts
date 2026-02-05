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
  signUp: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name must be at most 100 characters')
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
  }),

  // Two-factor authentication
  twoFactorTotp: z.object({
    code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers')
  }),

  twoFactorBackup: z.object({
    code: z.string().min(1, 'Backup code is required')
  })
};

export type LoginFormData = z.infer<typeof authSchemas.login>;
export type SignUpFormData = z.infer<typeof authSchemas.signUp>;
export type ChangePasswordFormData = z.infer<typeof authSchemas.changePassword>;
export type ResetPasswordRequestFormData = z.infer<
  typeof authSchemas.resetPasswordRequest
>;
export type ResetPasswordFormData = z.infer<typeof authSchemas.resetPassword>;
export type RefreshTokenFormData = z.infer<typeof authSchemas.refreshToken>;
export type TwoFactorTotpFormData = z.infer<typeof authSchemas.twoFactorTotp>;
export type TwoFactorBackupFormData = z.infer<typeof authSchemas.twoFactorBackup>;
