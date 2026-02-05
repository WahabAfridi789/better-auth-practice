import { createAuthClient } from 'better-auth/react';
import {
  twoFactorClient,
  organizationClient,
  adminClient,
  oneTapClient,
  lastLoginMethodClient
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        // Redirect to 2FA verification page
        window.location.href = '/auth/2fa';
      }
    }),
    organizationClient({
      teams: {
        enabled: true
      }
    }),
    adminClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: 'signin',
      additionalOptions: {},
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 1000, // Base delay in ms (default: 1000)
        maxAttempts: 5 // Maximum number of attempts before triggering onPromptNotification (default: 5)
      }
    }),
    lastLoginMethodClient()
  ]
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  twoFactor,
  linkSocial,
  unlinkAccount,
  listAccounts,
  organization,
  useListOrganizations,
  admin,
  resetPassword,
  requestPasswordReset,
  changePassword
} = authClient;
