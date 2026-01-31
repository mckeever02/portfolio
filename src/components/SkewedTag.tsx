"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TagVariant = "muted" | "colored";
type TagSize = "sm" | "base" | "lg" | "xl";

interface SkewedTagProps {
  children: ReactNode;
  /** "muted" uses foreground colors, "colored" uses custom bgColor with white text */
  variant?: TagVariant;
  /** Custom background color (only used when variant is "colored") */
  bgColor?: string;
  /** Font size preset */
  size?: TagSize;
  /** Additional CSS classes */
  className?: string;
  /** Render as different HTML element */
  as?: "span" | "h3" | "h4";
}

const sizeClasses: Record<TagSize, string> = {
  sm: "text-xs sm:text-sm",
  base: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
  xl: "text-lg sm:text-xl",
};

export function SkewedTag({
  children,
  variant = "muted",
  bgColor,
  size = "base",
  className = "",
  as: Component = "h3",
}: SkewedTagProps) {
  const baseClasses = "font-bold tracking-wide py-1 px-2 uppercase -skew-x-8 transform inline-block w-fit";
  
  const variantClasses = variant === "muted"
    ? "bg-[var(--foreground)]/10 text-[var(--foreground)]"
    : "text-white";
  
  const style = variant === "colored" && bgColor
    ? { backgroundColor: bgColor }
    : undefined;

  return (
    <Component
      className={twMerge(baseClasses, sizeClasses[size], variantClasses, className)}
      style={style}
    >
      {children}
    </Component>
  );
}
