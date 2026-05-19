"use client";

import dynamic from "next/dynamic";
import React from "react";
import { FaAngleRight } from "react-icons/fa";
import AboutTimeline from "./AboutTimeline";
import AboutReviews from "./AboutReviews";
import CuriousCatClickTrap from "./CuriousCatClickTrap";
import LocationMapCard from "./LocationMapCard";
import MagicBento from "./MagicBento";
import RotatingText from "./RotatingText";

const ProfileHoloCard = dynamic(() => import("./ProfileHoloCard"), {
  ssr: false,
});

const eyebrowClassName =
  "inline-flex items-center gap-[0.45rem] text-[0.65em] uppercase tracking-[0.06em] text-[color:var(--site-text-muted)]";
const cardValueClassName =
  "mb-[0.2em] text-[clamp(1.5rem,1.2rem+1.4vw,2.6rem)] font-[500] leading-none text-[color:var(--site-text-strong)]";
const cardDescriptionClassName =
  "m-0 max-w-[14ch] text-[0.9em] leading-[1.2] text-[color:var(--site-text-muted)] opacity-90";
const subheadRowClassName =
  "flex flex-nowrap items-center gap-1 overflow-hidden max-sm:justify-center xs:flex-col sm:flex-row";
const subheadIconClassName =
  "w-auto text-[color:var(--site-text-muted)] max-sm:h-[1rem] max-xs:text-[0.7rem] sm:h-[14px] md:h-[17px] lg:h-[22.4px] xl:h-[27.2px] xxl:h-[36px]";
const subheadTextClassName =
  "whitespace-nowrap text-[0.8rem] text-[color:var(--site-text-muted)] sm:text-[1.2rem] lg:text-[1.35rem] xxl:text-[1.5rem]";
const rotatingTextClassName =
  "text-[0.8rem] xs:ml-0 sm:ml-1 sm:text-[1.2rem] lg:text-[1.35rem] xxl:text-[1.5rem]";

export const About: React.FC = () => {
  const emailHref = "mailto:lee.jia.quan@u.nus.edu";
  const sweValueRotations = [
    "passion & curiosity",
    "clean system design",
    "clear communication",
    "maintainable codebases",
  ];

  const renderCardEyebrow = (label: string, status?: "busy" | "available") => (
    <span className={eyebrowClassName}>
      {status ? (
        <span
          className={`h-2 w-2 rounded-full ${
            status === "busy"
              ? "site-status-dot site-status-dot--busy"
              : "site-status-dot site-status-dot--available"
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
        <h2 className={cardValueClassName}>{value}</h2>
        {description ? (
          <p className={cardDescriptionClassName}>{description}</p>
        ) : null}
        {extraContent ? (
          <div className="mt-[0.65em]">{extraContent}</div>
        ) : null}
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
      content: renderDefaultCardContent({
        label: "Work Experience",
        value: "1 year",
        description: "in tech",
      }),
    },
    {
      id: "current-gpa",
      size: "small" as const,
      content: renderDefaultCardContent({
        label: "Current GPA",
        value: "4.46",
        description: "NUS Computer Science",
      }),
    },
    {
      id: "projects",
      size: "small" as const,
      content: renderDefaultCardContent({
        label: "Completed Projects",
        value: "3",
        description: "Click for more info",
      }),
    },
    {
      id: "deployments",
      size: "small" as const,
      content: renderDefaultCardContent({
        label: "Deployments",
        value: "1",
        description: "Live production deployment",
      }),
    },
  ];

  return (
    <>
      <div
        className="site-page-shell z-[-1] min-h-screen pt-[92px]
          transition-colors duration-150 ease-linear sm:pt-[130px]"
      >
        {/* [START] About Me Hero Banner */}
        <div
          id="home"
          className="mx-auto grid w-full scroll-mt-[92px] items-start gap-6
            pb-4 max-sm:w-[300px] max-sm:grid-cols-1
            max-xs:max-w-[230px] sm:max-w-[560px] sm:scroll-mt-[130px] sm:grid-cols-1 sm:px-5
            md:max-w-[680px] md:px-5 lg:max-w-[910px] lg:grid-cols-1
            lg:px-10 xl:max-w-[1160px] xl:grid-cols-[4fr_1fr] xl:gap-10 xl:px-[40px] xxl:max-w-[1480px] xxl:grid-cols-[4fr_1fr] xxl:px-[40px]"
        >
          {/* [LEFT] BENTO */}
          <div className="order-2 w-full max-sm:mx-auto sm:relative sm:z-[1]">
            <h1
              className="max-sm:text-center max-sm:text-[1.8rem] max-xs:text-[1.4rem] 
              sm:text-[1.5rem] md:text-[2.5rem] xl:text-[3.2rem] xxl:text-[4rem]"
            >
              Lee Jia Quan, Benny
            </h1>
            <div className={subheadRowClassName}>
              <div className="flex flex-nowrap items-center gap-1">
                <FaAngleRight className={subheadIconClassName} />
                <h1 className={subheadTextClassName}>
                  I&#39;m a Software Engineer who values
                </h1>
              </div>
              <RotatingText
                texts={sweValueRotations}
                className={rotatingTextClassName}
                rotationInterval={2200}
              />
            </div>
            <MagicBento
              cards={hireabilityCards}
              enableBorderGlow={true}
              glowColor="16, 185, 129"
            />
          </div>

          {/* [RIGHT] Profile Holo Card */}
          <div className="order-1 flex h-full w-full items-start justify-center sm:relative sm:z-0 xl:order-2 xl:items-center">
            <ProfileHoloCard
              name="Lee Jia Quan, Benny"
              title="Full-stack Engineer"
              imageSrc="/sneakyOwl_1.jpg"
              idCode="1337-5T4C-K9001"
            />
          </div>
        </div>
        {/* [END] About Me Hero Banner */}
        <div id="reviews" className="scroll-mt-[92px] sm:scroll-mt-[130px]">
          <h1
            className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
            max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
          >
            What My Friends Think Of Me
          </h1>
          <AboutReviews />
        </div>
        <div id="timeline" className="scroll-mt-[92px] sm:scroll-mt-[130px]">
          <AboutTimeline />
        </div>
      </div>
    </>
  );
};
