import React from "react";

import GitHubCommitSnake from "./GitHubCommitSnake";

const WorkInProgress = () => {
  return (
    <>
      <div className="w-full text-center">
        <h1 className="pt-5 text-[4rem] text-[color:var(--site-accent)] drop-shadow-[0_0_6px] max-sm:text-[3rem]">
          /chess - Work In Progress
        </h1>
      </div>

      <GitHubCommitSnake />
    </>
  );
};

export default WorkInProgress;
