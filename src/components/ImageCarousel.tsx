"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback, useState } from "react";

const defaultImages = [
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
        fill="currentColor"
      />
    </svg>
  );
}

type ScrollDirection = "left" | "right" | "paused";

interface CarouselImage {
  src: string;
  alt: string;
  location?: string;
}

interface ImageCarouselProps {
  images?: CarouselImage[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  snap?: boolean;
  autoScroll?: boolean;
  autoScrollIntervalMs?: number;
  showCaptions?: boolean;
  imageClassName?: string;
}

export function ImageCarousel({
  images = defaultImages,
  className = "",
  cardWidth,
  cardHeight,
  gap = 24,
  snap = false,
  autoScroll = true,
  autoScrollIntervalMs = 2400,
  showCaptions = true,
  imageClassName = "",
}: ImageCarouselProps) {
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];
  const useCustomCardSize = Boolean(cardWidth && cardHeight);
  const resolvedWidth = cardWidth ?? 426;
  const resolvedHeight = cardHeight ?? 320;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
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
    if (snap) {
      return;
    }

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
  }, [snap]);

  useEffect(() => {
    if (!snap) return;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const itemWidth = resolvedWidth;
    const itemOffset = itemWidth + gap;
    const singleSetWidth = images.length * itemWidth + (images.length - 1) * gap;

    const centerActive = () => {
      const containerWidth = scrollContainer.clientWidth;
      const targetLeft =
        singleSetWidth +
        activeIndex * itemOffset -
        (containerWidth - itemWidth) / 2;
      scrollContainer.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    centerActive();
  }, [snap, activeIndex, gap, images.length, resolvedWidth]);

  useEffect(() => {
    if (!snap || !autoScroll) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, autoScrollIntervalMs);

    return () => window.clearInterval(interval);
  }, [snap, autoScroll, autoScrollIntervalMs, images.length]);

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
    <div 
      ref={(el) => {
        containerRef.current = el;
        scrollRef.current = el;
      }}
      className={`marquee-container relative w-full max-w-full overflow-hidden ${className}`}
      onMouseMove={snap ? undefined : handleMouseMove}
      onMouseEnter={snap ? undefined : handleMouseEnter}
      onMouseLeave={snap ? undefined : handleMouseLeave}
      style={{
        cursor: snap ? "default" : getCursor(),
        scrollSnapType: snap ? "x mandatory" : undefined,
      }}
    >
      {/* Scrolling Track */}
      <div className="marquee-track flex w-max" style={{ gap: `${gap}px` }}>
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className={
              useCustomCardSize
                ? "group relative flex-shrink-0 bg-white overflow-hidden"
                : "group relative flex-shrink-0 w-[338px] sm:w-[426px] h-[253px] sm:h-[320px] bg-white overflow-hidden"
            }
            style={{
              ...(useCustomCardSize ? { width: resolvedWidth, height: resolvedHeight } : {}),
              ...(snap ? { scrollSnapAlign: "center" } : {}),
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={resolvedWidth}
              height={resolvedHeight}
              className={`w-full h-full object-cover pointer-events-none ${imageClassName}`}
              draggable={false}
            />
            {/* Caption that slides up on hover (hidden on touch devices) */}
            {showCaptions && image.location && (
              <div 
                className="carousel-caption absolute left-2 bottom-2 flex items-center gap-1 bg-[var(--card-background)] border border-[var(--border-darker)] px-2 py-1.5 translate-y-[calc(100%+8px)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-[var(--foreground)]"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <LocationIcon />
                <span className="text-sm whitespace-nowrap">
                  {image.location}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
