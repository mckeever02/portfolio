"use client";

import { Button } from "../Button";

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export function BackButton() {
  return (
    <Button href="/" iconBefore={<ArrowLeftIcon />}>
      Back
    </Button>
  );
}
