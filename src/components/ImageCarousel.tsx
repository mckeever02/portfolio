"use client";

import Image from "next/image";

const images = [
  { src: "/images/michael-mckeever-hiking.jpg", alt: "Michael hiking", location: "Mourne Mountains" },
  { src: "/images/michael-mckeever-in-tenerife.jpg", alt: "Michael in Tenerife", location: "Tenerife" },
  { src: "/images/michael-mckeever-kayaking.jpg", alt: "Michael kayaking", location: "Vancouver Island" },
  { src: "/images/michael-mckeever-vancouver-downtown.jpg", alt: "Michael in Vancouver downtown", location: "Vancouver" },
  { src: "/images/michael-mckeever-vancouver.jpg", alt: "Michael in Vancouver", location: "Stanley Park" },
];

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M8 1.5C5.51472 1.5 3.5 3.51472 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51472 10.4853 1.5 8 1.5ZM8 7.75C7.0335 7.75 6.25 6.9665 6.25 6C6.25 5.0335 7.0335 4.25 8 4.25C8.9665 4.25 9.75 5.0335 9.75 6C9.75 6.9665 8.9665 7.75 8 7.75Z" 
        fill="#21201c"
      />
    </svg>
  );
}

export function ImageCarousel() {
  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="marquee-container relative w-full max-w-full overflow-hidden">
      {/* Scrolling Track */}
      <div className="marquee-track flex gap-6 w-max">
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 w-[338px] sm:w-[426px] h-[253px] sm:h-[320px] bg-white overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={426}
              height={320}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {/* Caption that slides up on hover */}
            <div 
              className="absolute left-2 bottom-2 flex items-center gap-1 bg-white border border-foreground px-2 py-1.5 translate-y-[calc(100%+8px)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              <LocationIcon />
              <span className="text-sm text-foreground whitespace-nowrap">
                {image.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
