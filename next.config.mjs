// file: next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
  images: {
    // 간단히 도메인만 체크하고 싶을 땐 domains 만 써도 됩니다.
    domains: [
      "imagedelivery.net",
      "avatars.githubusercontent.com",
      "customer-6fknsj3llsy5y0kn.cloudflarestream.com",
    ],
    // 더 세밀하게 패턴을 지정하려면 remotePatterns 를 함께 써주세요.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
