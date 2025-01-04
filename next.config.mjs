/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export when building
  ...(process.env.NODE_ENV === 'production' && { output: "export" }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/Shamanbenny/**',
      }
    ],
  },
};

export default nextConfig;
