"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import InfoTooltip from "./InfoTooltip";

type CuriousCatClickTrapProps = {
  emailHref: string;
};

type FloatingPlusOne = {
  id: number;
  x: number;
  y: number;
};

const ABACUS_BASE_URL = "https://abacus.jasoncameron.dev";
const ABACUS_DOCS_URL = "https://v2.jasoncameron.dev/abacus/";
const ABACUS_NAMESPACE = "sneaky-owl";
const ABACUS_KEY = "social-cell-clicks";
const ABACUS_UNIQUE_VIEW_KEY = "social-cell-unique-views";
const PERSONAL_COUNT_STORAGE_KEY = "sneakyowl-social-clicks";
const UNIQUE_VIEW_STORAGE_KEY = "sneakyowl-social-unique-views";

const socialLinkClassName =
  "inline-flex h-11 w-11 items-center justify-center rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] text-[1.05rem] text-[color:var(--site-text-strong)] transition duration-150 ease-linear hover:-translate-y-[1px] hover:border-[rgba(16,185,129,0.45)] hover:text-[color:var(--site-accent-soft)] focus-visible:-translate-y-[1px] focus-visible:border-[rgba(16,185,129,0.45)] focus-visible:text-[color:var(--site-accent-soft)] xxl:h-14 xxl:w-14 xxl:text-[1.35rem] xl:text-[1.2rem] xl:h-12 xl:w-12";

const clickButtonClassName =
  "inline-flex h-11 min-w-[6.9rem] items-center justify-center rounded-[0.75rem] border border-[color:var(--site-accent-strong)] bg-[color:var(--site-accent)] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--site-selection-text)] transition duration-150 ease-linear hover:-translate-y-[1px] hover:border-[color:var(--site-accent-strong)] hover:bg-[color:var(--site-accent-strong)] focus-visible:-translate-y-[1px] focus-visible:border-[color:var(--site-accent-strong)] focus-visible:bg-[color:var(--site-accent-strong)] active:bg-[color:var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70 xxl:h-14 xxl:min-w-[8.1rem] xxl:text-[1rem]";

const formatCount = (count: number) => count.toLocaleString();

