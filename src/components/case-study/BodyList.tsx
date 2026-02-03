"use client";

import { twMerge } from "tailwind-merge";

interface BodyListProps {
  children: React.ReactNode;
  className?: string;
  /** Color for link highlights within the text */
  linkColor?: "blue" | "purple" | "brown" | "orange" | "neutral";
  /** Use ordered (numbered) list instead of unordered (bullet) list */
  ordered?: boolean;
}

export function BodyList({ children, className = "", linkColor = "blue", ordered = false }: BodyListProps) {
  const Component = ordered ? "ol" : "ul";
  
  return (
    <Component
      className={twMerge(
        "body-text-links",
        `body-text-links-${linkColor}`,
        "text-lg sm:text-xl leading-relaxed sm:tracking-[-0.2px] text-[var(--foreground)] space-y-2",
        ordered && "list-decimal list-inside marker:font-bold marker:text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </Component>
  );
}
