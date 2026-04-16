import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@fortawesome/fontawesome-free'],
  },
  images: {
    formats: ['image/webp'],
  },
  // No static export, full backend support
};

export default nextConfig;
