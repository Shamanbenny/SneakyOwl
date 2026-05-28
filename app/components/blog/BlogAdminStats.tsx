"use client";

import { useEffect, useState } from "react";
import { FaClock, FaHeart } from "react-icons/fa6";

import { fetchAbacusCount, getBlogMetricKey } from "@/app/blog/abacus";

type BlogAdminStatsProps = {
  slug: string;
};

type BlogAdminCounts = {
  likes: number;
  threeMinutes: number;
  tenMinutes: number;
};

const formatCount = (count: number) => count.toLocaleString();

const EMPTY_COUNTS: BlogAdminCounts = {
  likes: 0,
  threeMinutes: 0,
  tenMinutes: 0,
};

export default function BlogAdminStats({ slug }: BlogAdminStatsProps) {
  const [counts, setCounts] = useState<BlogAdminCounts>(EMPTY_COUNTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      fetchAbacusCount(getBlogMetricKey(slug, "likes")),
      fetchAbacusCount(getBlogMetricKey(slug, "3m")),
      fetchAbacusCount(getBlogMetricKey(slug, "10m")),
    ])
      .then(([likes, threeMinutes, tenMinutes]) => {
        if (!isActive) {
          return;
        }

        setCounts({
          likes,
          threeMinutes,
          tenMinutes,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch blog admin stats", error);
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
    <div
      className={[
        "blog-admin-stats",
        isLoading ? "blog-admin-stats--loading" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="blog-admin-stat">
        <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{formatCount(counts.likes)}</span>
        <span className="blog-admin-stat-label">Likes</span>
      </span>
      <span className="blog-admin-stat">
        <FaClock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{formatCount(counts.threeMinutes)}</span>
        <span className="blog-admin-stat-label">3m</span>
      </span>
      <span className="blog-admin-stat">
        <FaClock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{formatCount(counts.tenMinutes)}</span>
        <span className="blog-admin-stat-label">10m</span>
      </span>
    </div>
  );
}
