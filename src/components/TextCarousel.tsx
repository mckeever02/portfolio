"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function QuoteMark() {
  return (
    <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 text-black" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

interface ProgressButtonProps {
  progress: number;
  onClick: () => void;
}

function ProgressButton({ progress, onClick }: ProgressButtonProps) {
  const size = 54;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <button
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
      aria-label="Next quote"
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-black/10"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-black"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      {/* Down arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
  );
}


export function TextCarousel({
  items,
  autoplay = true,
  loop = true,
  interval = 3000,
  className = "",
}: TextCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= items.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [items.length, loop]);

  useEffect(() => {
    if (!autoplay) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / interval, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        // Reset for next cycle
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

  const handleManualNext = () => {
    goToNext();
  };

  return (
    <div
      className={`relative w-full pt-16 pb-20 ${className}`}
    >
      <QuoteMark />
      <div className="relative w-full h-[280px] md:h-[240px] py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="absolute inset-0 flex flex-col justify-center items-start gap-6"
          >
            <p className="text-[var(--foreground)] text-2xl md:text-3xl leading-relaxed">
              {items[currentIndex].quote}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Progress button */}
      <ProgressButton 
        progress={progress} 
        onClick={handleManualNext}
      />
    </div>
  );
}
