/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io","assets.aceternity.com"], // ✅ Allow Sanity-hosted images
    //I am allowing from assets aceternity for testing purposes
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    //HUGE TODO: FIX THE TYPES
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;