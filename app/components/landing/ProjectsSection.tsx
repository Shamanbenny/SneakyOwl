"use client";

import Image from "next/image";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { FaArrowUpRightFromSquare, FaReact } from "react-icons/fa6";
import {
  SiTypescript,
  SiFirebase,
  SiPython,
  SiRedis,
  SiDocker,
  SiTerraform,
  SiAmazonwebservices,
  SiFastify,
  SiSocketdotio,
  SiOpenapiinitiative,
  SiNodedotjs,
  SiVite,
  SiFlask,
} from "react-icons/si";

import FlowingMenu, {
  type FlowingMenuItemData,
} from "@/app/components/shared/display/FlowingMenu";
import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import CollapsibleCard from "@/app/components/shared/ui/CollapsibleCard";

type TechTag = {
  icon: ReactElement;
  id: string;
  label: string;
  priority: number;
};

type ProjectLinks = {
  githubRepoUrl: string | null;
  infoUrl: string | null;
  deployedSiteUrl: string | null;
};

type ProjectItem = FlowingMenuItemData & {
  architectureLabel: string;
  architectureSummary: string;
  description: ReactNode;
  previewImage: string;
  projectType: string;
  tags: TechTag[];
} & ProjectLinks;

const FLOWING_MENU_VISIBLE_TAGS = {
  xl: 6,
  xxl: 8,
} as const;

type FlowingMenuVisibleTagCount =
  (typeof FLOWING_MENU_VISIBLE_TAGS)[keyof typeof FLOWING_MENU_VISIBLE_TAGS];

const getVisibleFlowingMenuTagCount = (
  viewportWidth: number,
): FlowingMenuVisibleTagCount => {
  if (viewportWidth >= 1600) {
    return FLOWING_MENU_VISIBLE_TAGS.xxl;
  }

  return FLOWING_MENU_VISIBLE_TAGS.xl;
};

const getFlowingMenuTagDisplay = (tags: TechTag[], visibleSlotCount: number) => {
  const sortedTags = [...tags]
    .map((tag, index) => ({ index, tag }))
    .sort((left, right) => {
      if (left.tag.priority === right.tag.priority) {
        return left.index - right.index;
      }

      return left.tag.priority - right.tag.priority;
    })
    .map(({ tag }) => tag);

  if (sortedTags.length <= visibleSlotCount) {
    return {
      hiddenCount: 0,
      hiddenTags: [] as TechTag[],
      visibleTags: sortedTags,
    };
  }

  const visibleTagCount = Math.max(visibleSlotCount - 1, 0);

  return {
    hiddenCount: sortedTags.length - visibleTagCount,
    hiddenTags: sortedTags.slice(visibleTagCount),
    visibleTags: sortedTags.slice(0, visibleTagCount),
  };
};

const getProjectCtas = ({ deployedSiteUrl, githubRepoUrl, infoUrl }: ProjectLinks) => {
  return [
    {
      href: infoUrl,
      key: "info",
      label: "Click for more info",
    },
    githubRepoUrl
      ? {
          href: githubRepoUrl,
          key: "github",
          label: "View GitHub repo",
        }
      : null,
    deployedSiteUrl
      ? {
          href: deployedSiteUrl,
          key: "deployed",
          label: "Visit deployed site",
        }
      : null,
  ].filter((cta): cta is { href: string; key: string; label: string } => Boolean(cta));
};

const isExternalUrl = (href: string) => /^https?:\/\//.test(href);

