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
import { cloneElement, useEffect, useState, type ReactElement, type SVGProps } from "react";
import { VscVscode } from "react-icons/vsc";

import FlowingMenu, { type FlowingMenuItemData } from "./FlowingMenu";
import InfoTooltip from "./InfoTooltip";
import LogoLoop, { type LogoItem } from "./LogoLoop";

type SkillChip = {
  icon: ReactElement<{ className?: string }>;
  id: string;
  label: string;
  showInLogoLoop?: boolean;
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

const ReactBitsAtomLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 25 23"
    aria-hidden="true"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.6317 0.571987C16.3759 0.228574 17.2363 0.0550841 18.033 0.38644L18.1922 0.459682L18.1942 0.460659L18.41 0.587612C18.8912 0.905222 19.2097 1.37902 19.407 1.8923C19.602 2.39947 19.6967 2.98342 19.7195 3.60226L19.7244 3.86886L19.7293 4.82101L17.825 4.83078L17.8201 3.87863L17.8045 3.47042C17.7767 3.09113 17.7136 2.79437 17.6297 2.57589C17.5217 2.29489 17.4024 2.19635 17.3289 2.15792L17.284 2.13937C17.1618 2.09871 16.9051 2.08256 16.4305 2.30148C15.8996 2.5465 15.2436 3.02482 14.5086 3.74874C13.7215 4.524 12.8888 5.53694 12.0692 6.73507C12.2359 6.73273 12.4038 6.73019 12.5721 6.73019C15.8011 6.73022 18.765 7.16566 20.9539 7.89523C22.0431 8.25833 22.9938 8.71183 23.6912 9.26144C24.3778 9.80264 24.9519 10.5493 24.952 11.4919C24.9519 12.3043 24.5214 12.9748 23.9715 13.4831C23.4218 13.9912 22.6749 14.416 21.824 14.7673L20.9432 15.1306L20.2166 13.3698L21.0975 13.0066C21.833 12.7029 22.3554 12.3832 22.6785 12.0847C23.0011 11.7865 23.0476 11.5861 23.0477 11.4919C23.0476 11.3827 22.9814 11.1272 22.5125 10.7575C22.0535 10.3958 21.3298 10.028 20.3514 9.70187C18.4042 9.05287 15.6534 8.6355 12.5721 8.63546C11.9839 8.63546 11.4073 8.65026 10.8465 8.67941C10.5662 9.16529 10.292 9.6716 10.0252 10.195C9.8036 10.6298 9.59539 11.0625 9.40021 11.49C9.59576 11.9183 9.80411 12.3521 10.0262 12.7878H10.0272L10.2918 13.2976C11.6276 15.814 13.1379 17.8859 14.5086 19.236C15.2432 19.9595 15.8989 20.4376 16.4295 20.6823C16.9715 20.9322 17.23 20.8755 17.3279 20.8259L17.4061 20.7712C17.4946 20.6921 17.6094 20.5285 17.699 20.1902C17.8183 19.7396 17.8576 19.0916 17.7781 18.2556C17.6198 16.5909 17.0111 14.39 15.9705 12.0017L16.8436 11.6218L17.7166 11.2409C18.809 13.7484 19.4914 16.1499 19.6746 18.0749C19.7658 19.0336 19.7391 19.9287 19.5408 20.6775C19.343 21.4244 18.9388 22.1417 18.1932 22.5222L18.1922 22.5232C17.3525 22.9505 16.4266 22.7778 15.6326 22.4118C14.8262 22.04 13.9897 21.3992 13.1717 20.5935C11.5669 19.0128 9.8785 16.6456 8.43536 13.8562C7.94269 15.2332 7.60957 16.5119 7.44415 17.611C7.29073 18.6308 7.29006 19.4422 7.40411 20.0153C7.52086 20.6015 7.71887 20.7763 7.81622 20.8259H7.8172L7.88947 20.8523C8.09827 20.9026 8.58562 20.8602 9.46173 20.239L10.2381 19.6882L11.3397 21.2419L10.5633 21.7927L10.3582 21.9323C9.31984 22.6214 8.06557 23.0899 6.95197 22.5222V22.5232C6.11192 22.0955 5.70676 21.2449 5.53595 20.3874C5.36259 19.5163 5.38948 18.4625 5.56036 17.3269C5.81724 15.6203 6.41817 13.6025 7.31818 11.49C6.99301 10.7266 6.7076 9.97508 6.46271 9.24679C5.85761 9.38078 5.298 9.53349 4.79279 9.70187C3.81426 10.028 3.09071 10.3958 2.63165 10.7575C2.16243 11.1274 2.09658 11.3827 2.0965 11.4919C2.09671 11.6513 2.25906 12.068 3.17462 12.5876L3.36798 12.6921L4.21271 13.1335L3.3299 14.822L2.48615 14.3806L2.2674 14.2614C1.17979 13.6487 0.192367 12.742 0.1922 11.4919C0.192288 10.5492 0.766185 9.80266 1.45294 9.26144C2.15046 8.7118 3.10094 8.25834 4.19025 7.89523C4.72343 7.71753 5.30301 7.55645 5.92072 7.41574C5.76557 6.80139 5.64509 6.21178 5.56134 5.65597C5.39035 4.52081 5.36283 3.46829 5.53595 2.59738C5.70654 1.7396 6.11162 0.888515 6.95197 0.460659V0.461635C7.83252 0.0128116 8.80234 0.2186 9.65021 0.63937L10.0057 0.831752L10.8279 1.31222L9.86603 2.95675L9.04376 2.47628L8.78009 2.33371C8.20699 2.05202 7.91997 2.1051 7.81622 2.15792V2.1589C7.71887 2.20847 7.52073 2.38226 7.40411 2.96847C7.29019 3.54153 7.29149 4.35303 7.44513 5.37277C7.52452 5.89955 7.64219 6.46785 7.79767 7.06808C8.41596 6.97652 9.06014 6.90151 9.72443 6.8464C10.8365 5.04912 12.0257 3.5201 13.1717 2.39132C13.9899 1.58545 14.8252 0.944189 15.6317 0.571987ZM17.7166 11.2409L15.9705 12.0017L15.5906 11.1286L17.3367 10.3679L17.7166 11.2409ZM8.4422 7.94406C7.87898 7.94428 7.42287 8.40036 7.42267 8.96359C7.42267 9.52698 7.87886 9.98388 8.4422 9.9841C9.00573 9.9841 9.46271 9.52712 9.46271 8.96359C9.46251 8.40023 9.00561 7.94406 8.4422 7.94406Z"
      fill="currentColor"
    />
  </svg>
);

