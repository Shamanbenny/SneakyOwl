import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BlogPostHeadingProps = ComponentPropsWithoutRef<"h1"> & {
  as: "h1" | "h2" | "h3" | "h4";
  children: ReactNode;
};

const headingPrefixMap: Record<BlogPostHeadingProps["as"], string | null> = {
  h1: null,
  h2: ">",
  h3: "",
  h4: "",
};

export default function BlogPostHeading({
  as,
  children,
  className,
  id,
  ...rest
}: BlogPostHeadingProps) {
  const HeadingTag = as;
  const prefix = headingPrefixMap[as];

  return (
    <HeadingTag
      id={id}
      className={[className, "blog-heading", `blog-heading--${as}`].filter(Boolean).join(" ")}
      {...rest}
    >
      {prefix !== null ? (
        <span aria-hidden="true" className="blog-heading-prefix">
          {prefix}
        </span>
      ) : null}
      <span>{children}</span>
    </HeadingTag>
  );
}
