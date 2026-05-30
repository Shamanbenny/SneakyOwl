export type BlogPostType = "general" | "project";

type BlogPostBaseMeta = {
  slug: string;
  type: BlogPostType;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  contentPath: string;
};

export type GeneralBlogPostMeta = BlogPostBaseMeta & {
  type: "general";
};

export type ProjectBlogPostMeta = BlogPostBaseMeta & {
  type: "project";
  project: {
    githubRepoUrl: string;
  };
};

export type BlogPostMeta = GeneralBlogPostMeta | ProjectBlogPostMeta;

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
    publishedAt: "2026-05-27",
    project: {
      githubRepoUrl: "https://github.com/CS3219-AY2526S2/peerprep-g18",
    },
    slug: "peer-prep-system-design",
    summary:
      "Using PeerPrep as a case study, this post examines how early decisions around UI structure, service ownership, and deployment affected maintainability and scaling later on.",
    tags: ["React", "Redis", "Terraform", "AWS", "Microservice", "System Design"],
    title: "PeerPrep and the Cost of Early Architectural Choices",
    type: "project",
  },
];
