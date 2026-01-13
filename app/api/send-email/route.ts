import { NextRequest, NextResponse } from "next/server";
import { sendEmail, EmailProvider } from "@/lib/email-send";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html, provider } = await request.json();

    // Validate input
    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    // Default to smtp if provider not specified
    const emailProvider: EmailProvider = provider || "smtp";

    // Send email
    const result = await sendEmail({
      to,
      subject,
      text,
      html,
      provider: emailProvider,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
