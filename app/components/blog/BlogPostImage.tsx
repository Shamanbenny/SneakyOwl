import type { CSSProperties, ImgHTMLAttributes } from "react";

type BlogPostImageProps = ImgHTMLAttributes<HTMLImageElement>;

const hasExplicitSize = (style: CSSProperties | undefined, width: BlogPostImageProps["width"], height: BlogPostImageProps["height"]) =>
  width != null ||
  height != null ||
  style?.width != null ||
  style?.height != null ||
  style?.maxWidth != null ||
  style?.maxHeight != null;

export default function BlogPostImage({
  alt = "",
  className,
  height,
  style,
  width,
  ...rest
}: BlogPostImageProps) {
  const imageClassName = [
    "blog-post-image",
    hasExplicitSize(style, width, height) ? "blog-post-image--explicit-size" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // MDX post content can contain arbitrary local or remote images, so a plain img tag is the stable renderer here.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={imageClassName} height={height} style={style} width={width} {...rest} />;
}
