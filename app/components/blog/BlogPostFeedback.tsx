"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FaArrowUpRightFromSquare, FaGithub, FaHeart } from "react-icons/fa6";

import {
  fetchAbacusCount,
  getBlogMetricKey,
  getBlogStorageKey,
  hitAbacusCounter,
} from "@/app/blog/abacus";

type BlogPostFeedbackProviderProps = {
  slug: string;
  children: ReactNode;
};

type BlogPostGitHubRedirectProps = {
  githubRepoUrl: string;
};

type BlogPostFeedbackContextValue = {
  isLiked: boolean;
  isSubmittingLike: boolean;
  likesCount: number;
  registerLike: () => Promise<void>;
};

const MAX_TRACKED_MINUTES = 10;
const THREE_MINUTE_MILESTONE = 3;
const TEN_MINUTE_MILESTONE = 10;
const TIMER_INTERVAL_MS = 60_000;
const BYPASS_TIMER_STORAGE_KEY = "sneakyowl_bypass_timer";

const BlogPostFeedbackContext = createContext<BlogPostFeedbackContextValue | null>(null);

const formatCount = (count: number) => count.toLocaleString();

const shouldBypassTimer = () =>
  typeof window !== "undefined" && window.localStorage.getItem(BYPASS_TIMER_STORAGE_KEY) === "1";

const useBlogPostFeedback = () => {
  const context = useContext(BlogPostFeedbackContext);

  if (!context) {
    throw new Error("BlogPostFeedback components must be used within BlogPostFeedbackProvider.");
  }

  return context;
};

function BlogPostGitHubRedirect({ githubRepoUrl }: BlogPostGitHubRedirectProps) {
  return (
    <Link
      href={githubRepoUrl}
      className="blog-control-button"
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub repository in a new tab"
    >
      <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
      <span>GitHub</span>
      <FaArrowUpRightFromSquare className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

export default function BlogPostFeedbackProvider({
  slug,
  children,
}: BlogPostFeedbackProviderProps) {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const trackedMinutesRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const milestoneRequestsRef = useRef<Set<"3m" | "10m">>(new Set());

  const likeStorageKey = getBlogStorageKey(slug, "liked");
  const minutesStorageKey = getBlogStorageKey(slug, "minutes");
  const threeMinuteStorageKey = getBlogStorageKey(slug, "3m_registered");
  const tenMinuteStorageKey = getBlogStorageKey(slug, "10m_registered");

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const registerMilestone = useCallback(
    async (milestone: "3m" | "10m", storageKey: string) => {
      if (typeof window === "undefined") {
        return;
      }

      if (shouldBypassTimer()) {
        return;
      }

      if (window.localStorage.getItem(storageKey)) {
        return;
      }

      if (milestoneRequestsRef.current.has(milestone)) {
        return;
      }

      milestoneRequestsRef.current.add(milestone);

      try {
        await hitAbacusCounter(getBlogMetricKey(slug, milestone));
        window.localStorage.setItem(storageKey, "1");
      } catch (error) {
        console.error(`Failed to register ${milestone} milestone`, error);
      } finally {
        milestoneRequestsRef.current.delete(milestone);
      }
    },
    [slug],
  );

  const syncMilestones = useCallback(
    async (minutes: number) => {
      if (minutes >= THREE_MINUTE_MILESTONE) {
        await registerMilestone("3m", threeMinuteStorageKey);
      }

      if (minutes >= TEN_MINUTE_MILESTONE) {
        await registerMilestone("10m", tenMinuteStorageKey);
      }
    },
    [registerMilestone, tenMinuteStorageKey, threeMinuteStorageKey],
  );

  const tickTrackedMinute = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (shouldBypassTimer()) {
      stopTimer();
      return;
    }

    const nextMinutes = Math.min(trackedMinutesRef.current + 1, MAX_TRACKED_MINUTES);

    trackedMinutesRef.current = nextMinutes;
    window.localStorage.setItem(minutesStorageKey, String(nextMinutes));

    void syncMilestones(nextMinutes);

    if (nextMinutes >= MAX_TRACKED_MINUTES) {
      stopTimer();
    }
  }, [minutesStorageKey, stopTimer, syncMilestones]);

  const startTimer = useCallback(() => {
    if (typeof window === "undefined" || document.hidden) {
      return;
    }

    if (shouldBypassTimer()) {
      return;
    }

    if (intervalRef.current !== null || trackedMinutesRef.current >= MAX_TRACKED_MINUTES) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      tickTrackedMinute();
    }, TIMER_INTERVAL_MS);
  }, [tickTrackedMinute]);

  const registerLike = useCallback(async () => {
    if (typeof window === "undefined" || isLiked || isSubmittingLike) {
      return;
    }

    setIsSubmittingLike(true);

    try {
      const nextCount = await hitAbacusCounter(getBlogMetricKey(slug, "likes"));
      setLikesCount(nextCount);
      setIsLiked(true);
      window.localStorage.setItem(likeStorageKey, "1");
    } catch (error) {
      console.error("Failed to register blog like", error);
    } finally {
      setIsSubmittingLike(false);
    }
  }, [isLiked, isSubmittingLike, likeStorageKey, slug]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (shouldBypassTimer()) {
      trackedMinutesRef.current = 0;
    } else {
      const storedMinutes = Number.parseInt(window.localStorage.getItem(minutesStorageKey) ?? "0", 10);
      trackedMinutesRef.current = Number.isNaN(storedMinutes)
        ? 0
        : Math.min(Math.max(storedMinutes, 0), MAX_TRACKED_MINUTES);
    }

    setIsLiked(window.localStorage.getItem(likeStorageKey) === "1");

    fetchAbacusCount(getBlogMetricKey(slug, "likes"))
      .then((value) => {
        setLikesCount(value);
      })
      .catch((error) => {
        console.error("Failed to fetch blog likes", error);
      });

    if (!shouldBypassTimer()) {
      void syncMilestones(trackedMinutesRef.current);
      startTimer();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
        return;
      }

      startTimer();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTimer();
    };
  }, [likeStorageKey, minutesStorageKey, slug, startTimer, stopTimer, syncMilestones]);

  const value = useMemo(
    () => ({
      isLiked,
      isSubmittingLike,
      likesCount,
      registerLike,
    }),
    [isLiked, isSubmittingLike, likesCount, registerLike],
  );

  return <BlogPostFeedbackContext.Provider value={value}>{children}</BlogPostFeedbackContext.Provider>;
}

