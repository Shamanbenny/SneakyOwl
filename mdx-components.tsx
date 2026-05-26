import type { MDXComponents } from "mdx/types";

import BlogCodeBlock from "@/app/components/blog/BlogCodeBlock";
import BlogPostHeading from "@/app/components/blog/BlogPostHeading";

export const mdxComponents: MDXComponents = {
  h1: (props) => <BlogPostHeading as="h1" {...props} />,
  h2: (props) => <BlogPostHeading as="h2" {...props} />,
  h3: (props) => <BlogPostHeading as="h3" {...props} />,
  h4: (props) => <BlogPostHeading as="h4" {...props} />,
  pre: ({ children }) => <BlogCodeBlock>{children}</BlogCodeBlock>,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
