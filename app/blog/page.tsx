import { Sarina } from "next/font/google";

import BlogListingPage from "@/app/components/blog/BlogListingPage";
import NavBar from "@/app/components/shared/navigation/NavBar";
import { formatBlogDate, getAllBlogPosts, getAllBlogTags } from "@/app/blog/blogContent";

const sarinaFont = Sarina({ weight: "400", subsets: ["latin"] });

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getAllBlogPosts(), getAllBlogTags()]);
  const listingPosts = posts.map((post) => ({
    ...post,
    formattedPublishedAt: formatBlogDate(post.publishedAt),
  }));

  return (
    <>
      <NavBar />
      <BlogListingPage
        posts={listingPosts}
        tags={tags}
        asciiFontFamily={sarinaFont.style.fontFamily}
      />
    </>
  );
}
