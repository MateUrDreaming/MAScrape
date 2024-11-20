import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: "assets.kogan.com",
        },
    ],
    minimumCacheTTL: 15000000,
},
};

export default nextConfig;
