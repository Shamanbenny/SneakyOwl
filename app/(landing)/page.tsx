"use client";

import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import CuriousCatClickTrap from "@/app/components/landing/CuriousCatClickTrap";
import GitHubCommitSnake from "@/app/components/landing/GitHubCommitSnake";
import LandingReviews from "@/app/components/landing/LandingReviews";
import LandingTimeline from "@/app/components/landing/LandingTimeline";
import LocationMapCard from "@/app/components/landing/LocationMapCard";
import MagicBento from "@/app/components/landing/MagicBento";
import ProfileHoloCard from "@/app/components/landing/ProfileHoloCard";
import ProjectsSection from "@/app/components/landing/ProjectsSection";
import SkillsSection from "@/app/components/landing/SkillsSection";
import DecryptedText from "@/app/components/shared/display/DecryptedText";
import RotatingText from "@/app/components/shared/display/RotatingText";
import { LandingPageSkeleton } from "@/app/components/shared/feedback/PageSkeletons";
import NavBar from "@/app/components/shared/navigation/NavBar";

const SWE_VALUE_ROTATIONS = [
  "passion & curiousity",
  "clean system design",
  "clear communication",
  "maintainable codebases",
];

const LANDING_CRITICAL_IMAGE_SOURCES = [
  "/landing/sneakyOwl_1.jpg",
  "/landing/PeerPrep.png",
  "/landing/RafflesGo.png",
  "/landing/ChessFlask.png",
  "/reviewImages/gaanesh.jpg",
  "/reviewImages/anonymous.png",
  "https://raw.githubusercontent.com/Shamanbenny/Shamanbenny.github.io/output/snake-dark.svg",
];

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new window.Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });

