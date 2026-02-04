import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ensure we generate sizes suitable for retina displays
    // Default deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    // Adding 2000 to better match common 1000px containers at 2x
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2000, 2048, 3840],
  },
};

export default nextConfig;
