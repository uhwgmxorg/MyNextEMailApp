import { NextRequest, NextResponse } from "next/server";
import { sendEmailViaSMTP } from "@/lib/email-smtp";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html } = await request.json();

    // Validate input
    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmailViaSMTP({ to, subject, text, html });

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
