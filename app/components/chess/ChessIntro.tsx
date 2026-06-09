"use client";

import React from "react";
import { FaArrowUpRightFromSquare, FaCode, FaReact } from "react-icons/fa6";
import { SiDocker, SiOpenai, SiPython, SiTypescript } from "react-icons/si";

type IntroTag = {
  icon: React.ReactNode;
  id: string;
  label: string;
};

const INTRO_TAGS: IntroTag[] = [
  {
    icon: <FaCode className="h-4 w-4" />,
    id: "csharp-dotnet",
    label: "C# / .NET 8",
  },
  {
    icon: <SiDocker className="h-4 w-4" />,
    id: "docker",
    label: "Docker",
  },
  {
    icon: <SiOpenai className="h-4 w-4" />,
    id: "codex-sdk",
    label: "Codex SDK",
  },
  {
    icon: <SiPython className="h-4 w-4" />,
    id: "python",
    label: "Python",
  },
  {
    icon: <FaReact className="h-4 w-4" />,
    id: "react",
    label: "React",
  },
  {
    icon: <SiTypescript className="h-4 w-4" />,
    id: "typescript",
    label: "TypeScript",
  },
];

const LINKS = [
  {
    href: "/blog/autoresearch-chess",
    label: "Read my Coding Adventure",
  },
  {
    href: "/blog/autoresearch-chess",
    label: "Learn to Automate Improvement",
  },
  {
    href: "https://github.com/Shamanbenny/autoresearch-chess",
    label: "View current GitHub Repo",
  },
];

const isExternalUrl = (href: string) => /^https?:\/\//.test(href);

const ChessIntro = () => {
  return (
    <section className="text-[color:var(--site-text)]">
      <div className="w-full text-center">
        <h1 className="pb-4 text-[4rem] text-[color:var(--site-accent)] drop-shadow-[0_0_6px] max-sm:text-[3rem]">
          /chess
        </h1>
      </div>
      <article className="site-surface-card mx-auto rounded-[26px] p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {INTRO_TAGS.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] font-medium text-[color:var(--site-text-strong)]"
            >
              <span className="text-[color:var(--site-accent-soft)]">{tag.icon}</span>
              {tag.label}
            </span>
          ))}
        </div>
        <p className="w-full text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
          This page serves the current{" "}
          <a
            href="https://github.com/Shamanbenny/autoresearch-chess"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
          >
            autoresearch-chess
          </a>{" "}
          project: a Dockerized C#/.NET 8 chess API that provides interactive play against
          the engine versions exposed below, plus a Python-owned{" "}
          <a
            href="https://github.com/karpathy/autoresearch"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
          >
            autoresearch
          </a>{" "}
          inspired workflow that clones candidate engines, evaluates them against
          a fixed Stockfish baseline, and only keeps approved improvements. The versions selectable
          here come from the newer native-board C# engine lineage and its
          autonomous research loop.
        </p>
        <div className="mt-5 flex flex-col items-start gap-y-2 text-[0.82rem] font-semibold text-[color:var(--site-accent)] sm:text-[0.9rem] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
          {LINKS.map((link, index) => (
            <React.Fragment key={`${link.label}-${index}`}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden text-[0.7rem] text-[color:var(--site-text-faint)] sm:inline"
                >
                  •
                </span>
              ) : null}
              <a
                href={link.href}
                target={isExternalUrl(link.href) ? "_blank" : undefined}
                rel={isExternalUrl(link.href) ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
              >
                {link.label}
                <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
              </a>
            </React.Fragment>
          ))}
        </div>
      </article>
    </section>
  );
};

export default ChessIntro;
