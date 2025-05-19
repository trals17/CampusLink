/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },

  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'imagedelivery.net',
      },
    ],
    domains: [
      'imagedelivery.net',
      'customer-6fknsj3llsy5y0kn.cloudflarestream.com',
    ],
  },
};

export default nextConfig;
