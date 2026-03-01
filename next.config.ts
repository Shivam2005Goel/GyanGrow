import type { NextConfig } from "next";

const nextConfig: any = {
  serverExternalPackages: ['lightningcss'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
