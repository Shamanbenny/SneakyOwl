"use client";

import { SparklesCore } from "@/app/components/shared/display/Sparkles";

const BiteTrailSparklesTitle = () => {
  return (
    <header className="relative flex w-full flex-col items-center justify-center py-4">
      <h1 className="relative z-20 text-center text-[3.2rem] font-black leading-none text-[color:var(--site-text-strong)] drop-shadow-[0_0_18px_var(--site-accent-glow-soft)] sm:text-[5rem] lg:text-[6.4rem]">
        Bite Trail
      </h1>
      <div className="relative h-24 w-full max-w-[42rem] overflow-hidden sm:h-32">
        <div className="absolute left-1/2 top-0 h-[2px] w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent)] to-transparent blur-sm" />
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent-soft)] to-transparent" />
        <div className="absolute left-1/2 top-0 h-[5px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent-teal)] to-transparent blur-sm" />
        <div className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--site-accent-teal)] to-transparent" />

        <SparklesCore
          background="transparent"
          minSize={0.35}
          maxSize={1}
          particleDensity={700}
          className="h-full w-full"
          particleColor="#6ee7b7"
          speed={3}
        />
      </div>
    </header>
  );
};

export default BiteTrailSparklesTitle;
