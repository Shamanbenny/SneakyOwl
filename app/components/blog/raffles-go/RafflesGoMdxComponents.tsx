import type { ReactNode } from "react";
import { FaBan, FaCircleCheck, FaShieldHalved } from "react-icons/fa6";

import BlogCollapsibleCard from "@/app/components/blog/BlogCollapsibleCard";

export const RafflesGoDesignDivider = ({
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
      border: "1px solid rgba(74, 93, 71, 0.14)",
      borderRadius: "20px",
      background: "linear-gradient(180deg, #EEF3EE 0%, #E5ECE5 100%)",
      boxShadow: "0 18px 40px rgba(44, 44, 44, 0.08)",
    }}
    headerStyle={{
      padding: "1.25rem",
      background: "rgba(248, 248, 245, 0.88)",
    }}
    header={
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <span
          style={{
            color: "#4A5D47",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <strong style={{ color: "#2C2C2C", fontSize: "1.2rem", lineHeight: 1.3 }}>{title}</strong>
      </div>
    }
    toggleStyle={{
      width: "2.85rem",
      height: "2.85rem",
      borderRadius: "999px",
      border: "1px solid rgba(74, 93, 71, 0.16)",
      background: "#F8F8F5",
      color: "#4A5D47",
      boxShadow: "0 6px 18px rgba(44, 44, 44, 0.08)",
    }}
    bodyStyle={{
      padding: "1.25rem",
      borderTop: "1px solid rgba(74, 93, 71, 0.1)",
    }}
  >
    {children}
  </BlogCollapsibleCard>
);

export const RafflesGoSpecGrid = ({ children }: { children: ReactNode }) => (
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

export const RafflesGoSpecTile = ({
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
      border: "1px solid rgba(74, 93, 71, 0.12)",
      borderRadius: "16px",
      padding: "1rem",
      background: "#F8F8F5",
      boxShadow: "0 10px 24px rgba(44, 44, 44, 0.05)",
    }}
  >
    <div style={{ color: "#4A5D47", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ color: "#2C2C2C", marginTop: "0.6rem", fontWeight: 800 }}>{value}</div>
    <div style={{ color: "#2C2C2C", marginTop: "0.55rem" }}>{note}</div>
  </div>
);

export const RafflesGoShowcaseRow = ({
  title,
  children,
}: {
  children: ReactNode;
  title: string;
}) => (
  <div style={{ display: "grid", gap: "0.9rem" }}>
    <div
      style={{
        color: "#4A5D47",
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

export const RafflesGoSwatch = ({ name, hex }: { hex: string; name: string }) => (
  <div
    style={{
      border: "1px solid rgba(74, 93, 71, 0.12)",
      borderRadius: "16px",
      overflow: "hidden",
      background: "#F8F8F5",
      boxShadow: "0 10px 24px rgba(44, 44, 44, 0.05)",
    }}
  >
    <div style={{ height: "4.5rem", background: hex }} />
    <div style={{ padding: "0.8rem 0.9rem" }}>
      <div style={{ color: "#2C2C2C", fontWeight: 800 }}>{name}</div>
      <div style={{ color: "#2C2C2C", fontSize: "0.92rem", marginTop: "0.2rem" }}>{hex}</div>
    </div>
  </div>
);

export const RafflesGoRoleBadgeDemo = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.35rem 0.85rem",
        borderRadius: "999px",
        background: "#DBEAFE",
        color: "#1D4ED8",
        fontSize: "0.88rem",
        fontWeight: 600,
      }}
    >
      <FaShieldHalved style={{ width: "0.95rem", height: "0.95rem" }} />
      Admin
    </span>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.35rem 0.85rem",
        borderRadius: "999px",
        background: "#DCFCE7",
        color: "#15803D",
        fontSize: "0.88rem",
        fontWeight: 600,
      }}
    >
      <FaCircleCheck style={{ width: "0.95rem", height: "0.95rem" }} />
      Activated
    </span>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.35rem 0.85rem",
        borderRadius: "999px",
        background: "#FEE2E2",
        color: "#B91C1C",
        fontSize: "0.88rem",
        fontWeight: 600,
      }}
    >
      <FaBan style={{ width: "0.95rem", height: "0.95rem" }} />
      Deactivated
    </span>
  </div>
);

export const RafflesGoDesignSpecStyles = () => (
  <style>{`
    .rafflesgo-copy {
      color: #2C2C2C !important;
    }

    .rafflesgo-copy * {
      color: #2C2C2C !important;
    }

    .rafflesgo-copy-light {
      color: rgba(248, 248, 245, 0.92) !important;
    }

    .rafflesgo-copy-light * {
      color: rgba(248, 248, 245, 0.92) !important;
    }

    .rafflesgo-copy-amber {
      color: #78350F !important;
    }

    .rafflesgo-copy-amber * {
      color: #78350F !important;
    }

    .rafflesgo-label {
      color: #4A5D47 !important;
    }

    .rafflesgo-label * {
      color: #4A5D47 !important;
    }

    .rafflesgo-meta {
      color: #4A5D47 !important;
    }

    .rafflesgo-meta * {
      color: #4A5D47 !important;
    }

    .rafflesgo-spec-card {
      border: 1px solid rgba(74, 93, 71, 0.12);
      border-radius: 18px;
      padding: 1rem;
      background: #F8F8F5;
      box-shadow: 0 10px 24px rgba(44, 44, 44, 0.05);
    }

    .rafflesgo-spec-button {
      border: 0;
      border-radius: 999px;
      padding: 0.8rem 1.3rem;
      font-weight: 700;
      box-shadow: 0 8px 20px rgba(44, 44, 44, 0.08);
    }

    .rafflesgo-button-dark {
      color: #F8F8F5 !important;
    }

    .rafflesgo-button-dark * {
      color: #F8F8F5 !important;
    }

    .rafflesgo-button-light {
      color: #2C2C2C !important;
    }

    .rafflesgo-button-light * {
      color: #2C2C2C !important;
    }

    .rafflesgo-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.32rem 0.7rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      border: 1px solid rgba(74, 93, 71, 0.12);
      background: #F8F8F5;
      color: #2C2C2C;
    }

    .rafflesgo-input-demo {
      display: grid;
      gap: 0.7rem;
      border: 1px solid rgba(74, 93, 71, 0.12);
      border-radius: 18px;
      padding: 1rem;
      background: #F8F8F5;
      box-shadow: 0 10px 24px rgba(44, 44, 44, 0.05);
    }

    .rafflesgo-input-shell {
      background: #FFFFFF;
      border: 1px solid rgba(74, 93, 71, 0.16);
      border-radius: 14px;
      transition: box-shadow 140ms ease, border-color 140ms ease;
    }

    .rafflesgo-input-shell:focus-within {
      border-color: rgba(74, 93, 71, 0.5);
      box-shadow: 0 0 0 3px rgba(138, 175, 69, 0.12);
    }

    .rafflesgo-input {
      width: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: #2C2C2C;
      padding: 0.9rem 1rem;
      font: inherit;
    }

    .rafflesgo-input::placeholder {
      color: #6B7280;
    }

    .rafflesgo-compare-frame {
      margin: 1.25rem 0 0;
      border: 1px solid rgba(74, 93, 71, 0.12);
      border-radius: 24px;
      padding: 1rem;
      background: #EEF3EE;
      box-shadow: 0 18px 44px rgba(44, 44, 44, 0.08);
    }
  `}</style>
);
