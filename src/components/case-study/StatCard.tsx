"use client";

import { useTextScramble } from "@/hooks/useTextScramble";

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  const { displayText, elementRef } = useTextScramble({
    text: value,
    duration: 800,
    delay: 100,
    characters: "0123456789+.%",
  });

  return (
    <figure 
      ref={elementRef as React.RefObject<HTMLElement>}
      className="bg-[var(--card-background)] border border-[var(--border-darker)] p-6 text-center flex flex-col items-center gap-4"
    >
      <data className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[var(--foreground)] tabular-nums" value={value}>
        {displayText}
      </data>
      <figcaption className="text-[var(--foreground-secondary)] uppercase tracking-[1.2px] font-bold text-sm mt-2">
        {label}
      </figcaption>
    </figure>
  );
}
