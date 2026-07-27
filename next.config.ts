import type { NextConfig } from "next";

/**
 * When the app is served from a project page on GitHub Pages the site lives
 * under `https://<user>.github.io/<repo>/`, so every asset needs that prefix.
 * The deploy workflow sets NEXT_PUBLIC_BASE_PATH="/EnergyX"; locally it is
 * empty so `npm run dev` keeps working at http://localhost:3000/.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
