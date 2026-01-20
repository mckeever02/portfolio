"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  external?: boolean;
  className?: string;
}

export function Button({
  children,
  href,
  onClick,
  iconBefore,
  iconAfter,
  external = false,
  className = "",
}: ButtonProps) {
  const content = (
    <>
      {/* Shadow - animates in on hover */}
      <div className="tilt-button-shadow absolute inset-0 bg-black border border-black" />
      {/* Main button face */}
      <div className="tilt-button-face relative flex items-center gap-2 px-2 py-2 bg-[var(--background)] border border-transparent">
        {iconBefore && (
          <span className="tilt-button-icon shrink-0">{iconBefore}</span>
        )}
        <span className="text-xl text-[var(--foreground)]">{children}</span>
        {iconAfter && (
          <span className="tilt-button-icon shrink-0">{iconAfter}</span>
        )}
      </div>
    </>
  );

  const baseClassName = `tilt-button group relative inline-block ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClassName}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClassName}>
      {content}
    </button>
  );
}
