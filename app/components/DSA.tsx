"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DSA = () => {
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

  return (
    <>
      <div
        className={
          clientWidth < 640
            ? `z-[-1] h-full min-h-screen bg-neutral-300 pl-0 pt-[56px] 
            text-neutral-900 transition-colors duration-150 ease-linear 
            dark:bg-neutral-900 dark:text-neutral-300`
            : `z-[-1] h-full min-h-screen bg-neutral-300 pl-[64px] pt-0 
            text-neutral-900 transition-colors duration-150 ease-linear 
            dark:bg-neutral-900 dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        <div
          className="mx-auto max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
        >
          <div className="w-full text-center">
            <h1 className="pt-5 text-[4rem] text-emerald-700 drop-shadow-[0_0_6px] dark:text-emerald-500 max-sm:text-[3rem]">
              /dsa - Work In Progress
            </h1>
          </div>

          {/* [START] Commit Snake*/}
          <div className="w-full">
            <h1
              className="z-[6] mx-auto mb-3 w-[90%] border-b-2 border-neutral-900 pt-5 text-left text-[1.4rem] dark:border-neutral-300 
                max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
            >
              My GitHub Commit Snake
            </h1>
            <Image
              src="https://raw.githubusercontent.com/Shamanbenny/Shamanbenny.github.io/output/snake.svg"
              alt="Commit Snake"
              width={880}
              height={192}
              priority={true}
              className="mx-auto block h-auto w-[90%] max-w-[1200px] dark:hidden"
            />
            <Image
              src="https://raw.githubusercontent.com/Shamanbenny/Shamanbenny.github.io/output/snake-dark.svg"
              alt="Commit Snake"
              width={880}
              height={192}
              priority={true}
              className="mx-auto hidden h-auto w-[90%] max-w-[1200px] dark:block"
            />
          </div>
          {/* [END] Commit Snake*/}

          {/* DSA Content - Repeated Components */}
        </div>
      </div>
    </>
  );
};

export default DSA;
