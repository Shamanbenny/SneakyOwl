"use client";

import React, { useState, useEffect } from "react";
import {
  FaEarlybirds,
  FaHome,
  FaUser,
  FaThList,
  FaSun,
  FaMoon,
  FaEnvelope,
} from "react-icons/fa";

const NavBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const darkTheme = localStorage.getItem("dark-theme");
    if (darkTheme) {
      const newDarkMode = darkTheme === "true";
      setDarkMode(newDarkMode);
      document.body.classList.toggle("dark", newDarkMode);
    }
  }, []);

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
    navigator.clipboard.writeText("SneakyOwl_Official@proton.me");

    // Perform the clipboard copy operation here
    // For the sake of the example, let's assume the copy was successful
    setAlertVisible(true);

    // Hide the alert after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };
  /* [END] Copy Email & Alert */

  return (
    <>
      <div
        className={
          alertVisible ? "successAlert opacity-100" : "successAlert opacity-0"
        }
      >
        <span>Email copied successfully to clipboard!</span>
      </div>
      <nav>
        <div className="flex">
          <div className="sidebar">
            <div className="sidebar-icon logo group">
              <FaEarlybirds size="40" className="fa-navbar" />
              <span className="sidebar-tooltip group-hover:scale-x-100">
                SneakyOwl.net
              </span>
            </div>
            <Divider />
            <SideBarIcon
              icon={<FaHome size="36" className="fa-navbar" />}
              text="Home Page"
            />
            <SideBarIcon
              icon={<FaUser size="28" className="fa-navbar" />}
              text="About Me"
            />
            <SideBarIcon
              icon={<FaThList size="28" className="fa-navbar" />}
              text="DSA Page"
            />
            <Divider />
            <div className="sidebar-icon group" onClick={copyEmail}>
              <FaEnvelope size="28" className="fa-navbar" />
              <span className="sidebar-tooltip group-hover:scale-x-100">
                Copy Email to Clipboard
              </span>
            </div>
            <Divider />
            <div className="sidebar-icon group" onClick={toggleDarkMode}>
              {darkMode ? (
                <FaMoon size="28" className="fa-navbar" />
              ) : (
                <FaSun size="28" className="fa-navbar" />
              )}
              <span className="sidebar-tooltip group-hover:scale-x-100">
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const SideBarIcon = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-x-100">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default NavBar;
