import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

/**
 * Email Service
 *
 * Handles sending emails for the application.
 * Currently supports password reset emails.
 */

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = parseInt(process.env.SMTP_PORT || "587");
    const secure = port === 465 || process.env.SMTP_SECURE === "true";
    
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "",
      },
    };

    this.transporter = nodemailer.createTransport(config);

    // Verify connection
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info("Email service connected successfully");
    } catch (error) {
      logger.error("Email service connection failed:", error);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    userName: string,
  ): Promise<boolean> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - AI Medical System</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f8fafc; }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .warning { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>AI Medical Image System</h1>
              <p>Password Reset Request</p>
            </div>

            <div class="content">
              <h2>Hello ${userName},</h2>

              <p>You have requested to reset your password for your AI Medical Image System account.</p>

              <p>Please click the button below to reset your password:</p>

              <a href="${resetUrl}" class="button">Reset Password</a>

              <p><strong>This link will expire in 1 hour.</strong></p>

              <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>

              <div class="warning">
                <p>For security reasons, do not share this email or the reset link with anyone.</p>
              </div>
            </div>

            <div class="footer">
              <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>

              <p>&copy; 2024 AI Medical Image System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"AI Medical System" <${process.env.SMTP_USER}>`,
        to,
        subject: "Password Reset - AI Medical Image System",
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Password reset email sent", {
        to,
        messageId: info.messageId,
      });

      return true;
    } catch (error) {
      logger.error("Failed to send password reset email:", error);
      return false;
    }
  }

  /**
   * Send organization invitation email
   *
   * @param to - The email address of the recipient
   * @param invitedByUsername - The name of the user inviting the recipient
   * @param invitedByEmail - The email address of the user inviting the recipient
   * @param teamName - The name of the team the recipient is invited to
   * @param inviteLink - The link to the organization invitation
   * @returns void
   */
  async sendOrganizationInvitationEmail(
    to: string,
    invitedByUsername: string,
    invitedByEmail: string,
    teamName: string,
    inviteLink: string,
  ): Promise<void> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Organization Invitation - Better Auth</title>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Better Auth</h1>
              <p>Organization Invitation</p>
            </div>

            <div class="content">
              <h2>Hello ${to},</h2>

              <p>You are invited to join the organization ${teamName} by ${invitedByUsername}.</p>

              <p>Please click the button below to accept the invitation:</p>
            </div>

            <div class="footer">
              <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
              <p><a href="${inviteLink}">${inviteLink}</a></p>

              <p>&copy; 2024 Better Auth. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Better Auth" <${process.env.SMTP_USER}>`,
        to,
        subject: "Organization Invitation - Better Auth",
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Organization invitation email sent", {
        to,
        messageId: info.messageId,
      });
    } catch (error) {
      logger.error("Failed to send organization invitation email:", error);
      throw error;
    }
  }
}

export default EmailService;
