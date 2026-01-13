import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email via SMTP using credentials from .env
 * Uses nodemailer with SMTP configuration
 */
export async function sendEmailViaSMTP({
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
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    console.log("[SMTP] Config:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      from: process.env.SMTP_FROM,
    });

    // Create transporter with SMTP configuration from .env
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection configuration
    console.log("[SMTP] Verifying connection...");
    await transporter.verify();
    console.log("[SMTP] Connection verified!");

    // Send mail
    console.log("[SMTP] Sending email to:", to);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("[SMTP] Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[SMTP] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
