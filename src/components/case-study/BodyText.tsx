"use client";

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
}

export function BodyText({ children, className = "" }: BodyTextProps) {
  return (
    <p className={`text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)] ${className}`}>
      {children}
    </p>
  );
}
