"use client";

import Link from "next/link";
import { FaHistory } from "react-icons/fa";
import { FaArrowLeft, FaArrowUp, FaBookOpen, FaGithub, FaHeart, FaLinkedin } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { SiDocker, SiFastify, SiFirebase, SiReact, SiTypescript } from "react-icons/si";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";

import styles from "./design-component.module.css";

const colorTokens = [
  { label: "Page", swatchClass: styles.swatchColorPage, token: "--site-bg" },
  { label: "Chrome", swatchClass: styles.swatchColorChrome, token: "--site-bg-chrome" },
  { label: "Chrome Layer", swatchClass: styles.swatchColorChromeLayer, token: "--site-bg-chrome-layer" },
  { label: "Panel", swatchClass: styles.swatchColorPanel, token: "--site-bg-elevated" },
  { label: "Strong Surface", swatchClass: styles.swatchColorStrongSurface, token: "--site-bg-strong" },
  { label: "Soft Surface", swatchClass: styles.swatchColorSoftSurface, token: "--site-bg-soft" },
  { label: "Text", swatchClass: styles.swatchColorText, token: "--site-text" },
  { label: "Text Strong", swatchClass: styles.swatchColorTextStrong, token: "--site-text-strong" },
  { label: "Text Muted", swatchClass: styles.swatchColorTextMuted, token: "--site-text-muted" },
  { label: "Text Faint", swatchClass: styles.swatchColorTextFaint, token: "--site-text-faint" },
  { label: "Border", swatchClass: styles.swatchColorBorder, token: "--site-border" },
  { label: "Border Strong", swatchClass: styles.swatchColorBorderStrong, token: "--site-border-strong" },
  { label: "Overlay Border", swatchClass: styles.swatchColorOverlayBorder, token: "--site-border-overlay-light" },
  { label: "Divider", swatchClass: styles.swatchColorDivider, token: "--site-divider" },
  { label: "Accent", swatchClass: styles.swatchColorAccent, token: "--site-accent" },
  { label: "Accent Strong", swatchClass: styles.swatchColorAccentStrong, token: "--site-accent-strong" },
  { label: "Accent Soft", swatchClass: styles.swatchColorAccentSoft, token: "--site-accent-soft" },
  { label: "Accent Teal", swatchClass: styles.swatchColorAccentTeal, token: "--site-accent-teal" },
  { label: "Accent Cyan", swatchClass: styles.swatchColorAccentCyan, token: "--site-accent-cyan" },
  { label: "Accent Border Soft", swatchClass: styles.swatchColorAccentBorderSoft, token: "--site-accent-border-soft" },
  { label: "Accent Border Strong", swatchClass: styles.swatchColorAccentBorderStrong, token: "--site-accent-border-strong" },
  { label: "Accent Border Subtle", swatchClass: styles.swatchColorAccentBorderSubtle, token: "--site-accent-border-subtle" },
  { label: "Accent Border Hover", swatchClass: styles.swatchColorAccentBorderHover, token: "--site-accent-border-soft-hover" },
  { label: "Focus Ring", swatchClass: styles.swatchColorFocusRing, token: "--site-accent-focus-ring" },
  { label: "Accent Highlight", swatchClass: styles.swatchColorAccentHighlight, token: "--site-accent-highlight" },
  { label: "Accent Glow Soft", swatchClass: styles.swatchColorAccentGlowSoft, token: "--site-accent-glow-soft" },
  { label: "Accent Glow Faint", swatchClass: styles.swatchColorAccentGlowFaint, token: "--site-accent-glow-faint" },
  { label: "Selection BG", swatchClass: styles.swatchColorSelectionBg, token: "--site-selection-bg" },
  { label: "Selection Text", swatchClass: styles.swatchColorSelectionText, token: "--site-selection-text" },
];

