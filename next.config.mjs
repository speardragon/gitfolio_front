/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gitfolio.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:8080/api/auth/:path*',
      },
      {
        source: '/api/members/:path*',
        destination: 'http://localhost:8081/api/members/:path*',
      },
      {
        source: '/api/resumes/:path*',
        destination: 'http://localhost:8082/api/resumes/:path*',
      },
    ];
  },
};

export default nextConfig;
