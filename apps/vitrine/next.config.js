/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Pour Cloudflare Pages
  experimental: {
    // Rien pour l'instant
  },
};

module.exports = nextConfig;
