"use client";

import { ReactNode } from "react";

interface QuoteCardProps {
  quote: ReactNode;
  attribution?: string;
}

export function QuoteCard({ quote, attribution }: QuoteCardProps) {
  return (
    <div className="bg-[var(--card-background)] border border-[var(--border-darker)] flex flex-col gap-6 p-6">
      <p className="text-[24px] sm:text-[28px] leading-[1.4] tracking-[-0.28px] text-[var(--foreground)]">
        {attribution ? <>&ldquo;{quote}&rdquo;</> : quote}
      </p>
      {attribution && (
        <p className="text-base font-bold tracking-[1.6px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
          {attribution}
        </p>
      )}
    </div>
  );
}
