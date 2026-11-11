import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enable standalone mode for Docker
  
  // Pin root to this app to avoid lockfile root confusion
  turbopack: {
    root: __dirname,
  },
  
  // Optimize for production
  reactStrictMode: true,
  
  // Disable telemetry
  typescript: {
    // Set to true to ignore TypeScript errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },
  // Note: the `eslint` option was removed in Next.js 16; run `npm run lint` separately.
};

export default nextConfig;
