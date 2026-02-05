import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  twoFactor,
  organization,
  admin,
  oneTap,
  openAPI,
  lastLoginMethod,
} from "better-auth/plugins";
import { prisma } from "./prisma.js";

import EmailService from "../services/email.service.js";

export const auth = betterAuth({
  appName: "Better Auth Todo App",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async (data, request) => {
      try {
        const emailService = new EmailService();
        await emailService.sendPasswordResetEmail(
          data.user.email,
          data.token,
          data.user.name,
        );
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day - update session every day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    twoFactor({
      issuer: "Better Auth Todo App",
      backupCodeOptions: {
        amount: 10,
        length: 10,
      },
    }),
    organization({
      // Allow all authenticated users to create organizations
      allowUserToCreateOrganization: true,
      // Enable teams feature
      teams: {
        enabled: true,
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.FRONTEND_URL}/accept-invitation/${data.id}`;
        try {
          const emailService = new EmailService();
          await emailService.sendOrganizationInvitationEmail(
            data.email,
            data.inviter.user.name,
            data.inviter.user.email,
            data.organization.name,
            inviteLink,
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error(
              "Failed to send organization invitation email:",
              error.message,
            );
          } else {
            console.error(
              "Failed to send organization invitation email:",
              error,
            );
          }
        }
      },
    }),
    admin(),
    oneTap(),
    openAPI(),
    lastLoginMethod(),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
      // Update user info (including profile image) on every sign-in
      overrideUserInfoOnSignIn: true,
    },
    github: {
      clientId: "",
      clientSecret: "",
    },
    discord: {
      clientId: "",
      clientSecret: "",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  // Update user's profile image when linking a social account
  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          // When a new account is linked, update user's image if available
          if (account.providerId === "google") {
            const user = await prisma.user.findUnique({
              where: { id: account.userId },
            });
            // Only update if user doesn't have an image yet
            if (user && !user.image) {
              // Fetch the Google profile image from the account
              try {
                const response = await fetch(
                  `https://www.googleapis.com/oauth2/v2/userinfo`,
                  {
                    headers: {
                      Authorization: `Bearer ${account.accessToken}`,
                    },
                  },
                );
                if (response.ok) {
                  const profile = await response.json();
                  if (profile.picture) {
                    await prisma.user.update({
                      where: { id: account.userId },
                      data: { image: profile.picture },
                    });
                  }
                }
              } catch (error) {
                console.error("Failed to fetch Google profile image:", error);
              }
            }
          }
        },
      },
    },
  },
});

export type BetterAuthSession = typeof auth.$Infer.Session;
