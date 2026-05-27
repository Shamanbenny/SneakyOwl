import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use this when you want to use "npm run dev" to run the project locally
  //...(process.env.NODE_ENV === 'production' && { output: "export" }),
  // Use this when you want to publish the project to GitHub Pages
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/Shamanbenny/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
