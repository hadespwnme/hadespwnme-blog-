import type { NextConfig } from "next";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  // Non-standard property used only during local dev; ignored by Next at build time.
  allowedDevOrigins: ["https://*.ngrok-free.app"],
} satisfies NextConfig & { allowedDevOrigins?: string[] };

export default nextConfig;
