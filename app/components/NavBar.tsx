"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  FaBullseye,
  FaChess,
  FaEarlybirds,
  FaEnvelope,
  FaHistory,
  FaIdCard,
  FaQuoteLeft,
} from "react-icons/fa";

import Dock, { type DockEntry } from "@/components/Dock";
import StaggeredMenu from "@/components/StaggeredMenu";
import { cn } from "@/lib/utils";

const LANDING_SECTIONS = ["home", "intro", "objective", "reviews", "timeline"] as const;
const SITE_COLORS = {
  accent: "var(--site-accent)",
  chrome: "var(--site-bg-chrome)",
  chromeLayer: "var(--site-bg-chrome-layer)",
  text: "var(--site-text-strong)",
} as const;

type LandingSection = (typeof LANDING_SECTIONS)[number];
type ActiveDockItem = LandingSection | "chess" | null;
type MobileMenuItem = {
  ariaLabel: string;
  className?: string;
  label: string;
  link?: string;
  onClick?: () => void;
};
type StaggeredMenuProps = {
  accentColor?: string;
  buttonAriaLabel?: string;
  changeMenuColorOnOpen?: boolean;
  className?: string;
  closeOnItemClick?: boolean;
  colors?: string[];
  displayButtonText?: boolean;
  displayItemNumbering?: boolean;
  displaySocials?: boolean;
  hideLogo?: boolean;
  isFixed?: boolean;
  items?: MobileMenuItem[];
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  panelAriaLabel?: string;
  position?: "left" | "right";
};

const dockItemClass = (isActive: boolean) =>
  cn(isActive && "dock-item--active");

const mobileMenuItemClass = (isActive: boolean, withSectionBreak = false) =>
  cn(
    isActive && "sm-panel-itemWrap--active",
    withSectionBreak && "sm-panel-itemWrap--sectionBreak",
  );

const ResponsiveStaggeredMenu = StaggeredMenu as unknown as ComponentType<StaggeredMenuProps>;

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);
  const [activeDockItem, setActiveDockItem] = useState<ActiveDockItem>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 640);
      setIsViewportReady(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveDockItem(pathname === "/chess" ? "chess" : null);
      return;
    }

    const updateActiveSection = () => {
      const offset = 180;
      let currentSection: LandingSection = "home";

      for (const sectionId of LANDING_SECTIONS) {
        const section = document.getElementById(sectionId);

        if (!section) {
          continue;
        }

        if (section.getBoundingClientRect().top - offset <= 0) {
          currentSection = sectionId;
        }
      }

      setActiveDockItem(currentSection);
    };

    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    if (!alertVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAlertVisible(false);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [alertVisible]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("lee.jia.quan@u.nus.edu");
      setAlertVisible(true);
    } catch {
      setAlertVisible(false);
    }
  };

  const navigateToSection = (sectionId: LandingSection) => {
    if (pathname !== "/") {
      router.push(sectionId === "home" ? "/" : `/#${sectionId}`);
      return;
    }

    if (sectionId === "home") {
      window.history.replaceState(null, "", "/");
      window.scrollTo({ behavior: "smooth", top: 0 });
      setActiveDockItem("home");
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    window.history.replaceState(null, "", `/#${sectionId}`);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDockItem(sectionId);
  };

  const goToChessPage = () => {
    setActiveDockItem("chess");
    router.push("/chess");
  };

  const dockItems: DockEntry[] = [
    {
      className: dockItemClass(activeDockItem === "home"),
      icon: <FaEarlybirds size={22} />,
      label: "Home",
      onClick: () => navigateToSection("home"),
    },
    {
      className: dockItemClass(activeDockItem === "intro"),
      icon: <FaIdCard size={19} />,
      label: "> Introduction",
      onClick: () => navigateToSection("intro"),
    },
    {
      className: dockItemClass(activeDockItem === "objective"),
      icon: <FaBullseye size={19} />,
      label: "> Career Objective",
      onClick: () => navigateToSection("objective"),
    },
    {
      className: dockItemClass(activeDockItem === "reviews"),
      icon: <FaQuoteLeft size={18} />,
      label: "> Reviews",
      onClick: () => navigateToSection("reviews"),
    },
    {
      className: dockItemClass(activeDockItem === "timeline"),
      icon: <FaHistory size={19} />,
      label: "> Timeline",
      onClick: () => navigateToSection("timeline"),
    },
    { type: "divider" },
    {
      className: dockItemClass(activeDockItem === "chess"),
      icon: <FaChess size={20} />,
      label: "Chess Page",
      onClick: goToChessPage,
    },
    {
      icon: <FaEnvelope size={18} />,
      label: "Email Me",
      onClick: copyEmail,
    },
  ];

  const mobileMenuItems: MobileMenuItem[] = [
    {
      ariaLabel: "Go to the home section",
      className: mobileMenuItemClass(activeDockItem === "home"),
      label: "Home",
      onClick: () => navigateToSection("home"),
    },
    {
      ariaLabel: "Jump to the introduction section",
      className: mobileMenuItemClass(activeDockItem === "intro"),
      label: "> Introduction",
      onClick: () => navigateToSection("intro"),
    },
    {
      ariaLabel: "Jump to the career objective section",
      className: mobileMenuItemClass(activeDockItem === "objective"),
      label: "> Career Objective",
      onClick: () => navigateToSection("objective"),
    },
    {
      ariaLabel: "Jump to the reviews section",
      className: mobileMenuItemClass(activeDockItem === "reviews"),
      label: "> Reviews",
      onClick: () => navigateToSection("reviews"),
    },
    {
      ariaLabel: "Jump to the timeline section",
      className: mobileMenuItemClass(activeDockItem === "timeline"),
      label: "> Timeline",
      onClick: () => navigateToSection("timeline"),
    },
    {
      ariaLabel: "Open the chess page",
      className: mobileMenuItemClass(activeDockItem === "chess", true),
      label: "Chess Page",
      onClick: goToChessPage,
    },
    {
      ariaLabel: "Copy email address to the clipboard",
      className: mobileMenuItemClass(false, true),
      label: "Email Me",
      onClick: copyEmail,
    },
  ];

  return (
    <>
      <div className={alertVisible ? "successAlert block" : "successAlert hidden"}>
        <span>Email copied successfully to clipboard.</span>
      </div>
      {isViewportReady ? (
        isCompact ? (
          <ResponsiveStaggeredMenu
            accentColor={SITE_COLORS.accent}
            buttonAriaLabel="Open navigation menu"
            changeMenuColorOnOpen={false}
            className="site-staggered-menu"
            closeOnItemClick
            colors={[SITE_COLORS.chromeLayer, SITE_COLORS.chrome]}
            displayButtonText={false}
            displayItemNumbering={false}
            displaySocials={false}
            hideLogo
            isFixed
            items={mobileMenuItems}
            menuButtonColor={SITE_COLORS.text}
            openMenuButtonColor={SITE_COLORS.text}
            panelAriaLabel="Site navigation"
            position="right"
          />
        ) : (
          <Dock
            baseItemSize={50}
            className="sneaky-dock"
            distance={96}
            dockHeight={102}
            items={dockItems}
            magnification={56}
            panelHeight={72}
            position="top"
          />
        )
      ) : null}
    </>
  );
};

export default NavBar;
