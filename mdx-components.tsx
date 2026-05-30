import type { MDXComponents } from "mdx/types";

import BlogCodeBlock from "@/app/components/blog/BlogCodeBlock";
import BlogPostHeading from "@/app/components/blog/BlogPostHeading";
import BlogPostImage from "@/app/components/blog/BlogPostImage";
import {
  DesignDivider,
  DesignSpecStyles,
  ShowcaseRow,
  SpecGrid,
  SpecTile,
  Swatch,
} from "@/app/components/blog/peer-prep/PeerPrepMdxComponents";
import {
  RafflesGoDesignDivider,
  RafflesGoDesignSpecStyles,
  RafflesGoRoleBadgeDemo,
  RafflesGoShowcaseRow,
  RafflesGoSpecGrid,
  RafflesGoSpecTile,
  RafflesGoSwatch,
} from "@/app/components/blog/raffles-go/RafflesGoMdxComponents";
import { Compare } from "@/app/components/shared/ui/compare";

export const mdxComponents: MDXComponents = {
  Compare,
  DesignDivider,
  DesignSpecStyles,
  RafflesGoDesignDivider,
  RafflesGoDesignSpecStyles,
  RafflesGoRoleBadgeDemo,
  RafflesGoShowcaseRow,
  RafflesGoSpecGrid,
  RafflesGoSpecTile,
  RafflesGoSwatch,
  ShowcaseRow,
  SpecGrid,
  SpecTile,
  Swatch,
  h1: (props) => <BlogPostHeading as="h1" {...props} />,
  h2: (props) => <BlogPostHeading as="h2" {...props} />,
  h3: (props) => <BlogPostHeading as="h3" {...props} />,
  h4: (props) => <BlogPostHeading as="h4" {...props} />,
  img: (props) => <BlogPostImage {...props} />,
  pre: ({ children }) => <BlogCodeBlock>{children}</BlogCodeBlock>,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
