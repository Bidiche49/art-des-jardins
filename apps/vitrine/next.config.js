/** @type {import('next').NextConfig} */

// Use standalone for Docker, export for Cloudflare Pages
const isDocker = process.env.DOCKER_BUILD === 'true';

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
};

module.exports = nextConfig;
