"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaEarlybirds,
  FaHome,
  FaUser,
  FaThList,
  FaSun,
  FaMoon,
  FaEnvelope,
  FaBars,
} from "react-icons/fa";

/**
 * NavBar component [CSS className used]:
 * .sidebar .sidebar-icon .logo .navbar_element .sidebar-tooltip .sidebar-hr .successAlert
 */

const NavBar: React.FC = () => {
  const [hamburgerMenu, setHamburgerMenu] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState(true);
  const [clientWidth, setClientWidth] = useState<number>(1600);

  useEffect(() => {
    togglePageChange("");
    handleResize();
    window.addEventListener("resize", handleResize);

    const darkTheme = localStorage.getItem("dark-theme");
    if (darkTheme) {
      const newDarkMode = darkTheme === "true";
      setDarkMode(newDarkMode);
      document.body.classList.toggle("dark", newDarkMode);
    }
  });

  useEffect(() => {
    let mobileTopBar = document.getElementsByClassName(
      "mobileTopBar",
    )[0] as HTMLElement;
    let hamburgerElement = document.getElementsByClassName(
      "hamburgerMenu",
    )[0] as HTMLElement;
    let topBarHeight = mobileTopBar?.clientHeight;
    console.log(topBarHeight);
    if (hamburgerMenu) {
      mobileTopBar.style.top = "0px";
      hamburgerElement.style.top = topBarHeight + "px";
    } else {
      if (topBarHeight != 0) mobileTopBar.style.top = "-" + topBarHeight + "px";
      hamburgerElement.style.top = "0px";
    }
  }, [hamburgerMenu]);

  const handleResize = () => {
    setClientWidth(window.innerWidth);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);

    localStorage.setItem("dark-theme", newDarkMode.toString());

    const sound = new Audio("/sounds/toggleClick.mp3");
    sound.volume = 0.4;
    sound.play();
  };

  /* [START] Copy Email & Alert */
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("lee.jia.quan@u.nus.edu");

    // Perform the clipboard copy operation here
    // For the sake of the example, let's assume the copy was successful
    setAlertVisible(true);

    // Hide the alert after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };
  /* [END] Copy Email & Alert */

  const CopyEmailAlert = () => (
    <>
      {/* [START] Copy Email Alert */}

      <div
        className={alertVisible ? "successAlert block" : "successAlert hidden"}
      >
        <span>Email copied successfully to clipboard!</span>
      </div>
      {/* [END] Copy Email Alert */}
    </>
  );

  const Divider = () => (
    <hr
      className="mx-2 rounded-full border border-[#b3b3b3]
        transition-all duration-150 ease-linear dark:border-neutral-800"
    />
  );

  return (
    <>
      <div>
        {/* [RESPONSIVE DESIGN] Mobile View */}
        <div className={clientWidth <= 640 ? "block" : "hidden"}>
          {/* [START] Copy Email Alert */}
          <CopyEmailAlert />
          {/* [END] Copy Email Alert */}
          <nav>
            <div
              className="absolute z-[9998] flex w-full flex-col items-center bg-neutral-300 text-center 
              text-emerald-700 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {/* [START] Mobile Top Bar Menu */}
              <div
                className="mobileTopBar fixed w-full bg-neutral-300 pt-4 transition-all duration-150 ease-linear dark:bg-neutral-900"
                style={{ top: "-244px" }}
              >
                {/* [START] Website Logo */}
                <div
                  className="cursor-pointer text-[28px] font-bold text-emerald-500 
                  transition-all duration-150 ease-linear hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] 
                  dark:text-emerald-500 dark:hover:text-emerald-400 dark:hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]"
                  onClick={pressLogo}
                >
                  SneakyOwl.net
                </div>
                {/* [END] Website Logo */}

                {/* [START] Home Tab */}
                <Link
                  href="/"
                  className="topbar_element home-tab text-[24px] 
                  hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]
                  dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]"
                  onClick={() => togglePageChange("/")}
                >
                  Home Page
                </Link>
                {/* [END] Home Tab */}
                <br />
                {/* [START] About Me */}
                <Link
                  href="/about"
                  className="topbar_element about-tab text-[24px] 
                  hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]
                  dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]"
                  onClick={() => togglePageChange("/about")}
                >
                  About Me
                </Link>
                {/* [END] About Me */}
                <br />
                {/* [START] DSA Tab */}
                <Link
                  href="/dsa"
                  className="topbar_element dsa-tab text-[24px] 
                  hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]
                  dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]"
                  onClick={() => togglePageChange("/dsa")}
                >
                  Data Structure & Algorithm
                </Link>
                {/* [END] DSA Tab */}
                <Divider />
                {/* [START] Copy Email Button */}
                <h1
                  className="cursor-pointer text-[24px]
                  hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]
                  dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]"
                  onClick={copyEmail}
                >
                  Copy Email to Clipboard
                </h1>
                {/* [END] Copy Email Button */}
                <Divider />
                {/* [START] Dark Mode Button */}
                <h1
                  className="cursor-pointer text-[24px]
                  hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]
                  dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </h1>
                {/* [END] Dark Mode Button */}
                <Divider />
              </div>
              {/* [END] Mobile Top Bar Menu */}

              {/* [START] Hamburger Button */}
              <div
                className="hamburgerMenu group fixed w-full cursor-pointer bg-neutral-300 pt-3 
                  transition-all duration-150 ease-linear dark:bg-neutral-900"
                style={{ top: "0px" }}
                onClick={() => setHamburgerMenu(hamburgerMenu ? false : true)}
              >
                <FaBars
                  className="mx-auto group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)] dark:group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.75)]"
                  size={"32"}
                />
                <hr
                  className="mx-2 mt-3 rounded-full border border-[#b3b3b3]
                  transition-all duration-150 ease-linear dark:border-neutral-800"
                />
              </div>
              {/* [END] Hamburger Button */}
            </div>
          </nav>
        </div>

        {/* [RESPONSIVE DESIGN] PC View */}
        <div className={clientWidth > 640 ? "block" : "hidden"}>
          {/* [START] Copy Email Alert */}
          <CopyEmailAlert />
          {/* [END] Copy Email Alert */}
          <nav>
            <div className="flex">
              <div
                className="sidebar fixed left-0 top-0 z-[9998] m-0 flex h-screen w-16 
              flex-col border-neutral-900 bg-neutral-300 text-emerald-700
              shadow-lg transition-all duration-150 ease-linear lg:w-20 
              dark:border-emerald-500 dark:bg-neutral-900 dark:text-emerald-500"
              >
                {/* [START] Logo */}
                <div className="sidebar-icon logo group" onClick={pressLogo}>
                  <FaEarlybirds size="40" className="navbar_element h-3/4" />
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    SneakyOwl.net
                  </span>
                </div>
                {/* [END] Logo */}
                <Divider />
                {/* [START] Home Tab */}
                <Link
                  href="/"
                  className="sidebar-icon group"
                  onClick={() => togglePageChange("/")}
                >
                  <FaHome size="36" className="navbar_element home-tab h-3/4" />
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    Home Page
                  </span>
                </Link>
                {/* [END] Home Tab */}

                {/* [START] About Me Tab */}
                <Link
                  href="/about"
                  className="sidebar-icon group"
                  onClick={() => togglePageChange("/about")}
                >
                  <FaUser
                    size="28"
                    className="navbar_element about-tab h-3/4"
                  />
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    About Me
                  </span>
                </Link>
                {/* [END] About Me Tab */}

                {/* [START] DSA Tab */}
                <Link
                  href="/dsa"
                  className="sidebar-icon group"
                  onClick={() => togglePageChange("/dsa")}
                >
                  <FaThList
                    size="28"
                    className="navbar_element dsa-tab h-3/4"
                  />
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    About Me
                  </span>
                </Link>
                {/* [END] DSA Tab */}
                <Divider />
                {/* [START] Copy Email Button */}
                <div className="sidebar-icon group" onClick={copyEmail}>
                  <FaEnvelope size="28" className="navbar_element h-3/4" />
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    Copy Email to Clipboard
                  </span>
                </div>
                {/* [END] Copy Email Button */}
                <Divider />
                {/* [START] Dark Mode Button */}
                <div className="sidebar-icon group" onClick={toggleDarkMode}>
                  {darkMode ? (
                    <FaMoon size="28" className="navbar_element h-3/4" />
                  ) : (
                    <FaSun size="28" className="navbar_element h-3/4" />
                  )}
                  <span className="sidebar-tooltip group-hover:scale-x-100">
                    {darkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                {/* [END] Dark Mode Button */}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export const pressLogo = () => {
  document.querySelector(".navbar_element.active")?.classList.remove("active");
  document.querySelector(".home-tab")?.classList.add("active");
  let sessionCheck = localStorage.getItem("hasSeenAnimation");
  if (sessionCheck) {
    localStorage.removeItem("hasSeenAnimation");
  }
  window.location.href = "/";
};

export const togglePageChange = (tab: string) => {
  if (tab == "") {
    if (window) tab = window.location.pathname;
  }
  document.querySelector(".navbar_element.active")?.classList.remove("active");
  document.querySelector(".topbar_element.active")?.classList.remove("active");
  switch (tab) {
    case "/":
      document.querySelector(".home-tab")?.classList.add("active");
      document
        .querySelector(".topbar_element.home-tab")
        ?.classList.add("active");
      break;
    case "/about":
      document.querySelector(".about-tab")?.classList.toggle("active");
      document
        .querySelector(".topbar_element.about-tab")
        ?.classList.add("active");
      break;
    case "/dsa":
      document.querySelector(".dsa-tab")?.classList.toggle("active");
      document
        .querySelector(".topbar_element.dsa-tab")
        ?.classList.add("active");
      break;
    default:
      break;
  }
};

export default NavBar;
