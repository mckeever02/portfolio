"use client";

import { ReactNode } from "react";
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
}: HighlightTextProps) {
  const baseClasses = `highlight-expand ${colorClasses[color]} ${className}`.trim();

  // If it's an external link
  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    );
  }

  // If it's an internal link
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Link>
    );
  }

  // Default: span (for hover interactions without navigation)
  return (
    <span
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </span>
  );
}
