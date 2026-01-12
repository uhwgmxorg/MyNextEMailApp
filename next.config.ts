// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Default base path for production
const defaultProdBasePath = "/MyNextEMailApp";

// Allow overriding the basePath via NEXT_BASE_PATH for future deployments.
// If NEXT_BASE_PATH is not set, we fall back to the current behavior.
const basePath = isProd
  ? process.env.NEXT_BASE_PATH ?? defaultProdBasePath
  : "";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  assetPrefix: isProd ? basePath : undefined,
  trailingSlash: true,
  // Expose basePath to the client so assets in public can be referenced correctly
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
