import type { NextConfig } from "next";

// Extend Next.js config with asset caching headers
export const headers = () => {
  return [
    {
      // Cache Next.js static assets aggressively
      source: "/_next/static/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      // Cache public assets (svg/png/jpg/gif/svg/ico/woff etc.) aggressively
      source:
        "/(.*)\\.(png|jpg|jpeg|svg|gif|webp|ico|woff2|woff|ttf|eot)$",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ];
};

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
