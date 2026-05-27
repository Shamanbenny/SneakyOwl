"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { motion } from "motion/react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { SparklesCore } from "@/app/components/shared/ui/sparkles";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  style?: React.CSSProperties;
  firstImageClassName?: string;
  secondImageClassname?: string;
  firstImageContainerStyle?: React.CSSProperties;
  secondImageContainerStyle?: React.CSSProperties;
  firstImageStyle?: React.CSSProperties;
  secondImageStyle?: React.CSSProperties;
  firstImageWidth?: number;
  firstImageHeight?: number;
  secondImageWidth?: number;
  secondImageHeight?: number;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  style,
  firstImageClassName,
  secondImageClassname,
  firstImageContainerStyle,
  secondImageContainerStyle,
  firstImageStyle,
  secondImageStyle,
  firstImageWidth,
  firstImageHeight,
  secondImageWidth,
  secondImageHeight,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderAnimationSeconds, setSliderAnimationSeconds] = useState(0.16);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayDirectionRef = useRef(1);

  const getPercentFromClientX = useCallback((clientX: number) => {
    if (!sliderRef.current) {
      return null;
    }

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay) {
      return;
    }
    const animate = () => {
      const step = 1600 / autoplayDuration;

      setSliderAnimationSeconds(0.06);
      setSliderXPercent((currentPercent) => {
        let nextPercent =
          currentPercent + step * autoplayDirectionRef.current;

        if (nextPercent >= 100) {
          nextPercent = 100;
          autoplayDirectionRef.current = -1;
        } else if (nextPercent <= 0) {
          nextPercent = 0;
          autoplayDirectionRef.current = 1;
        }

        return nextPercent;
      });

      autoplayRef.current = setTimeout(animate, 16);
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (!autoplayRef.current) {
      return;
    }

    clearTimeout(autoplayRef.current);
    autoplayRef.current = null;
  }, []);

  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  const handleStart = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  }, [slideMode]);

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      const percent = getPercentFromClientX(clientX);

      if (percent === null) {
        return;
      }

      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        requestAnimationFrame(() => {
          setSliderAnimationSeconds(0.14);
          setSliderXPercent(percent);
        });
      }
    },
    [getPercentFromClientX, isDragging, slideMode]
  );

  const mouseEnterHandler = (e: React.MouseEvent) => {
    stopAutoplay();

    if (slideMode !== "hover") {
      return;
    }

    const percent = getPercentFromClientX(e.clientX);

    if (percent === null) {
      return;
    }

    setSliderAnimationSeconds(0.2);
    setSliderXPercent(percent);
  };

  const mouseLeaveHandler = () => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }

    setSliderAnimationSeconds(0.06);
    startAutoplay();
  };

  const handleMouseDown = useCallback(() => handleStart(), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchStart = useCallback(() => {
    if (!autoplay) {
      handleStart();
    }
  }, [autoplay, handleStart]);

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [autoplay, handleEnd]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [autoplay, handleMove]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("relative h-[400px] w-[400px] overflow-hidden", className)}
      style={{
        cursor: slideMode === "drag" ? "grab" : "col-resize",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <motion.div
        className="absolute top-0 z-40 h-full w-px bg-gradient-to-b from-transparent via-[color:var(--site-accent)] to-transparent"
        animate={{ left: `${sliderXPercent}%` }}
        transition={{ duration: sliderAnimationSeconds, ease: "easeOut" }}
      >
        <div className="absolute right-0 top-1/2 h-full w-36 -translate-y-1/2 bg-gradient-to-l from-[color:var(--site-accent-soft)] via-transparent to-transparent opacity-45 [mask-image:radial-gradient(100px_at_right,white,transparent)]" />
        <div className="absolute right-0 top-1/2 h-1/2 w-10 -translate-y-1/2 bg-gradient-to-l from-[color:var(--site-accent)] via-transparent to-transparent opacity-90 [mask-image:radial-gradient(50px_at_right,white,transparent)]" />
        <div className="absolute left-0 top-1/2 h-full w-36 -translate-y-1/2 bg-gradient-to-r from-[color:var(--site-accent-soft)] via-transparent to-transparent opacity-45 [mask-image:radial-gradient(100px_at_left,white,transparent)]" />
        <div className="absolute left-0 top-1/2 h-1/2 w-10 -translate-y-1/2 bg-gradient-to-r from-[color:var(--site-accent)] via-transparent to-transparent opacity-90 [mask-image:radial-gradient(50px_at_left,white,transparent)]" />
        <div className="absolute -left-10 top-1/2 h-3/4 w-10 -translate-y-1/2 [mask-image:radial-gradient(100px_at_right,white,transparent)]">
          <MemoizedSparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={28}
            className="h-full w-full"
            particleColor="var(--site-accent-soft)"
          />
        </div>
        <div className="absolute -right-10 top-1/2 h-3/4 w-10 -translate-y-1/2 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
          <MemoizedSparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={28}
            className="h-full w-full"
            particleColor="var(--site-accent-soft)"
          />
        </div>
        {showHandlebar ? (
          <div className="absolute -right-2.5 top-1/2 z-30 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md bg-[color:var(--site-accent)] shadow-[0_0_0_1px_var(--site-bg-elevated),0_10px_20px_var(--site-accent-glow-soft)]">
            <div className="flex gap-[2px]">
              <span className="h-3 w-[2px] rounded-full bg-[color:var(--site-selection-text)]" />
              <span className="h-3 w-[2px] rounded-full bg-[color:var(--site-selection-text)]" />
              <span className="h-3 w-[2px] rounded-full bg-[color:var(--site-selection-text)]" />
            </div>
          </div>
        ) : null}
      </motion.div>

      <div className="pointer-events-none relative z-20 h-full w-full overflow-hidden">
        {firstImage ? (
          <motion.div
            className={cn(
              "absolute inset-0 z-20 h-full w-full overflow-hidden rounded-2xl",
              firstImageClassName
            )}
            animate={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
            transition={{ duration: sliderAnimationSeconds, ease: "easeOut" }}
            style={firstImageContainerStyle}
          >
            {firstImageWidth && firstImageHeight ? (
              <Image
                alt="PeerPrep mockup"
                src={firstImage}
                width={firstImageWidth}
                height={firstImageHeight}
                sizes="(max-width: 768px) 100vw, 896px"
                className={cn(
                  "absolute select-none rounded-2xl",
                  firstImageClassName
                )}
                style={firstImageStyle}
                draggable={false}
              />
            ) : (
              <Image
                alt="PeerPrep mockup"
                src={firstImage}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className={cn(
                  "absolute inset-0 h-full w-full select-none rounded-2xl",
                  firstImageClassName
                )}
                style={firstImageStyle}
                draggable={false}
              />
            )}
          </motion.div>
        ) : null}
      </div>

      {secondImage ? (
        <motion.div
          className={cn(
            "absolute left-0 top-0 z-[19] h-full w-full select-none rounded-2xl",
            secondImageClassname
          )}
          style={secondImageContainerStyle}
        >
          {secondImageWidth && secondImageHeight ? (
            <Image
              alt="PeerPrep implemented UI"
              src={secondImage}
              width={secondImageWidth}
              height={secondImageHeight}
              sizes="(max-width: 768px) 100vw, 896px"
              className={cn(
                "absolute inset-0 h-full w-full select-none rounded-2xl",
                secondImageClassname
              )}
              style={secondImageStyle}
              draggable={false}
            />
          ) : (
            <Image
              alt="PeerPrep implemented UI"
              src={secondImage}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className={cn(
                "absolute inset-0 h-full w-full select-none rounded-2xl",
                secondImageClassname
              )}
              style={secondImageStyle}
              draggable={false}
            />
          )}
        </motion.div>
      ) : null}
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
