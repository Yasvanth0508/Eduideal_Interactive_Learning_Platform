import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Limits concurrent build worker threads to prevent out-of-memory crashes on memory-constrained systems
    cpus: 2,
  },
};

export default nextConfig;
