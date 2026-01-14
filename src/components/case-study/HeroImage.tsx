"use client";

import Image from "next/image";

interface HeroImageProps {
  bgColor: string;
  imageSrc?: string;
  children?: React.ReactNode;
}

export function HeroImage({ bgColor, imageSrc, children }: HeroImageProps) {
  return (
    <div
      className="relative w-full aspect-[1800/1110] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          priority
        />
      )}
      {children}
    </div>
  );
}