const CuriousCatClickTrap: React.FC<CuriousCatClickTrapProps> = ({
  emailHref,
}) => {
  const [globalCount, setGlobalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [personalCount, setPersonalCount] = useState(0);
  const [buttonScale, setButtonScale] = useState(1);
  const [counterPulse, setCounterPulse] = useState(false);
  const [plusOnes, setPlusOnes] = useState<FloatingPlusOne[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const buttonResetTimeoutRef = useRef<number | null>(null);
  const plusOneTimeoutsRef = useRef<number[]>([]);
  const lastAnimationTimeRef = useRef(0);

  const clearTimeouts = useCallback(() => {
    if (pulseTimeoutRef.current !== null) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    if (buttonResetTimeoutRef.current !== null) {
      window.clearTimeout(buttonResetTimeoutRef.current);
    }

    plusOneTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    plusOneTimeoutsRef.current = [];
  }, []);

  const disconnectStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const pulseCounter = useCallback(() => {
    setCounterPulse(true);
    if (pulseTimeoutRef.current !== null) {
      window.clearTimeout(pulseTimeoutRef.current);
    }
    pulseTimeoutRef.current = window.setTimeout(() => {
      setCounterPulse(false);
    }, 500);
  }, []);

  const maybeAnimateIncomingCount = useCallback(() => {
    const now = Date.now();
    if (now - lastAnimationTimeRef.current < 75) {
      return;
    }

    lastAnimationTimeRef.current = now;
    pulseCounter();
  }, [pulseCounter]);

  const fetchCurrentCount = useCallback(async () => {
    try {
      const response = await fetch(
        `${ABACUS_BASE_URL}/get/${ABACUS_NAMESPACE}/${ABACUS_KEY}`,
      );

      if (response.ok) {
        const data = (await response.json()) as { value?: number };
        setGlobalCount(data.value ?? 0);
      } else if (response.status === 404) {
        setGlobalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch Abacus count", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUniqueView = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const hasRegisteredUniqueView = window.localStorage.getItem(
      UNIQUE_VIEW_STORAGE_KEY,
    );

    if (hasRegisteredUniqueView) {
      return;
    }

    try {
      const response = await fetch(
        `${ABACUS_BASE_URL}/hit/${ABACUS_NAMESPACE}/${ABACUS_UNIQUE_VIEW_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      window.localStorage.setItem(UNIQUE_VIEW_STORAGE_KEY, "1");
    } catch (error) {
      console.error("Failed to register unique Abacus view", error);
    }
  }, []);

  const connectToStream = useCallback(() => {
    if (typeof window === "undefined" || eventSourceRef.current) {
      return;
    }

    const eventSource = new EventSource(
      `${ABACUS_BASE_URL}/stream/${ABACUS_NAMESPACE}/${ABACUS_KEY}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { value?: number };
        const nextValue = data.value ?? 0;

        setGlobalCount((currentValue) => {
          if (nextValue > currentValue) {
            maybeAnimateIncomingCount();
            return nextValue;
          }

          return currentValue;
        });
      } catch (error) {
        console.error("Failed to parse Abacus stream event", error);
      }
    };

    eventSource.onerror = () => {
      disconnectStream();
    };

    eventSourceRef.current = eventSource;
  }, [disconnectStream, maybeAnimateIncomingCount]);

  const spawnPlusOne = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setPlusOnes((current) => [...current.slice(-5), { id, x, y }]);

    const timeoutId = window.setTimeout(() => {
      setPlusOnes((current) => current.filter((entry) => entry.id !== id));
      plusOneTimeoutsRef.current = plusOneTimeoutsRef.current.filter(
        (savedId) => savedId !== timeoutId,
      );
    }, 950);

    plusOneTimeoutsRef.current.push(timeoutId);
  }, []);

  const writePersonalCount = useCallback((nextCount: number) => {
    setPersonalCount(nextCount);
    window.localStorage.setItem(
      PERSONAL_COUNT_STORAGE_KEY,
      String(nextCount),
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedCount = window.localStorage.getItem(PERSONAL_COUNT_STORAGE_KEY);
    if (storedCount) {
      const parsedCount = Number.parseInt(storedCount, 10);
      if (!Number.isNaN(parsedCount)) {
        setPersonalCount(parsedCount);
      }
    }

    void fetchCurrentCount();
    void registerUniqueView();
    connectToStream();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnectStream();
        return;
      }

      void fetchCurrentCount();
      connectToStream();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PERSONAL_COUNT_STORAGE_KEY) {
        return;
      }

      const nextCount = Number.parseInt(event.newValue ?? "0", 10);
      setPersonalCount(Number.isNaN(nextCount) ? 0 : nextCount);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
      disconnectStream();
      clearTimeouts();
    };
  }, [
    clearTimeouts,
    connectToStream,
    disconnectStream,
    fetchCurrentCount,
    registerUniqueView,
  ]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - buttonRect.left;
    const relativeY = event.clientY - buttonRect.top;

    setButtonScale(0.97);
    if (buttonResetTimeoutRef.current !== null) {
      window.clearTimeout(buttonResetTimeoutRef.current);
    }
    buttonResetTimeoutRef.current = window.setTimeout(() => {
      setButtonScale(1);
    }, 150);

    const nextPersonalCount = personalCount + 1;
    writePersonalCount(nextPersonalCount);
    setGlobalCount((currentValue) => currentValue + 1);
    pulseCounter();
    spawnPlusOne(relativeX, relativeY);

    try {
      const response = await fetch(
        `${ABACUS_BASE_URL}/hit/${ABACUS_NAMESPACE}/${ABACUS_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      const data = (await response.json()) as { value?: number };
      if (typeof data.value === "number") {
        setGlobalCount(data.value);
      }
    } catch (error) {
      console.error("Failed to register Abacus click", error);
      writePersonalCount(Math.max(0, nextPersonalCount - 1));
      setGlobalCount((currentValue) => Math.max(0, currentValue - 1));
    }
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-[0.45rem] text-[0.65em] uppercase tracking-[0.06em] text-[color:var(--site-text-muted)]">
            Socials
          </span>
          <InfoTooltip
            ariaLabel="Why is there a click counter?"
            preferredPlacement="left"
            className="shrink-0"
          >
            <p className="m-0">
              Human sees button, human clicks button. Cats would respect that instinct.
            </p>
            <p className="mt-2 text-[color:var(--site-text-muted)]">
              Powered by{" "}
              <a
                href={ABACUS_DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="site-link-accent underline decoration-[rgba(110,231,183,0.45)] underline-offset-[3px]"
              >
                Abacus
              </a>
              .
            </p>
          </InfoTooltip>
        </div>
        <p className="m-0 text-[0.72em] leading-[1.2] text-[color:var(--site-text-muted)] opacity-90">
          Four actual useful buttons, plus one deeply unserious one for the
          dopamine crowd.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <InfoTooltip
          ariaLabel="LinkedIn"
          isInteractive={false}
          preferredPlacement="top"
          panelClassName="px-2.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[color:var(--site-text-strong)]"
          trigger={
            <a
              href="https://www.linkedin.com/in/shamanbenny/"
              aria-label="LinkedIn profile"
              className={socialLinkClassName}
            >
              <FaLinkedin />
            </a>
          }
        >
          LinkedIn
        </InfoTooltip>
        <InfoTooltip
          ariaLabel="GitHub"
          isInteractive={false}
          preferredPlacement="top"
          panelClassName="px-2.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[color:var(--site-text-strong)]"
          trigger={
            <a
              href="https://github.com/Shamanbenny"
              aria-label="GitHub profile"
              className={socialLinkClassName}
            >
              <FaGithub />
            </a>
          }
        >
          GitHub
        </InfoTooltip>
        <InfoTooltip
          ariaLabel="Instagram"
          isInteractive={false}
          preferredPlacement="top"
          panelClassName="px-2.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[color:var(--site-text-strong)]"
          trigger={
            <a
              href="https://www.instagram.com/shamanbenny/"
              aria-label="Instagram profile"
              className={socialLinkClassName}
            >
              <FaInstagram />
            </a>
          }
        >
          Instagram
        </InfoTooltip>
        <InfoTooltip
          ariaLabel="Email"
          isInteractive={false}
          preferredPlacement="top"
          panelClassName="px-2.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[color:var(--site-text-strong)]"
          trigger={
            <a
              href={emailHref}
              aria-label="Send an email"
              className={socialLinkClassName}
            >
              <FaEnvelope />
            </a>
          }
        >
          Send Email
        </InfoTooltip>
        <div className="relative overflow-hidden rounded-[0.75rem]">
          {plusOnes.map((entry) => (
            <span
              key={entry.id}
              className="cat-click-plus-one pointer-events-none absolute text-[0.74em] font-semibold text-[color:var(--site-accent-soft)]"
              style={{ left: entry.x, top: entry.y }}
            >
              +1
            </span>
          ))}
          <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={clickButtonClassName}
            style={{ transform: `scale(${buttonScale})` }}
          >
            Click Me
          </button>
        </div>
      </div>

      <div className="rounded-[0.85rem] bg-[color:var(--site-bg-soft)] px-3 py-2 text-[0.68em] leading-[1.35] text-[color:var(--site-text-muted)] xxl:text-[0.73em]">
        <span
          className={`font-medium text-[color:var(--site-text-strong)] transition-transform duration-200 ${
            counterPulse ? "scale-[1.03]" : ""
          } inline-block`}
        >
          {isLoading ? "---" : formatCount(globalCount)}
        </span>{" "}
        total clicks so far.
        {personalCount > 0 ? (
          <>
            {" "}
            You&apos;ve contributed{" "}
            <span className="font-medium text-[color:var(--site-text-strong)]">
              {formatCount(personalCount)}
            </span>
            .
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CuriousCatClickTrap;
