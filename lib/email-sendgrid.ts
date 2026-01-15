import sgMail from "@sendgrid/mail";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email via SendGrid API using credentials from .env
 */
export async function sendEmailViaSendGrid({
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
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(apiKey);

    console.log("[SendGrid] Sending email to:", to);
    console.log("[SendGrid] From:", process.env.SENDGRID_FROM);

    const msg: any = {
      to,
      from: process.env.SENDGRID_FROM || "noreply@example.com",
      subject,
    };

    // Add html or text (at least one is required)
    if (html) {
      msg.html = html;
    }
    if (text) {
      msg.text = text;
    }

    // If neither html nor text is provided, use subject as text
    if (!html && !text) {
      msg.text = subject;
    }

    const response = await sgMail.send(msg);

    // SendGrid returns an array of responses
    const messageId = response[0]?.headers?.["x-message-id"];

    console.log("[SendGrid] Email sent successfully:", messageId);
    return { success: true, messageId };
  } catch (error: any) {
    console.error("[SendGrid] Error sending email:", error);

    // Log detailed error information from SendGrid
    if (error.response) {
      console.error("[SendGrid] Status Code:", error.code);
      console.error(
        "[SendGrid] Response Body:",
        JSON.stringify(error.response?.body, null, 2)
      );
      console.error("[SendGrid] Response Headers:", error.response?.headers);
    }

    // Extract detailed error message
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (error.response?.body?.errors) {
      errorMessage = error.response.body.errors
        .map((e: any) => e.message)
        .join(", ");
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
