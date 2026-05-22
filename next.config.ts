import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to the project directory.
    // process.cwd() resolves to wherever `next dev` was invoked from,
    // which is the project root for `npm run dev`.
    root: process.cwd(),
  },
};

export default nextConfig;
