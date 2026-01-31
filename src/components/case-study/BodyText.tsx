"use client";

import { twMerge } from "tailwind-merge";

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  /** Color for link highlights within the text */
  linkColor?: "blue" | "purple" | "brown" | "orange" | "neutral";
}

export function BodyText({ children, className = "", linkColor = "blue" }: BodyTextProps) {
  // Check if custom text size is provided to skip default responsive sizing
  const hasCustomTextSize = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[.*?\])\b/.test(className);
  
  const baseClasses = hasCustomTextSize
    ? "leading-relaxed text-[var(--foreground)]"
    : "text-lg sm:text-xl leading-relaxed sm:tracking-[-0.2px] text-[var(--foreground)]";
  
  return (
    <p className={twMerge("body-text-links", `body-text-links-${linkColor}`, baseClasses, className)}>
      {children}
    </p>
  );
}
