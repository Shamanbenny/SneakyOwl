"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  FaAngleRight,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

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
    }, 3000); // 3 seconds
    setTimeoutId(id);

    if (personalityRefs[personalityIndex].current) {
      let prevPersonalityIndex;
      if (personalityIndex) prevPersonalityIndex = personalityIndex - 1;
      else prevPersonalityIndex = personality.length - 1;
      personalityRefs[personalityIndex].current?.classList.remove("hidden");
      personalityRefs[prevPersonalityIndex].current?.classList.add("hidden");
      personalityRefs[personalityIndex].current.dataset.text =
        personality[personalityIndex];
    }
  }, [personalityIndex]);
  /* [END] Array of string for iterating personality */

  return (
    <>
      <div
        className={
          clientWidth < 640
            ? `h-screen bg-neutral-300 pl-0 pt-[56px] text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300`
            : `h-screen bg-neutral-300 pl-[64px] pt-0 text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        {/* [START] About Me Hero Banner */}
        <div
          className="mx-auto flex w-full items-center  max-sm:h-[50%] 
            max-sm:min-h-[500px] max-sm:w-[300px] max-sm:grid-cols-1 max-sm:grid-rows-2 max-sm:flex-col sm:h-[50%] 
            sm:min-h-[350px] sm:max-w-[570px] sm:grid-cols-2 sm:gap-4 sm:px-5 md:h-[70%] 
            md:min-h-[500px] md:max-w-[704px] md:px-5 lg:h-[90%] lg:min-h-[600px] lg:max-w-[944px] 
            lg:gap-8 lg:px-10 xl:min-h-[700px] xl:max-w-[1200px] xl:px-[60px] xxl:min-h-[810px] xxl:max-w-[1520px] xxl:px-[80px]"
        >
          <div className="flex h-full w-full items-center justify-center text-center duration-0 max-sm:flex sm:hidden">
            <img
              src="/sneakyOwl_1.jpg"
              alt="Profile Picture"
              className="h-[250px] w-[250px] rounded-[50%] duration-0 md:h-[310px] md:w-[310px] 
                lg:h-[400px] lg:w-[400px] xl:h-[512px] xl:w-[512px] xl:scale-100 xxl:scale-125"
            />
          </div>
          <div className="w-full  max-sm:mx-auto">
            <h1
              className=" max-sm:text-[1.8rem] 
              sm:text-[1.6rem] md:text-[2rem] lg:text-[2.6rem] xl:text-[3.2rem] xxl:text-[4rem]"
            >
              Lee Jia Quan, Benny
            </h1>
            <div className="flex items-center ">
              <FaAngleRight className="w-auto dark:text-neutral-400 max-sm:h-[1rem] sm:h-[14px] md:h-[17px] lg:h-[22.4px] xl:h-[27.2px] xxl:h-[36px]" />
              <h1
                className=" 
                dark:text-neutral-400 max-sm:text-[1rem] sm:text-[14px] md:text-[17px] lg:text-[22.4px] xl:text-[27.2px] xxl:text-[36px]"
              >
                I'm
              </h1>
              {personality.map((element, index) => (
                <span
                  key={index}
                  ref={personalityRefs[index]}
                  className="personality-animation hidden transition-all duration-150 
                    ease-linear max-sm:pl-[4px] max-sm:text-[1rem] sm:pl-[4px] sm:text-[14px] 
                    md:pl-[5px] md:text-[17px] lg:pl-[7px] lg:text-[1.4rem] xl:pl-[8px] xl:text-[1.7rem] xxl:pl-[10px] xxl:text-[36px]"
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
            <img
              src="/sneakyOwl_1.jpg"
              alt="Profile Picture"
              className="h-[250px] w-[250px] rounded-[50%] duration-0 md:h-[310px] md:w-[310px] 
                lg:h-[400px] lg:w-[400px] xl:h-[512px] xl:w-[512px] xl:scale-100 xxl:scale-125"
            />
          </div>
        </div>
        {/* [END] About Me Hero Banner */}
      </div>
    </>
  );
};
