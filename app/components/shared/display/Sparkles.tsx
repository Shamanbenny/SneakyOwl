"use client";

import React, { useId, useMemo } from "react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "motion/react";

import { cn } from "@/lib/utils";

type SparklesCoreProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
  speed?: number;
};

const initialiseParticles = async (engine: Parameters<typeof loadSlim>[0]) => {
  await loadSlim(engine);
};

const SparklesParticles = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#ffffff",
  particleDensity = 120,
  speed = 4,
}: SparklesCoreProps) => {
  const controls = useAnimation();
  const generatedId = useId();

  const options = useMemo<ISourceOptions>(
    () => ({
      background: {
        color: {
          value: background,
        },
      },
      detectRetina: true,
      fpsLimit: 120,
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: false,
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
        },
      },
      particles: {
        color: {
          value: particleColor,
        },
        links: {
          enable: false,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: {
            min: 0.1,
            max: 1,
          },
          straight: false,
        },
        number: {
          density: {
            enable: true,
            height: 400,
            width: 400,
          },
          limit: {
            mode: "delete",
            value: 0,
          },
          value: particleDensity,
        },
        opacity: {
          animation: {
            enable: true,
            speed,
            startValue: "random",
            sync: false,
          },
          value: {
            min: 0.1,
            max: 1,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: minSize,
            max: maxSize,
          },
        },
      },
    }),
    [background, maxSize, minSize, particleColor, particleDensity, speed],
  );

  const particlesLoaded = async (container?: Container) => {
    if (!container) {
      return;
    }

    await controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  };

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      <Particles
        id={id || generatedId}
        className="h-full w-full"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </motion.div>
  );
};

export const SparklesCore = (props: SparklesCoreProps) => {
  return (
    <ParticlesProvider init={initialiseParticles}>
      <SparklesParticles {...props} />
    </ParticlesProvider>
  );
};
