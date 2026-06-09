import type { VideoHTMLAttributes } from "react";

type BlogPostVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "children" | "src"> & {
  src: string;
  title: string;
};

const getVideoType = (src: string) => {
  if (src.endsWith(".mp4")) {
    return "video/mp4";
  }

  if (src.endsWith(".webm")) {
    return "video/webm";
  }

  return undefined;
};

export default function BlogPostVideo({ className, src, title, ...rest }: BlogPostVideoProps) {
  const videoClassName = ["blog-post-video", className].filter(Boolean).join(" ");

  return (
    <figure className="blog-post-video-frame">
      <video aria-label={title} className={videoClassName} controls playsInline preload="metadata" {...rest}>
        <source src={src} type={getVideoType(src)} />
        <a href={src}>Open video</a>
      </video>
    </figure>
  );
}
