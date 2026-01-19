"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface SectionNavProps {
  activeSection: string;
}

const navItems = [
  { id: "works", label: "Selected Works" },
  { id: "projects", label: "Side Projects" },
  { id: "about", label: "About" },
];

const MIN_HEIGHT = 3;
const MAX_HEIGHT = 14;

export function SectionNav({ activeSection }: SectionNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);
  
  // Track scroll progress within the active section
  const updateProgress = useCallback(() => {
    const element = document.getElementById(activeSection);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how far through the section we've scrolled
    // Progress starts when section enters viewport and ends when it leaves
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // Start progress when section top reaches 20% from top of viewport (matching rootMargin)
    const triggerPoint = viewportHeight * 0.2;
    const scrolledPast = triggerPoint - sectionTop;
    const progress = Math.max(0, Math.min(1, scrolledPast / sectionHeight));
    
    setSectionProgress(progress);
  }, [activeSection]);
  
  useEffect(() => {
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);
  
  // Clear clickedIndex once scroll reaches the target section
  useEffect(() => {
    if (clickedIndex !== null && activeIndex === clickedIndex) {
      setClickedIndex(null);
    }
  }, [activeIndex, clickedIndex]);

  // Use clicked index while scrolling to target, otherwise use active index
  const indicatorIndex = clickedIndex !== null ? clickedIndex : activeIndex;
  
  // Calculate indicator height based on scroll progress (shrinks as you scroll)
  const indicatorHeight = MAX_HEIGHT - (MAX_HEIGHT - MIN_HEIGHT) * sectionProgress;

  const handleClick = (id: string, index: number) => {
    setClickedIndex(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="relative hidden md:flex flex-col gap-8 w-3/4"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Active Indicator */}
      <motion.div
        className="absolute left-[-12px] w-[3px] bg-[var(--nav-indicator)] rounded-full"
        initial={false}
        animate={{
          // Keep indicator centered within the line-height as it grows
          top: indicatorIndex * (24 + 32) + (24 - indicatorHeight) / 2,
          height: indicatorHeight,
        }}
        transition={{
          top: {
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.8,
          },
          height: {
            duration: 0,
          },
        }}
      />

      {/* Nav Items */}
      {navItems.map((item, index) => (
        <motion.button
          key={item.id}
          onClick={() => handleClick(item.id, index)}
          onMouseEnter={() => setHoveredIndex(index)}
          className={`text-left text-base cursor-pointer transition-none ${
            (clickedIndex !== null ? index === clickedIndex : activeSection === item.id)
              ? "text-[var(--foreground)]"
              : "text-[var(--foreground-secondary)]"
          }`}
          initial={false}
          animate={{
            x: hoveredIndex === index ? 4 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.8,
          }}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}
