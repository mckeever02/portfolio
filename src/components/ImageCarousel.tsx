"use client";

import Image from "next/image";

const images = [
  { src: "/images/about-1.svg", alt: "Photo 1" },
  { src: "/images/about-2.svg", alt: "Photo 2" },
  { src: "/images/about-3.svg", alt: "Photo 3" },
  { src: "/images/about-4.svg", alt: "Photo 4" },
  { src: "/images/about-5.svg", alt: "Photo 5" },
  { src: "/images/about-6.svg", alt: "Photo 6" },
];

export function ImageCarousel() {
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* Scrolling Container */}
      <div className="flex gap-6 animate-scroll-x hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing w-max">
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[300px] sm:w-[378px] h-[225px] sm:h-[285px] bg-white overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={378}
              height={285}
              className="w-full h-full object-cover"
              style={{ filter: "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
