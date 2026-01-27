"use client";

import { useRef, useEffect, useState, RefObject, ReactNode } from "react";
import { motion, MotionValue, useMotionValue } from "framer-motion";

// Hook to detect touch devices
function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none)').matches
      );
    };
    
    checkTouchDevice();
  }, []);

  return isTouchDevice;
}

interface UseHoverCursorOptions {
  containerRef: RefObject<HTMLElement | null>;
}

interface UseHoverCursorReturn {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseEnter: (e: React.MouseEvent) => void;
}

export function useHoverCursor({ containerRef }: UseHoverCursorOptions): UseHoverCursorReturn {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const lastClientPos = useRef({ x: 0, y: 0 });
  const isTracking = useRef(false);

  const updateCursorPosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorX.set(clientX - rect.left);
      cursorY.set(clientY - rect.top);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isTracking.current) {
        updateCursorPosition(lastClientPos.current.x, lastClientPos.current.y);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    isTracking.current = true;
    updateCursorPosition(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    isTracking.current = true;
    updateCursorPosition(e.clientX, e.clientY);
  };

  return {
    cursorX,
    cursorY,
    handleMouseMove,
    handleMouseEnter,
  };
}

interface HoverCursorProps {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  isVisible: boolean;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-24 h-24",
};

export function HoverCursor({
  cursorX,
  cursorY,
  isVisible,
  children,
  size = "md",
  className = "",
  label,
}: HoverCursorProps) {
  const isTouchDevice = useIsTouchDevice();

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: isVisible ? 1 : 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {label ? (
        <div className="bg-[var(--foreground)] rounded-full pl-4 pr-1.5 py-1.5 whitespace-nowrap flex items-center gap-3">
          <span className="text-[var(--background)] text-base font-medium">{label}</span>
          <div className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center">
            <span className="[&_svg]:text-[var(--foreground)]">{children}</span>
          </div>
        </div>
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-[var(--foreground)] flex items-center justify-center ${className}`}>
          {children}
        </div>
      )}
    </motion.div>
  );
}

// Pre-built icon variants for common use cases
interface CursorIconProps {
  className?: string;
}

export function RotateIcon({ flipCount = 0, className = "" }: CursorIconProps & { flipCount?: number }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[var(--background)] transition-transform duration-500 ${className}`}
      style={{ transform: `rotate(${flipCount * 360}deg)` }}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export function ArrowIcon({ direction = "right", className = "" }: CursorIconProps & { direction?: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[var(--background)] transition-transform duration-200 ${direction === "left" ? "rotate-180" : ""} ${className}`}
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

export function ExternalArrowIcon({ className = "" }: CursorIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[var(--background)] ${className}`}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function ComingSoonText({ className = "" }: CursorIconProps) {
  return (
    <span className={`text-[var(--background)] text-xs font-bold tracking-wide uppercase text-center leading-tight ${className}`}>
      Coming<br />soon
    </span>
  );
}
