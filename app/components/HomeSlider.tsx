import React, { RefObject, useEffect, useState } from "react";
import OwlSVG from "./svgComponents/OwlSVG";
import Link from "next/link";
import { togglePageChange } from "./NavBar";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import DsaSVG from "./svgComponents/DsaSVG";

/**
 * This component represents a slider that displays multiple slides.
 * It includes functionality to change slides automatically and adjust padding for small screens.
 * The slides contain text and SVG components.
 * The slider can be customized using CSS classes.
 *
 * Props:
 * - clientWidth: The width of the client window
 * - clientHeight: The height of the client window
 */

interface SliderProps {
  clientWidth: number;
  clientHeight: number;
}

const HomeSlider: React.FC<SliderProps> = ({ clientWidth, clientHeight }) => {
  const carouselRef = React.createRef<HTMLDivElement>();
  const numberOfSlides = 2;
  let firstRender = true;
  const [currSlide, setCurrSlide] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const slideRefs: RefObject<HTMLDivElement>[] = [];
  let intervalArray = Array(2).fill(null);
  for (let i = 0; i < numberOfSlides; i++) {
    slideRefs.push(React.createRef<HTMLDivElement>());
  }

  const changeSlideValue = (value: number) => {
    if (currSlide + value < 0) setCurrSlide(numberOfSlides + value);
    else setCurrSlide((currSlide + value) % numberOfSlides);
  };

  // On Slide Change, set the left property of the carousel to show the current slide
  // Reset any existing Timeout and set a new Timeout to change the slide after 7.5 seconds
  useEffect(() => {
    carouselRef.current?.style.setProperty("left", `-${currSlide * 100}%`);
    if (timeoutId) clearTimeout(timeoutId as NodeJS.Timeout);
    const id = setTimeout(() => {
      setCurrSlide((currSlide + 1) % numberOfSlides);
      // console.log("Slide changed to: ", (currSlide + 1) % numberOfSlides);
      if ((currSlide + 1) % numberOfSlides == 0) {
        if (slideRefs[0].current)
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to Benny's personal website";
      }
    }, 15000); // 15 seconds
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

  /* [START] Mouse Over and Mouse Leave Event Handlers for Benny versus SneakyOwl (Interchangable) */
  const mouseOverIndexBenny = () => {
    const intendedText = "SneakyOwl";
    let iterations = 0;
    let iterationMinusOffset = 0;
    if (intervalArray[1]) clearInterval(intervalArray[1]);

    intervalArray[0] = setInterval(() => {
      if (slideRefs[0].current && iterations <= 13) {
        if (iterations > 4) iterationMinusOffset = iterations - 4;
        if (iterations <= 4) {
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to " +
            intendedText.substring(0, iterationMinusOffset) +
            Math.random()
              .toString(36)
              .substring(2, 11 - iterationMinusOffset - (4 - iterations)) +
            "'s personal website";
        }
        if (iterations > 4 && iterations < 13) {
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to " +
            intendedText.substring(0, iterationMinusOffset) +
            Math.random()
              .toString(36)
              .substring(2, 11 - iterationMinusOffset) +
            "'s personal website";
        }
        if (iterations === 13) {
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to " + intendedText + "'s personal website";
        }
      }

      if (iterations > 13) clearInterval(intervalArray[0]);

      iterations++;
    }, 20);
  };

  const mouseLeaveIndexBenny = () => {
    const intendedText = "Benny";
    let iterations = 0;
    let iterationMinusOffset = 0;
    let excessTextLen = 0;
    if (intervalArray[0]) clearInterval(intervalArray[0]);

    intervalArray[1] = setInterval(() => {
      if (slideRefs[0].current && iterations <= 9) {
        if (iterations > 4) iterationMinusOffset = iterations - 4;
        if (iterations < 9) {
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to " +
            intendedText.substring(0, iterationMinusOffset) +
            Math.random()
              .toString(36)
              .substring(2, 11 - iterationMinusOffset - excessTextLen) +
            "'s personal website";
        } else {
          slideRefs[0].current.children[0].children[0].textContent =
            "Welcome to " + intendedText + "'s personal website";
        }
      }

      if (iterations > 9) clearInterval(intervalArray[1]);

      if (excessTextLen < 4) excessTextLen++;
      iterations++;
    }, 20);
  };
  /* [END] Mouse Over and Mouse Leave Event Handlers for Benny versus SneakyOwl (Interchangable) */

  return (
    <>
      {/* Remove the Slider Arrow Button for First and Last Slide eventually */}
      <div
        className="slider-arrow-btn absolute top-0 flex h-screen w-[75px] cursor-pointer items-center from-emerald-700/25 
          to-emerald-700/0 transition-all duration-150 ease-linear hover:bg-gradient-to-r 
          dark:from-emerald-500/10 dark:to-emerald-500/0 max-sm:left-0 
          sm:left-[64px] lg:left-[80px]"
        onClick={() => changeSlideValue(-1)}
      >
        <FaAngleLeft className="mx-auto h-[50px] w-[50px] text-neutral-900/25 dark:text-neutral-300/25" />
      </div>
      <div
        className="slider-arrow-btn absolute right-0 top-0 flex h-screen w-[75px] cursor-pointer items-center from-emerald-700/25 
          to-emerald-700/0 transition-all duration-150 ease-linear hover:bg-gradient-to-l 
          dark:from-emerald-500/10 dark:to-emerald-500/0"
        onClick={() => changeSlideValue(1)}
      >
        <FaAngleRight className="mx-auto h-[50px] w-[50px] text-neutral-900/25 dark:text-neutral-300/25" />
      </div>
      <div
        ref={carouselRef}
        className="slide-left-transition relative flex max-h-screen"
      >
        {/* [START] Slide 1 - slideRefs[0] */}
        <div
          className="mx-auto grid h-screen w-full grid-cols-1 items-center overflow-hidden transition-all 
          duration-150 ease-linear max-sm:my-auto max-sm:max-h-[600px] max-sm:max-w-[300px] 
          max-xs:max-w-[250px] sm:max-w-[576px] sm:grid-cols-3 sm:gap-4 sm:px-5 
          md:max-w-[704px] md:px-5 lg:max-w-[944px] lg:gap-8 lg:px-10 xl:max-w-[1200px] xl:px-[60px]"
          ref={slideRefs[0]}
        >
          <div className="col-span-2 text-right max-sm:mt-[66px] max-sm:text-center">
            <h1
              className="transition-all duration-150 ease-linear max-sm:text-[1.5rem] max-xs:text-[1.2rem] 
              sm:text-[2rem] md:text-[2.4rem] lg:text-[3.2rem] xl:text-[4rem]"
              onMouseOver={() => mouseOverIndexBenny()}
              onMouseLeave={() => mouseLeaveIndexBenny()}
            >
              Welcome to Benny&#39;s personal website
            </h1>
            <h1
              className="emerald-highlight text-emerald-700 transition-all 
              duration-150 ease-linear dark:text-emerald-500 max-sm:text-[1.05rem] max-xs:text-[0.94rem] 
              sm:text-[1.2rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[2.5rem]"
            >
              Fueled by Coffee, Powered by Code
            </h1>
            <div
              className="mt-3 flex items-center transition-all duration-150 ease-linear 
              max-sm:mx-auto max-sm:mt-3 max-sm:w-1/2 max-sm:flex-col sm:ml-auto sm:w-3/4 
              md:w-3/5 lg:w-1/2 xl:w-[70%]"
            >
              <div className="flex w-full max-sm:w-[220px]">
                <a
                  href="https://www.linkedin.com/in/shamanbenny/"
                  className="group mx-auto ml-0"
                >
                  <FaLinkedin
                    className="transition-all duration-150  ease-linear group-hover:scale-125 
                  group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[2rem] 
                  max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                  />
                  <span
                    className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm transition-all 
                    duration-150 ease-linear group-hover:scale-y-100 max-sm:hidden sm:block 
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
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[2rem] 
                    max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                  />
                  <span
                    className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm transition-all 
                    duration-150 ease-linear group-hover:scale-y-100 max-sm:hidden sm:block 
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
                    group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] max-sm:h-[2rem] 
                    max-sm:w-[3rem] sm:h-10 sm:w-10 xl:h-[4rem] xl:w-[4rem]"
                  />
                  <span
                    className="absolute mt-1 flex scale-y-0 items-center justify-center text-sm transition-all 
                    duration-150 ease-linear group-hover:scale-y-100 max-sm:hidden sm:block 
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
                  dark:hover:bg-emerald-500 max-sm:mt-3 max-sm:w-40 max-sm:py-2 max-sm:text-[20px] max-xs:w-[120px] max-xs:text-[16px] 
                  sm:mx-auto sm:ml-2 sm:mr-0 sm:h-8 sm:w-36 xl:ml-4 xl:h-10 xl:w-40 xl:py-2 xl:text-[20px]"
                onClick={(e) => togglePageChange("/about")}
              >
                About Me
              </Link>
            </div>
          </div>
          <div className="w-full text-center max-sm:mx-auto max-sm:max-h-[290px] max-sm:max-w-[250px] max-xs:max-w-[175px]">
            <OwlSVG />
          </div>
        </div>
        {/* [END] Slide 1 */}

        {/* [START] Slide 2 - slideRefs[1] */}
        <div
          className="mx-auto grid h-screen w-full grid-cols-1 items-center overflow-hidden 
          transition-all duration-150 ease-linear max-sm:max-h-[700px] max-sm:max-w-[300px] max-xs:max-w-[250px] 
          sm:max-w-[576px] sm:grid-cols-3 sm:gap-4 sm:px-5 md:max-w-[704px] 
          md:px-5 lg:max-w-[944px] lg:gap-8 lg:px-10 xl:max-w-[1200px] xl:px-[60px]"
          ref={slideRefs[1]}
        >
          <div
            className="w-full text-center max-sm:mx-auto max-sm:mb-[30px] max-sm:mt-[70px] max-sm:max-h-[280px] 
            max-sm:max-w-[250px] max-xs:max-h-[210px] max-xs:max-w-[175px]"
          >
            <DsaSVG />
          </div>
          <div className="col-span-2 text-left max-sm:mb-[30px] max-sm:text-center">
            <h1
              className="transition-all duration-150 ease-linear max-sm:text-[1.6rem] max-xs:text-[1.2rem] 
              sm:text-[1.7rem] md:text-[2.4rem] lg:text-[2.8rem] xl:text-[4.6rem]"
            >
              Data Structures & Algorithms
            </h1>
            <h1
              className="emerald-highlight text-emerald-700 transition-all 
              duration-150 ease-linear dark:text-emerald-500 max-sm:text-[1.05rem] 
              sm:text-[1.3rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[1.8rem]"
            >
              Code Snippets with Visualizations on common LeetCode Problems
            </h1>
            <div
              className="mt-0 flex items-center transition-all duration-150 ease-linear max-sm:mx-auto 
              max-sm:w-1/2 max-sm:flex-col sm:mr-auto sm:mt-7 sm:w-3/4 
              md:w-3/5 lg:w-1/2 xl:w-[70%]"
            >
              <Link
                href="/dsa"
                className="items-center rounded-md border border-emerald-500 bg-emerald-700 
                  py-1 text-center text-sm text-neutral-300 transition-all duration-150 
                  ease-linear hover:scale-110 hover:border-emerald-700 hover:bg-emerald-600 
                  dark:border-emerald-500 dark:bg-emerald-600 dark:hover:border-emerald-700 
                  dark:hover:bg-emerald-500 max-sm:mt-3 max-sm:w-40 max-sm:py-2 max-sm:text-[20px] max-xs:w-[120px] max-xs:py-1 max-xs:text-[16px] 
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

export default HomeSlider;
