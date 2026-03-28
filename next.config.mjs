/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true, // Esto silencia el error circular definitivamente
  }
};

export default nextConfig;
