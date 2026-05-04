import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TEMPLATE ONLY
  turbopack: { root: import.meta.dirname },
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // TEMPLATE ONLY
  async redirects() {
    return [
      {
        destination: '/editor',
        permanent: false,
        source: '/',
      },
    ];
  },
};

// Wire OpenNext-Cloudflare bindings to Next.js dev server.
initOpenNextCloudflareForDev();

export default nextConfig;
