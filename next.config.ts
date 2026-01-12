import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
const useBasePath = !!basePath && basePath !== "/";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(useBasePath ? { basePath, trailingSlash: true } : { trailingSlash: true }),
};

export default nextConfig;
