"use client";

import { useId, useState, type ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa6";

type CollapsibleCardProps = {
  bodyClassName?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  description?: ReactNode;
  eyebrow?: string;
  headerContent?: ReactNode;
  headerSupplement?: ReactNode;
  stackedToggle?: boolean;
  toggleClassName?: string;
  title: string;
};

const CollapsibleCard = ({
  bodyClassName,
  children,
  defaultOpen = false,
  description,
  eyebrow,
  headerContent,
  headerSupplement,
  stackedToggle = false,
  toggleClassName,
  title,
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const toggleClasses = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-accent-soft)] transition-transform duration-200 ${
    isOpen ? "rotate-180" : ""
  } ${toggleClassName ?? ""}`;

  return (
    <article className="site-surface-card overflow-hidden rounded-[26px]">
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`w-full text-left transition-colors duration-150 hover:bg-[color:var(--site-bg-soft)] focus-visible:bg-[color:var(--site-bg-soft)] ${
          stackedToggle ? "block" : "flex items-start gap-4"
        }`}
      >
        {stackedToggle ? (
          <div className="w-full">
            {headerContent ? <div>{headerContent}</div> : null}
            <div className="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                {eyebrow ? (
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
                    {eyebrow}
                  </p>
                ) : null}
                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                  <h3 className="text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--site-text-strong)] sm:text-[1.35rem]">
                    {title}
                  </h3>
                  {headerSupplement}
                </div>
                {description ? (
                  <div className="mt-3 max-w-[58ch] text-[0.95rem] leading-6 text-[color:var(--site-text-muted)] sm:text-[0.98rem]">
                    {description}
                  </div>
                ) : null}
              </div>
              <span aria-hidden="true" className={toggleClasses}>
                <FaChevronDown className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className={headerContent ? "min-w-0 flex-1" : "min-w-0 flex-1"}>
              {headerContent ? (
                <div>{headerContent}</div>
              ) : (
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                  {eyebrow ? (
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
                      {eyebrow}
                    </p>
                  ) : null}
                  <div className="mt-1 flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--site-text-strong)] sm:text-[1.35rem]">
                      {title}
                    </h3>
                    {headerSupplement}
                  </div>
                  {description ? (
                    <div className="mt-3 max-w-[58ch] text-[0.95rem] leading-6 text-[color:var(--site-text-muted)] sm:text-[0.98rem]">
                      {description}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <span
              aria-hidden="true"
              className={`mr-5 mt-5 sm:mr-6 ${toggleClasses}`}
            >
              <FaChevronDown className="h-3.5 w-3.5" />
            </span>
          </>
        )}
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div id={contentId} className="overflow-hidden">
          <div
            className={`border-t border-[color:var(--site-border)] bg-[color:var(--site-bg-elevated)] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 ${bodyClassName ?? ""}`}
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CollapsibleCard;
