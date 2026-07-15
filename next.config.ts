import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/wallet',    destination: '/profile/wallet',    permanent: true },
      { source: '/affiliate', destination: '/profile/affiliate', permanent: true },
      { source: '/settings',  destination: '/profile/settings',  permanent: true },
    ];
  },
};

export default nextConfig;
