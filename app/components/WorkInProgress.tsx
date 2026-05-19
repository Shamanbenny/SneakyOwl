import React from 'react'
import Image from "next/image";

const WorkInProgress = () => {
  return (
    <>
      <div className="w-full text-center">
        <h1 className="pt-5 text-[4rem] text-[color:var(--site-accent)] drop-shadow-[0_0_6px] max-sm:text-[3rem]">
          /chess - Work In Progress
        </h1>
      </div>

      {/* [START] Commit Snake*/}
      <div className="w-full">
        <h1
          className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-left text-[1.4rem]
            max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
        >
          My GitHub Commit Snake
        </h1>
        <Image
          src="https://raw.githubusercontent.com/Shamanbenny/Shamanbenny.github.io/output/snake-dark.svg"
          alt="Commit Snake"
          width={880}
          height={192}
          priority={true}
          className="mx-auto block h-auto w-[90%] max-w-[1200px]"
        />
      </div>
      {/* [END] Commit Snake*/}
    </>
  )
}

export default WorkInProgress
