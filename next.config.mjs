/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow localtunnel for testing
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['red-toes-eat.loca.lt']
    }
  }
};

// Workaround for Next.js 15 allowedDevOrigins
nextConfig.allowedDevOrigins = ['red-toes-eat.loca.lt'];

export default nextConfig;
