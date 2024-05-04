import React, { useEffect } from "react";
import Slider from "./Slider";

export const Index: React.FC = () => {
  useEffect(() => {
    if (window) {
      const currPathnameElement = document.querySelector(".currPathname");
      if (currPathnameElement) {
        currPathnameElement.textContent =
          "Current Path: " + window.location.pathname;
      }
    }
  }, []);

  return (
    <>
      <Slider />
      <div className="h-32 currPathname"></div>
    </>
  );
};
