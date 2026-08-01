import type { ReactNode } from "react";
import {
  FaBan,
  FaCircleCheck,
  FaArrowUpRightFromSquare,
  FaQuoteLeft,
  FaQuoteRight,
  FaShieldHalved,
} from "react-icons/fa6";

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

export const RafflesGoTestimonial = () => (
  <>
    <div
    style={{
      margin: "1.5rem 0",
      padding: "1.4rem 1.35rem",
      borderLeft: "3px solid var(--site-accent-border-strong)",
      borderRadius: "0 16px 16px 0",
      background: "var(--site-bg-soft)",
    }}
  >
      <div style={{ display: "grid", gap: "1rem", padding: "0 1.1rem" }}>
      <p style={{ margin: 0 }}>
        <FaQuoteLeft
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.8rem",
            height: "0.8rem",
            marginRight: "0.35rem",
            transform: "translateY(-0.02rem)",
            color: "var(--site-text-muted)",
          }}
        />
        It was great to have Benny as part of CS3213! Academically, he was <em>one
        of the strongest students in the class</em>, excelling in both the exams and
        the group project.
      </p>
      <p style={{ margin: 0 }}>
        The group project aimed to support a citizen-science effort in
        collaboration with real stakeholders. Each student team met regularly
        with a tutor, so I did not interact closely with the individual teams
        during most of the semester. However, the tutor who worked with Benny
        described him as highly active and <em>someone who naturally established
        himself as a leader</em>. He led discussions, provided updates on the team&apos;s
        progress, and coordinated the agendas for their meetings. At the same
        time, he remained very hands-on and <em>made the most code contributions</em>
        within his team.
      </p>
      <p style={{ margin: 0 }}>
        It was thus not surprising that <strong>Benny&apos;s team was one of the three teams
        we shortlisted</strong> out of eleven, as their solution closely matched the
        needs of our collaborating stakeholder. After the course and project
        formally ended, I could also see Benny&apos;s competence and enthusiasm
        directly. He and a small group of other students voluntarily continued
        developing the project, with the aim of deploying it in practice.
      </p>
      <p style={{ margin: 0 }}>
        During a meeting that I attended with the project members, I saw what
        the tutor had described. Benny led the discussion, made sure that
        everyone had an opportunity to contribute, and moved the conversation
        towards an actionable outcome. Importantly, he <em>combines strong
        technical ability with distinct leadership and interpersonal skills</em>.
      </p>
      <p style={{ margin: 0 }}>
        Overall, I consider Benny an <em>excellent software engineer</em>. Based on what
        I observed, I expect that he will quickly take on significant technical
        and leadership responsibilities in any team he joins.
        <FaQuoteRight
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.8rem",
            height: "0.8rem",
            marginLeft: "0.35rem",
            transform: "translateY(-0.02rem)",
            color: "var(--site-text-muted)",
          }}
        />
      </p>
      <p
        style={{
          margin: "0.1rem 0 0",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--site-accent)",
        }}
      >
        <a
          href="https://www.manuelrigger.at/"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-border-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
        >
          Prof. Rigger
        </a>
        , 30 July 2026
        <span
          aria-hidden="true"
          className="mx-2 inline-block text-[0.7rem] text-[color:var(--site-text-faint)]"
        >
          •
        </span>
        <a
          href="/blog/raffles-go/Testimonial%20Letter%20for%20Benny.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[color:var(--site-accent)] transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
        >
          View Testimonial PDF
          <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
        </a>
      </p>
      </div>
    </div>
    <div
      style={{
        margin: "1.5rem 0",
        padding: "1.4rem 1.35rem",
        borderLeft: "3px solid var(--site-accent-border-strong)",
        borderRadius: "0 16px 16px 0",
        background: "var(--site-bg-soft)",
      }}
    >
      <div style={{ display: "grid", gap: "1rem", padding: "0 1.1rem" }}>
      <p style={{ margin: 0 }}>
        <FaQuoteLeft
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.8rem",
            height: "0.8rem",
            marginRight: "0.35rem",
            transform: "translateY(-0.02rem)",
            color: "var(--site-text-muted)",
          }}
        />
        What began as a project assignment for NUS CS3213 evolved into a solution with genuine potential for real-world deployment. The group demonstrated a strong commitment to understanding and addressing the pain points faced by both volunteers and organizers within the Raffles&apos; Banded Langur Working Group (RBLWG) Citizen Science Programme.
      </p>
      <p style={{ margin: 0 }}>
        Throughout the project, the group successfully fulfilled the key requirements and expectations that I briefly communicated at the start of the project. Additionally, suggestions raised during the demonstration sessions were implemented promptly, reflecting their technical competence and dedication to delivering a high-quality solution.
      </p>
      <p style={{ margin: 0 }}>
        <em>Under the leadership of Lee Jia Quan</em>, the team worked cohesively and efficiently while maintaining a strong focus on stakeholder needs. Their ability to balance technical execution with client requirements resulted in a product that was thoughtfully designed to serve its intended users.
      </p>
      <p style={{ margin: 0 }}>
        I am pleased to commend the team&apos;s professionalism, adaptability, and collaborative spirit. Their efforts exemplify the qualities of an effective software development team and showcase the practical impact that student-led projects can achieve when guided by a clear understanding of user needs.
        <FaQuoteRight
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.8rem",
            height: "0.8rem",
            marginLeft: "0.35rem",
            transform: "translateY(-0.02rem)",
            color: "var(--site-text-muted)",
          }}
        />
      </p>
      <p
        style={{
          margin: "0.1rem 0 0",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--site-accent)",
        }}
      >
        <a
          href="https://www.dbs.nus.edu.sg/dr-andie-ang-2/"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-border-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
        >
          Dr. Andie
        </a>
        , 14 June 2026
        <span
          aria-hidden="true"
          className="mx-2 inline-block text-[0.7rem] text-[color:var(--site-text-faint)]"
        >
          •
        </span>
        <a
          href="/blog/raffles-go/Testimonial%20Letter%20for%20RafflesGo.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[color:var(--site-accent)] transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
        >
          View Testimonial PDF
          <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
        </a>
      </p>
      </div>
    </div>
  </>
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
