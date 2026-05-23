"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

const MIN_REPETITIONS = 4;

const getSafeRepetitionCount = (count: number) => {
  if (!Number.isFinite(count)) {
    return MIN_REPETITIONS;
  }

  return Math.max(MIN_REPETITIONS, Math.ceil(count));
};

export interface FlowingMenuItemData {
  image: string;
  link?: string;
  text: string;
}

interface FlowingMenuProps<T extends FlowingMenuItemData> {
  bgColor?: string;
  borderColor?: string;
  items?: T[];
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  onItemHover?: (index: number) => void;
  onItemLeave?: (index: number) => void;
  renderItemContent?: (item: T, index: number) => ReactNode;
  speed?: number;
  textColor?: string;
}

interface MenuItemProps<T extends FlowingMenuItemData> {
  borderColor: string;
  index: number;
  item: T;
  isFirst: boolean;
  marqueeBgColor: string;
  marqueeTextColor: string;
  onItemHover?: (index: number) => void;
  onItemLeave?: (index: number) => void;
  renderItemContent?: (item: T, index: number) => ReactNode;
  speed: number;
  textColor: string;
}

const FlowingMenu = <T extends FlowingMenuItemData>({
  items = [],
  speed = 15,
  textColor = "var(--site-text-strong)",
  bgColor = "var(--site-bg-elevated)",
  marqueeBgColor = "var(--site-accent)",
  marqueeTextColor = "var(--site-selection-text)",
  borderColor = "var(--site-border)",
  renderItemContent,
  onItemHover,
  onItemLeave,
}: FlowingMenuProps<T>) => {
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const menuWrap = menuWrapRef.current;
    if (!menuWrap) {
      return;
    }

    const updateScrollability = () => {
      setIsScrollable(menuWrap.scrollHeight > menuWrap.clientHeight + 1);
    };

    updateScrollability();

    const resizeObserver = new ResizeObserver(updateScrollability);
    resizeObserver.observe(menuWrap);

    Array.from(menuWrap.children).forEach((child) => {
      resizeObserver.observe(child);
    });

    window.addEventListener("resize", updateScrollability);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollability);
    };
  }, [items]);

  return (
    <div
      ref={menuWrapRef}
      className={`flowing-menu ${
        isScrollable ? "flowing-menu--scrollable" : ""
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <nav className="flowing-menu__items">
        {items.map((item, idx) => (
          <MenuItem<T>
            key={`${item.text}-${idx}`}
            borderColor={borderColor}
            index={idx}
            item={item}
            isFirst={idx === 0}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            onItemHover={onItemHover}
            onItemLeave={onItemLeave}
            renderItemContent={renderItemContent}
            speed={speed}
            textColor={textColor}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem = <T extends FlowingMenuItemData>({
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
  index,
  renderItemContent,
  onItemHover,
  onItemLeave,
}: MenuItemProps<T>) => {
  const { image, link, text } = item;
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults: gsap.TweenVars = { duration: 0.6, ease: "expo" };

  const distMetric = (x: number, y: number, x2: number, y2: number): number => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
  ): "top" | "bottom" => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".flowing-menu__marquee-part",
      ) as HTMLElement | null;

      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth <= 0) {
        setRepetitions(MIN_REPETITIONS);
        return;
      }

      const viewportWidth = window.innerWidth;
      const needed = viewportWidth / contentWidth + 2;
      setRepetitions(getSafeRepetitionCount(needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".flowing-menu__marquee-part",
      ) as HTMLElement | null;

      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        duration: speed,
        ease: "none",
        repeat: -1,
        x: -contentWidth,
      });
    };

    const timer = window.setTimeout(setupMarquee, 50);

    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);

    onItemHover?.(index);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);

    onItemLeave?.(index);
  };

  return (
    <div
      ref={itemRef}
      className={`flowing-menu__item ${isFirst ? "flowing-menu__item--first" : ""}`}
      style={{ borderColor }}
    >
      <a
        className="flowing-menu__item-link"
        href={link ?? "#projects"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => onItemHover?.(index)}
        onBlur={() => onItemLeave?.(index)}
        style={{ color: textColor }}
      >
        {renderItemContent?.(item, index) ?? text}
      </a>
      <div
        ref={marqueeRef}
        className="flowing-menu__marquee"
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flowing-menu__marquee-inner-wrap">
          <div
            ref={marqueeInnerRef}
            className="flowing-menu__marquee-inner"
            aria-hidden="true"
          >
            {Array.from(
              { length: getSafeRepetitionCount(repetitions) },
              (_, idx) => (
                <div
                  key={`${text}-marquee-${idx}`}
                  className="flowing-menu__marquee-part"
                  style={{ color: marqueeTextColor }}
                >
                  <span className="flowing-menu__marquee-label">{text}</span>
                  <div
                    className="flowing-menu__marquee-image"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
