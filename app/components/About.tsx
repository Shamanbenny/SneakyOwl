"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import {
  FaAngleRight,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import AboutTimeline from "./AboutTimeline";
import AboutReviews from "./AboutReviews";

const ProfileHoloCard = dynamic(() => import("./ProfileHoloCard"), {
  ssr: false,
});

export const About: React.FC = () => {
  /* [START] Array of string for iterating personality */
  const [personalityIndex, setPersonalityIndex] = useState<number>(0);
  const personality = [
    "an NUS Student",
    "a Software Engineer",
    "a Fullstack Web Developer",
    "an Information Security Analyst",
    "a Game Developer",
    "a LLMs Enthusiast",
    "a Curious Individual!",
  ];

  useEffect(() => {
    const id = setTimeout(() => {
      setPersonalityIndex((currentIndex) => (currentIndex + 1) % personality.length);
    }, 2000);

    return () => clearTimeout(id);
  }, [personality.length, personalityIndex]);
  /* [END] Array of string for iterating personality */

  /* [START] Introduction & Career Objective Collapsible Text */
  const introDivRef = useRef<HTMLDivElement>(null);
  const onClickIntro = () => {
    if (introDivRef.current) {
      introDivRef.current.children[0].children[1].children[0].classList.toggle(
        "rotate-[270deg]",
      );
      introDivRef.current.children[0].children[1].children[0].classList.toggle(
        "rotate-90",
      );
      introDivRef.current.children[0].children[0].classList.toggle(
        "xxl:rounded-b-xl",
      );
      introDivRef.current.children[0].children[0].classList.toggle(
        "xl:rounded-b-lg",
      );
      introDivRef.current.children[0].children[0].classList.toggle(
        "rounded-b-md",
      );

      const collapsibleElement = introDivRef.current.children[1];
      collapsibleElement.classList.toggle("max-h-0");
      collapsibleElement.classList.toggle("max-h-[600px]");
    }
  };
  const careerObjDivRef = useRef<HTMLDivElement>(null);
  const onClickCareerObj = () => {
    if (careerObjDivRef.current) {
      careerObjDivRef.current.children[0].children[1].children[0].classList.toggle(
        "rotate-[270deg]",
      );
      careerObjDivRef.current.children[0].children[1].children[0].classList.toggle(
        "rotate-90",
      );
      careerObjDivRef.current.children[0].children[0].classList.toggle(
        "xxl:rounded-b-xl",
      );
      careerObjDivRef.current.children[0].children[0].classList.toggle(
        "xl:rounded-b-lg",
      );
      careerObjDivRef.current.children[0].children[0].classList.toggle(
        "rounded-b-md",
      );
      const collapsibleElement = careerObjDivRef.current.children[1];
      collapsibleElement.classList.toggle("max-h-0");
      collapsibleElement.classList.toggle("max-h-[600px]");
    }
  };
  /* [END] Introduction & Career Objective Collapsible Text */

  return (
    <>
      <div
        className="site-page-shell z-[-1] min-h-screen pt-[92px]
          transition-colors duration-150 ease-linear sm:pt-[130px]"
      >
        {/* [START] About Me Hero Banner */}
        <div
          id="home"
          className="mx-auto flex w-full items-center justify-between gap-8 max-sm:min-h-[720px]
            scroll-mt-[92px] max-sm:w-[300px] max-sm:flex-col max-sm:justify-center
            max-xs:min-h-[680px] max-xs:max-w-[230px]
            sm:min-h-[350px] sm:max-w-[570px] sm:px-5 md:min-h-[500px] md:max-w-[704px] md:px-5
            lg:min-h-[600px] lg:max-w-[944px] lg:gap-10 lg:px-10 xl:min-h-[700px] xl:max-w-[1200px]
            xl:px-[60px] xxl:min-h-[810px] xxl:max-w-[1520px] xxl:px-[80px] sm:scroll-mt-[130px]"
        >
          <div className="order-1 flex h-full w-full items-center justify-center sm:order-2 sm:relative sm:z-0">
            <ProfileHoloCard
              name="Lee Jia Quan, Benny"
              title="Full-stack Engineer"
              imageSrc="/sneakyOwl_1.jpg"
              idCode="1337-5T4C-K9001"
            />
          </div>
          <div className="order-2 w-full max-sm:mx-auto sm:order-1 sm:relative sm:z-[1]">
            <h1
              className="max-sm:text-center max-sm:text-[1.8rem] max-xs:text-[1.4rem] 
              sm:text-[1.5rem] md:text-[1.9rem] lg:text-[2.5rem] xl:text-[3.2rem] xxl:text-[4rem]"
            >
              Lee Jia Quan, Benny
            </h1>
            <div className="flex items-center max-sm:justify-center">
              <FaAngleRight className="w-auto text-[color:var(--site-text-muted)] max-sm:h-[1rem] max-xs:text-[0.7rem] sm:h-[14px] md:h-[17px] lg:h-[22.4px] xl:h-[27.2px] xxl:h-[36px]" />
              <h1
                className="text-[color:var(--site-text-muted)] max-sm:text-[1rem] max-xs:text-[0.7rem] sm:text-[14px] md:text-[17px] lg:text-[22.4px] xl:text-[27.2px] xxl:text-[36px]"
              >
                I&#39;m
              </h1>
              <span
                key={personalityIndex}
                data-text={personality[personalityIndex]}
                className="personality-animation transition-all duration-150 ease-linear max-sm:pl-[4px] max-sm:text-[1rem] max-xs:text-[0.7rem] sm:pl-[4px] sm:text-[13px] md:pl-[5px] md:text-[17px] lg:pl-[7px] lg:text-[1.35rem] xl:pl-[8px] xl:text-[1.7rem] xxl:pl-[10px] xxl:text-[34px]"
              >
                {personality[personalityIndex]}
              </span>
            </div>
            <div className="flex w-[50%] pt-4 max-sm:mx-auto max-sm:w-[70%] max-xs:w-[50%]">
              <a
                href="https://www.linkedin.com/in/shamanbenny/"
                className="group mx-auto ml-0"
              >
                <FaLinkedin
                  className="transition-all duration-150 ease-linear group-hover:scale-125 group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                  max-sm:w-[3rem] max-xs:h-[2rem] 
                  max-xs:w-[2rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm group-hover:scale-y-100 
                    max-sm:hidden sm:block 
                    xl:pt-3 xl:text-[1.2rem]"
                >
                  LinkedIn
                </span>
              </a>
              <a
                href="https://www.instagram.com/shamanbenny/"
                className="group mx-auto"
              >
                <FaInstagram
                  className="transition-all duration-150 ease-linear group-hover:scale-125 
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] max-sm:w-[3rem] max-xs:h-[2rem] 
                    max-xs:w-[2rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm group-hover:scale-y-100 
                    max-sm:hidden sm:block 
                    xl:pt-3 xl:text-[1.2rem]"
                >
                  Instagram
                </span>
              </a>
              <a
                href="https://github.com/Shamanbenny"
                className="group mx-auto max-sm:mr-0"
              >
                <FaGithub
                  className="transition-all duration-150 ease-linear group-hover:scale-125 group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                    max-sm:w-[3rem] max-xs:h-[2rem] 
                    max-xs:w-[2rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm group-hover:scale-y-100 
                    max-sm:hidden sm:block 
                    xl:pt-4 xl:text-[1.2rem]"
                >
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </div>
        {/* [END] About Me Hero Banner */}

        {/* [START] Introduction Span */}
        <div id="intro" ref={introDivRef} className="z-[5] mb-5 scroll-mt-[92px] sm:scroll-mt-[130px]">
          <div
            className="group mx-auto flex cursor-pointer items-center text-center transition-all duration-150 
              ease-linear max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
            onClick={onClickIntro}
          >
            <h1
              className="site-accent-banner z-[5] mx-auto w-full rounded-b-md rounded-t-md
              py-1 transition-all duration-150 ease-linear max-sm:text-[1.4rem] max-xs:text-[1rem] lg:text-[1.8rem] 
              xl:rounded-b-lg xl:rounded-t-lg xl:py-1.5 xl:text-[2rem] xxl:rounded-b-xl xxl:rounded-t-xl 
              xxl:py-2 xxl:text-[2.4rem]"
            >
              Introduction
            </h1>
            <span
              className="absolute transition-all duration-150 ease-linear max-sm:pl-[260px] max-xs:pl-[200px] 
              sm:pl-[515px] md:pl-[640px] lg:pl-[864px] xl:pl-[1100px] xxl:pl-[1420px]"
            >
              <FaAngleRight
                className="site-chip-surface h-[25px] w-[25px] rotate-90 rounded-[50%]
                transition-all duration-150 ease-linear lg:h-[30px] lg:w-[30px] xl:h-[40px] xl:w-[40px]"
              />
            </span>
          </div>
          <div
            className="mx-auto flex max-h-0 overflow-hidden transition-all duration-150 ease-linear 
            max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
          >
            <p
              className="site-surface-panel rounded-b-md px-[24px] py-2 text-justify
              max-xs:text-[0.8rem] lg:px-[28px] lg:py-3 xl:rounded-b-lg xl:px-[40px] xl:py-4 
              xl:text-[1.1rem] xxl:rounded-b-xl xxl:py-5 xxl:text-xl"
            >
              I am a naturally inquisitive person, whose easily captivated by
              the vast amount of knowledge made available to us. As I pursue my
              degree in Information Security & Computer Science, my goal is to
              integrate my academic learning with its application in the real
              world. Throughout my educational journey, I&#39;ve discovered a
              passion for educating others, sparking interest in subjects they
              may initially find irrelevant. Through engaging and meaningful
              discussions, I&#39;ve helped others develop a greater
              understanding and appreciation for topics such as Data Structure &
              Algorithms, Machine Learning/LLMs, and basic Programming
              principles.
            </p>
          </div>
        </div>
        {/* [END] Introduction Span */}

        {/* [START] Career Objective Span */}
        <div
          id="objective"
          ref={careerObjDivRef}
          className="z-[5] mb-5 scroll-mt-[92px] sm:scroll-mt-[130px]"
        >
          <div
            className="group mx-auto flex cursor-pointer items-center text-center transition-all 
              duration-150 ease-linear max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
            onClick={onClickCareerObj}
          >
            <h1
              className="site-accent-banner mx-auto w-full rounded-b-md rounded-t-md py-1 
              transition-all duration-150 ease-linear
              max-sm:text-[1.4rem] max-xs:text-[1rem] lg:text-[1.8rem] xl:rounded-b-lg 
              xl:rounded-t-lg xl:py-1.5 xl:text-[2rem] xxl:rounded-b-xl xxl:rounded-t-xl xxl:py-2 
              xxl:text-[2.4rem]"
            >
              Career Objective
            </h1>
            <span
              className="absolute transition-all duration-150 ease-linear max-sm:pl-[260px] max-xs:pl-[200px] 
              sm:pl-[515px] md:pl-[640px] lg:pl-[864px] xl:pl-[1100px] xxl:pl-[1420px]"
            >
              <FaAngleRight
                className="site-chip-surface h-[25px] w-[25px] rotate-90 rounded-[50%]
                transition-all duration-150 ease-linear lg:h-[30px] lg:w-[30px] xl:h-[40px] xl:w-[40px]"
              />
            </span>
          </div>
          <div
            className="mx-auto flex max-h-0 overflow-hidden transition-all duration-150 ease-linear 
            max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
          >
            <p
              className="site-surface-panel z-[5] rounded-b-md px-[24px] py-2 text-justify
              max-xs:text-[0.8rem] lg:px-[28px] lg:py-3 xl:rounded-b-lg xl:px-[40px] 
              xl:py-4 xl:text-[1.1rem] xxl:rounded-b-xl xxl:py-5 xxl:text-xl"
            >
              I firmly believe in the importance of exploring various aspects of
              cybersecurity rather than confining myself to a single area. My
              experiences at SP and now at NUS have allowed me to identify where
              I can make the most significant contributions within the InfoTech
              field. Recently, my growing interest in Data Structure &
              Algorithms, combined with a solid foundation in programming, has
              steered me towards a career as a Software Engineer. Over the next
              few years, I aim to refine my skills and knowledge, while I plan
              to create practical and educational content that incorporates
              essential Software Engineering techniques.
            </p>
          </div>
        </div>
        {/* [END] Career Objective Span */}
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
