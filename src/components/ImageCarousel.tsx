"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback, useState } from "react";

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

type ScrollDirection = "left" | "right" | "paused";

export function ImageCarousel() {
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  
  const [cursorStyle, setCursorStyle] = useState<ScrollDirection>("paused");

  // Calculate velocity based on mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const centerX = containerWidth / 2;
    
    // Calculate normalized position (-1 to 1, where 0 is center)
    const normalizedPosition = (mouseX - centerX) / centerX;
    
    // Dead zone in the middle - only the outer 25% on each side triggers scrolling
    const deadZone = 0.75;
    
    if (Math.abs(normalizedPosition) < deadZone) {
      velocityRef.current = 0;
      setCursorStyle("paused");
    } else {
      // Calculate velocity (max speed of 8px per frame)
      const maxSpeed = 8;
      const adjustedPosition = normalizedPosition > 0 
        ? (normalizedPosition - deadZone) / (1 - deadZone)
        : (normalizedPosition + deadZone) / (1 - deadZone);
      
      // Exponential curve for smoother acceleration
      const speed = Math.pow(Math.abs(adjustedPosition), 1.5) * maxSpeed;
      velocityRef.current = normalizedPosition > 0 ? speed : -speed;
      setCursorStyle(normalizedPosition > 0 ? "right" : "left");
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    velocityRef.current = 0;
    setCursorStyle("paused");
  }, []);

  // Animation loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Initialize scroll position to center of content
    const singleSetWidth = scrollContainer.scrollWidth / 3;
    scrollPositionRef.current = singleSetWidth;
    scrollContainer.scrollLeft = singleSetWidth;

    const animate = () => {
      if (!scrollContainer) return;
      
      // Default auto-scroll when not hovering
      const baseSpeed = isHoveringRef.current ? 0 : 0.5;
      const currentVelocity = isHoveringRef.current ? velocityRef.current : baseSpeed;
      
      scrollPositionRef.current += currentVelocity;
      
      // Seamless loop logic
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      
      if (scrollPositionRef.current >= singleSetWidth * 2) {
        scrollPositionRef.current -= singleSetWidth;
      } else if (scrollPositionRef.current <= 0) {
        scrollPositionRef.current += singleSetWidth;
      }
      
      scrollContainer.scrollLeft = scrollPositionRef.current;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getCursor = () => {
    switch (cursorStyle) {
      case "left":
        return "w-resize";
      case "right":
        return "e-resize";
      default:
        return "default";
    }
  };

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
            {/* Caption that slides up on hover (hidden on touch devices) */}
            <div 
              className="carousel-caption absolute left-2 bottom-2 flex items-center gap-1 bg-white border border-foreground px-2 py-1.5 translate-y-[calc(100%+8px)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
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
