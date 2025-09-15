import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['googleapis'],
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Enable static HTML export
  trailingSlash: true, // Optional: adds trailing slashes to URLs
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
