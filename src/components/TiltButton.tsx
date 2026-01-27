"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

interface TiltButtonBaseProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Makes the button square with equal padding - ideal for icon-only buttons */
  iconOnly?: boolean;
}

interface TiltButtonAsButton extends TiltButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'> {
  as?: "button";
  href?: never;
}

interface TiltButtonAsLink extends TiltButtonBaseProps {
  as: "link";
  href: string;
  onClick?: never;
}

type TiltButtonProps = TiltButtonAsButton | TiltButtonAsLink;

export function TiltButton({
  children,
  className = "",
  disabled = false,
  iconOnly = false,
  ...props
}: TiltButtonProps) {
  const paddingClass = iconOnly ? "p-3" : "px-3 py-2";
  
  const content = (
    <>
      {/* Tilted shadow - animates in on hover */}
      <div className="tilt-button-shadow absolute inset-0 bg-black border border-black" />
      {/* Main button face - lifts on hover */}
      <div className={`tilt-button-face relative flex items-center justify-center gap-2 ${paddingClass} bg-[var(--page-background)] border border-transparent text-[var(--foreground)]`}>
        {children}
      </div>
    </>
  );

  const baseClasses = `tilt-button group relative inline-flex ${disabled ? "opacity-30 cursor-not-allowed" : ""} ${className}`.trim();

  if (props.as === "link") {
    return (
      <Link href={props.href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  const { as, ...buttonProps } = props;
  return (
    <button
      className={baseClasses}
      disabled={disabled}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

// Icon components for common use cases
export function ArrowLeftIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}
