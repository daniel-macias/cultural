/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // ✅ Allow Sanity-hosted images
  },
};

module.exports = nextConfig;