"use client";

import React from "react";

type MagicBentoCard = {
  id: string;
  content: React.ReactNode;
  size?: "small" | "large";
};

type MagicBentoProps = {
  cards: MagicBentoCard[];
  enableBorderGlow?: boolean;
  glowColor?: string;
};

const MagicBento = ({
  cards,
  enableBorderGlow = true,
  glowColor = "16, 185, 129",
}: MagicBentoProps) => {
  const gridClassName =
    "grid w-full gap-2 px-5 py-5 text-[clamp(1rem,0.9rem+0.5vw,1.5rem)] " +
    "xs:auto-rows-auto sm:auto-rows-[200px] md:auto-rows-[215px] " +
    "xl:auto-rows-[225px] xxl:auto-rows-[250px] xs:grid-cols-1 " +
    "sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4";

  const baseCardClassName =
    "magic-bento-card relative flex w-full max-w-full flex-col justify-between " +
    "overflow-hidden rounded-[20px] border-2 border-[color:var(--site-border)] " +
    "bg-[color:var(--site-bg-elevated)] p-[1rem] font-light " +
    "text-[color:var(--site-text-strong)] transition-all duration-300 " +
    "ease-in-out hover:-translate-y-[2px] " +
    "hover:border-[color:color-mix(in_srgb,var(--site-border-strong)_55%,var(--site-accent)_45%)] " +
    "hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] max-sm:min-h-[180px] sm:h-full sm:min-h-0";

  return (
    <div className={gridClassName}>
      {cards.map((card) => (
        <article
          key={card.id}
          className={[
            baseCardClassName,
            card.size === "small" ? "min-h-[170px] sm:min-h-0" : "",
            card.size === "large" ? "sm:col-span-2 sm:row-span-1" : "",
            enableBorderGlow ? "magic-bento-card--border-glow" : "",
          ].join(" ")}
          style={
            {
              "--glow-color": glowColor,
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": 0,
              "--glow-radius": "200px",
            } as React.CSSProperties
          }
        >
          {card.content}
        </article>
      ))}
    </div>
  );
};

export default MagicBento;
