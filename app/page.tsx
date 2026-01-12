"use client";

import Image from "next/image";
import { APP_VERSION } from "@/lib/version";

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  console.log("[DEBUG] Version:", APP_VERSION);
  console.log("[DEBUG] BasePath:", basePath);
  if (typeof window !== "undefined") {
    console.log("[DEBUG] window.location:", window.location.href);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 bg-white dark:bg-black sm:items-start gap-6">
        <Image
          className="dark:invert"
          src={`${basePath}/next.svg`}
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <h4>
          <span className="font-bold">MyNextEMailApp</span> is a small
          application demonstrating how to send emails in different ways
        </h4>
      </main>
      <div className="fixed bottom-4 right-4 text-xs text-zinc-400">
        Version {APP_VERSION}
      </div>
    </div>
  );
}
