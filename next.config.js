/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['googleapis'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
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
