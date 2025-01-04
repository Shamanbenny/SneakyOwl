/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use this when you want to use "npm run dev" to run the project locally
  //...(process.env.NODE_ENV === 'production' && { output: "export" }),
  // Use this when you want to publish the project to GitHub Pages
  output: "export",
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
