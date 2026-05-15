import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/debug-sitemap" },
    ];
  },
  images: {
    minimumCacheTTL: 2592000, // 30 gün — aynı görsel tekrar optimize edilmez
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
