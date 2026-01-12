"use client";

import Image from "next/image";

interface TiltedImage {
  src: string;
  alt: string;
}

interface TiltedImageGridProps {
  images: TiltedImage[];
}

// Predefined rotations for consistency
const rotations = [3.149, -3.892, -3.95, 3.892];

export function TiltedImageGrid({ images }: TiltedImageGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square flex items-center justify-center"
        >
          <div
            className="relative w-[90%] h-[90%]"
            style={{
              transform: `rotate(${rotations[index % rotations.length]}deg)`,
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
