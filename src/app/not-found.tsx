"use client";

import Link from "next/link";
import { FuzzyText } from "@/components/FuzzyText";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="text-center flex flex-col items-center">
        {/* Fuzzy 404 */}
        <FuzzyText
          fontSize="clamp(8rem, 25vw, 20rem)"
          fontWeight={700}
          color="var(--foreground)"
          baseIntensity={0.46}
          hoverIntensity={0.96}
          fuzzRange={15}
          fps={120}
          letterSpacing={7}
          clickEffect={true}
          glitchMode={true}
          glitchInterval={1900}
          glitchDuration={200}
        >
          404
        </FuzzyText>

        {/* Back home link */}
        <Link
          href="/"
          className="inline-flex mt-12 items-center gap-2 text-[var(--foreground)] hover:opacity-70 transition-opacity text-lg group"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span className="wavy-link">Back to home</span>
        </Link>
      </div>
    </div>
  );
}
