import { createAuthClient } from 'better-auth/react';
import {
  twoFactorClient,
  organizationClient,
  adminClient
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
    adminClient()
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
  admin
} = authClient;
