"use client";

import React from "react";
import ChessContent from "./ChessContent";
import ChessIntro from "./ChessIntro";
import NavBar from "@/app/components/shared/navigation/NavBar";

const ChessPage = () => {
  return (
    <>
      <NavBar />
      <div
        className="site-page-shell z-[-1] min-h-screen pt-[92px]
          transition-colors duration-150 ease-linear sm:pt-[130px]"
      >
        <div
          id="chess"
          className="mx-auto pb-[50px] max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
        >
          <ChessIntro />
          <ChessContent />
        </div>
      </div>
    </>
  );
};

export default ChessPage;