const specs = [
  ["Container widths", "<640: 300px, <320: 230px, sm: 560px, md: 680px, lg: 910px, xl: 1160px, xxl: 1480px"],
  ["Core surface radius", "8px for reference panels; route cards may use local established radii"],
  ["Button schemes", "Emerald action and dark chrome/navigation"],
  ["Project tags", "Circular icon tags for FlowingMenu previews; text/icon pills for card metadata"],
  ["Tooltip behavior", "Use InfoTooltip for explanatory hover/focus/click details and custom badge triggers"],
  ["Letter spacing", "0.12em for CTA controls, 0.14em for filter chips, 0.16em for labels"],
  ["Transition timing", "150ms for color, border, background, and small lift states"],
];

export default function DesignComponentPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Design Reference</p>
          <h1 className={styles.title}>SneakyOwl component styling</h1>
          <p className={styles.summary}>
            A compact internal page for matching route-level UI to the landing page decisions:
            dark-only surfaces, restrained chrome, emerald action states, and timeline-style filters.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="button-schemes">
          <h2 id="button-schemes" className={styles.sectionTitle}>
            Button Color Schemes
          </h2>
          <p className={styles.sectionIntro}>
            Keep the site to two button color schemes. Use emerald for committed actions and
            active states. Use dark chrome for navigation, utility controls, and idle filters.
          </p>

          <div className={styles.grid}>
            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Emerald Action</h3>
                <span className={styles.meta}>CTA / active</span>
              </div>
              <div className={styles.buttonRow}>
                <span className={styles.stateLabel}>Default</span>
                <a className={`${styles.button} ${styles.buttonPrimary}`} href="/Lee%20Jia%20Quan_CV.pdf">
                  <FiFileText aria-hidden="true" />
                  Resume
                </a>
                <a className={`${styles.button} ${styles.buttonPrimary}`} href="#top">
                  <FaArrowUp aria-hidden="true" />
                  Scroll to top
                </a>
                <a className={`${styles.button} ${styles.buttonSecondary}`} href="https://github.com/Shamanbenny">
                  <FaGithub aria-hidden="true" />
                  GitHub
                </a>
                <a className={`${styles.button} ${styles.buttonSecondary}`} href="https://www.linkedin.com/in/lee-jia-quan/">
                  <FaLinkedin aria-hidden="true" />
                  LinkedIn
                </a>
                <span className={styles.stateLabel}>Hover reference</span>
                <button
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonPrimaryHover}`}
                  type="button"
                >
                  <FiFileText aria-hidden="true" />
                  Resume
                </button>
                <button
                  className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSecondaryHover}`}
                  type="button"
                >
                  <FaGithub aria-hidden="true" />
                  GitHub
                </button>
              </div>
            </article>

            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Chrome Navigation</h3>
                <span className={styles.meta}>Nav / utility</span>
              </div>
              <div className={styles.buttonRow}>
                <span className={styles.stateLabel}>Default</span>
                <Link className={`${styles.button} ${styles.buttonChrome}`} href="/blog">
                  <FaArrowLeft aria-hidden="true" />
                  Back to blog
                </Link>
                <button className={`${styles.button} ${styles.buttonChrome}`} type="button">
                  <FaBookOpen aria-hidden="true" />
                  Blog
                </button>
                <span className={styles.stateLabel}>Hover reference</span>
                <button
                  className={`${styles.button} ${styles.buttonChrome} ${styles.buttonChromeHover}`}
                  type="button"
                >
                  <FaArrowLeft aria-hidden="true" />
                  Back to blog
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="form-inputs">
          <h2 id="form-inputs" className={styles.sectionTitle}>
            Form Inputs
          </h2>
          <p className={styles.sectionIntro}>
            Search and text inputs use the shared dark soft surface with strong borders. Focus
            states should remove browser blue outlines and use the emerald accent border and ring.
          </p>
          <div className={styles.grid}>
            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Search Input</h3>
                <span className={styles.meta}>Default</span>
              </div>
              <div className={styles.inputStack}>
                <label className={styles.inputLabel} htmlFor="design-search-default">
                  Search
                </label>
                <input
                  id="design-search-default"
                  className={styles.input}
                  type="search"
                  placeholder="Search title, summary, or tags"
                />
              </div>
            </article>

            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Search Input</h3>
                <span className={styles.meta}>Focused</span>
              </div>
              <div className={styles.inputStack}>
                <label className={styles.inputLabel} htmlFor="design-search-focus">
                  Search
                </label>
                <input
                  id="design-search-focus"
                  className={`${styles.input} ${styles.inputFocusReference}`}
                  type="search"
                  value="system design"
                  readOnly
                />
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="filter-buttons">
          <h2 id="filter-buttons" className={styles.sectionTitle}>
            Filter Buttons
          </h2>
          <p className={styles.sectionIntro}>
            Filters inherit the timeline chip structure: pill radius, uppercase label, muted idle
            text, dark surface, and emerald strong background for the selected item.
          </p>
          <div className={styles.chipRow}>
            <span className={styles.stateLabel}>Default and active</span>
            <button className={`${styles.chip} ${styles.chipActive}`} type="button">
              All
            </button>
            <button className={styles.chip} type="button">
              Work
            </button>
            <button className={styles.chip} type="button">
              Education
            </button>
            <button className={styles.chip} type="button">
              Project
            </button>
            <span className={styles.stateLabel}>Hover reference</span>
            <button className={`${styles.chip} ${styles.chipHover}`} type="button">
              Work
            </button>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="blog-feedback">
          <h2 id="blog-feedback" className={styles.sectionTitle}>
            Blog Feedback
          </h2>
          <p className={styles.sectionIntro}>
            Blog posts use the same restrained chrome button with an emerald active state, paired
            with a compact metric pill for likes and lightweight post stats.
          </p>
          <div className={styles.grid}>
            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Like Control</h3>
                <span className={styles.meta}>Default / active</span>
              </div>
              <div className={styles.buttonRow}>
                <span className={styles.metricPill}>
                  <FaHeart aria-hidden="true" />
                  237
                </span>
                <button className={`${styles.button} ${styles.buttonPrimary}`} type="button">
                  <FaHeart aria-hidden="true" />
                  Like post
                </button>
                <button
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonPrimaryHover}`}
                  type="button"
                >
                  <FaHeart aria-hidden="true" />
                  Liked
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tagging-badges">
          <h2 id="tagging-badges" className={styles.sectionTitle}>
            Tagging And Badges
          </h2>
          <p className={styles.sectionIntro}>
            Project sections use two tagging treatments. FlowingMenu previews use compact circular
            logo tags and an overflow count. Project cards use text-based tags with a leading icon.
            Keep metadata badges separate from tags.
          </p>

          <div className={styles.grid}>
            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Flowing Menu Tags</h3>
                <span className={styles.meta}>Logo-only</span>
              </div>
              <div className={styles.tagPreviewPanel}>
                <p className={styles.previewEyebrow}>Full-Stack Project</p>
                <h4 className={styles.previewTitle}>Peer Prep</h4>
                <div className={styles.tagRow}>
                  <span className={styles.stateLabel}>Idle</span>
                  <span className={styles.logoTag} aria-label="React" title="React">
                    <SiReact aria-hidden="true" />
                  </span>
                  <span className={styles.logoTag} aria-label="Docker" title="Docker">
                    <SiDocker aria-hidden="true" />
                  </span>
                  <span className={styles.logoTagOverflow} aria-label="4 more technologies" title="AWS, Terraform, Redis, Firebase">
                    +4
                  </span>
                  <span className={styles.stateLabel}>Active / hovered row</span>
                  <span className={`${styles.logoTag} ${styles.logoTagActive}`} aria-label="React" title="React">
                    <SiReact aria-hidden="true" />
                  </span>
                  <span className={`${styles.logoTag} ${styles.logoTagActive}`} aria-label="Docker" title="Docker">
                    <SiDocker aria-hidden="true" />
                  </span>
                  <span
                    className={`${styles.logoTagOverflow} ${styles.logoTagActive}`}
                    aria-label="4 more technologies"
                    title="AWS, Terraform, Redis, Firebase"
                  >
                    +4
                  </span>
                </div>
              </div>
            </article>

            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Card Tags And Badges</h3>
                <span className={styles.meta}>Text metadata</span>
              </div>
              <div className={styles.tagPreviewPanel}>
                <span className={styles.badge}>Microservices Architecture</span>
                <div className={styles.tagRow}>
                  <span className={styles.stateLabel}>Project card tags</span>
                  <span className={styles.textTag}>
                    <SiReact aria-hidden="true" />
                    React
                  </span>
                  <span className={styles.textTag}>
                    <SiTypescript aria-hidden="true" />
                    TypeScript
                  </span>
                  <span className={styles.textTag}>
                    <SiFastify aria-hidden="true" />
                    Fastify
                  </span>
                  <span className={styles.textTag}>
                    <SiFirebase aria-hidden="true" />
                    Firebase
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="info-tooltips">
          <h2 id="info-tooltips" className={styles.sectionTitle}>
            Info Tooltips
          </h2>
          <p className={styles.sectionIntro}>
            Use the shared InfoTooltip for compact explanatory detail that should be available by
            hover, focus, and click. Prefer custom triggers when the tooltip explains a visible
            badge or metadata label.
          </p>

          <div className={styles.grid}>
            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Icon Trigger</h3>
                <span className={styles.meta}>Default</span>
              </div>
              <div className={styles.tooltipSample}>
                <span className={styles.tooltipSampleLabel}>Project architecture</span>
                <InfoTooltip
                  ariaLabel="Project architecture details"
                  panelClassName={styles.tooltipPanel}
                  preferredPlacement="top"
                >
                  Use this for short supporting context that clarifies a label without expanding
                  the surrounding card or changing the layout.
                </InfoTooltip>
              </div>
            </article>

            <article className={styles.surface}>
              <div className={styles.surfaceHeader}>
                <h3 className={styles.label}>Badge Trigger</h3>
                <span className={styles.meta}>Project cards</span>
              </div>
              <div className={styles.tooltipSample}>
                <InfoTooltip
                  ariaLabel="Microservices architecture details"
                  className={styles.tooltipBadgeTrigger}
                  panelClassName={styles.tooltipPanel}
                  preferredPlacement="left"
                  trigger={<button type="button">Microservices Architecture</button>}
                >
                  Gateway-centered services split user, matching, collaboration, history, and AI
                  responsibilities while sharing infrastructure through Redis and Docker Compose.
                </InfoTooltip>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="navigation-chrome">
          <h2 id="navigation-chrome" className={styles.sectionTitle}>
            Navigation Chrome
          </h2>
          <p className={styles.sectionIntro}>
            Dock-inspired navigation uses the chrome shell, page-dark item surface, soft borders,
            and emerald icon/text only for hover or active states.
          </p>
          <div className={styles.buttonRow}>
            <div className={styles.dockSample} aria-label="Dock color sample" role="group">
              <span className={styles.dockItem}>
                <FaBookOpen aria-hidden="true" />
              </span>
              <span className={`${styles.dockItem} ${styles.dockItemActive}`}>
                <FaHistory aria-hidden="true" />
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="color-tokens">
          <h2 id="color-tokens" className={styles.sectionTitle}>
            Color Tokens
          </h2>
          <div className={styles.swatchGrid}>
            {colorTokens.map((token) => (
              <div key={token.token} className={styles.swatch}>
                <div className={`${styles.swatchColor} ${token.swatchClass}`} />
                <p className={styles.swatchLabel}>{token.label}</p>
                <p className={styles.swatchToken}>{token.token}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="layout-type">
          <h2 id="layout-type" className={styles.sectionTitle}>
            Layout And Type
          </h2>
          <dl className={styles.specList}>
            {specs.map(([label, value]) => (
              <div key={label} className={styles.spec}>
                <dt>{label}</dt>
                <dd>
                  <code>{value}</code>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
