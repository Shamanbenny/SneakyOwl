"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowRightLong, FaTag } from "react-icons/fa6";

import type { BlogPost } from "@/app/blog/blogPosts";

type BlogListingPost = BlogPost & {
  formattedPublishedAt: string;
};

type BlogListingPageProps = {
  posts: BlogListingPost[];
  tags: string[];
};

const TYPE_FILTERS = [
  { label: "All", value: "all" as const },
  { label: "Project", value: "project" as const },
  { label: "General", value: "general" as const },
];

const getSearchableText = (post: BlogPost) =>
  `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase();

export default function BlogListingPage({
  posts,
  tags,
}: BlogListingPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [activeType, setActiveType] = useState<(typeof TYPE_FILTERS)[number]["value"]>("all");
  const [activeTag, setActiveTag] = useState<string>("all");

  const trimmedSearchValue = searchValue.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesType = activeType === "all" ? true : post.type === activeType;
    const matchesTag = activeTag === "all" ? true : post.tags.includes(activeTag);
    const matchesSearch = trimmedSearchValue
      ? getSearchableText(post).includes(trimmedSearchValue)
      : true;

    return matchesType && matchesTag && matchesSearch;
  });

  return (
    <div className="blog-list-page">
      <div className="blog-shell">
        <header className="blog-hero">
          <span className="blog-eyebrow">Writing</span>
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-page-summary">
            Notes on projects, tradeoffs, and the implementation details worth keeping.
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
            <p>The blog registry is empty. Add a metadata entry and an MDX file to publish one.</p>
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
                </div>
                <div className="blog-card-body">
                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-card-summary">{post.summary}</p>
                </div>
                <div className="blog-chip-row">
                  {post.tags.map((tag) => (
                    <span key={`${post.slug}-${tag}`} className="blog-post-tag">
                      <FaTag className="h-3 w-3" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
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
  );
}
