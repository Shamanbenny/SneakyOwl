import React, { useEffect, useState } from "react";

const Loading: React.FC = () => {
  // This will run one time after the component mounts
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      const spinner = document.querySelector(".spinner") as HTMLElement;
      const apps = document.querySelector(".apps") as HTMLElement;
      apps.style.display = "block";
      spinner.style.opacity = "0";

      /*setTimeout(() => {
        spinner.style.opacity = "0";
      }, 100);*/

      setTimeout(() => {
        spinner.remove();
      }, 1000);
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return <></>;
};

export default Loading;
