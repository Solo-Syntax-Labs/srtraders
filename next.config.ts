import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['googleapis'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Note: Static export disabled because app uses API routes
  // output: 'export' is incompatible with API routes
};

export default nextConfig;
