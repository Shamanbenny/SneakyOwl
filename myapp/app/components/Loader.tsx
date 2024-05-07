"use client";
// useState, therefore use client

import React, { useEffect, useState } from "react";

let keyboardSound: any;
let enteringSound: any;

/**
 * Loader component that displays a start-up animation.
 *
 * Session Cooldown: 24 hours
 */
const Loader: React.FC = () => {
  const [counter, setCounter] = useState(5);
  const counterPerChar = 5;

  useEffect(() => {
    let hasSeenAnimation = false;
    if (counter == 5) {
      let sessionCheck = localStorage.getItem("hasSeenAnimation");
      if (sessionCheck) {
        let data = JSON.parse(sessionCheck);
        let currTime = new Date();
        // If more than 24 hours have passed
        if (currTime.getTime() - data.timestamp > 24 * 60 * 60 * 1000) {
          // Remove the item from session storage
          localStorage.removeItem("hasSeenAnimation");
        } else {
          hasSeenAnimation = true;
          let apps = document.getElementsByClassName("apps")[0] as HTMLElement;
          if (apps) apps.style.display = "block";
          let loader = document.getElementsByClassName(
            "loader",
          )[0] as HTMLElement;
          if (loader) loader.remove();
        }
      }
    }

    if (!hasSeenAnimation && counter == 6) {
      keyboardSound = new Audio("/sounds/keyboard.mp3");
      keyboardSound.play();
    }
    if (!hasSeenAnimation && counter == 65) {
      keyboardSound.pause();
    }
    if (!hasSeenAnimation && counter == 68) {
      enteringSound = new Audio("/sounds/entering.mp3");
      enteringSound.play();
    }

    let stringLen = Math.floor(counter / counterPerChar);
    if (stringLen <= 19 && !hasSeenAnimation) {
      let loaderStringElement =
        document.getElementsByClassName("loader_string")[0];
      if (loaderStringElement) {
        const timeout = setTimeout(() => {
          if (stringLen <= 9) {
            let randomString = Math.random()
              .toString(36)
              .substring(2, 2 + stringLen);
            loaderStringElement.textContent = randomString;
          } else {
            let revealIndex = counter - 10 * counterPerChar;
            let targetString = "SneakyOwl";
            let randomString = "";
            if (revealIndex <= 8) {
              randomString = Math.random()
                .toString(36)
                .substring(2, 2 + 9 - revealIndex);
            }
            loaderStringElement.textContent =
              targetString.substring(0, revealIndex) + randomString;
          }

          setCounter(counter + 1);
        }, 20);

        if (counter == 79) {
          const currTime = new Date();
          localStorage.setItem(
            "hasSeenAnimation",
            JSON.stringify({
              timestamp: currTime.getTime(),
            }),
          );
          let apps = document.getElementsByClassName("apps")[0] as HTMLElement;
          apps.style.display = "block";
          let loader = document.getElementsByClassName(
            "loader",
          )[0] as HTMLElement;
          loader.style.opacity = "0";

          setTimeout(() => {
            loader.style.display = "none";
          }, 500);
        }

        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [counter]);

  return <></>;
};

export default Loader;
