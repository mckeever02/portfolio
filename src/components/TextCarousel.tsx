"use client";

import { useState, useEffect, useCallback } from "react";
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


export function TextCarousel({
  items,
  autoplay = true,
  loop = true,
  interval = 3000,
  className = "",
}: TextCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoplay || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= items.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, interval, items.length, loop]);

  return (
    <div
      className={`relative pt-16 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <QuoteMark />
      <div
        className="relative overflow-hidden py-8 w-full"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
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
            className="flex flex-col items-start gap-6"
          >
            <p className="text-[var(--foreground)] text-2xl md:text-3xl leading-relaxed">
              {items[currentIndex].quote}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
