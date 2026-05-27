"use client";

import React, { useMemo } from "react";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type ParticlesProps = {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = ({
  className,
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#ffffff",
  particleDensity = 24,
}: ParticlesProps) => {
  const particles = useMemo(
    () =>
      Array.from({ length: particleDensity }, (_, index) => {
        const seed = index + 1;

        return {
          id: `spark-${seed}`,
          size: minSize + ((seed * 37) % 100) / 100 * (maxSize - minSize),
          top: ((seed * 29) % 100),
          left: ((seed * 17) % 100),
          delay: (seed % 12) * 0.12,
          duration: 1.6 + (seed % 5) * 0.35,
          opacity: 0.35 + (seed % 6) * 0.08,
        };
      }),
    [maxSize, minSize, particleDensity]
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.size * 4}px`,
            height: `${particle.size * 4}px`,
            background: particleColor,
            boxShadow: `0 0 10px ${particleColor}`,
          }}
          animate={{
            opacity: [0, particle.opacity, 0],
            scale: [0.65, 1.05, 0.65],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
