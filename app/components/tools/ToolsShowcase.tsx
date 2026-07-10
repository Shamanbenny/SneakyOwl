"use client";

import Image from "next/image";
import { useState, type ReactElement, type ReactNode } from "react";
import { FaArrowUpRightFromSquare, FaMapLocationDot, FaReact } from "react-icons/fa6";
import { SiFirebase, SiFlask, SiLeaflet, SiTypescript } from "react-icons/si";

import FlowingMenu, {
  type FlowingMenuItemData,
} from "@/app/components/shared/display/FlowingMenu";
import CollapsibleCard from "@/app/components/shared/ui/CollapsibleCard";

type ToolTag = {
  icon: ReactElement;
  id: string;
  label: string;
};

type ToolItem = FlowingMenuItemData & {
  description: ReactNode;
  githubRepoUrl: string | null;
  infoUrl: string | null;
  previewImage: string;
  status: string;
  tags: ToolTag[];
  toolType: string;
};

const TOOLS_DESKTOP_HEIGHT_CLASS = "lg:min-h-[34rem] xl:h-[650px] xxl:h-[760px]";

const TOOLS: ToolItem[] = [
  {
    description:
      "A personal food-place map for saving meal spots, ratings, cost notes, comments, and eventually shared friend lists through QR or invite codes.",
    githubRepoUrl: null,
    image: "/blog/raffles-go/3.png",
    infoUrl: null,
    link: "/tools/bite-trail",
    previewImage: "/blog/raffles-go/3.png",
    status: "Auth setup in progress",
    tags: [
      {
        icon: <FaReact className="h-4 w-4" />,
        id: "react",
        label: "React",
      },
      {
        icon: <SiTypescript className="h-4 w-4" />,
        id: "typescript",
        label: "TypeScript",
      },
      {
        icon: <SiFirebase className="h-4 w-4" />,
        id: "firebase",
        label: "Firebase",
      },
      {
        icon: <SiLeaflet className="h-4 w-4" />,
        id: "leaflet",
        label: "Leaflet",
      },
      {
        icon: <SiFlask className="h-4 w-4" />,
        id: "flask",
        label: "Flask API",
      },
    ],
    text: "BiteTrail",
    toolType: "Food Map Tool",
  },
];

const ToolPreviewCard = ({ tool }: { tool: ToolItem }) => {
  const ctas = [
    {
      href: tool.link,
      key: "open",
      label: "Open Tool",
    },
    tool.infoUrl
      ? {
          href: tool.infoUrl,
          key: "info",
          label: "View Blog Post",
        }
      : null,
    tool.githubRepoUrl
      ? {
          href: tool.githubRepoUrl,
          key: "github",
          label: "View GitHub repo",
        }
      : null,
  ].filter((cta): cta is { href: string; key: string; label: string } => Boolean(cta));

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[26px] site-surface-card p-3 sm:p-4 lg:p-5 ${TOOLS_DESKTOP_HEIGHT_CLASS}`}
    >
      <div className="relative overflow-hidden rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)]">
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-[color:rgba(255,255,255,0.2)] bg-[color:rgba(12,18,16,0.78)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--site-text-strong)] backdrop-blur">
          <FaMapLocationDot className="h-3.5 w-3.5 text-[color:var(--site-accent-soft)]" />
          {tool.status}
        </div>
        <div className="relative aspect-video w-full bg-[color:var(--site-bg)]">
          <Image
            src={tool.previewImage}
            alt={`${tool.text} preview`}
            fill
            priority
            sizes="(max-width: 1279px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      </div>
      <footer className="mt-3 flex flex-1 flex-col rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4 sm:p-5">
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span
                key={`${tool.text}-${tag.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] font-medium text-[color:var(--site-text-strong)]"
              >
                <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
          <h2 className="mb-3 text-[1.35rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--site-text-strong)]">
            {tool.text}
          </h2>
          <p className="w-full text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
            {tool.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-2 pt-5 text-[0.9rem] font-semibold text-[color:var(--site-accent)]">
          {ctas.map((cta, index) => (
            <div key={`${tool.text}-${cta.key}`} className="contents">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="text-[0.7rem] text-[color:var(--site-text-faint)]"
                >
                  •
                </span>
              ) : null}
              <a
                href={cta.href}
                className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
              >
                {cta.label}
                <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </footer>
    </article>
  );
};

const MobileToolCard = ({ tool }: { tool: ToolItem }) => (
  <CollapsibleCard
    title={tool.text}
    eyebrow={tool.toolType}
    stackedToggle
    headerContent={
      <div className="overflow-hidden">
        <div className="relative aspect-video w-full bg-[color:var(--site-bg-soft)]">
          <Image
            src={tool.previewImage}
            alt={`${tool.text} preview`}
            fill
            priority
            sizes="(max-width: 1279px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
        <div className="border-t border-[color:var(--site-border)]" />
      </div>
    }
  >
    <div className="rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={`${tool.text}-${tag.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-accent-border-soft)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] font-medium text-[color:var(--site-text-strong)]"
          >
            <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
            {tag.label}
          </span>
        ))}
      </div>
      <p className="w-full text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
        {tool.description}
      </p>
      <a
        href={tool.link}
        className="mt-5 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[color:var(--site-accent)] transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
      >
        Open Tool
        <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
      </a>
    </div>
  </CollapsibleCard>
);

const ToolsShowcase = () => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const activeTool = TOOLS[activeToolIndex];

  return (
    <section
      className="mx-auto scroll-mt-[10px] pb-10 pt-[88px]
        max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Tools
      </h1>

      <div className="grid gap-5 xl:hidden">
        {TOOLS.map((tool) => (
          <MobileToolCard key={tool.text} tool={tool} />
        ))}
      </div>

      <div className="hidden gap-7 xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ToolPreviewCard tool={activeTool} />

        <div
          className={`site-surface-card min-h-0 overflow-hidden rounded-[26px] ${TOOLS_DESKTOP_HEIGHT_CLASS}`}
        >
          <FlowingMenu<ToolItem>
            items={TOOLS}
            speed={5}
            bgColor="var(--site-bg-elevated)"
            borderColor="var(--site-border)"
            marqueeBgColor="var(--site-accent)"
            marqueeTextColor="var(--site-selection-text)"
            textColor="var(--site-text-strong)"
            onItemHover={setActiveToolIndex}
            onItemLeave={() => undefined}
            renderItemContent={(item, index) => {
              const isActive = activeToolIndex === index;

              return (
                <div
                  className={`flex w-full flex-col items-start gap-3 px-4 py-5 text-left
                    sm:px-5 lg:px-6 ${isActive ? "text-[color:var(--site-accent-soft)]" : ""}`}
                >
                  <div>
                    <p className="text-[0.9rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
                      {item.toolType}
                    </p>
                    <h3 className="pt-1 text-[1.15rem] font-semibold uppercase tracking-[0.08em] sm:text-[1.35rem]">
                      {item.text}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.text}-${tag.id}-icon`}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-[0.95rem]
                          ${
                            isActive
                              ? "border-[color:rgba(110,231,183,0.5)] bg-[color:rgba(16,185,129,0.14)] text-[color:var(--site-accent-soft)]"
                              : "border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)]"
                          }`}
                        aria-label={tag.label}
                        title={tag.label}
                      >
                        {tag.icon}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
