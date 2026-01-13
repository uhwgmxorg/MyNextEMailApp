import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email via Resend API using credentials from .env
 */
export async function sendEmailViaResend({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log("[Resend] Sending email to:", to);
    console.log("[Resend] From:", process.env.RESEND_FROM);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[Resend] Error:", error);
      return { success: false, error: error.message };
    }

    console.log("[Resend] Email sent successfully:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("[Resend] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
