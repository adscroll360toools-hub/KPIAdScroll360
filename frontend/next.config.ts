import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during Vercel builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
