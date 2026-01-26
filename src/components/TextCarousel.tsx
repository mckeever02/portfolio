"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselItem {
  quote: React.ReactNode;
  attribution: string;
}

interface TextCarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  loop?: boolean;
  interval?: number;
  className?: string;
}

// Combined quote icon with progress ring - exported for external use
export function QuoteProgressIndicator({ progress, variant = "default" }: { progress: number; variant?: "default" | "light" }) {
  const size = 32;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const colors = variant === "light" 
    ? { ring: "text-white/30", progress: "text-white", icon: "text-white" }
    : { ring: "text-[var(--foreground)]/20", progress: "text-[var(--foreground)]", icon: "text-[var(--foreground)]" };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={colors.ring}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colors.progress}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <svg className={`w-4 h-4 ${colors.icon}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
  );
}

export function TextCarousel({
  items,
  autoplay = true,
  loop = true,
  interval = 3000,
  className = "",
  renderIndicator,
}: TextCarouselProps & { renderIndicator?: (progress: number) => React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!autoplay) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / interval, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        startTimeRef.current = Date.now();
        setProgress(0);
        setCurrentIndex((prev) => {
          if (prev >= items.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoplay, interval, items.length, loop]);

  return (
    <>
      {/* Render indicator externally if provided */}
      {renderIndicator?.(progress)}
      
      {/* Content container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className={className}
          style={{ 
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
        >
          <p className="text-[var(--foreground)] text-xl md:text-2xl leading-snug text-center">
            {items[currentIndex].quote}
          </p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
