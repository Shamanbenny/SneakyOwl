"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBriefcase, FaFlag, FaGraduationCap } from "react-icons/fa";
import type { IconType } from "react-icons";

type TimelineFilter = "all" | "education" | "work" | "misc";
type TimelineCategory = Exclude<TimelineFilter, "all">;

type TimelineItem = {
  category: TimelineCategory;
  details: string[];
  id: string;
  // Use `miscLabel` to show the actual misc subtype on the timeline card badge
  // (for example: Competition, Achievement, Certificate) while keeping the tab label as "Misc.".
  miscLabel?: string;
  organization: string;
  period: string;
  title: string;
};

type TimelineCategoryMeta = {
  accent: string;
  icon: IconType;
  label: string;
  shortLabel: string;
  tabLabel: string;
};

const TIMELINE_CATEGORY_META: Record<TimelineCategory, TimelineCategoryMeta> = {
  education: {
    accent: "var(--site-accent)",
    icon: FaGraduationCap,
    label: "Education",
    shortLabel: "Edu",
    tabLabel: "Education",
  },
  misc: {
    accent: "var(--site-accent-cyan)",
    icon: FaFlag,
    label: "Misc.",
    shortLabel: "Misc",
    tabLabel: "Misc.",
  },
  work: {
    accent: "var(--site-accent-teal)",
    icon: FaBriefcase,
    label: "Work Experience",
    shortLabel: "Work",
    tabLabel: "Work Experience",
  },
};

const TIMELINE_FILTERS: TimelineFilter[] = ["all", "work", "education", "misc"];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    category: "education",
    details: [
      "Course transferred to Computer Science in pursuit of becoming a SWE.",
      "Continuation as Teaching Assistant for CS2040C since AY2024/25 Semester 1.",
      "Awarded the Certificate of Distinction in Computer Security Focus Area",
      "Distinction in CS3235.",
      "Current GPA: 4.48.",
    ],
    id: "nus-cs",
    organization: "National University of Singapore (NUS)",
    period: "Ongoing (2024 - 2027)",
    title: "B.Comp in Computer Science",
  },
  {
    category: "education",
    details: [
      "Teaching Assistant for CS2040C for AY2023/24 Semester 2.",
      "Distinction in CS2107.",
    ],
    id: "nus-infosec",
    organization: "National University of Singapore (NUS)",
    period: "2023 - 2024",
    title: "B.Comp in Information Security",
  },
  {
    category: "work",
    details: [
      "Developed a web app for use by DSO to maximize workflow efficiency.",
      "Skills involved: PhpMyAdmin, AMPPS, Flask.",
    ],
    id: "dso-part-time-swe",
    organization: "DSO National Laboratories",
    period: "2021",
    title: "Part-time Software Engineer",
  },
  {
    category: "work",
    details: [
      "R&D of commonly used Key Derivation Functions (KDFs) on an FPGA using VHDL.",
      "Skills involved: Cryptography, VHDL, FPGA.",
    ],
    id: "dso-internship",
    organization: "DSO National Laboratories",
    period: "2021",
    title: "Singapore Polytechnic Internship Program",
  },
  {
    category: "work",
    details: [
      "Volunteered on the Talent Development Team to create and organize opportunities for youths exploring the cybersecurity sector.",
    ],
    id: "cys-manager",
    organization: "Cyber Youth Singapore (CYS)",
    period: "2020",
    title: "Manager, Talent Development Team",
  },
  {
    category: "misc",
    details: [
      "Placed 36th out of 237 participating teams in the CDDC 2020 CTF organized by DSTA.",
    ],
    id: "cddc-2020",
    miscLabel: "Competition",
    organization: "Cyber Defenders Discovery Camp (CDDC)",
    period: "2020",
    title: "CDDC 2020 CTF, 36th place",
  },
  {
    category: "misc",
    details: [
      "Placed 2nd out of 41 teams in the Gryphons CTF 2020 event.",
    ],
    id: "gryphons-ctf-2020",
    miscLabel: "Competition",
    organization: "Singapore Polytechnic Gryphons",
    period: "2020",
    title: "Gryphons CTF 2020, 2nd place",
  },
  {
    category: "education",
    details: [
      "Club activity: SP Photography and SP Inline Skating.",
      "Distinction in Web Client Development, Programming in Python and C, Database Management Systems, and Social Innovation Project.",
      "Cumulative GPA: 3.696.",
    ],
    id: "sp-diploma",
    organization: "Singapore Polytechnic",
    period: "2018 - 2021",
    title: "Diploma in Infocomm Security Management",
  },
  {
    category: "education",
    details: [
      "Entered PFP after strong GCE \"N\"-Level results, in place of taking the GCE \"O\"-Level Examination.",
    ],
    id: "sp-pfp",
    organization: "Singapore Polytechnic",
    period: "2017",
    title: "Polytechnic Foundation Program (PFP)",
  },
  {
    category: "education",
    details: [
      "Club activity: GSS Chinese Orchestra.",
      "Results: EMB3 of 6.",
    ],
    id: "gce-n-level",
    organization: "Greenridge Secondary School",
    period: "2013 - 2016",
    title: "GCE \"N\"-Level Examination",
  },
];

