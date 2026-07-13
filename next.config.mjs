/** @type {import('next').NextConfig} */
const nextConfig = {
  // We validate/lint in the editor; don't fail production builds on lint.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Allow next/image to optimize files uploaded to Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