const PROJECTS: ProjectItem[] = [
  {
    architectureLabel: "Microservices Architecture",
    architectureSummary:
      "A gateway-centric system split into dedicated user, question, matching, collaboration, history, and AI services, coordinated with Redis and deployed locally via Docker Compose and on AWS with Terraform-managed infrastructure.",
    description: (
      <>
        A real-time technical interview prep platform that matches peers by topic
        and difficulty, launches shared coding sessions, and preserves per-user
        session history. It was also designed for scalable cloud deployment, with
        load-balanced AWS infrastructure provisioned through Terraform as
        Infrastructure as Code. That deployment has since been torn down because
        grading for NUS{" "}
        <a
          href="https://nusmods.com/courses/CS3219/software-engineering-principles-and-patterns"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
        >
          CS3219
        </a>{" "}
        had concluded.
      </>
    ),
    deployedSiteUrl: null,
    githubRepoUrl: null,
    image: "/PeerPrep_Banner.png",
    infoUrl: "/blog/peer-prep-system-design",
    link: "/blog/peer-prep-system-design",
    previewImage: "/PeerPrep.png",
    projectType: "Full-Stack Project",
    tags: [
      {
        icon: <FaReact className="h-4 w-4" />,
        id: "react",
        label: "React",
        priority: 1,
      },
      {
        icon: <SiNodedotjs className="h-4 w-4" />,
        id: "nodejs",
        label: "Node.js",
        priority: 10,
      },
      {
        icon: <SiDocker className="h-4 w-4" />,
        id: "docker",
        label: "Docker",
        priority: 2,
      },
      {
        icon: <SiAmazonwebservices className="h-4 w-4" />,
        id: "aws",
        label: "AWS",
        priority: 3,
      },
      {
        icon: <SiTerraform className="h-4 w-4" />,
        id: "terraform",
        label: "Terraform",
        priority: 4,
      },
      {
        icon: <SiRedis className="h-4 w-4" />,
        id: "redis",
        label: "Redis",
        priority: 5,
      },
      {
        icon: <SiFirebase className="h-4 w-4" />,
        id: "firebase",
        label: "Firebase",
        priority: 6,
      },
      {
        icon: <SiSocketdotio className="h-4 w-4" />,
        id: "socket-io",
        label: "Socket.IO",
        priority: 7,
      },
      {
        icon: <SiTypescript className="h-4 w-4" />,
        id: "typescript",
        label: "TypeScript",
        priority: 8,
      },
      {
        icon: <SiPython className="h-4 w-4" />,
        id: "python",
        label: "Python",
        priority: 9,
      },
    ],
    text: "Peer Prep",
  },
  {
    architectureLabel: "Modular Monolith Architecture",
    architectureSummary:
      "Single-page React app talks to a single Fastify API application. Firebase Auth, Firestore, and Storage are external platform services used by the system.",
    description: (
      <>
        A conservation operations platform built to support the{" "}
        <a
          href="https://janegoodall.org.sg/our-programmes-and-campaigns/wildlife-environment/raffles-banded-langur/"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
        >
          Raffles&apos; Banded Langur Citizen Science Programme
        </a>
        , covering volunteer onboarding, training-gated survey signup, trail
        execution, and wildlife sighting reporting. The project also involved{" "}
        <span className="rounded-[0.35rem] bg-[color:var(--site-accent-strong)] px-1.5 py-0.5 text-[color:var(--site-text-strong)]">
          requirement analysis through close stakeholder collaboration
        </span>{" "}
        with{" "}
        <a
          href="https://www.dbs.nus.edu.sg/dr-andie-ang-2/"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
        >
          Dr. Andie Ang
        </a>
        . Its React SPA supports low-connectivity field use with offline draft
        and media sync, while a single Fastify backend enforces RBAC and keeps
        the frontend contract-safe through generated OpenAPI clients.
      </>
    ),
    deployedSiteUrl: null,
    githubRepoUrl: null,
    image: "/RafflesGo_Banner.jpg",
    infoUrl: "/blog/raffles-go-conservation-operations",
    link: "/blog/raffles-go-conservation-operations",
    previewImage: "/RafflesGo.png",
    projectType: "Full-Stack Project",
    tags: [
      {
        icon: <FaReact className="h-4 w-4" />,
        id: "react",
        label: "React",
        priority: 1,
      },
      {
        icon: <SiVite className="h-4 w-4" />,
        id: "vite",
        label: "Vite",
        priority: 6,
      },
      {
        icon: <SiTypescript className="h-4 w-4" />,
        id: "typescript",
        label: "TypeScript",
        priority: 5,
      },
      {
        icon: <SiFastify className="h-4 w-4" />,
        id: "fastify",
        label: "Fastify",
        priority: 2,
      },
      {
        icon: <SiOpenapiinitiative className="h-4 w-4" />,
        id: "openapi",
        label: "OpenAPI",
        priority: 3,
      },
      {
        icon: <SiFirebase className="h-4 w-4" />,
        id: "firebase",
        label: "Firebase",
        priority: 4,
      },
    ],
    text: "Raffles Go",
  },
  {
    architectureLabel: "Client-Server Architecture",
    architectureSummary:
      "A Flask-based chess engine service exposes versioned move endpoints, while the Next.js frontend hosts the playable interface and calls the deployed engine remotely.",
    description: (
      <>
        A browser-based chess interface backed by iterative chess bot versions exposed
        through a Flask API. The standalone{" "}
        <a
          href="https://github.com/Shamanbenny/chess-flask"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
        >
          chess-flask
        </a>{" "}
        repository powers the move generation logic, while this repo hosts the
        UI used to test and play against each bot version. The project followed
        an iterative build approach inspired by Sebastian Lague&apos;s{" "}
        <a
          href="https://www.youtube.com/watch?v=U4ogK0MIzqk"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
        >
          Coding Adventure: Chess
        </a>
        , starting from legal move generation and basic search, then improving
        successive versions with stronger evaluation and search heuristics.
      </>
    ),
    deployedSiteUrl: null,
    githubRepoUrl: "https://github.com/Shamanbenny/chess-flask",
    image: "/ChessFlask.png",
    infoUrl: "/blog/chess-flask-iteration-notes",
    link: "/blog/chess-flask-iteration-notes",
    previewImage: "/ChessFlask.png",
    projectType: "Backend Project",
    tags: [
      {
        icon: <SiPython className="h-4 w-4" />,
        id: "python",
        label: "Python",
        priority: 1,
      },
      {
        icon: <SiFlask className="h-4 w-4" />,
        id: "flask",
        label: "Flask",
        priority: 2,
      },
      {
        icon: <FaReact className="h-4 w-4" />,
        id: "react",
        label: "React",
        priority: 3,
      },
      {
        icon: <SiTypescript className="h-4 w-4" />,
        id: "typescript",
        label: "TypeScript",
        priority: 4,
      },
    ],
    text: "Chess Flask",
  },
].map((project) => ({
  ...project,
  link: project.infoUrl,
}));

