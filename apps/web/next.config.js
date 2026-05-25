/** @type {import('next').NextConfig} */
const apiProxyTarget =
  process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_URL || ''

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client', 'nodemailer'],
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    if (!apiProxyTarget) {
      return []
    }

    return [
      {
        source: '/backend/:path*',
        destination: `${apiProxyTarget}/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
