"use client";

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";

import { fetchAbacusCount, getBlogMetricKey } from "@/app/blog/abacus";

type BlogLikeCountProps = {
  slug: string;
  className?: string;
};

const formatCount = (count: number) => count.toLocaleString();

export default function BlogLikeCount({ slug, className }: BlogLikeCountProps) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    fetchAbacusCount(getBlogMetricKey(slug, "likes"))
      .then((value) => {
        if (isActive) {
          setCount(value);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch blog likes", error);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  return (
    <span
      className={["blog-like-metric", isLoading ? "blog-like-metric--loading" : null, className]
        .filter(Boolean)
        .join(" ")}
    >
      <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{formatCount(count)}</span>
    </span>
  );
}
