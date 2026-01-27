"use client";

import Link from "next/link";

export function BackButton() {
  return (
    <Link href="/" className="back-button group relative inline-block">
      {/* Tilted shadow - animates in on hover */}
      <div className="back-button-shadow absolute inset-0 bg-black border border-black" />
      {/* Main button - lifts slightly on hover */}
      <div className="back-button-face relative flex items-center gap-2 px-2 py-2 bg-[var(--page-background)] border border-transparent">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="back-button-arrow"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span className="text-xl text-[var(--foreground)]">Back</span>
      </div>
    </Link>
  );
}
