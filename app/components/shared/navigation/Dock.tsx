"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type DockActionItem = {
  type?: "item";
  className?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

type DockDividerItem = {
  type: "divider";
  className?: string;
};

export type DockEntry = DockActionItem | DockDividerItem;

type DockProps = {
  baseItemSize?: number;
  className?: string;
  distance?: number;
  dockHeight?: number;
  items: DockEntry[];
  magnification?: number;
  panelHeight?: number;
  position?: "top" | "bottom";
  spring?: SpringOptions;
};

type DockItemProps = {
  baseItemSize: number;
  children: ReactNode;
  className?: string;
  distance: number;
  label: string;
  magnification: number;
  mouseX: MotionValue<number>;
  onClick?: () => void;
  position: "top" | "bottom";
  spring: SpringOptions;
};

type DockLabelProps = {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
  position?: "top" | "bottom";
};

type DockIconProps = {
  children: ReactNode;
  className?: string;
};

const isDivider = (item: DockEntry): item is DockDividerItem => item.type === "divider";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  position,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      width: baseItemSize,
      x: 0,
    };

    return value - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.button
      ref={ref}
      aria-label={label}
      className={`dock-item ${className}`}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onFocus={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onHoverStart={() => isHovered.set(1)}
      style={{
        height: size,
        width: size,
      }}
      type="button"
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child as ReactElement<Record<string, unknown>>, {
          isHovered,
          position,
        });
      })}
    </motion.button>
  );
}

function DockLabel({
  children,
  className = "",
  isHovered,
  position = "bottom",
}: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      return;
    }

    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          animate={{
            opacity: 1,
            y: position === "top" ? 10 : -10,
          }}
          className={`dock-label dock-label--${position} ${className}`}
          exit={{ opacity: 0, y: 0 }}
          initial={{ opacity: 0, y: 0 }}
          role="tooltip"
          transition={{ duration: 0.18 }}
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { damping: 14, mass: 0.12, stiffness: 170 },
  magnification = 70,
  distance = 180,
  panelHeight = 68,
  dockHeight = 132,
  baseItemSize = 50,
  position = "bottom",
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 24),
    [dockHeight, magnification],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      className={`dock-outer dock-outer--${position}`}
      style={{ height, scrollbarWidth: "none" }}
    >
      <motion.div
        aria-label="Application dock"
        className={`dock-panel dock-panel--${position} ${className}`}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        role="toolbar"
        style={{ height: panelHeight }}
      >
        {items.map((item, index) => {
          if (isDivider(item)) {
            return <div key={`divider-${index}`} aria-hidden="true" className="dock-divider" />;
          }

          return (
            <DockItem
              key={`${item.label}-${index}`}
              baseItemSize={baseItemSize}
              className={item.className}
              distance={distance}
              label={item.label}
              magnification={magnification}
              mouseX={mouseX}
              onClick={item.onClick}
              position={position}
              spring={spring}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
