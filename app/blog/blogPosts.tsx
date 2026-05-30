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
    title: "PeerPrep and the Benefits of Early Architectural Choices",
    type: "project",
  },
  {
    contentPath: "content/blog/raffles-go-conservation.mdx",
    publishedAt: "2026-05-30",
    project: {
      githubRepoUrl: "https://github.com/CS3213-2026-spring/rafflesgo-group-11",
    },
    slug: "raffles-go-conservation",
    summary:
      "RafflesGo became most meaningful when the work stopped being about flashy features and started being about removing real friction for the volunteers and organisers supporting Singapore's langur conservation efforts.",
    tags: ["React", "Fastify", "OpenAPI", "Requirements Analysis", "Conservation"],
    title: "RafflesGo: Will someone PLEASE think of the Stakeholders!",
    type: "project",
  },
];
