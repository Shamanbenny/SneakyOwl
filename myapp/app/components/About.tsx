"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaAngleRight,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import AboutTimeline from "./AboutTimeline";

export const About: React.FC = () => {
  /* AppContent Divider Size Rendering based on User's Width*/
  const [clientWidth, setClientWidth] = useState<number>(1600);
  const [clientHeight, setClientHeight] = useState<number>(900);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  const handleResize = () => {
    setClientWidth(window.innerWidth);
    setClientHeight(window.innerHeight);
  };

  /* [START] Array of string for iterating personality */
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [personalityIndex, setPersonalityIndex] = useState<number>(0);
  const personalityRefs: RefObject<HTMLHeadingElement>[] = [];
  const personality = [
    "an NUS Student",
    "a Software Engineer",
    "a Fullstack Web Developer",
    "an Information Security Analyst",
    "a Game Developer",
    "a LLMs Enthusiast",
    "a Curious Individual!",
  ];
  for (let i = 0; i < personality.length; i++) {
    personalityRefs.push(React.createRef<HTMLHeadingElement>());
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setPersonalityIndex((personalityIndex + 1) % personality.length);
    }, 2000); // 3 seconds
    setTimeoutId(id);

    if (personalityRefs[personalityIndex].current) {
      let prevPersonalityIndex;
      if (personalityIndex) prevPersonalityIndex = personalityIndex - 1;
      else prevPersonalityIndex = personality.length - 1;
      personalityRefs[personalityIndex].current?.classList.remove("hidden");
      personalityRefs[prevPersonalityIndex].current?.classList.add("hidden");
      // Following warning can be ignored...
      personalityRefs[personalityIndex].current.dataset.text =
        personality[personalityIndex];
    }
  }, [personalityIndex]);
  /* [END] Array of string for iterating personality */

  /* [START] Introduction Span */
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
      introDivRef.current.children[1].classList.toggle("max-h-0");
      introDivRef.current.children[1].classList.toggle("max-h-[500px]");
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
      careerObjDivRef.current.children[1].classList.toggle("max-h-0");
      careerObjDivRef.current.children[1].classList.toggle("max-h-[500px]");
    }
  };
  /* [END] Introduction Span */

  return (
    <>
      <div
        className={
          clientWidth < 640
            ? `h-full min-h-screen bg-neutral-300 pl-0 pt-[56px] text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300`
            : `h-full min-h-screen bg-neutral-300 pl-[64px] pt-0 text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        {/* [START] About Me Hero Banner */}
        <div
          className="mx-auto flex w-full items-center  max-sm:h-[50%] 
            max-sm:min-h-[600px] max-sm:w-[300px] max-sm:grid-cols-1 max-sm:grid-rows-2 max-sm:flex-col sm:h-[50%] 
            sm:min-h-[350px] sm:max-w-[570px] sm:grid-cols-2 sm:gap-4 sm:px-5 md:h-[70%] 
            md:min-h-[500px] md:max-w-[704px] md:px-5 lg:h-[90%] lg:min-h-[600px] lg:max-w-[944px] 
            lg:gap-8 lg:px-10 xl:min-h-[700px] xl:max-w-[1200px] xl:px-[60px] xxl:min-h-[810px] xxl:max-w-[1520px] xxl:px-[80px]"
        >
          <div className="flex h-full w-full items-center justify-center text-center duration-0 max-sm:flex sm:hidden">
            <Image
              src="/sneakyOwl_1.jpg"
              width={512}
              height={512}
              alt="Profile Picture"
              className="h-[250px] w-[250px] rounded-[50%] duration-0 max-sm:mt-[100px] md:h-[310px] md:w-[310px] 
                lg:h-[400px] lg:w-[400px] xl:h-[512px] xl:w-[512px] xl:scale-100 xxl:scale-125"
            />
          </div>
          <div className="w-full  max-sm:mx-auto">
            <h1
              className=" max-sm:text-[1.8rem] 
              sm:text-[1.5rem] md:text-[1.9rem] lg:text-[2.5rem] xl:text-[3.2rem] xxl:text-[4rem]"
            >
              Lee Jia Quan, Benny
            </h1>
            <div className="flex items-center ">
              <FaAngleRight className="w-auto dark:text-neutral-400 max-sm:h-[1rem] sm:h-[14px] md:h-[17px] lg:h-[22.4px] xl:h-[27.2px] xxl:h-[36px]" />
              <h1
                className=" 
                dark:text-neutral-400 max-sm:text-[1rem] sm:text-[14px] md:text-[17px] lg:text-[22.4px] xl:text-[27.2px] xxl:text-[36px]"
              >
                I&#39;m
              </h1>
              {personality.map((element, index) => (
                <span
                  key={index}
                  ref={personalityRefs[index]}
                  className="personality-animation hidden transition-all duration-150 
                    ease-linear max-sm:pl-[4px] max-sm:text-[1rem] sm:pl-[4px] sm:text-[13px] 
                    md:pl-[5px] md:text-[17px] lg:pl-[7px] lg:text-[1.35rem] xl:pl-[8px] xl:text-[1.7rem] xxl:pl-[10px] xxl:text-[34px]"
                >
                  {element}
                </span>
              ))}
            </div>
            <div className="flex w-[50%] pt-4  max-sm:w-[70%]">
              <a
                href="https://www.linkedin.com/in/shamanbenny/"
                className="group mx-auto ml-0"
              >
                <FaLinkedin
                  className="transition-all duration-150 ease-linear group-hover:scale-125 
                  group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                  max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center 
                    text-sm  group-hover:scale-y-100 
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
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                    max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center 
                    text-sm  group-hover:scale-y-100 
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
                  className="transition-all duration-150 ease-linear group-hover:scale-125 
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                    max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                />
                <span
                  className="absolute mt-1 flex scale-y-0 items-center justify-center 
                    text-sm  group-hover:scale-y-100 
                    xl:pt-4 xl:text-[1.2rem]"
                >
                  GitHub
                </span>
              </a>
            </div>
          </div>
          <div className="h-full w-full items-center justify-center text-center duration-0 max-sm:hidden sm:flex">
            <Image
              src="/sneakyOwl_1.jpg"
              width={512}
              height={512}
              alt="Profile Picture"
              className="h-[250px] w-[250px] rounded-[50%] duration-0 md:h-[310px] md:w-[310px] 
                lg:h-[400px] lg:w-[400px] xl:h-[512px] xl:w-[512px] xl:scale-100 xxl:scale-125"
            />
          </div>
        </div>
        {/* [END] About Me Hero Banner */}

        {/* [START] Introduction Span */}
        <div ref={introDivRef} className="mb-5">
          <div
            className="group mx-auto flex cursor-pointer items-center text-center transition-all 
              duration-150 ease-linear max-sm:w-[400px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
            onClick={onClickIntro}
          >
            <h1
              className="mx-auto w-full rounded-b-md rounded-t-md bg-emerald-700 py-1 
              text-[1.4rem] transition-all duration-150 ease-linear group-hover:bg-emerald-600 
              dark:bg-emerald-600 group-hover:dark:bg-emerald-500 lg:text-[1.8rem] xl:rounded-b-lg 
              xl:rounded-t-lg xl:py-1.5 xl:text-[2rem] xxl:rounded-b-xl xxl:rounded-t-xl xxl:py-2 
              xxl:text-[2.4rem]"
            >
              Introduction
            </h1>
            <span
              className="absolute transition-all duration-150 ease-linear max-sm:pl-[360px] 
              sm:pl-[515px] md:pl-[640px] lg:pl-[864px] xl:pl-[1100px] xxl:pl-[1420px]"
            >
              <FaAngleRight
                className="h-[25px] w-[25px] rotate-90 rounded-[50%] bg-neutral-900 
                text-neutral-300 transition-all duration-150 ease-linear dark:bg-neutral-800 
                dark:text-neutral-300 lg:h-[30px] lg:w-[30px] xl:h-[40px] xl:w-[40px]"
              />
            </span>
          </div>
          <div
            className="mx-auto flex max-h-0 overflow-hidden transition-all duration-150 ease-linear 
            max-sm:w-[400px] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
          >
            <p
              className="rounded-b-md bg-neutral-400 px-[24px] py-2 text-justify 
              dark:bg-neutral-800 lg:px-[28px] lg:py-3 xl:rounded-b-lg xl:px-[40px] xl:py-4 
              xl:text-[1.1rem] xxl:rounded-b-xl xxl:py-5 xxl:text-xl"
            >
              I am a naturally inquisitive person, whose easily captivated by
              the vast amount of knowledge made available to us. As I pursue my
              degree in Information Security, my goal is to integrate my
              academic learning with its application in the real world.
              Throughout my educational journey, I&#39;ve discovered a passion
              for educating others, sparking interest in subjects they may
              initially find irrelevant. Through engaging and meaningful
              discussions, I&#39;ve helped others develop a greater
              understanding and appreciation for topics such as Data Structure &
              Algorithms, Machine Learning/LLMs, and basic Programming
              principles.
            </p>
          </div>
        </div>
        {/* [END] Introduction Span */}

        {/* [START] Career Objective Span */}
        <div ref={careerObjDivRef} className="mb-5">
          <div
            className="group mx-auto flex cursor-pointer items-center text-center transition-all 
              duration-150 ease-linear max-sm:w-[400px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
            onClick={onClickCareerObj}
          >
            <h1
              className="mx-auto w-full rounded-b-md rounded-t-md bg-emerald-700 py-1 
              text-[1.4rem] transition-all duration-150 ease-linear group-hover:bg-emerald-600 
              dark:bg-emerald-600 group-hover:dark:bg-emerald-500 lg:text-[1.8rem] xl:rounded-b-lg 
              xl:rounded-t-lg xl:py-1.5 xl:text-[2rem] xxl:rounded-b-xl xxl:rounded-t-xl xxl:py-2 
              xxl:text-[2.4rem]"
            >
              Career Objective
            </h1>
            <span
              className="absolute transition-all duration-150 ease-linear max-sm:pl-[360px] 
              sm:pl-[515px] md:pl-[640px] lg:pl-[864px] xl:pl-[1100px] xxl:pl-[1420px]"
            >
              <FaAngleRight
                className="h-[25px] w-[25px] rotate-90 rounded-[50%] bg-neutral-900 
                text-neutral-300 transition-all duration-150 ease-linear dark:bg-neutral-800 
                dark:text-neutral-300 lg:h-[30px] lg:w-[30px] xl:h-[40px] xl:w-[40px]"
              />
            </span>
          </div>
          <div
            className="mx-auto flex max-h-0 overflow-hidden transition-all duration-150 ease-linear 
            max-sm:w-[400px] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
          >
            <p
              className="rounded-b-md bg-neutral-400 px-[24px] py-2 text-justify 
              dark:bg-neutral-800 lg:px-[28px] lg:py-3 xl:rounded-b-lg xl:px-[40px] xl:py-4 
              xl:text-[1.1rem] xxl:rounded-b-xl xxl:py-5 xxl:text-xl"
            >
              I firmly believe in the importance of exploring various aspects of
              cybersecurity rather than confining myself to a single area. My
              experiences at SP and now at NUS have allowed me to identify where
              I can make the most significant contributions within the InfoTech
              field. Recently, my growing interest in Data Structure &
              Algorithms, combined with a solid foundation in programming, has
              steered me towards a career as a Software Engineer. Over the next
              few years, I aim to refine my skills and knowledge, and I plan to
              create practical, educational content that incorporates essential
              Software Engineering techniques.
            </p>
          </div>
        </div>
        {/* [END] Career Objective Span */}
        <AboutTimeline />
      </div>
    </>
  );
};
