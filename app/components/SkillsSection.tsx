"use client";

import {
  SiAmazonwebservices,
  SiAndroidstudio,
  SiCss3,
  SiDocker,
  SiEclipseide,
  SiFastapi,
  SiFastify,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiGit,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiNodedotjs,
  SiNumpy,
  SiOpenapiinitiative,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiR,
  SiReact,
  SiRedis,
  SiScikitlearn,
  SiSocketdotio,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
  SiUnity,
  SiVite,
} from "react-icons/si";
import { FaCode, FaMicrochip } from "react-icons/fa6";
import { useEffect, useState, type ReactElement } from "react";
import { VscVscode } from "react-icons/vsc";

import FlowingMenu, { type FlowingMenuItemData } from "./FlowingMenu";
import InfoTooltip from "./InfoTooltip";
import LogoLoop, { type LogoItem } from "./LogoLoop";

type SkillChip = {
  icon: ReactElement;
  id: string;
  label: string;
};

type SkillCategoryItem = FlowingMenuItemData & {
  eyebrow: string;
  previewTitle: string;
  summary: string;
  tags: SkillChip[];
};

const FLOWING_MENU_VISIBLE_TAGS = {
  xl: 4,
  xxl: 6,
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

const getFlowingMenuTagDisplay = (tags: SkillChip[], visibleSlotCount: number) => {
  if (tags.length <= visibleSlotCount) {
    return {
      hiddenCount: 0,
      hiddenTags: [] as SkillChip[],
      visibleTags: tags,
    };
  }

  const visibleTagCount = Math.max(visibleSlotCount - 1, 0);

  return {
    hiddenCount: tags.length - visibleTagCount,
    hiddenTags: tags.slice(visibleTagCount),
    visibleTags: tags.slice(0, visibleTagCount),
  };
};

const skillLogoClassName = "h-[1em] w-[1em]";

type SkillLogoTypeOrder = 1 | 2 | 3 | 4;

type SkillLogoItem = LogoItem & {
  priority: number;
  typeOrder: SkillLogoTypeOrder;
};

// `typeOrder` keeps the logo loop grouped by the four tech-stack skill buckets
// (1 = Languages, 2 = Frameworks, 3 = Developer Tools, 4 = Libraries) so new
// entries sort themselves without manual reordering. `priority` is a 1-10 hiring
// signal rank where 1 is most broadly valuable to employers and 10 is the least
// material, which gives us a stable secondary sort within each bucket.
const SKILL_LOGO_ITEMS: SkillLogoItem[] = [
  { node: <SiReact className={skillLogoClassName} />, priority: 1, title: "React", typeOrder: 2 },
  { node: <SiTypescript className={skillLogoClassName} />, priority: 1, title: "TypeScript", typeOrder: 1 },
  { node: <SiJavascript className={skillLogoClassName} />, priority: 2, title: "JavaScript", typeOrder: 1 },
  { node: <SiPython className={skillLogoClassName} />, priority: 1, title: "Python", typeOrder: 1 },
  { node: <SiNodedotjs className={skillLogoClassName} />, priority: 2, title: "Node.js", typeOrder: 2 },
  { node: <SiFastify className={skillLogoClassName} />, priority: 4, title: "Fastify", typeOrder: 2 },
  { node: <SiFlask className={skillLogoClassName} />, priority: 4, title: "Flask", typeOrder: 2 },
  { node: <SiFastapi className={skillLogoClassName} />, priority: 3, title: "FastAPI", typeOrder: 2 },
  { node: <SiPostgresql className={skillLogoClassName} />, priority: 3, title: "PostgreSQL", typeOrder: 1 },
  { node: <SiDocker className={skillLogoClassName} />, priority: 2, title: "Docker", typeOrder: 3 },
  { node: <SiGit className={skillLogoClassName} />, priority: 1, title: "Git", typeOrder: 3 },
  { node: <SiHtml5 className={skillLogoClassName} />, priority: 4, title: "HTML5", typeOrder: 1 },
  { node: <SiCss3 className={skillLogoClassName} />, priority: 4, title: "CSS3", typeOrder: 1 },
  { node: <SiFirebase className={skillLogoClassName} />, priority: 5, title: "Firebase", typeOrder: 3 },
  { node: <SiRedis className={skillLogoClassName} />, priority: 5, title: "Redis", typeOrder: 4 },
  { node: <SiSocketdotio className={skillLogoClassName} />, priority: 5, title: "Socket.IO", typeOrder: 4 },
  { node: <SiTailwindcss className={skillLogoClassName} />, priority: 3, title: "Tailwind CSS", typeOrder: 4 },
  { node: <SiOpenapiinitiative className={skillLogoClassName} />, priority: 6, title: "OpenAPI", typeOrder: 3 },
  { node: <SiAmazonwebservices className={skillLogoClassName} />, priority: 3, title: "AWS", typeOrder: 3 },
  { node: <SiTerraform className={skillLogoClassName} />, priority: 5, title: "Terraform", typeOrder: 3 },
  { node: <SiVite className={skillLogoClassName} />, priority: 6, title: "Vite", typeOrder: 3 },
  { node: <SiPandas className={skillLogoClassName} />, priority: 4, title: "pandas", typeOrder: 4 },
  { node: <SiNumpy className={skillLogoClassName} />, priority: 4, title: "NumPy", typeOrder: 4 },
  { node: <SiPytorch className={skillLogoClassName} />, priority: 6, title: "PyTorch", typeOrder: 4 },
  { node: <SiScikitlearn className={skillLogoClassName} />, priority: 5, title: "Scikit-learn", typeOrder: 4 },
  { node: <SiUnity className={skillLogoClassName} />, priority: 7, title: "Unity", typeOrder: 2 },
  { node: <VscVscode className={skillLogoClassName} />, priority: 3, title: "VS Code", typeOrder: 3 },
  { node: <SiIntellijidea className={skillLogoClassName} />, priority: 7, title: "IntelliJ IDEA", typeOrder: 3 },
  { node: <SiEclipseide className={skillLogoClassName} />, priority: 8, title: "Eclipse", typeOrder: 3 },
  { node: <SiAndroidstudio className={skillLogoClassName} />, priority: 7, title: "Android Studio", typeOrder: 3 },
  { node: <SiFigma className={skillLogoClassName} />, priority: 8, title: "Figma", typeOrder: 3 },
  { node: <SiR className={skillLogoClassName} />, priority: 7, title: "R Language", typeOrder: 1 },
];

const SKILL_LOGOS: LogoItem[] = [...SKILL_LOGO_ITEMS]
  .sort((left, right) => {
    if (left.typeOrder !== right.typeOrder) {
      return left.typeOrder - right.typeOrder;
    }

    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return (left.title ?? "").localeCompare(right.title ?? "");
  })
  .map(({ priority: _priority, typeOrder: _typeOrder, ...logo }) => logo);

const SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    eyebrow: "",
    image: "/Skills_Banner_1.jpg",
    summary:
      "Highlights the core programming foundations behind day-to-day building, from application logic and backend work to systems thinking, technical problem solving, and lower-level implementation.",
    tags: [
      { icon: <SiTypescript className="h-4 w-4" />, id: "typescript", label: "TypeScript" },
      { icon: <SiJavascript className="h-4 w-4" />, id: "javascript", label: "JavaScript" },
      { icon: <SiPython className="h-4 w-4" />, id: "python", label: "Python" },
      { icon: <SiPostgresql className="h-4 w-4" />, id: "sql", label: "SQL / Postgres" },
      { icon: <FaCode className="h-4 w-4" />, id: "c-family", label: "C / C++ / C#" },
      { icon: <FaMicrochip className="h-4 w-4" />, id: "vhdl", label: "VHDL" },
      { icon: <SiR className="h-4 w-4" />, id: "r", label: "R" },
    ],
    previewTitle: "Languages",
    text: "Languages",
  },
  {
    eyebrow: "",
    image: "/Skills_Banner_2.png",
    summary:
      "Covers the application-layer tools used to shape interfaces, structure products, and connect frontend experiences with backend services, real-time features, and interactive systems.",
    tags: [
      { icon: <SiReact className="h-4 w-4" />, id: "react", label: "React" },
      { icon: <SiNodedotjs className="h-4 w-4" />, id: "nodejs", label: "Node.js" },
      { icon: <SiFastify className="h-4 w-4" />, id: "fastify", label: "Fastify" },
      { icon: <SiFlask className="h-4 w-4" />, id: "flask", label: "Flask" },
      { icon: <SiFastapi className="h-4 w-4" />, id: "fastapi", label: "FastAPI" },
      { icon: <SiSocketdotio className="h-4 w-4" />, id: "socketio", label: "Socket.IO" },
      { icon: <SiOpenapiinitiative className="h-4 w-4" />, id: "openapi", label: "OpenAPI" },
      { icon: <SiUnity className="h-4 w-4" />, id: "unity", label: "Unity" },
    ],
    previewTitle: "Frameworks",
    text: "Frameworks",
  },
  {
    eyebrow: "",
    image: "/Skills_Banner_3.jpg",
    summary:
      "Focuses on the workflow and delivery layer: the tools that support building reliably, collaborating cleanly, managing environments, and moving projects from development into deployment.",
    tags: [
      { icon: <SiGit className="h-4 w-4" />, id: "git", label: "Git" },
      { icon: <SiDocker className="h-4 w-4" />, id: "docker", label: "Docker" },
      { icon: <SiAmazonwebservices className="h-4 w-4" />, id: "aws", label: "AWS" },
      { icon: <SiTerraform className="h-4 w-4" />, id: "terraform", label: "Terraform" },
      { icon: <SiFirebase className="h-4 w-4" />, id: "firebase", label: "Firebase" },
      { icon: <SiRedis className="h-4 w-4" />, id: "redis", label: "Redis" },
      { icon: <SiVite className="h-4 w-4" />, id: "vite", label: "Vite" },
      { icon: <VscVscode className="h-4 w-4" />, id: "vscode", label: "VS Code" },
      { icon: <SiIntellijidea className="h-4 w-4" />, id: "intellij", label: "IntelliJ IDEA" },
      { icon: <SiAndroidstudio className="h-4 w-4" />, id: "android-studio", label: "Android Studio" },
      { icon: <SiFigma className="h-4 w-4" />, id: "figma", label: "Figma" },
    ],
    previewTitle: "Developer Tools",
    text: "Dev Tools",
  },
  {
    eyebrow: "",
    image: "/Skills_Banner_4.jpg",
    summary:
      "Highlights the reusable building blocks used for data work, experimentation, frontend styling, and implementation speed when a project benefits from established patterns instead of custom reinvention.",
    tags: [
      { icon: <SiPandas className="h-4 w-4" />, id: "pandas", label: "pandas" },
      { icon: <SiNumpy className="h-4 w-4" />, id: "numpy", label: "NumPy" },
      { icon: <SiPytorch className="h-4 w-4" />, id: "pytorch", label: "PyTorch" },
      { icon: <SiScikitlearn className="h-4 w-4" />, id: "scikit-learn", label: "Scikit-learn" },
      { icon: <SiTailwindcss className="h-4 w-4" />, id: "tailwindcss", label: "Tailwind CSS" },
      { icon: <SiReact className="h-4 w-4" />, id: "reactbits", label: "ReactBits" },
    ],
    previewTitle: "Libraries",
    text: "Libraries",
  },
  {
    eyebrow: "",
    image: "/Skills_Banner_5.png",
    summary:
      "Covers the broader artificial intelligence and machine learning ideas explored across search, decision-making, prediction, pattern discovery, and neural-network-based problem solving.",
    tags: [
      { icon: <FaCode className="h-4 w-4" />, id: "minimax", label: "MiniMax" },
      { icon: <SiScikitlearn className="h-4 w-4" />, id: "regression", label: "Regression" },
      { icon: <SiScikitlearn className="h-4 w-4" />, id: "svm", label: "SVM" },
      { icon: <SiScikitlearn className="h-4 w-4" />, id: "clustering", label: "Clustering" },
      { icon: <SiPytorch className="h-4 w-4" />, id: "cnn", label: "Convolutional Neural Network (CNN)" },
      { icon: <SiPytorch className="h-4 w-4" />, id: "rnn", label: "Recurrent Neural Network (RNN)" },
    ],
    previewTitle: "Artificial Intelligence & Machine Learning",
    text: "AI & ML",
  },
  {
    eyebrow: "",
    image: "/Skills_Banner_6.png",
    summary:
      "Highlights the problem-solving fundamentals behind efficient software, with emphasis on organizing data well, reasoning about performance, and choosing the right approach for optimization-heavy tasks.",
    tags: [
      { icon: <FaCode className="h-4 w-4" />, id: "linked-lists", label: "Linked Lists" },
      { icon: <FaCode className="h-4 w-4" />, id: "stacks-queues", label: "Stacks & Queues" },
      { icon: <FaCode className="h-4 w-4" />, id: "bst-avl", label: "BST & AVL" },
      { icon: <FaCode className="h-4 w-4" />, id: "heaps", label: "Heaps" },
      { icon: <FaCode className="h-4 w-4" />, id: "hashing", label: "Hash Maps" },
      { icon: <FaCode className="h-4 w-4" />, id: "graphs", label: "Graphs" },
      { icon: <FaCode className="h-4 w-4" />, id: "sssp", label: "Single-Source Shortest Path (SSSP)" },
      { icon: <FaCode className="h-4 w-4" />, id: "recursion-dp", label: "Recursion & Dynamic Programming" },
      { icon: <FaCode className="h-4 w-4" />, id: "sorting-searching", label: "Sorting & Searching" },
      { icon: <FaCode className="h-4 w-4" />, id: "greedy", label: "Greedy Algorithms" },
    ],
    previewTitle: "Data Structures & Algorithms",
    text: "DS & Algo",
  },
];

