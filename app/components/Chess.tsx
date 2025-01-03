"use client";

import { useEffect, useState } from "react";
import WorkInProgress from "./WorkInProgress";

const Chess = () => {
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
          <WorkInProgress />

          {/* Chess Content */}

        </div>
      </div>
    </>
  );
};

export default Chess;
