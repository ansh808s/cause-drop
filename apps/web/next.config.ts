import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://db9qe88uankx8.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
