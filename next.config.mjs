/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ideogram.ai', 'lh3.googleusercontent.com'],
  },
  rewrites: async () => [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap',
    },
  ],
};

export default nextConfig;