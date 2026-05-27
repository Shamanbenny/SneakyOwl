import { Poppins } from "next/font/google";

import BlogSilkBackground from "@/app/components/blog/BlogSilkBackground";

const blogFont = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

type BlogLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className={`${blogFont.className} blog-layout`}>
      <BlogSilkBackground
        className="blog-layout-background"
        color="#6da690"
        noiseIntensity={1.2}
      />
      <div className="blog-layout-content">{children}</div>
    </div>
  );
}
