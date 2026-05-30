import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaTag } from "react-icons/fa6";

import { BLOG_POSTS } from "@/app/blog/blogPosts";
import { formatBlogDate, getBlogPostBySlug } from "@/app/blog/blogContent";
import BlogPostFeedbackProvider, {
  BlogPostFooterFeedback,
  BlogPostHeaderFeedback,
} from "@/app/components/blog/BlogPostFeedback";
import BlogPostReadyGate from "@/app/components/blog/BlogPostReadyGate";
import BlogPostSidebar from "@/app/components/blog/BlogPostSidebar";
import { mdxComponents } from "@/mdx-components";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { Content } = post;
  const githubRepoUrl = post.type === "project" ? post.project.githubRepoUrl : undefined;

  return (
    <BlogPostReadyGate>
      <div className="blog-post-page" id="top">
        <Link href="/blog" className="blog-control-button blog-control-button--back">
          <FaArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <BlogPostFeedbackProvider slug={post.slug}>
          <div className="blog-shell">
            <header className="blog-post-header">
              <div className="blog-post-header-top">
                <div className="blog-card-meta">
                  <span className="blog-card-type">{post.type}</span>
                  <span>{formatBlogDate(post.publishedAt)}</span>
                  <span className="blog-meta-dot" aria-hidden="true" />
                  <span>{post.readTimeMinutes} min read</span>
                </div>
                <BlogPostHeaderFeedback githubRepoUrl={githubRepoUrl} />
              </div>
              <h1 className="blog-page-title blog-page-title--post">{post.title}</h1>
              <p className="blog-page-summary blog-page-summary--post">{post.summary}</p>
              <div className="blog-chip-row">
                {post.tags.map((tag) => (
                  <span key={`${post.slug}-${tag}`} className="blog-post-tag">
                    <FaTag className="h-3 w-3" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="blog-article-grid">
              <div className="blog-content-rail">
                <article className="blog-article-panel">
                  <div className="blog-prose">
                    <Content components={mdxComponents} />
                  </div>
                  <BlogPostFooterFeedback githubRepoUrl={githubRepoUrl} />
                </article>
              </div>

              {post.headings.length > 0 ? <BlogPostSidebar headings={post.headings} /> : null}
            </div>
          </div>
        </BlogPostFeedbackProvider>
      </div>
    </BlogPostReadyGate>
  );
}