const PROJECTS_DESKTOP_HEIGHT_CLASS = "lg:min-h-[34rem] xl:h-[750px] xxl:h-[875px]";

const ProjectPreviewCard = ({
  project,
  framed = true,
}: {
  project: ProjectItem;
  framed?: boolean;
}) => {
  const ctas = getProjectCtas(project);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[26px] ${
        framed ? `site-surface-card p-3 sm:p-4 lg:p-5 ${PROJECTS_DESKTOP_HEIGHT_CLASS}` : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)]">
        <div className="absolute right-3 top-3 z-10">
          <InfoTooltip
            ariaLabel={`${project.text} architecture`}
            className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(255,255,255,0.2)] bg-[color:rgba(12,18,16,0.78)] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-strong)] backdrop-blur"
            panelClassName="border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-elevated)] text-[color:var(--site-text-muted)] shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
            preferredPlacement="left"
            trigger={<button type="button">{project.architectureLabel}</button>}
          >
            {project.architectureSummary}
          </InfoTooltip>
        </div>
        <div className="relative aspect-video w-full bg-[color:var(--site-bg)]">
          <Image
            src={project.previewImage}
            alt={`${project.text} preview slide`}
            fill
            priority
            sizes="(max-width: 1279px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      </div>
      <footer
        className="mt-3 flex flex-1 flex-col rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4 sm:p-5"
      >
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={`${project.text}-${tag.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] font-medium text-[color:var(--site-text-strong)]"
              >
                <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
          <p className="w-full text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
            {project.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-2 pt-5 text-[0.9rem] font-semibold text-[color:var(--site-accent)]">
          {ctas.map((cta, index) => (
            <div key={`${project.text}-${cta.key}`} className="contents">
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
                target={isExternalUrl(cta.href) ? "_blank" : undefined}
                rel={isExternalUrl(cta.href) ? "noreferrer" : undefined}
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

const MobileProjectCollapsibleCard = ({ project }: { project: ProjectItem }) => {
  const ctas = getProjectCtas(project);

  return (
    <CollapsibleCard
      title={project.text}
      eyebrow={project.projectType}
      stackedToggle
      headerContent={
        <div className="overflow-hidden">
          <div className="relative aspect-video w-full bg-[color:var(--site-bg-soft)]">
            <Image
              src={project.previewImage}
              alt={`${project.text} preview slide`}
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
          {project.tags.map((tag) => (
            <span
              key={`${project.text}-${tag.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-accent-border-soft)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] font-medium text-[color:var(--site-text-strong)]"
            >
              <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
              {tag.label}
            </span>
          ))}
        </div>
        <p className="w-full text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.9rem] font-semibold text-[color:var(--site-accent)]">
          {ctas.map((cta, index) => (
            <div key={`${project.text}-${cta.key}`} className="contents">
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
                target={isExternalUrl(cta.href) ? "_blank" : undefined}
                rel={isExternalUrl(cta.href) ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
              >
                {cta.label}
                <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleCard>
  );
};

const ProjectsSection = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [visibleFlowingMenuTagCount, setVisibleFlowingMenuTagCount] =
    useState<FlowingMenuVisibleTagCount>(FLOWING_MENU_VISIBLE_TAGS.xl);

  const activeProject = PROJECTS[activeProjectIndex];

  useEffect(() => {
    const updateVisibleFlowingMenuTagCount = () => {
      setVisibleFlowingMenuTagCount(getVisibleFlowingMenuTagCount(window.innerWidth));
    };

    updateVisibleFlowingMenuTagCount();
    window.addEventListener("resize", updateVisibleFlowingMenuTagCount);

    return () => window.removeEventListener("resize", updateVisibleFlowingMenuTagCount);
  }, []);

  return (
    <section
      id="projects"
      className="mx-auto scroll-mt-[10px] pb-10
        max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Projects
      </h1>
      <div className="grid gap-5 xl:hidden">
        {PROJECTS.map((project) => (
          <MobileProjectCollapsibleCard key={project.text} project={project} />
        ))}
      </div>

      <div
        className="hidden gap-7 xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <ProjectPreviewCard project={activeProject} />

        <div
          className={`site-surface-card min-h-0 overflow-hidden rounded-[26px]
            ${PROJECTS_DESKTOP_HEIGHT_CLASS}`}
        >
          <FlowingMenu<ProjectItem>
            items={PROJECTS}
            speed={5}
            bgColor="var(--site-bg-elevated)"
            borderColor="var(--site-border)"
            marqueeBgColor="var(--site-accent)"
            marqueeTextColor="var(--site-selection-text)"
            textColor="var(--site-text-strong)"
            onItemHover={setActiveProjectIndex}
            onItemLeave={() => undefined}
            renderItemContent={(item, index) => {
              const isActive = activeProjectIndex === index;
              const { hiddenCount, hiddenTags, visibleTags } = getFlowingMenuTagDisplay(
                item.tags,
                visibleFlowingMenuTagCount,
              );

              return (
                <div
                  className={`flex w-full flex-col items-start gap-3 px-4 py-5 text-left
                    sm:px-5 lg:px-6 ${isActive ? "text-[color:var(--site-accent-soft)]" : ""}`}
                >
                  <div>
                    <p className="text-[0.9rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
                      {item.projectType}
                    </p>
                    <h3 className="pt-1 text-[1.15rem] font-semibold uppercase tracking-[0.08em] sm:text-[1.35rem]">
                      {item.text}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {visibleTags.map((tag) => (
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
                    {hiddenCount > 0 ? (
                      <span
                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-2 text-[0.82rem] font-semibold
                          ${
                            isActive
                              ? "border-[color:rgba(110,231,183,0.5)] bg-[color:rgba(16,185,129,0.14)] text-[color:var(--site-accent-soft)]"
                              : "border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)]"
                          }`}
                        aria-label={`${hiddenCount} more technologies`}
                        title={hiddenTags.map((tag) => tag.label).join(", ")}
                      >
                        +{hiddenCount}
                      </span>
                    ) : null}
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

export default ProjectsSection;
