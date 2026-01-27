"use client";

import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface LightboxImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  maxWidth?: string;
}

export function LightboxImage({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
  maxWidth = "1100px",
}: LightboxImageProps) {
  return (
    <div
      className={`mx-auto w-full ${className}`}
      style={{ maxWidth }}
    >
      <Zoom
        zoomMargin={20}
        classDialog="lightbox-dialog"
        IconUnzoom={CloseIcon}
      >
        <div
          className="relative rounded xs:rounded-md sm:rounded-lg overflow-hidden border border-black/10 w-full"
          style={{ aspectRatio }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`(max-width: 768px) 100vw, ${maxWidth}`}
          />
        </div>
      </Zoom>
    </div>
  );
}
