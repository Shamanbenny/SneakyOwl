import React, { RefObject, useEffect, useState } from "react";
import OwlSVG from "./svgComponents/OwlSVG";
import Link from "next/link";
import { togglePageChange } from "./NavBar";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import DsaSVG from "./svgComponents/DsaSVG";

/**
 * Slider component [CSS className used]:
 * .slider .slide .slideContent .svgCard .owlCard
 */

interface SliderProps {
  clientWidth: number;
  clientHeight: number;
}

const Slider: React.FC<SliderProps> = ({ clientWidth, clientHeight }) => {
  const carouselRef = React.createRef<HTMLDivElement>();
  const numberOfSlides = 2;
  let firstRender = true;
  const [currSlide, setCurrSlide] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const slideRefs: RefObject<HTMLDivElement>[] = [];
  for (let i = 0; i < numberOfSlides; i++) {
    slideRefs.push(React.createRef<HTMLDivElement>());
  }

  // On Slide Change, set the left property of the carousel to show the current slide
  // Reset any existing Timeout and set a new Timeout to change the slide after 7.5 seconds
  useEffect(() => {
    carouselRef.current?.style.setProperty("left", `-${currSlide * 100}%`);
    if (timeoutId) clearTimeout(timeoutId as NodeJS.Timeout);
    const id = setTimeout(() => {
      setCurrSlide((currSlide + 1) % numberOfSlides);
      console.log("Slide changed to: ", (currSlide + 1) % numberOfSlides);
    }, 15000); // 7.5 seconds
    setTimeoutId(id);
  }, [currSlide]);

  // Carousel padding-top adjustment for small screens
  useEffect(() => {
    if (firstRender) {
      carouselRef.current?.style.setProperty(
        "width",
        `${numberOfSlides * 100}%`,
      );
      firstRender = false;
    }
    if (clientWidth < 640) {
      const carouselTop = (clientHeight - 700 - 58) / 2;
      carouselRef.current?.style.setProperty("padding-top", `${carouselTop}px`);
    } else {
      carouselRef.current?.style.removeProperty("padding-top");
    }
  }, [clientHeight, clientWidth]);

  return (
    <>
      <div ref={carouselRef} className="slide-left-transition relative flex">
        {/* [START] Slide 1 - slideRefs[0] */}
        <div
          className="mx-auto grid h-screen w-full grid-cols-1 items-center 
          transition-all duration-150 ease-linear max-sm:max-h-[700px] max-sm:max-w-[300px] 
          sm:max-w-[576px] sm:grid-cols-3 sm:gap-4 sm:px-5 md:max-w-[704px] md:px-5 
          lg:max-w-[944px] lg:gap-8 lg:px-10 xl:max-w-[1200px] xl:px-[60px]"
          ref={slideRefs[0]}
        >
          <div className="col-span-2 text-right max-sm:mt-5 max-sm:text-center">
            <h1
              className="transition-all duration-150 ease-linear max-sm:text-[1.8rem] 
              sm:text-[2.1rem] md:text-[2.6rem] lg:text-[3.4rem] xl:text-[4.4rem]"
            >
              Welcome to Benny's personal website
            </h1>
            <h1
              className="emerald-highlight text-emerald-700 transition-all 
              duration-150 ease-linear dark:text-emerald-500 max-sm:text-[1.05rem] 
              sm:text-[1.2rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[2.5rem]"
            >
              Fueled by Coffee, Powered by Code
            </h1>
            <div
              className="mt-3 flex items-center transition-all duration-150 ease-linear 
              max-sm:mx-auto max-sm:mt-7 max-sm:w-1/2 max-sm:flex-col sm:ml-auto sm:w-3/4 
              md:w-3/5 lg:w-1/2 xl:w-[70%]"
            >
              <div className="flex w-full max-sm:w-[220px]">
                <a
                  href="https://www.linkedin.com/in/shamanbenny/"
                  className="group mx-auto ml-0"
                >
                  <FaLinkedin
                    className="transition-all duration-150  ease-linear group-hover:scale-125 
                  group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                  max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                  />
                  <span
                    className="absolute mt-1 flex scale-y-0 items-center justify-center 
                    text-sm transition-all duration-150 ease-linear group-hover:scale-y-100 
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
                    className="transition-all duration-150  ease-linear group-hover:scale-125 
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[3rem] 
                    max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                  />
                  <span
                    className="absolute mt-1 flex scale-y-0 items-center justify-center 
                    text-sm transition-all duration-150 ease-linear group-hover:scale-y-100 
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
                    text-sm transition-all duration-150 ease-linear group-hover:scale-y-100 
                    xl:pt-4 xl:text-[1.2rem]"
                  >
                    GitHub
                  </span>
                </a>
              </div>
              <Link
                href="/about"
                className="items-center rounded-md border border-emerald-500 bg-emerald-700 
                  px-3 py-1 text-center text-sm text-neutral-300 transition-all duration-150 
                  ease-linear hover:scale-110 hover:border-emerald-700 hover:bg-emerald-600 
                  dark:border-emerald-500 dark:bg-emerald-600 dark:hover:border-emerald-700 
                  dark:hover:bg-emerald-500 max-sm:mt-7 max-sm:w-40 max-sm:py-2 max-sm:text-[20px] 
                  sm:mx-auto sm:ml-2 sm:mr-0 sm:h-8 sm:w-36 xl:ml-4 xl:h-10 xl:w-40 xl:py-2 xl:text-[20px]"
                onClick={(e) => togglePageChange("/about")}
              >
                About Me
              </Link>
            </div>
          </div>
          <div className="w-full text-center">
            <OwlSVG />
          </div>
        </div>
        {/* [END] Slide 1 */}

        {/* [START] Slide 2 - slideRefs[1] */}
        <div
          className="mx-auto grid h-screen w-full grid-cols-1 items-center 
          transition-all duration-150 ease-linear max-sm:max-h-[700px] max-sm:max-w-[300px] 
          sm:max-w-[576px] sm:grid-cols-3 sm:gap-4 sm:px-5 md:max-w-[704px] md:px-5 
          lg:max-w-[944px] lg:gap-8 lg:px-10 xl:max-w-[1200px] xl:px-[60px]"
          ref={slideRefs[1]}
        >
          <div className="w-full text-center">
            <DsaSVG />
          </div>
          <div className="col-span-2 text-left max-sm:mt-5 max-sm:text-center">
            <h1
              className="transition-all duration-150 ease-linear max-sm:text-[1.8rem] 
              sm:text-[1.7rem] md:text-[2.4rem] lg:text-[2.8rem] xl:text-[4.6rem]"
            >
              Data Structures & Algorithms
            </h1>
            <h1
              className="emerald-highlight text-emerald-700 transition-all 
              duration-150 ease-linear dark:text-emerald-500 max-sm:text-[1.05rem] 
              sm:text-[1.3rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[1.8rem]"
            >
              Code Snippets with Visualizations on common LeekCode Problems
            </h1>
            <div
              className="mt-3 flex items-center transition-all duration-150 ease-linear 
              max-sm:mx-auto max-sm:mt-7 max-sm:w-1/2 max-sm:flex-col sm:mr-auto sm:w-3/4 
              md:w-3/5 lg:w-1/2 xl:w-[70%]"
            >
              <Link
                href="/dsa"
                className="items-center rounded-md border border-emerald-500 bg-emerald-700 
                  py-1 text-center text-sm text-neutral-300 transition-all duration-150 
                  ease-linear hover:scale-110 hover:border-emerald-700 hover:bg-emerald-600 
                  dark:border-emerald-500 dark:bg-emerald-600 dark:hover:border-emerald-700 
                  dark:hover:bg-emerald-500 max-sm:mt-7 max-sm:w-40 max-sm:py-2 max-sm:text-[20px] 
                  sm:h-8 sm:w-36 xl:h-10 xl:w-40 xl:py-2 xl:text-[20px]"
                onClick={(e) => togglePageChange("/about")}
              >
                Click Here
              </Link>
            </div>
          </div>
        </div>
        {/* [END] Slide 2 */}
      </div>
    </>
  );
};

export default Slider;
