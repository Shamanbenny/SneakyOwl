"use client";

import Image from "next/image";

type GitHubCommitSnakeProps = {
  title?: string;
};

const GitHubCommitSnake = ({
  title = "My GitHub Commit Snake",
}: GitHubCommitSnakeProps) => {
  return (
    <section
      className="mx-auto pb-10
        max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        {title}
      </h1>
      <Image
        src="https://raw.githubusercontent.com/Shamanbenny/Shamanbenny.github.io/output/snake-dark.svg"
        alt="GitHub commit snake"
        width={880}
        height={192}
        priority
        className="mx-auto block h-auto w-[90%] max-w-[1200px]"
      />
    </section>
  );
};

export default GitHubCommitSnake;
