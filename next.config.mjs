/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  eslint: {
    // ❌ Build fails if ESLint finds errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // ❌ Build fails if TS finds errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;