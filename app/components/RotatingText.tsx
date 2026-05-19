"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type RotatingTextProps = {
  texts: string[];
  rotationInterval?: number;
  className?: string;
};

const RotatingText = ({
  texts,
  rotationInterval = 3000,
  className = "",
}: RotatingTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % texts.length);
    }, rotationInterval);

    return () => window.clearInterval(timer);
  }, [texts, rotationInterval]);

  if (texts.length === 0) return null;

  return (
    <span
      className={`relative inline-flex overflow-hidden whitespace-nowrap text-[color:var(--site-accent)] ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 430 }}
          className="inline-block whitespace-nowrap [filter:drop-shadow(0_0_4px_rgba(16,185,129,0.45))]"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
