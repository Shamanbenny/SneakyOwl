import type { ReactNode } from "react";

import BlogCollapsibleCard from "@/app/components/blog/BlogCollapsibleCard";

export const DesignDivider = ({
  eyebrow,
  title,
  children,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) => (
  <BlogCollapsibleCard
    containerStyle={{
      border: "1px solid rgba(232, 185, 149, 0.28)",
      borderRadius: "18px",
      background: "linear-gradient(135deg, rgba(45, 41, 66, 0.96), rgba(58, 53, 82, 0.92))",
      boxShadow: "0 18px 48px rgba(0, 0, 0, 0.24)",
    }}
    headerStyle={{
      padding: "1.25rem",
      background: "rgba(20, 18, 32, 0.26)",
    }}
    header={
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <span
          style={{
            color: "#E8B995",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <strong style={{ color: "#FFFFFF", fontSize: "1.2rem", lineHeight: 1.3 }}>{title}</strong>
      </div>
    }
    toggleStyle={{
      width: "2.85rem",
      height: "2.85rem",
      borderRadius: "999px",
      border: "1px solid rgba(232, 185, 149, 0.36)",
      background: "rgba(232, 185, 149, 0.12)",
      color: "#E8B995",
    }}
    bodyStyle={{
      padding: "1.25rem",
      borderTop: "1px solid rgba(232, 185, 149, 0.2)",
    }}
  >
    {children}
  </BlogCollapsibleCard>
);

export const SpecGrid = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "grid",
      gap: "0.85rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    }}
  >
    {children}
  </div>
);

export const SpecTile = ({
  label,
  value,
  note,
}: {
  label: string;
  note: string;
  value: string;
}) => (
  <div
    style={{
      minHeight: "9rem",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "14px",
      padding: "1rem",
      background: "rgba(255, 255, 255, 0.05)",
    }}
  >
    <div style={{ color: "#E8B995", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ color: "#FFFFFF", marginTop: "0.6rem", fontWeight: 800 }}>{value}</div>
    <div style={{ color: "rgba(255, 255, 255, 0.72)", marginTop: "0.55rem" }}>{note}</div>
  </div>
);

export const ShowcaseRow = ({
  title,
  children,
}: {
  children: ReactNode;
  title: string;
}) => (
  <div style={{ display: "grid", gap: "0.9rem" }}>
    <div
      style={{
        color: "#E8B995",
        fontSize: "0.78rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

export const Swatch = ({ name, hex }: { hex: string; name: string }) => (
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "14px",
      overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
    }}
  >
    <div style={{ height: "4.5rem", background: hex }} />
    <div style={{ padding: "0.8rem 0.9rem" }}>
      <div style={{ color: "#FFFFFF", fontWeight: 800 }}>{name}</div>
      <div style={{ color: "#FFFFFF", fontSize: "0.92rem", marginTop: "0.2rem" }}>{hex}</div>
    </div>
  </div>
);

export const DesignSpecStyles = () => (
  <style>{`
    .peerprep-input-demo {
      display: grid;
      gap: 0.7rem;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      padding: 1rem;
      background: rgba(255,255,255,0.05);
    }

    .peerprep-input-shell {
      background: #3A3552;
      border-radius: 999px;
      box-shadow: inset 0 0 0 0 rgba(232,185,149,0.9);
      transition: box-shadow 140ms ease;
    }

    .peerprep-input-shell:focus-within {
      box-shadow: inset 0 0 0 2px rgba(232,185,149,0.9);
    }

    .peerprep-input {
      width: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: #FFFFFF;
      padding: 0.85rem 1.05rem;
      font: inherit;
    }

    .peerprep-input::placeholder {
      color: #9CA3AF;
    }

    .peerprep-button-dark {
      color: #FFFFFF !important;
    }

    .peerprep-button-dark * {
      color: #FFFFFF !important;
    }

    .peerprep-button-peach {
      color: #4A4563 !important;
    }

    .peerprep-button-peach * {
      color: #4A4563 !important;
    }

    .peerprep-peach-copy {
      color: #374151 !important;
    }

    .peerprep-peach-copy * {
      color: #374151 !important;
    }

    .peerprep-compare-frame {
      margin: 1.25rem 0 0;
      border: 1px solid rgba(74, 69, 99, 0.14);
      border-radius: 24px;
      padding: 1rem;
      background: var(--site-bg-elevated);
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
    }

    .peerprep-compare-stage {
      --peerprep-compare-scale: 1.055;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      height: calc(779px * var(--peerprep-compare-scale));
      overflow: hidden;
    }

    .peerprep-compare-scaler {
      flex: 0 0 auto;
      width: 960px;
      height: 779px;
      transform-origin: top center;
      transform: scale(var(--peerprep-compare-scale));
    }

    @media (max-width: 1535px) {
      .peerprep-compare-stage {
        --peerprep-compare-scale: 0.74;
      }
    }

    @media (max-width: 1279px) {
      .peerprep-compare-stage {
        --peerprep-compare-scale: 0.47;
      }
    }

    @media (max-width: 1023px) {
      .peerprep-compare-stage {
        --peerprep-compare-scale: 0.56;
      }
    }

    @media (max-width: 767px) {
      .peerprep-compare-stage {
        --peerprep-compare-scale: 0.34;
      }
    }
  `}</style>
);
