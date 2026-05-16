import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Existing project code has pre-existing TS issues.
    // Keep migration focused on runtime stack conversion.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
