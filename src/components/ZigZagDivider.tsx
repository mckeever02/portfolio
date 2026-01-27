"use client";

interface ZigZagDividerProps {
  className?: string;
}

export function ZigZagDivider({ className = "" }: ZigZagDividerProps) {
  return (
    <div className={`flex justify-center py-12 ${className}`.trim()}>
      <svg
        className="w-24 h-3"
        viewBox="0 0 96 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 6L8 11L16 6L24 11L32 6L40 11L48 6L56 11L64 6L72 11L80 6L88 11L96 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--foreground)]"
        />
      </svg>
    </div>
  );
}
