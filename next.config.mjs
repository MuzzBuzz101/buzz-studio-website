/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All photography is served locally from /public/images. Add a
    // `remotePatterns` entry here if you later move assets to a CDN.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
