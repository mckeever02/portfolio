"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface PixelRevealImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** How pixelated the initial state should be (lower = more pixelated). Default: 10 */
  pixelSize?: number;
  /** Duration of the scanline reveal in ms. Default: 800 */
  duration?: number;
  /** Delay before starting the reveal animation (ms). Default: 0 */
  delay?: number;
  /** Direction of the scanline. Default: "down" */
  direction?: "up" | "down";
}

export function PixelRevealImage({
  src,
  alt,
  width,
  height,
  className = "",
  pixelSize = 10,
  duration = 800,
  delay = 0,
  direction = "down",
}: PixelRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Intersection observer for scroll trigger
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setHasTriggered(true);

            setTimeout(() => {
              startReveal();
            }, delay);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [delay, hasTriggered]);

  const startReveal = () => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Linear - no easing
      setRevealProgress(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    requestAnimationFrame(animate);
  };

  // Calculate clip path based on direction and progress
  const getClipPath = (progress: number) => {
    if (direction === "down") {
      return `inset(0 0 ${100 - progress}% 0)`;
    } else {
      return `inset(${100 - progress}% 0 0 0)`;
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Pixelated version - base layer */}
      <Image
        src={src}
        alt=""
        width={Math.ceil(width / pixelSize)}
        height={Math.ceil(height / pixelSize)}
        className="w-full h-full object-cover"
        style={{
          imageRendering: "pixelated",
          opacity: isComplete ? 0 : 1,
        }}
        aria-hidden="true"
      />

      {/* Full resolution image - revealed with scanline clip */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: getClipPath(revealProgress),
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
