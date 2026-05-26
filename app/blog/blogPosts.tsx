export type BlogPostType = "general" | "project";

export type BlogPostMeta = {
  slug: string;
  type: BlogPostType;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  contentPath: string;
};

export type BlogPostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPost = BlogPostMeta & {
  headings: BlogPostHeading[];
  readTimeMinutes: number;
};

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    contentPath: "content/blog/peer-prep.mdx",
    publishedAt: "2026-03-14",
    slug: "peer-prep-system-design",
    summary:
      "How Peer Prep was structured around matching, collaboration, and history services while still remaining workable for a student team.",
    tags: ["React", "Node.js", "Redis", "Terraform", "AWS", "System Design"],
    title: "Peer Prep: From Real-Time Interview Practice to Deployable System Design",
    type: "project",
  },
  {
    contentPath: "content/blog/raffles-go-operations.mdx",
    publishedAt: "2026-02-06",
    slug: "raffles-go-conservation-operations",
    summary:
      "Design notes from building a field-friendly conservation operations platform with offline-sensitive flows and stakeholder-heavy requirement work.",
    tags: ["React", "Fastify", "Firebase", "OpenAPI", "Conservation Tech"],
    title: "Raffles Go: Building a Conservation Operations Platform for Real Field Work",
    type: "project",
  },
  {
    contentPath: "content/blog/chess-flask-iterations.mdx",
    publishedAt: "2026-01-18",
    slug: "chess-flask-iteration-notes",
    summary:
      "A short breakdown of how the chess engine API and the separate Next.js UI evolved together across multiple bot versions.",
    tags: ["Python", "Flask", "Chess", "Search", "Evaluation"],
    title: "Chess Flask: Iterating on a Chess Engine API Without Overbuilding the Frontend",
    type: "project",
  },
  {
    contentPath: "content/blog/shipping-smaller-interfaces.mdx",
    publishedAt: "2025-12-09",
    slug: "shipping-smaller-interfaces",
    summary:
      "Why smaller interfaces and a tighter presentation layer usually make personal projects easier to maintain after the first sprint.",
    tags: ["Frontend", "Maintainability", "DX"],
    title: "Shipping Smaller Interfaces",
    type: "general",
  },
];
