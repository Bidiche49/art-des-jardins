/** @type {import('next').NextConfig} */

// Use standalone for Docker, export for Cloudflare Pages
const isDocker = process.env.DOCKER_BUILD === 'true';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  // 'standalone' for Docker, 'export' for static hosting (Cloudflare)
  output: isDocker ? 'standalone' : 'export',
  trailingSlash: true,
  images: {
    // Disable optimization for static export, enable for standalone
    unoptimized: !isDocker,
  },
  // Environment variables available at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Lint is run separately, not during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Security & cache headers (standalone/Docker mode only)
  ...(isDocker && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
        {
          source: '/images/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
      ];
    },
  }),
};

module.exports = nextConfig;