const getFilterLabel = (filter: TimelineFilter) => {
  if (filter === "all") {
    return "All";
  }

  return TIMELINE_CATEGORY_META[filter].tabLabel;
};

const getFilteredItems = (filter: TimelineFilter) => {
  return filter === "all"
    ? TIMELINE_ITEMS
    : TIMELINE_ITEMS.filter((item) => item.category === filter);
};

const alignScrollToTimeline = () => {
  const timelineSection = document.getElementById("timeline");

  if (!timelineSection) {
    return;
  }

  const scrollMarginTop =
    Number.parseFloat(getComputedStyle(timelineSection).scrollMarginTop) || 0;
  const top =
    window.scrollY + timelineSection.getBoundingClientRect().top - scrollMarginTop;

  window.scrollTo({
    top: Math.max(0, top),
  });
};

const LandingTimeline = () => {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");
  const previousFilterRef = useRef<TimelineFilter | null>(null);

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out-quart", once: true });
  }, []);

  const filteredItems = getFilteredItems(activeFilter);

  useEffect(() => {
    if (previousFilterRef.current === null) {
      previousFilterRef.current = activeFilter;
      return;
    }

    if (previousFilterRef.current === activeFilter) {
      return;
    }

    previousFilterRef.current = activeFilter;

    window.requestAnimationFrame(() => {
      AOS.refreshHard();
      alignScrollToTimeline();
    });
  }, [activeFilter]);

  return (
    <section
      className="mx-auto flex flex-col pb-10
        max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Timeline
      </h1>

      <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="60">
        {TIMELINE_FILTERS.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                if (isActive) {
                  return;
                }

                setActiveFilter(filter);
              }}
              className={`rounded-full border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-150 sm:text-[0.82rem]
                ${
                  isActive
                    ? "border-[color:var(--site-accent-border-soft)] bg-[color:var(--site-accent-strong)] text-[color:var(--site-text-strong)]"
                    : "border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)] hover:text-[color:var(--site-text-strong)]"
                }`}
              aria-pressed={isActive}
            >
              {getFilterLabel(filter)}
            </button>
          );
        })}
      </div>

      <p
        className="mt-3 text-[0.78rem] uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]"
        data-aos="fade-up"
        data-aos-delay="90"
      >
        Showing {filteredItems.length} {filteredItems.length === 1 ? "entry" : "entries"}
      </p>

      <div className="landing-timeline-rail relative mt-6">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[1.125rem] top-2 w-px bg-[color:var(--site-divider)] sm:left-6"
        />

        <div className="space-y-5">
          {filteredItems.map((item, index) => {
            const meta = TIMELINE_CATEGORY_META[item.category];
            const Icon = meta.icon;
            const badgeLabel = item.category === "misc" ? item.miscLabel ?? meta.label : meta.label;
            const accentStyle = {
              "--timeline-accent": meta.accent,
            } as CSSProperties;

            return (
              <article
                key={`${activeFilter}-${item.id}`}
                className="relative pl-10 sm:pl-14"
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 45, 180)}
              >
                <div
                  className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-[color:var(--site-bg)] text-[color:var(--timeline-accent)] sm:h-12 sm:w-12"
                  style={{
                    borderColor: meta.accent,
                    color: meta.accent,
                  }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>

                <div
                  className="site-surface-card relative overflow-hidden rounded-[14px] px-5 py-5 sm:px-6 sm:py-6"
                  style={accentStyle}
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[color:var(--timeline-accent)]" />
                  <div className="relative flex flex-col gap-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)] sm:text-[0.9rem]">
                          {item.period}
                        </p>
                        <h2 className="pt-2 text-[1.16rem] font-semibold text-[color:var(--site-text-strong)] sm:text-[1.35rem]">
                          {item.title}
                        </h2>
                        <p className="pt-1 text-[0.98rem] text-[color:var(--site-text-muted)] sm:text-[1.04rem] md:text-[1.2rem]">
                          {item.organization}
                        </p>
                      </div>

                      <span
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--timeline-accent)]"
                        style={accentStyle}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {item.category === "work" ? (
                          <>
                            <span className="md:hidden lg:inline">Work Experience</span>
                            <span className="hidden md:inline lg:hidden">Experience</span>
                          </>
                        ) : (
                          badgeLabel
                        )}
                      </span>
                    </div>

                    <div className="rounded-[10px] border border-[color:var(--site-border)] bg-[color:rgba(10,10,10,0.24)] px-4 py-3">
                      <div className="space-y-3">
                        {item.details.map((detail) => (
                          <p
                            key={`${item.id}-${detail}`}
                            className="relative pl-5 text-[0.96rem] leading-7 text-[color:var(--site-text-strong)]
                              before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-[color:var(--timeline-accent)] before:content-['']
                              sm:text-[1rem]"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingTimeline;
