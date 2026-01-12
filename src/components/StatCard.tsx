"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  value: number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  const { count, elementRef } = useCountUp({ end: value, duration: 2000 });

  return (
    <div
      ref={elementRef}
      className="flex-1 bg-white border border-[var(--border-darker)] p-4 overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[28px] font-light text-black">
          {count}
        </span>
        <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
          {label}
        </span>
      </div>
    </div>
  );
}