type SkillLogoTypeOrder = 1 | 2 | 3 | 4;

type SkillLogoItem = LogoItem & {
  typeOrder: SkillLogoTypeOrder;
  tagOrder: number;
};

const SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    eyebrow: "",
    image: "/Skills_Banner_1.jpg",
    summary:
      "Highlights the core programming foundations behind day-to-day building, from application logic and backend work to systems thinking, technical problem solving, and lower-level implementation.",
    tags: [
      {
        icon: <SiTypescript className="h-4 w-4" />,
        id: "typescript",
        label: "TypeScript",
        showInLogoLoop: true,
      },
      {
        icon: <SiJavascript className="h-4 w-4" />,
        id: "javascript",
        label: "JavaScript",
        showInLogoLoop: true,
      },
      {
        icon: <SiPython className="h-4 w-4" />,
        id: "python",
        label: "Python",
        showInLogoLoop: true,
      },
      {
        icon: <SiPostgresql className="h-4 w-4" />,
        id: "sql",
        label: "SQL / Postgres",
        showInLogoLoop: true,
      },
      { icon: <FaCode className="h-4 w-4" />, id: "c-family", label: "C / C++ / C#" },
      { icon: <FaMicrochip className="h-4 w-4" />, id: "vhdl", label: "VHDL" },
      {
        icon: <SiR className="h-4 w-4" />,
        id: "r",
        label: "R",
        showInLogoLoop: true,
      },
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
      {
        icon: <SiReact className="h-4 w-4" />,
        id: "react",
        label: "React",
        showInLogoLoop: true,
      },
      {
        icon: <SiNodedotjs className="h-4 w-4" />,
        id: "nodejs",
        label: "Node.js",
        showInLogoLoop: true,
      },
      {
        icon: <SiFastify className="h-4 w-4" />,
        id: "fastify",
        label: "Fastify",
        showInLogoLoop: true,
      },
      {
        icon: <SiFlask className="h-4 w-4" />,
        id: "flask",
        label: "Flask",
        showInLogoLoop: true,
      },
      {
        icon: <SiFastapi className="h-4 w-4" />,
        id: "fastapi",
        label: "FastAPI",
        showInLogoLoop: true,
      },
      {
        icon: <SiSocketdotio className="h-4 w-4" />,
        id: "socketio",
        label: "Socket.IO",
        showInLogoLoop: true,
      },
      {
        icon: <SiOpenapiinitiative className="h-4 w-4" />,
        id: "openapi",
        label: "OpenAPI",
        showInLogoLoop: true,
      },
      {
        icon: <SiUnity className="h-4 w-4" />,
        id: "unity",
        label: "Unity",
        showInLogoLoop: true,
      },
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
      {
        icon: <SiGit className="h-4 w-4" />,
        id: "git",
        label: "Git",
        showInLogoLoop: true,
      },
      {
        icon: <SiDocker className="h-4 w-4" />,
        id: "docker",
        label: "Docker",
        showInLogoLoop: true,
      },
      {
        icon: <SiAmazonwebservices className="h-4 w-4" />,
        id: "aws",
        label: "AWS",
        showInLogoLoop: true,
      },
      {
        icon: <SiTerraform className="h-4 w-4" />,
        id: "terraform",
        label: "Terraform",
        showInLogoLoop: true,
      },
      {
        icon: <SiFirebase className="h-4 w-4" />,
        id: "firebase",
        label: "Firebase",
        showInLogoLoop: true,
      },
      {
        icon: <SiRedis className="h-4 w-4" />,
        id: "redis",
        label: "Redis",
        showInLogoLoop: true,
      },
      {
        icon: <SiVite className="h-4 w-4" />,
        id: "vite",
        label: "Vite",
        showInLogoLoop: true,
      },
      {
        icon: <VscVscode className="h-4 w-4" />,
        id: "vscode",
        label: "VS Code",
        showInLogoLoop: true,
      },
      {
        icon: <SiAndroidstudio className="h-4 w-4" />,
        id: "android-studio",
        label: "Android Studio",
        showInLogoLoop: true,
      },
      {
        icon: <SiIntellijidea className="h-4 w-4" />,
        id: "intellij",
        label: "IntelliJ IDEA",
        showInLogoLoop: true,
      },
      {
        icon: <SiEclipseide className="h-4 w-4" />,
        id: "eclipse",
        label: "Eclipse",
        showInLogoLoop: true,
      },
      {
        icon: <SiFigma className="h-4 w-4" />,
        id: "figma",
        label: "Figma",
        showInLogoLoop: true,
      },
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
      {
        icon: <SiTailwindcss className="h-4 w-4" />,
        id: "tailwindcss",
        label: "Tailwind CSS",
        showInLogoLoop: true,
      },
      {
        icon: <SiPandas className="h-4 w-4" />,
        id: "pandas",
        label: "pandas",
        showInLogoLoop: true,
      },
      {
        icon: <SiNumpy className="h-4 w-4" />,
        id: "numpy",
        label: "NumPy",
        showInLogoLoop: true,
      },
      {
        icon: <SiPytorch className="h-4 w-4" />,
        id: "pytorch",
        label: "PyTorch",
        showInLogoLoop: true,
      },
      {
        icon: <SiScikitlearn className="h-4 w-4" />,
        id: "scikit-learn",
        label: "Scikit-learn",
        showInLogoLoop: true,
      },
      {
        icon: <ReactBitsAtomLogo className="h-4 w-4" />,
        id: "reactbits",
        label: "ReactBits",
        showInLogoLoop: true,
      },
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

const SKILL_LOGOS: LogoItem[] = SKILL_CATEGORIES.slice(0, 4)
  .flatMap((category, index) =>
    category.tags
      .flatMap((tag, tagIndex) =>
        tag.showInLogoLoop === true
          ? [
              {
        node: cloneElement(tag.icon, {
          className: skillLogoClassName,
        }),
        title: tag.label,
        typeOrder: (index + 1) as SkillLogoTypeOrder,
                tagOrder: tagIndex,
              } satisfies SkillLogoItem,
            ]
          : [],
      ),
  )
  .sort((left, right) => {
    if (left.typeOrder !== right.typeOrder) {
      return left.typeOrder - right.typeOrder;
    }

    if (left.tagOrder !== right.tagOrder) {
      return left.tagOrder - right.tagOrder;
    }

    return 0;
  })
  .map(({ tagOrder: _tagOrder, typeOrder: _typeOrder, ...logo }) => logo);

const SKILLS_DESKTOP_HEIGHT_CLASS = "xl:h-[535px] xxl:h-[535px]";

const SkillsPreviewCard = ({ item }: { item: SkillCategoryItem }) => {
  return (
    <article
      className={`site-surface-card flex flex-col overflow-hidden rounded-[26px] p-5
        sm:p-6 lg:p-6 ${SKILLS_DESKTOP_HEIGHT_CLASS}`}
    >
      <div className="flex min-h-[14rem] flex-1 flex-col">
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
        <p className="mt-5 w-full text-[1.02rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[1.06rem]">
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
            speed={5}
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
