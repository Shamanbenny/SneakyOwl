import React from 'react'
import Image from "next/image";

const WorkInProgress = () => {
  return (
    <>
      <div className="w-full text-center">
        <h1 className="pt-5 text-[4rem] text-emerald-700 drop-shadow-[0_0_6px] dark:text-emerald-500 max-sm:text-[3rem]">
          /chess - Work In Progress
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
    </>
  )
}

export default WorkInProgress