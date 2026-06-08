"use client";

import React from "react";
import { FaArrowUpRightFromSquare, FaReact } from "react-icons/fa6";
import { SiFlask, SiPython, SiTypescript } from "react-icons/si";

type IntroTag = {
  icon: React.ReactNode;
  id: string;
  label: string;
};

const INTRO_TAGS: IntroTag[] = [
  {
    icon: <SiPython className="h-4 w-4" />,
    id: "python",
    label: "Python",
  },
  {
    icon: <SiFlask className="h-4 w-4" />,
    id: "flask",
    label: "Flask",
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
    href: "/blog/chess-flask-coding-adventure",
    label: "View Blog Post",
  },
  {
    href: "https://github.com/Shamanbenny/chess-flask",
    label: "View GitHub repo",
  },
];

const isExternalUrl = (href: string) => /^https?:\/\//.test(href);

const ChessIntro = () => {
  return (
    <section className="mt-4 text-[color:var(--site-text)]">
      <div className="w-full text-center">
        <h1 className="pb-4 pt-5 text-[4rem] text-[color:var(--site-accent)] drop-shadow-[0_0_6px] max-sm:text-[3rem]">
          /chess - Work In Progress
        </h1>
      </div>
      <article className="site-surface-card mx-auto rounded-[26px] p-4 text-center sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-wrap justify-center gap-2">
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
        <p className="mx-auto w-full max-w-[960px] text-[0.94rem] leading-7 text-[color:var(--site-text-strong)] sm:text-[0.98rem]">
          A browser-based chess interface backed by iterative chess bot versions
          exposed through a Flask API. The standalone{" "}
          <a
            href="https://github.com/Shamanbenny/chess-flask"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
          >
            chess-flask
          </a>{" "}
          repository powers the move generation logic, while this repo hosts the UI
          used to test and play against each bot version. The project followed an
          iterative build approach inspired by Sebastian Lague&apos;s{" "}
          <a
            href="https://www.youtube.com/watch?v=U4ogK0MIzqk"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--site-accent)] underline decoration-[color:var(--site-accent-soft)] underline-offset-2 transition-colors duration-150 hover:text-[color:var(--site-accent-soft)]"
          >
            Coding Adventure: Chess
          </a>
          , starting from legal move generation and basic search, then improving
          successive versions with stronger evaluation and search heuristics.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[0.9rem] font-semibold text-[color:var(--site-accent)]">
          {LINKS.map((link, index) => (
            <div key={link.href} className="contents">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="text-[0.7rem] text-[color:var(--site-text-faint)]"
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
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default ChessIntro;
