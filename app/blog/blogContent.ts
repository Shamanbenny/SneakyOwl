import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache, type ComponentType } from "react";
import { evaluate } from "@mdx-js/mdx";
import type { MDXProps } from "mdx/types";
import rehypeSlug from "rehype-slug";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

import type { BlogPost, BlogPostHeading, BlogPostMeta } from "@/app/blog/blogPosts";
import { BLOG_POSTS } from "@/app/blog/blogPosts";

const BLOG_WORDS_PER_MINUTE = 200;
const BLOG_CONTENT_ROOT = process.cwd();

type BlogPostModule = ComponentType<MDXProps>;

type BlogPostWithContent = BlogPost & {
  Content: BlogPostModule;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

const normalizeHeadingText = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();

const createHeadingId = (text: string, existingIds: Map<string, number>) => {
  const baseId = text
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "section";

  const currentCount = existingIds.get(baseId) ?? 0;

  existingIds.set(baseId, currentCount + 1);

  return currentCount === 0 ? baseId : `${baseId}-${currentCount}`;
};

const extractHeadings = (rawContent: string): BlogPostHeading[] => {
  const lines = rawContent.split(/\r?\n/);
  const headings: BlogPostHeading[] = [];
  const headingIds = new Map<string, number>();
  let isInCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      isInCodeFence = !isInCodeFence;
      continue;
    }

    if (isInCodeFence) {
      continue;
    }

    const match = /^(##|###)\s+(.*)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = normalizeHeadingText(match[2].replace(/\s+#*$/, ""));

    if (!text) {
      continue;
    }

    headings.push({
      id: createHeadingId(text, headingIds),
      level,
      text,
    });
  }

  return headings;
};

const countWords = (rawContent: string) => {
  const sanitized = rawContent
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]/g, " ");

  const words = sanitized.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g);

  return words?.length ?? 0;
};

const getReadTimeMinutes = (wordCount: number) =>
  Math.max(1, Math.ceil(wordCount / BLOG_WORDS_PER_MINUTE));

const getBlogPostMeta = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug) ?? null;

const getBlogPostRawContent = async (post: BlogPostMeta) => {
  const fullPath = path.join(BLOG_CONTENT_ROOT, post.contentPath);

  return readFile(fullPath, "utf8");
};

const getBlogPostComponent = cache(async (contentPath: string): Promise<BlogPostModule> => {
  const fullPath = path.join(BLOG_CONTENT_ROOT, contentPath);
  const source = await readFile(fullPath, "utf8");
  const evaluated = await evaluate(source, {
    ...runtime,
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [remarkGfm],
  });

  return evaluated.default as BlogPostModule;
});

const deriveBlogPost = async (post: BlogPostMeta): Promise<BlogPost> => {
  const rawContent = await getBlogPostRawContent(post);

  return {
    ...post,
    headings: extractHeadings(rawContent),
    readTimeMinutes: getReadTimeMinutes(countWords(rawContent)),
  };
};

const comparePublishedDates = (left: BlogPostMeta, right: BlogPostMeta) =>
  new Date(`${right.publishedAt}T00:00:00`).getTime() -
  new Date(`${left.publishedAt}T00:00:00`).getTime();

export const formatBlogDate = (publishedAt: string) =>
  dateFormatter.format(new Date(`${publishedAt}T00:00:00`));

export const getAllBlogPosts = cache(async () => {
  const posts = await Promise.all(BLOG_POSTS.map((post) => deriveBlogPost(post)));

  return posts.sort(comparePublishedDates);
});

export const getAllBlogTags = cache(async () => {
  const posts = await getAllBlogPosts();
  const tags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort((left, right) => left.localeCompare(right));
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostWithContent | null> => {
  const post = getBlogPostMeta(slug);

  if (!post) {
    return null;
  }

  const [derivedPost, Content] = await Promise.all([
    deriveBlogPost(post),
    getBlogPostComponent(post.contentPath),
  ]);

  return {
    ...derivedPost,
    Content,
  };
});
