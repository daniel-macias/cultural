/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io","assets.aceternity.com"], // ✅ Allow Sanity-hosted images
    //I am allowing from assets aceternity for testing purposes
  },
};

module.exports = nextConfig;