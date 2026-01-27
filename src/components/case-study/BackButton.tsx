"use client";

import { TiltButton, ArrowLeftIcon } from "@/components/TiltButton";

export function BackButton() {
  return (
    <TiltButton as="link" href="/">
      <span className="tilt-button-arrow">
        <ArrowLeftIcon size={20} />
      </span>
      <span className="text-xl">Back</span>
    </TiltButton>
  );
}
