"use client";

import Image from "next/image";
import { useState } from "react";
import { APP_VERSION } from "@/lib/version";

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [provider, setProvider] = useState<"smtp" | "resend">("smtp");

  console.log("[DEBUG] Version:", APP_VERSION);
  console.log("[DEBUG] BasePath:", basePath);
  if (typeof window !== "undefined") {
    console.log("[DEBUG] window.location:", window.location.href);
  }

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      setMessage("❌ Please enter a recipient email address");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const response = await fetch(`${basePath}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: "Test Email from MyNextEMailApp",
          text: "This is a test email sent via SMTP",
          html: "<h1>Test Email</h1><p>This is a test email sent via SMTP</p>",
          provider: provider,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Email sent successfully! Message ID: ${data.messageId}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to send email: ${error}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 bg-white dark:bg-black sm:items-start gap-6">
        <Image
          className="dark:invert"
          src={`${basePath}/email-opened-svgrepo-com.svg`}
          alt="Email icon"
          width={110}
          height={110}
          priority
        />
        <h4>
          <span className="font-bold">MyNextEMailApp</span> is a small
          application demonstrating how to send emails in different ways from a
          Next.js Application.
        </h4>
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="smtp"
              checked={provider === "smtp"}
              onChange={(e) => setProvider(e.target.value as "smtp" | "resend")}
              disabled={sending}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">SMTP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="resend"
              checked={provider === "resend"}
              onChange={(e) => setProvider(e.target.value as "smtp" | "resend")}
              disabled={sending}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">Resend</span>
          </label>
        </div>
        <div className="flex gap-3 w-full max-w-md">
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            disabled={sending}
          />
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="px-6 py-3 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {sending ? "Sending..." : "Send Test Email"}
          </button>
        </div>
        {message && <p className="text-sm mt-2 text-center">{message}</p>}
      </main>
      <div className="fixed bottom-4 right-4 text-xs text-zinc-400">
        Version {APP_VERSION}
      </div>
    </div>
  );
}
