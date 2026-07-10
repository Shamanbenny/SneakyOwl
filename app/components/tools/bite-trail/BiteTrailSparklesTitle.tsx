"use client";

import type { ReactNode } from "react";

import { SparklesCore } from "@/app/components/shared/display/Sparkles";

type BiteTrailSparklesTitleProps = {
  children: ReactNode;
};

const BiteTrailSparklesTitle = ({ children }: BiteTrailSparklesTitleProps) => {
  return (
    <header className="relative flex w-full flex-col items-center justify-center py-4">
      <h1 className="relative z-20 text-center text-[3.2rem] font-black leading-none text-[color:var(--site-accent)] drop-shadow-[0_0_18px_var(--site-accent-glow-soft)] sm:text-[5rem] lg:text-[6.4rem]">
        Bite Trail
      </h1>
      <div className="relative w-full overflow-hidden rounded-[34px] border border-[color:rgba(16,185,129,0.12)] bg-[color:rgba(16,185,129,0.018)] px-3 pb-3 pt-24 sm:px-5 sm:pb-5 sm:pt-32 lg:px-7 lg:pb-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.075),transparent_58%)]" />
        <div className="absolute left-1/2 top-0 h-[2px] w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent)] to-transparent blur-sm" />
        <div className="absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent)] to-transparent" />
        <div className="absolute left-1/2 top-0 h-[5px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent-teal)] to-transparent blur-sm" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent-teal)] to-transparent" />

        <SparklesCore
          background="transparent"
          minSize={0.35}
          maxSize={1}
          particleDensity={200}
          className="pointer-events-none absolute inset-0 h-full w-full"
          particleColor="#6ee7b7"
          speed={3}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[34px] shadow-[inset_0_0_34px_rgba(10,10,10,0.78)]" />
        <div className="relative z-10">{children}</div>
      </div>
    </header>
  );
};

export default BiteTrailSparklesTitle;
