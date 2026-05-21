import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kmpbaski.com" }],
        destination: "https://kmpbaski.com/:path*",
        permanent: true,
      },
    ];
  },
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