const SKILLS_DESKTOP_HEIGHT_CLASS = "xl:h-[535px] xxl:h-[535px]";

const SkillsPreviewCard = ({ item }: { item: SkillCategoryItem }) => {
  return (
    <article
      className={`site-surface-card flex flex-col overflow-hidden rounded-[26px] p-3
        sm:p-4 lg:p-5 ${SKILLS_DESKTOP_HEIGHT_CLASS}`}
    >
      <div className="relative flex min-h-[14rem] flex-1 flex-col overflow-hidden rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-5 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--site-accent-border-subtle)]" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
              {item.eyebrow}
            </p>
            <h3 className="pt-1 text-[1.35rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--site-text-strong)] sm:text-[1.55rem]">
              {item.previewTitle}
            </h3>
          </div>
        </div>
        <p className="mt-5 w-full text-[1.02rem] leading-7 text-[color:var(--site-text-muted)] sm:text-[1.06rem]">
          {item.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {item.tags.map((tag) => (
            <span
              key={`${item.text}-${tag.id}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-4 py-2 text-[0.95rem] font-medium text-[color:var(--site-text-strong)] sm:text-[1rem]"
            >
              <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

const SkillsSection = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [visibleFlowingMenuTagCount, setVisibleFlowingMenuTagCount] =
    useState<FlowingMenuVisibleTagCount>(FLOWING_MENU_VISIBLE_TAGS.xl);

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
      id="skills"
      className="mx-auto scroll-mt-[10px] pb-10
        max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Skills &amp; Technologies
      </h1>

      <div className="site-surface-card overflow-hidden rounded-[26px] py-5 sm:py-6">
        <LogoLoop
          logos={SKILL_LOGOS}
          speed={120}
          direction="left"
          logoHeight={30}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="var(--site-bg-elevated)"
          ariaLabel="Skills and technologies"
          className="skills-logo-loop"
          renderItem={(item, key) => {
            if (!("node" in item)) {
              return null;
            }

            return (
              <InfoTooltip
                key={key}
                ariaLabel={item.title ?? "Technology"}
                preferredPlacement="top"
                panelClassName="text-[color:var(--site-text-strong)]"
                trigger={
                  <button
                    type="button"
                    className="skills-logo-loop__trigger"
                    aria-label={item.title}
                  >
                    <span className="skills-logo-loop__icon">{item.node}</span>
                  </button>
                }
              >
                {item.title}
              </InfoTooltip>
            );
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="mx-auto my-5 h-px w-[88%] bg-[color:var(--site-divider)]"
      />

      <div className="grid gap-5 xl:hidden">
        {SKILL_CATEGORIES.map((item) => (
          <SkillsPreviewCard key={item.text} item={item} />
        ))}
      </div>

      <div
        className="hidden gap-7 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <div
          className={`site-surface-card min-h-0 overflow-hidden rounded-[26px]
            ${SKILLS_DESKTOP_HEIGHT_CLASS}`}
        >
          <FlowingMenu<SkillCategoryItem>
            items={SKILL_CATEGORIES}
            speed={17}
            bgColor="var(--site-bg-elevated)"
            borderColor="var(--site-border)"
            marqueeBgColor="var(--site-accent)"
            marqueeTextColor="var(--site-selection-text)"
            textColor="var(--site-text-strong)"
            onItemHover={setActiveCategoryIndex}
            onItemLeave={() => undefined}
            renderItemContent={(item, index) => {
              const isActive = activeCategoryIndex === index;
              const { hiddenCount, hiddenTags, visibleTags } = getFlowingMenuTagDisplay(
                item.tags,
                visibleFlowingMenuTagCount,
              );

              return (
                <div
                  className={`flex w-full flex-col items-start gap-3 px-4 py-5 text-left
                    sm:px-5 lg:px-6 ${isActive ? "text-[color:var(--site-accent-soft)]" : ""}`}
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
                        {item.eyebrow}
                      </p>
                      <h3 className="pt-1 text-[1.15rem] font-semibold uppercase tracking-[0.08em] sm:text-[1.35rem]">
                        {item.text}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 overflow-hidden">
                      {visibleTags.map((tag) => (
                        <span
                          key={`${item.text}-${tag.id}-icon`}
                          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.95rem]
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
                          className={`inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full border px-2 text-[0.82rem] font-semibold
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
                </div>
              );
            }}
          />
        </div>

        <SkillsPreviewCard item={SKILL_CATEGORIES[activeCategoryIndex]} />
      </div>
    </section>
  );
};

export default SkillsSection;
