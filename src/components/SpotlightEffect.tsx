"use client";

import { useRef, ReactNode } from "react";

interface SpotlightEffectProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightEffect({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.15)",
}: SpotlightEffectProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-effect ${className}`}
    >
      {children}
    </div>
  );
}
