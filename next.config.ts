import type { NextConfig } from "next";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  allowedDevOrigins: ["https://*.ngrok-free.app"],
} satisfies NextConfig & { allowedDevOrigins?: string[] };

export default nextConfig;
