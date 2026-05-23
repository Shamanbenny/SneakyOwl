"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FaInfo } from "react-icons/fa6";

type TooltipPlacement = "top" | "right" | "bottom" | "left";

type Position = {
  left: number;
  placement: TooltipPlacement;
  top: number;
};

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  className?: string;
};

type TooltipTriggerElement = React.ReactElement<
  TooltipTriggerProps & React.RefAttributes<HTMLElement>
>;

type InfoTooltipProps = {
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
  panelClassName?: string;
  preferredPlacement?: TooltipPlacement;
  trigger?: TooltipTriggerElement;
};

const VIEWPORT_MARGIN = 12;
const TOOLTIP_GAP = 10;
const TOOLTIP_CLOSE_DELAY_MS = 120;

const placementPriority = (preferredPlacement: TooltipPlacement) => {
  switch (preferredPlacement) {
    case "bottom":
      return ["bottom", "top", "right", "left"] as const;
    case "left":
      return ["left", "right", "top", "bottom"] as const;
    case "right":
      return ["right", "left", "top", "bottom"] as const;
    case "top":
    default:
      return ["top", "bottom", "right", "left"] as const;
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const mergeRefs = <T,>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(value);
        return;
      }

      (ref as React.MutableRefObject<T | null>).current = value;
    });
  };
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  ariaLabel = "More information",
  children,
  className,
  isInteractive = true,
  panelClassName,
  preferredPlacement = "top",
  trigger,
}) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const placementOrder = useMemo(
    () => placementPriority(preferredPlacement),
    [preferredPlacement],
  );

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openTooltip = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(true);
  }, [clearCloseTimeout]);

  const closeTooltip = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(false);
  }, [clearCloseTimeout]);

  const scheduleCloseTooltip = useCallback(() => {
    clearCloseTimeout();

    if (!isInteractive) {
      setIsOpen(false);
      return;
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, TOOLTIP_CLOSE_DELAY_MS);
  }, [clearCloseTimeout, isInteractive]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !panelRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current || !panelRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      const computePosition = (placement: TooltipPlacement): Position => {
        switch (placement) {
          case "bottom":
            return {
              top: triggerRect.bottom + TOOLTIP_GAP,
              left:
                triggerRect.left + triggerRect.width / 2 - panelRect.width / 2,
              placement,
            };
          case "left":
            return {
              top:
                triggerRect.top + triggerRect.height / 2 - panelRect.height / 2,
              left: triggerRect.left - panelRect.width - TOOLTIP_GAP,
              placement,
            };
          case "right":
            return {
              top:
                triggerRect.top + triggerRect.height / 2 - panelRect.height / 2,
              left: triggerRect.right + TOOLTIP_GAP,
              placement,
            };
          case "top":
          default:
            return {
              top: triggerRect.top - panelRect.height - TOOLTIP_GAP,
              left:
                triggerRect.left + triggerRect.width / 2 - panelRect.width / 2,
              placement,
            };
        }
      };

      const fitsViewport = ({ left, top }: Position) => {
        const right = left + panelRect.width;
        const bottom = top + panelRect.height;

        return (
          left >= VIEWPORT_MARGIN &&
          top >= VIEWPORT_MARGIN &&
          right <= window.innerWidth - VIEWPORT_MARGIN &&
          bottom <= window.innerHeight - VIEWPORT_MARGIN
        );
      };

      const nextPosition =
        placementOrder.map(computePosition).find(fitsViewport) ??
        (() => {
          const fallback = computePosition(preferredPlacement);

          return {
            placement: fallback.placement,
            left: clamp(
              fallback.left,
              VIEWPORT_MARGIN,
              window.innerWidth - panelRect.width - VIEWPORT_MARGIN,
            ),
            top: clamp(
              fallback.top,
              VIEWPORT_MARGIN,
              window.innerHeight - panelRect.height - VIEWPORT_MARGIN,
            ),
          };
        })();

      setPosition(nextPosition);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, placementOrder, preferredPlacement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }

      closeTooltip();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTooltip();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeTooltip, isOpen]);

  const tooltipPanel =
    isMounted && isOpen
      ? createPortal(
          <div
            ref={panelRef}
            role="tooltip"
            id={tooltipId}
            onMouseEnter={isInteractive ? openTooltip : undefined}
            onMouseLeave={scheduleCloseTooltip}
            className={`site-tooltip-panel z-[10020] max-w-[min(320px,calc(100vw-24px))] rounded-[14px] p-3 text-[0.76rem] leading-[1.45] selection:bg-[color:var(--site-selection-bg)] selection:text-[color:var(--site-selection-text)] ${panelClassName ?? ""}`}
            style={{
              left: position?.left ?? -9999,
              opacity: position ? 1 : 0,
              position: "fixed",
              top: position?.top ?? -9999,
            }}
          >
            {children}
          </div>,
          document.body,
        )
      : null;

  const triggerProps = {
    "aria-describedby": isOpen ? tooltipId : undefined,
    "aria-expanded": isOpen,
    "aria-label": trigger ? undefined : ariaLabel,
    className: trigger
      ? className
      : `site-tooltip-trigger site-tooltip-trigger--icon inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.66rem] duration-150 ease-linear ${className ?? ""}`,
    onBlur: scheduleCloseTooltip,
    onClick: () => {
      if (isOpen) {
        closeTooltip();
        return;
      }

      openTooltip();
    },
    onFocus: openTooltip,
    onMouseEnter: openTooltip,
    onMouseLeave: scheduleCloseTooltip,
  };

  const triggerNode = trigger ? (
    React.cloneElement<TooltipTriggerProps & React.RefAttributes<HTMLElement>>(
      trigger,
      {
        ...triggerProps,
        ...trigger.props,
        "aria-describedby": isOpen
          ? tooltipId
          : trigger.props["aria-describedby"],
        "aria-expanded":
          typeof trigger.props["aria-expanded"] === "undefined"
            ? isOpen
            : trigger.props["aria-expanded"],
        className: [trigger.props.className, "site-tooltip-trigger", className]
          .filter(Boolean)
          .join(" "),
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          trigger.props.onBlur?.(event);
          scheduleCloseTooltip();
        },
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (isOpen) {
            closeTooltip();
            return;
          }

          openTooltip();
        },
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          trigger.props.onFocus?.(event);
          openTooltip();
        },
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          trigger.props.onMouseEnter?.(event);
          openTooltip();
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          trigger.props.onMouseLeave?.(event);
          scheduleCloseTooltip();
        },
        ref: mergeRefs(
          triggerRef,
          (trigger as TooltipTriggerElement & { ref?: React.Ref<HTMLElement> })
            .ref,
        ),
      },
    )
  ) : (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      {...triggerProps}
    >
      <FaInfo />
    </button>
  );

  return (
    <>
      {triggerNode}
      {tooltipPanel}
    </>
  );
};

export default InfoTooltip;
