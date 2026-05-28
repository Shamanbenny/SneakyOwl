"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRightLong, FaTag } from "react-icons/fa6";

import type { BlogPost } from "@/app/blog/blogPosts";
import BlogAdminStats from "@/app/components/blog/BlogAdminStats";
import ASCIIText from "@/app/components/blog/ASCIIText";
import BlogLikeCount from "@/app/components/blog/BlogLikeCount";
import { BlogListingSkeleton } from "@/app/components/shared/feedback/PageSkeletons";

type BlogListingPost = BlogPost & {
  formattedPublishedAt: string;
};

type BlogListingPageProps = {
  posts: BlogListingPost[];
  tags: string[];
  asciiFontFamily: string;
};

const TYPE_FILTERS = [
  { label: "All", value: "all" as const },
  { label: "Project", value: "project" as const },
  { label: "General", value: "general" as const },
];

const getSearchableText = (post: BlogPost) =>
  `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase();

const BLOG_LISTING_ASCII_LOCKUP_COUNT = 2;

export default function BlogListingPage({
  posts,
  tags,
  asciiFontFamily,
}: BlogListingPageProps) {
  const [isPageReady, setIsPageReady] = useState(false);
  const [readyAsciiCount, setReadyAsciiCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [activeType, setActiveType] = useState<(typeof TYPE_FILTERS)[number]["value"]>("all");
  const [activeTag, setActiveTag] = useState<string>("all");

  useEffect(() => {
    if (readyAsciiCount < BLOG_LISTING_ASCII_LOCKUP_COUNT) {
      return;
    }

    let isActive = true;
    const fontReady =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();

    fontReady.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isActive) {
            setIsPageReady(true);
          }
        });
      });
    });

    return () => {
      isActive = false;
    };
  }, [readyAsciiCount]);

  const handleAsciiReady = useCallback(() => {
    setReadyAsciiCount((currentCount) =>
      Math.min(BLOG_LISTING_ASCII_LOCKUP_COUNT, currentCount + 1),
    );
  }, []);

  const trimmedSearchValue = searchValue.trim().toLowerCase();
  const isAdminStatsMode = trimmedSearchValue === "vinniere";
  const filteredPosts = posts.filter((post) => {
    const matchesType = activeType === "all" ? true : post.type === activeType;
    const matchesTag = activeTag === "all" ? true : post.tags.includes(activeTag);
    const matchesSearch = trimmedSearchValue
      ? isAdminStatsMode
        ? true
        : getSearchableText(post).includes(trimmedSearchValue)
      : true;

    return matchesType && matchesTag && matchesSearch;
  });

  return (
    <div className="relative" aria-busy={!isPageReady}>
      {!isPageReady ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <BlogListingSkeleton />
        </div>
      ) : null}
      <div
        aria-hidden={!isPageReady}
        className={`transition-[opacity,visibility] duration-200 ease-linear ${
          isPageReady ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div className="blog-list-page">
          <div className="blog-shell">
            <header className="blog-hero">
              <h1 className="sr-only">Welcome to my Blog</h1>
              <div className="blog-ascii-lockup">
                <div className="blog-ascii-lockup-inner">
                  <div className="blog-kicker-ascii-stage">
                    <ASCIIText
                      text="Welcome to my"
                      asciiFontSize={4}
                      textFontSize={220}
                      textFontFamily={asciiFontFamily}
                      textFontWeight={400}
                      planeBaseHeight={10}
                      enableWaves={false}
                      enableMouseMotion={false}
                      textColor="var(--site-text-strong)"
                      onReady={handleAsciiReady}
                    />
                  </div>
                  <div className="blog-ascii-stage">
                    <ASCIIText
                      text="Blog"
                      asciiFontSize={6}
                      textFontSize={300}
                      textFontFamily={asciiFontFamily}
                      textFontWeight={400}
                      planeBaseHeight={15}
                      enableWaves={false}
                      enableColorShifting={false}
                      textColor="var(--site-text-strong)"
                      onReady={handleAsciiReady}
                    />
                  </div>
                </div>
              </div>
              <p className="blog-page-summary w-auto mx-auto">
                SWE by trade. Gamer by instinct. Climber by obsession. Coffee by necessity.
              </p>
            </header>

            <section className="blog-filter-panel" aria-label="Blog filters">
              <div className="blog-filter-group">
                <span className="blog-filter-label">Type</span>
                <div className="blog-chip-row">
                  {TYPE_FILTERS.map((filter) => {
                    const isActive = activeType === filter.value;

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        className={`blog-chip ${isActive ? "blog-chip--active" : ""}`}
                        onClick={() => setActiveType(filter.value)}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="blog-filter-group">
                <label className="blog-filter-label" htmlFor="blog-search">
                  Search
                </label>
                <input
                  id="blog-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search title, summary, or tags"
                  className="site-input blog-search-input"
                />
              </div>

              <div className="blog-filter-group">
                <span className="blog-filter-label">Tags</span>
                <div className="blog-chip-row">
                  <button
                    type="button"
                    className={`blog-chip ${activeTag === "all" ? "blog-chip--active" : ""}`}
                    onClick={() => setActiveTag("all")}
                  >
                    All Tags
                  </button>
                  {tags.map((tag) => {
                    const isActive = activeTag === tag;

                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`blog-chip ${isActive ? "blog-chip--active" : ""}`}
                        onClick={() => setActiveTag(tag)}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {posts.length === 0 ? (
              <section className="blog-empty-state">
                <h2>No posts yet</h2>
                <p>
                  The blog registry is empty. Add a metadata entry and an MDX file to publish one.
                </p>
              </section>
            ) : filteredPosts.length === 0 ? (
              <section className="blog-empty-state">
                <h2>No matching posts</h2>
                <p>Change the search term or filters to widen the result set.</p>
              </section>
            ) : (
              <section className="blog-list-grid" aria-label="Blog posts">
                {filteredPosts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    <div className="blog-card-meta">
                      <span className="blog-card-type">{post.type}</span>
                      <span>{post.formattedPublishedAt}</span>
                      <span className="blog-meta-dot" aria-hidden="true" />
                      <span>{post.readTimeMinutes} min read</span>
                      <span className="blog-meta-dot" aria-hidden="true" />
                      <BlogLikeCount slug={post.slug} />
                    </div>
                    <div className="blog-card-body">
                      <h2 className="blog-card-title">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {isAdminStatsMode ? (
                        <BlogAdminStats slug={post.slug} />
                      ) : (
                        <p className="blog-card-summary">{post.summary}</p>
                      )}
                    </div>
                    {isAdminStatsMode ? null : (
                      <div className="blog-chip-row">
                        {post.tags.map((tag) => (
                          <span key={`${post.slug}-${tag}`} className="blog-post-tag">
                            <FaTag className="h-3 w-3" aria-hidden="true" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`} className="blog-card-link">
                      Read post
                      <FaArrowRightLong className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
