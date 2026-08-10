import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Vercel: output standalone build
  output: "standalone",

  // Allow images from common external domains if needed in future
  images: {
    remotePatterns: [],
  },

  // Expose public env vars (already handled via NEXT_PUBLIC_ prefix, listed for clarity)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  },
};

export default nextConfig;
