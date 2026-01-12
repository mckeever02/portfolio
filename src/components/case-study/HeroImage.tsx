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
      className="relative w-full h-[300px] sm:h-[350px] md:h-[408px] overflow-hidden"
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
