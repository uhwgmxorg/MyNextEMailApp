import { sendEmailViaSMTP } from "./email-smtp";
import { sendEmailViaResend } from "./email-resend";

export type EmailProvider = "smtp" | "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  provider: EmailProvider;
}

/**
 * Send email using the specified provider (SMTP or Resend)
 * This is a wrapper function that delegates to the appropriate implementation
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  provider,
}: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  console.log(`[Email] Using provider: ${provider}`);

  if (provider === "resend") {
    return sendEmailViaResend({ to, subject, text, html });
  } else {
    return sendEmailViaSMTP({ to, subject, text, html });
  }
}
