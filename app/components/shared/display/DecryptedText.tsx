"use client";

import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "inViewHover" | "click";
  clickMode?: "once" | "toggle";
  hoverText?: string;
  isActive?: boolean;
}

const buildRevealOrder = (
  len: number,
  revealDirection: "start" | "end" | "center",
) => {
  const order: number[] = [];

  if (revealDirection === "start") {
    for (let i = 0; i < len; i += 1) {
      order.push(i);
    }
    return order;
  }

  if (revealDirection === "end") {
    for (let i = len - 1; i >= 0; i -= 1) {
      order.push(i);
    }
    return order;
  }

  const middle = Math.floor((len - 1) / 2);
  let left = middle;
  let right = middle + 1;

  while (left >= 0 || right < len) {
    if (left >= 0) {
      order.push(left);
      left -= 1;
    }
    if (right < len) {
      order.push(right);
      right += 1;
    }
  }

  return order;
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  hoverText,
  isActive,
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isClickActive, setIsClickActive] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTextRef = useRef(text);

  const activeText = hoverText ?? text;
  const isControlled = typeof isActive === "boolean";
  const targetText = isControlled
    ? isActive
      ? activeText
      : text
    : isClickActive
      ? activeText
      : text;

  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(`${text}${hoverText ?? ""}`.split(""))).filter(
        (char) => char !== " ",
      );
    }

    return characters.split("");
  }, [characters, hoverText, text, useOriginalCharsOnly]);

  const shuffleText = useCallback(
    (targetValue: string, currentRevealed: Set<number>) =>
      targetValue
        .split("")
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (currentRevealed.has(index)) {
            return targetValue[index];
          }
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(""),
    [availableChars],
  );

  const getRandomChar = useCallback(() => {
    if (availableChars.length === 0) {
      return "";
    }

    return availableChars[Math.floor(Math.random() * availableChars.length)];
  }, [availableChars]);

  const createEncryptedText = useCallback(
    (length: number) =>
      Array.from({ length }, () => getRandomChar()).join(""),
    [getRandomChar],
  );

  const resetAnimation = useCallback(
    (targetValue: string) => {
      clearInterval(intervalRef.current ?? undefined);
      setDisplayText(targetValue);
      setRevealedIndices(new Set());
      setIsAnimating(false);
      setIsDecrypted(true);
      currentTextRef.current = targetValue;
    },
    [],
  );

  const startAnimation = useCallback(
    (sourceValue: string, targetValue: string) => {
      clearInterval(intervalRef.current ?? undefined);
      setIsAnimating(true);
      setIsDecrypted(false);
      setRevealedIndices(new Set());

      if (!targetValue) {
        setDisplayText(targetValue);
        setIsAnimating(false);
        setIsDecrypted(true);
        return;
      }

      let currentLength = sourceValue.length;
      const targetLength = targetValue.length;
      let isResizePhase = currentLength !== targetLength;

      if (sequential) {
        const revealOrder = buildRevealOrder(targetValue.length, revealDirection);
        let pointer = 0;

        setDisplayText(createEncryptedText(currentLength));
        intervalRef.current = setInterval(() => {
          if (isResizePhase) {
            currentLength += targetLength > currentLength ? 1 : -1;
            setDisplayText(createEncryptedText(currentLength));

            if (currentLength === targetLength) {
              isResizePhase = false;
            }

            return;
          }

          pointer += 1;
          const nextRevealed = new Set(revealOrder.slice(0, pointer));
          setRevealedIndices(nextRevealed);
          setDisplayText(shuffleText(targetValue, nextRevealed));

          if (pointer >= revealOrder.length) {
            clearInterval(intervalRef.current ?? undefined);
            setDisplayText(targetValue);
            setIsAnimating(false);
            setIsDecrypted(true);
            currentTextRef.current = targetValue;
          }
        }, speed);

        return;
      }

      let iteration = 0;
      setDisplayText(createEncryptedText(currentLength));
      intervalRef.current = setInterval(() => {
        if (isResizePhase) {
          currentLength += targetLength > currentLength ? 1 : -1;
          setDisplayText(createEncryptedText(currentLength));

          if (currentLength === targetLength) {
            isResizePhase = false;
          }

          return;
        }

        iteration += 1;
        setDisplayText(shuffleText(targetValue, new Set()));

        if (iteration >= maxIterations) {
          clearInterval(intervalRef.current ?? undefined);
          setDisplayText(targetValue);
          setIsAnimating(false);
          setIsDecrypted(true);
          currentTextRef.current = targetValue;
        }
      }, speed);
    },
    [
      createEncryptedText,
      maxIterations,
      revealDirection,
      sequential,
      shuffleText,
      speed,
    ],
  );

  const handleMouseEnter = useCallback(() => {
    if (isControlled || animateOn !== "hover") {
      return;
    }
    startAnimation(currentTextRef.current, activeText);
  }, [activeText, animateOn, isControlled, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (isControlled || animateOn !== "hover") {
      return;
    }
    startAnimation(currentTextRef.current, text);
  }, [animateOn, isControlled, startAnimation, text]);

  const handleClick = useCallback(() => {
    if (isControlled || animateOn !== "click") {
      return;
    }

    if (clickMode === "once" && isClickActive) {
      return;
    }

    const nextActive = clickMode === "toggle" ? !isClickActive : true;
    setIsClickActive(nextActive);
    startAnimation(currentTextRef.current, nextActive ? activeText : text);
  }, [
    activeText,
    animateOn,
    clickMode,
    isClickActive,
    isControlled,
    startAnimation,
    text,
  ]);

  useEffect(() => {
    if (!isControlled) {
      resetAnimation(text);
    }
  }, [isControlled, resetAnimation, text]);

  useEffect(() => {
    if (isControlled) {
      if (currentTextRef.current === targetText) {
        resetAnimation(targetText);
        return;
      }

      startAnimation(currentTextRef.current, targetText);
    }
  }, [isControlled, resetAnimation, startAnimation, targetText]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation(currentTextRef.current, targetText);
            setHasAnimated(true);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [animateOn, hasAnimated, startAnimation, targetText]);

  useEffect(
    () => () => {
      clearInterval(intervalRef.current ?? undefined);
    },
    [],
  );

  return (
    <motion.span
      className={`decrypted-text ${parentClassName}`.trim()}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      <span className="decrypted-text__sr-only">{displayText}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (isDecrypted && !isAnimating);

          return (
            <span
              key={`${char}-${index}`}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
