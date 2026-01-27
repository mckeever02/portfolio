"use client";

import Image from "next/image";

interface HeroImageProps {
  bgColor: string;
  imageSrc?: string;
  videoPoster?: string;
  children?: React.ReactNode;
}

function isVideo(src: string): boolean {
  return src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov");
}

export function HeroImage({ bgColor, imageSrc, videoPoster, children }: HeroImageProps) {
  return (
    <div
      className="relative w-full aspect-[1800/1110] overflow-hidden border border-black/20 dark:border-white/10"
    >
      {imageSrc && isVideo(imageSrc) ? (
        <video
          src={imageSrc}
          poster={videoPoster}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          priority
        />
      ) : null}
      {children}
    </div>
  );
}