const LandingPage: React.FC = () => {
  const emailHref = "mailto:lee.jia.quan@u.nus.edu";
  const [isAliasHovered, setIsAliasHovered] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fontReady =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();

    Promise.all([
      fontReady,
      ...LANDING_CRITICAL_IMAGE_SOURCES.map((imageSource) => preloadImage(imageSource)),
    ]).then(() => {
      if (isActive) {
        setIsPageReady(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const navigateToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const scrollMarginTop = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const top = window.scrollY + section.getBoundingClientRect().top - scrollMarginTop;

    window.scrollTo({ behavior: "smooth", top: Math.max(0, top) });
  };

  const navigateToProjects = () => navigateToSection("projects");
  const navigateToTimeline = () => navigateToSection("timeline");

  const renderCardEyebrow = (label: string, status?: "busy" | "available") => (
    <span className="inline-flex items-center gap-[0.45rem] text-[0.65em] uppercase tracking-[0.06em] text-[color:var(--site-text-muted)]">
      {status ? (
        <span
          className={`h-2 w-2 rounded-full ${
            status === "busy"
              ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.65)]"
              : "bg-[color:var(--site-accent)] shadow-[0_0_8px_rgba(16,185,129,0.65)]"
          }`}
        />
      ) : null}
      {label}
    </span>
  );

  const renderDefaultCardContent = ({
    label,
    value,
    description,
    status,
    extraContent,
  }: {
    label: string;
    value: string;
    description?: string;
    status?: "busy" | "available";
    extraContent?: React.ReactNode;
  }) => (
    <div className="relative flex h-full flex-col">
      <header className="relative z-[1] flex justify-between">
        {renderCardEyebrow(label, status)}
      </header>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h2 className="mb-[0.2em] text-[clamp(1.5rem,1.2rem+1.4vw,2.6rem)] font-[500] leading-none text-[color:var(--site-text-strong)]">
          {value}
        </h2>
        {description ? (
          <p className="m-0 max-w-[14ch] text-[0.9em] leading-[1.2] text-[color:var(--site-text-muted)] opacity-90">
            {description}
          </p>
        ) : null}
        {extraContent ? <div className="mt-[0.65em]">{extraContent}</div> : null}
      </div>
    </div>
  );

  const hireabilityCards = [
    {
      id: "socials",
      size: "large" as const,
      content: <CuriousCatClickTrap emailHref={emailHref} />,
    },
    {
      id: "current-status",
      size: "small" as const,
      content: renderDefaultCardContent({
        label: "Current Status",
        value: "Intern",
        description: "at Synapxe",
        status: "busy",
      }),
    },
    {
      id: "location",
      size: "small" as const,
      content: <LocationMapCard />,
    },
    {
      id: "experience",
      size: "small" as const,
      onClick: navigateToTimeline,
      content: renderDefaultCardContent({
        label: "Work Experience",
        value: "1 year",
        description: "in cybertech",
      }),
    },
    {
      id: "current-gpa",
      size: "small" as const,
      onClick: navigateToTimeline,
      content: renderDefaultCardContent({
        label: "Current GPA",
        value: "4.48",
        description: "NUS Computer Science",
      }),
    },
    {
      id: "projects",
      size: "small" as const,
      onClick: navigateToProjects,
      content: renderDefaultCardContent({
        label: "Projects",
        value: "3",
        description: "Completed Projects",
      }),
    },
    {
      id: "deployments",
      size: "small" as const,
      content: renderDefaultCardContent({
        label: "Deployments",
        value: "1",
        description: "Successful Deployment",
      }),
    },
  ];

  return (
    <div className="relative" aria-busy={!isPageReady}>
      {!isPageReady ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <LandingPageSkeleton />
        </div>
      ) : null}
      <NavBar />
      <div
        aria-hidden={!isPageReady}
        className={`site-page-shell z-[-1] min-h-screen
          transition-[opacity,visibility] duration-200 ease-linear
          ${isPageReady ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
          transition-colors duration-150 ease-linear xs:pt-[80px] sm:pt-[100px] xl:pt-[80px] xxl:pt-[130px]`}
      >
        {/* [START] Landing Hero Banner */}
        <div
          id="home"
          className="mx-auto grid w-full items-start gap-6 pb-10
            max-sm:w-[300px] max-sm:grid-cols-1 max-xs:max-w-[230px]
            sm:max-w-[560px] sm:grid-cols-1 sm:px-5 md:max-w-[680px] md:px-5
            lg:max-w-[910px] lg:grid-cols-1 lg:px-10 xl:max-w-[1160px]
            xl:gap-10 xl:px-[40px] xl:grid-cols-[7fr_3fr] xxl:max-w-[1480px] xxl:grid-cols-[3fr_1fr] xxl:px-[40px] scroll-mt-[10px]"
        >
          {/* [LEFT] BENTO */}
          <div className="order-2 w-full max-sm:mx-auto sm:relative sm:z-[1]">
            <div
              onMouseEnter={() => setIsAliasHovered(true)}
              onMouseLeave={() => setIsAliasHovered(false)}
            >
              <h1
                className="max-md:text-center max-sm:text-[1.4rem] sm:text-[2.5rem] md:text-[3rem] xl:text-[3.2rem] xxl:text-[4rem]"
              >
                Lee Jia Quan,{" "}
                <DecryptedText
                  text="Benny"
                  hoverText="SneakyOwl"
                  isActive={isAliasHovered}
                  speed={35}
                  maxIterations={16}
                  sequential={true}
                  revealDirection="start"
                  className="text-[color:var(--site-text-strong)]"
                  encryptedClassName="text-[color:var(--site-accent-soft)]"
                />
              </h1>
              <div className="flex flex-nowrap items-center gap-1 overflow-hidden max-sm:justify-center xs:flex-col md:flex-row">
                <div className="flex flex-nowrap items-center gap-1">
                  <FaAngleRight className="w-auto text-[color:var(--site-text-muted)] max-sm:h-[1rem] max-xs:text-[0.7rem] sm:h-[14px] md:h-[17px] lg:h-[22.4px] xl:h-[27.2px] xxl:h-[36px]" />
                  <h1
                    className="whitespace-nowrap text-[color:var(--site-text-muted)] xxl:text-[1.5rem] lg:text-[1.35rem] sm:text-[1.2rem] text-[0.8rem]"
                  >
                    I&#39;m a Software Engineer who values
                  </h1>
                </div>
                <RotatingText
                  texts={SWE_VALUE_ROTATIONS}
                  className="xs:ml-0 md:ml-1 xxl:text-[1.5rem] lg:text-[1.35rem] sm:text-[1.2rem] text-[0.8rem]"
                  rotationInterval={2200}
                />
              </div>
            </div>
              <MagicBento
                cards={hireabilityCards}
                enableBorderGlow={true}
                glowColor="16, 185, 129"
              />
          </div>

          {/* [RIGHT] Profile Holo Card */}
          <div className="order-1 flex h-full w-full flex-col items-center justify-start gap-5 sm:relative sm:z-0 xl:order-2 xl:justify-center">
            <ProfileHoloCard
              name="Lee Jia Quan, Benny"
              title="Full-stack Engineer"
              imageSrc="/landing/sneakyOwl_1.jpg"
              idCode="1337-5T4C-K9001"
            />
            <a
              href="/Lee%20Jia%20Quan_CV.pdf"
              download="Lee Jia Quan_CV.pdf"
              className="relative z-10 inline-flex h-11 min-w-[6.9rem] items-center justify-center gap-2 rounded-[0.75rem] border border-[color:var(--site-accent-strong)] bg-[color:var(--site-accent)] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--site-selection-text)] transition duration-150 ease-linear hover:-translate-y-[1px] hover:border-[color:var(--site-accent-strong)] hover:bg-[color:var(--site-accent-strong)] focus-visible:-translate-y-[1px] focus-visible:border-[color:var(--site-accent-strong)] focus-visible:bg-[color:var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--site-bg)] active:bg-[color:var(--site-accent-strong)] xxl:h-14 xxl:min-w-[8.1rem] xxl:text-[1rem]"
            >
              <FiFileText className="text-base" aria-hidden="true" />
              <span>Resume</span>
            </a>
          </div>
        </div>
        {/* [END] Landing Hero Banner */}
        <ProjectsSection />
        <SkillsSection />
        <div id="timeline" className="scroll-mt-[10px]">
          <LandingTimeline />
        </div>
        <div
          id="reviews"
          className="mx-auto scroll-mt-[10px] pb-10
            max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
            lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
        >
          <h1
            className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
            max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
          >
            Testimonials
          </h1>
          <LandingReviews />
        </div>
        <GitHubCommitSnake />
      </div>
    </div>
  );
};

export default LandingPage;
