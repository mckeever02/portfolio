"use client";

import { ReactNode } from "react";

type TagVariant = "muted" | "colored";

interface SkewedTagProps {
  children: ReactNode;
  /** "muted" uses foreground colors, "colored" uses custom bgColor with white text */
  variant?: TagVariant;
  /** Custom background color (only used when variant is "colored") */
  bgColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Render as different HTML element */
  as?: "span" | "h3" | "h4";
}

export function SkewedTag({
  children,
  variant = "muted",
  bgColor,
  className = "",
  as: Component = "h3",
}: SkewedTagProps) {
  const baseClasses = "font-bold text-sm sm:text-base tracking-wide py-1 px-2 uppercase -skew-x-8 transform inline-block w-fit";
  
  const variantClasses = variant === "muted"
    ? "bg-[var(--foreground)]/10 text-[var(--foreground)]"
    : "text-white";
  
  const style = variant === "colored" && bgColor
    ? { backgroundColor: bgColor }
    : undefined;

  return (
    <Component
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      style={style}
    >
      {children}
    </Component>
  );
}
