import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/debug-sitemap" },
    ];
  },
  images: {
    unoptimized: true, // Vercel image optimization kotasını tüketmez; görseller Supabase'den direkt gelir
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
