"use client";

import { ReactNode, CSSProperties } from "react";
import Link from "next/link";

type HighlightColor = "blue" | "purple" | "brown" | "orange" | "neutral";

interface HighlightTextProps {
  children: ReactNode;
  color?: HighlightColor;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  /** When true, shows full highlight (like hover state) */
  isActive?: boolean;
  /** Progress from 0-100, controls countdown animation of background shrinking */
  progress?: number;
}

const colorClasses: Record<HighlightColor, string> = {
  blue: "highlight-expand-blue",
  purple: "highlight-expand-purple",
  brown: "highlight-expand-brown",
  orange: "highlight-expand-orange",
  neutral: "highlight-expand-neutral",
};

export function HighlightText({
  children,
  color = "blue",
  href,
  external = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
  isActive = false,
  progress,
}: HighlightTextProps) {
  const baseClasses = `highlight-expand ${colorClasses[color]} ${className}`.trim();
  
  // Calculate dynamic styles for active state with progress countdown
  const dynamicStyle: CSSProperties | undefined = 
    isActive && progress !== undefined
      ? {
          // Progress goes 100 -> 0, so background shrinks from 100% to 3px
          backgroundSize: `100% ${3 + (progress / 100) * 97}%`,
          transition: "none", // Disable CSS transition when JS is controlling countdown
        }
      : isActive
      ? {
          backgroundSize: "100% 100%",
          // Springy expansion animation
          transition: "background-size 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }
      : undefined;

  const props = {
    className: baseClasses,
    style: dynamicStyle,
    onClick,
    onMouseEnter,
    onMouseLeave,
  };

  // If it's an external link
  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  // If it's an internal link
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // Default: span (for hover interactions without navigation)
  return (
    <span {...props}>
      {children}
    </span>
  );
}
