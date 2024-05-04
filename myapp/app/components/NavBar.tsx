import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEarlybirds,
  FaHome,
  FaUser,
  FaThList,
  FaSun,
  FaMoon,
  FaEnvelope,
} from "react-icons/fa";

/**
 * NavBar component [CSS className used]:
 * .sidebar .sidebar-icon .logo .fa-navbar .sidebar-tooltip .sidebar-hr .successAlert
 */

const NavBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    togglePageChange("");

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
            <Link
              to="/"
              className="sidebar-icon logo group"
              onClick={(e) => togglePageChange("/")}
            >
              <FaEarlybirds size="40" className="fa-navbar" />
              <span className="sidebar-tooltip group-hover:scale-x-100">
                SneakyOwl.net
              </span>
            </Link>
            <Divider />
            <SideBarIcon
              icon={<FaHome size="36" className="fa-navbar home-tab" />}
              linkPath="/"
              text="Home Page"
            />
            <SideBarIcon
              icon={<FaUser size="28" className="fa-navbar about-tab" />}
              linkPath="/about"
              text="About Me"
            />
            <SideBarIcon
              icon={<FaThList size="28" className="fa-navbar dsa-tab" />}
              linkPath="/dsa"
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
  linkPath,
  text,
}: {
  icon: React.ReactNode;
  linkPath: string;
  text: string;
}) => (
  <Link
    to={linkPath}
    className="sidebar-icon group"
    onClick={(e) => togglePageChange(linkPath)}
  >
    {icon}
    <span className="sidebar-tooltip group-hover:scale-x-100">{text}</span>
  </Link>
);

const Divider = () => <hr className="sidebar-hr" />;

export const togglePageChange = (tab: string) => {
  if (tab == "") {
    if (window) tab = window.location.pathname;
  }
  document.querySelector(".fa-navbar.active")?.classList.remove("active");
  switch (tab) {
    case "/":
      document.querySelector(".home-tab")?.classList.add("active");
      break;
    case "/about":
      document.querySelector(".about-tab")?.classList.toggle("active");
      break;
    case "/dsa":
      document.querySelector(".dsa-tab")?.classList.toggle("active");
      break;
    default:
      break;
  }
};

export default NavBar;
