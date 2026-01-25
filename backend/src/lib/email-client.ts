import { ServerClient } from "postmark";
import "dotenv/config";

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

export const sendOrganizationInvitation = async (data: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) => {
  try {
    const result = await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: process.env.POSTMARK_FROM_EMAIL!,
      Subject: "You are invited to join the organization",
      TextBody: `You are invited to join the organization ${data.teamName} by ${data.invitedByUsername}. Please click the link to accept the invitation: ${data.inviteLink}`,
    });
    return result;
  } catch (error) {
    console.error("Failed to send organization invitation email:", error);
    throw error;
  }
};