export function BlogPostHeaderFeedback({ githubRepoUrl }: { githubRepoUrl?: string }) {
  const { isLiked, isSubmittingLike, likesCount, registerLike } = useBlogPostFeedback();

  return (
    <div className="blog-feedback-anchor">
      {githubRepoUrl ? <BlogPostGitHubRedirect githubRepoUrl={githubRepoUrl} /> : null}

      <div className="blog-feedback-stats" aria-label="Post likes">
        <span className="blog-feedback-stat">
          <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatCount(likesCount)}</span>
        </span>
      </div>

      <button
        type="button"
        className={[
          "blog-control-button",
          "blog-control-button--primary",
          isLiked ? "blog-control-button--active" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => void registerLike()}
        aria-pressed={isLiked}
        disabled={isLiked || isSubmittingLike}
      >
        <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
        {isLiked ? "Liked" : "Like post"}
      </button>
    </div>
  );
}

export function BlogPostFooterFeedback({ githubRepoUrl }: { githubRepoUrl?: string }) {
  const { isLiked, isSubmittingLike, likesCount, registerLike } = useBlogPostFeedback();

  return (
    <section className="blog-post-footer-feedback" aria-label="Post feedback">
      <div className="blog-post-footer-copy">
        <p className="blog-post-footer-kicker">End of transmission</p>
        <h2 className="blog-post-footer-title">If this read earned a bookmark in your head, mark it here.</h2>
        <p className="blog-post-footer-body">
          No confetti, no pop-up survey. Just a small signal that this post was worth the caffeine it took to produce!
        </p>
      </div>

      <div className="blog-post-footer-actions">
        {githubRepoUrl ? <BlogPostGitHubRedirect githubRepoUrl={githubRepoUrl} /> : null}
        <span className="blog-feedback-stat">
          <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatCount(likesCount)}</span>
        </span>
        <button
          type="button"
          className={[
            "blog-control-button",
            "blog-control-button--primary",
            isLiked ? "blog-control-button--active" : null,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => void registerLike()}
          aria-pressed={isLiked}
          disabled={isLiked || isSubmittingLike}
        >
          <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
          {isLiked ? "Liked" : "Like post"}
        </button>
      </div>
    </section>
  );
}
