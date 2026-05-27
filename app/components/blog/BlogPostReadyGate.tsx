"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { BlogPostSkeleton } from "@/app/components/shared/feedback/PageSkeletons";

type BlogPostReadyGateProps = {
  children: ReactNode;
};

const waitForImagesInElement = async (element: HTMLElement) => {
  // Lazy images lower in the article can remain intentionally unloaded until they approach the viewport.
  // Waiting on them here deadlocks the reveal because the content stays hidden behind the skeleton.
  const images = Array.from(element.querySelectorAll("img")).filter((image) => image.loading !== "lazy");

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          const finish = () => {
            image.removeEventListener("load", finish);
            image.removeEventListener("error", finish);
            resolve();
          };

          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
        }),
    ),
  );
};

const waitForNextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const withTimeout = async (promise: Promise<void>, timeoutMs: number) => {
  await Promise.race([
    promise,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
};

export default function BlogPostReadyGate({ children }: BlogPostReadyGateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let isActive = true;

    const fontReady =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();

    withTimeout(Promise.all([fontReady, waitForImagesInElement(container), waitForNextPaint()]).then(() => undefined), 2500).then(
      () => {
        if (isActive) {
          setIsPageReady(true);
        }
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="relative" aria-busy={!isPageReady}>
      {!isPageReady ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <BlogPostSkeleton />
        </div>
      ) : null}
      <div
        ref={containerRef}
        aria-hidden={!isPageReady}
        className={`transition-[opacity,visibility] duration-200 ease-linear ${
          isPageReady ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
