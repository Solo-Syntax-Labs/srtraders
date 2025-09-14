/** @type {import('next').NextConfig} */
const nextConfig = {
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
