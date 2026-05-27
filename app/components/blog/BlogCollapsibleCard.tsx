"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa6";

type BlogCollapsibleCardProps = {
  bodyStyle?: CSSProperties;
  children: ReactNode;
  containerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  defaultOpen?: boolean;
  header: ReactNode;
  headerStyle?: CSSProperties;
  toggleIcon?: ReactNode;
  toggleStyle?: CSSProperties;
};

export default function BlogCollapsibleCard({
  bodyStyle,
  children,
  containerStyle,
  contentStyle,
  defaultOpen = false,
  header,
  headerStyle,
  toggleIcon,
  toggleStyle,
}: BlogCollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section
      style={{
        margin: "2.5rem 0",
        overflow: "hidden",
        ...containerStyle,
      }}
    >
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          border: 0,
          textAlign: "left",
          cursor: "pointer",
          ...headerStyle,
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 auto" }}>{header}</div>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 220ms ease, background-color 160ms ease, border-color 160ms ease",
            ...toggleStyle,
          }}
        >
          {toggleIcon ?? <FaChevronDown style={{ width: "1rem", height: "1rem" }} />}
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 320ms ease",
          ...contentStyle,
        }}
      >
        <div id={contentId} style={{ overflow: "hidden" }}>
          <div
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 220ms ease, transform 260ms ease",
              ...bodyStyle,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
