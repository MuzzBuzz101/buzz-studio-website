/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Portfolio photography is local under /public/images. Admin media may
    // also live on Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
