/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  serverExternalPackages: ['googleapis'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/google-drive',
        destination: '/api/auth/google-drive/callback',
      },
    ]
  },
}

module.exports = nextConfig
