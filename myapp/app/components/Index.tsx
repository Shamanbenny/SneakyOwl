"use client";

import React, { useEffect, useState } from "react";
import Slider from "./Slider";

export const Index: React.FC = () => {
  /* AppContent Divider Size Rendering based on User's Width*/
  const [clientWidth, setClientWidth] = useState<number>(1600);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  const handleResize = () => {
    setClientWidth(window.innerWidth);
  };

  return (
    <>
      <div
        className={
          clientWidth <= 640
            ? `h-screen bg-neutral-300 pl-0 pt-[56px] text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300`
            : `h-screen bg-neutral-300 pl-[64px] pt-0 text-neutral-900 
            transition-colors duration-150 ease-linear dark:bg-neutral-900 
            dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        <Slider />
      </div>
    </>
  );
};
