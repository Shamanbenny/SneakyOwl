"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  FaCode,
  FaChess,
  FaEarlybirds,
  FaEnvelope,
  FaHistory,
  FaLaptopCode,
  FaQuoteLeft,
} from "react-icons/fa";

import Dock, { type DockEntry } from "@/components/Dock";
import StaggeredMenu from "@/components/StaggeredMenu";
import { cn } from "@/lib/utils";

const LANDING_SECTIONS = ["home", "projects", "skills", "reviews", "timeline"] as const;
const EMAIL_ADDRESS = "lee.jia.quan@u.nus.edu";
const EMAIL_HREF = `mailto:${EMAIL_ADDRESS}`;
const NAV_TOP_LOCK_OFFSET = 24;
const NAV_HIDE_SCROLL_OFFSET = 96;
const NAV_HIDE_DISTANCE = 48;
const NAV_REVEAL_DISTANCE = 28;
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
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
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
  const [isCompact, setIsCompact] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeDockItem, setActiveDockItem] = useState<ActiveDockItem>(null);
  const lastScrollYRef = useRef(0);
  const downwardScrollRef = useRef(0);
  const upwardScrollRef = useRef(0);

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
    if (typeof window === "undefined") {
      return;
    }

    lastScrollYRef.current = window.scrollY;
    setIsNavVisible(true);

    if (isCompact) {
      downwardScrollRef.current = 0;
      upwardScrollRef.current = 0;
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= NAV_TOP_LOCK_OFFSET) {
        downwardScrollRef.current = 0;
        upwardScrollRef.current = 0;
        setIsNavVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (isMobileMenuOpen) {
        downwardScrollRef.current = 0;
        upwardScrollRef.current = 0;
        setIsNavVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 2) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 0) {
        downwardScrollRef.current += delta;
        upwardScrollRef.current = 0;

        if (
          currentScrollY > NAV_HIDE_SCROLL_OFFSET &&
          downwardScrollRef.current >= NAV_HIDE_DISTANCE
        ) {
          setIsNavVisible(false);
        }
      } else {
        upwardScrollRef.current += Math.abs(delta);
        downwardScrollRef.current = 0;

        if (upwardScrollRef.current >= NAV_REVEAL_DISTANCE) {
          setIsNavVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCompact, isMobileMenuOpen]);

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

  const openEmailComposer = () => {
    window.location.href = EMAIL_HREF;
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
      className: dockItemClass(activeDockItem === "projects"),
      icon: <FaLaptopCode size={19} />,
      label: "#Projects",
      onClick: () => navigateToSection("projects"),
    },
    {
      className: dockItemClass(activeDockItem === "skills"),
      icon: <FaCode size={19} />,
      label: "#Skills",
      onClick: () => navigateToSection("skills"),
    },
    {
      className: dockItemClass(activeDockItem === "reviews"),
      icon: <FaQuoteLeft size={18} />,
      label: "#Reviews",
      onClick: () => navigateToSection("reviews"),
    },
    {
      className: dockItemClass(activeDockItem === "timeline"),
      icon: <FaHistory size={19} />,
      label: "#Timeline",
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
      onClick: openEmailComposer,
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
      ariaLabel: "Jump to the projects section",
      className: mobileMenuItemClass(activeDockItem === "projects"),
      label: "> Projects",
      onClick: () => navigateToSection("projects"),
    },
    {
      ariaLabel: "Jump to the skills section",
      className: mobileMenuItemClass(activeDockItem === "skills"),
      label: "> Skills",
      onClick: () => navigateToSection("skills"),
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
      ariaLabel: `Send an email to ${EMAIL_ADDRESS}`,
      className: mobileMenuItemClass(false, true),
      label: "Email Me",
      onClick: openEmailComposer,
    },
  ];

  return (
    <div
      className="site-nav-shell"
      data-hidden={!isCompact && !isNavVisible ? true : undefined}
    >
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
            onMenuClose={() => setIsMobileMenuOpen(false)}
            onMenuOpen={() => {
              setIsNavVisible(true);
              setIsMobileMenuOpen(true);
            }}
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
    </div>
  );
};

export default NavBar;
