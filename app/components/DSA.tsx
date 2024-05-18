"use client";

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
            ? `flex h-full min-h-screen items-center bg-neutral-300 pl-0 
            pt-[56px] text-neutral-900 transition-colors duration-150 
            ease-linear dark:bg-neutral-900 dark:text-neutral-300`
            : `flex h-full min-h-screen items-center bg-neutral-300 pl-[64px] 
            pt-0 text-neutral-900 transition-colors duration-150 
            ease-linear dark:bg-neutral-900 dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        <div className="my-auto h-full w-full text-center">
          <h1 className="text-[6rem] text-emerald-700 drop-shadow-[0_0_6px] dark:text-emerald-500 max-sm:text-[3rem]">
            /dsa
          </h1>
          <h2 className="text-[2rem] max-sm:text-[1.2rem]">
            Still a work in progress...
          </h2>
        </div>
      </div>
    </>
  );
};

export default DSA;
