"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface SectionNavProps {
  activeSection: string;
}

const navItems = [
  { id: "works", label: "Selected Works" },
  { id: "projects", label: "Side Projects" },
  { id: "about", label: "About" },
];

export function SectionNav({ activeSection }: SectionNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const prevActiveIndexRef = useRef<number>(-1);
  const isFirstRender = useRef(true);
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);

  // Skip spin on first render
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Clear target when activeSection catches up to target, and trigger spin
  useEffect(() => {
    if (targetIndex !== null && activeIndex === targetIndex) {
      setTargetIndex(null);
      if (!isFirstRender.current) {
        setSpinCount((prev) => prev + 1);
      }
    }
  }, [activeIndex, targetIndex]);

  // Spin when active section changes from scrolling (not from clicking)
  useEffect(() => {
    if (!isFirstRender.current && prevActiveIndexRef.current !== -1 && prevActiveIndexRef.current !== activeIndex && targetIndex === null) {
      setSpinCount((prev) => prev + 1);
    }
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex, targetIndex]);

  // Use target during navigation, otherwise follow activeSection
  const indicatorIndex = targetIndex ?? activeIndex;

  const handleClick = (id: string, index: number) => {
    // Don't do anything if already at target
    if (index === activeIndex && targetIndex === null) {
      return;
    }
    
    // Set target immediately so indicator moves directly there
    setTargetIndex(index);
    
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
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="26 4 18 18"
        className="absolute left-[-22px] w-[10px] h-[10px] fill-[var(--nav-indicator)]"
        initial={false}
        animate={{
          top: indicatorIndex * (24 + 32) + 7, // line-height (24px) + gap-8 (32px) + offset to center (24 - 10) / 2
          rotate: spinCount * 720, // 2 full rotations per arrival
        }}
        transition={{
          top: {
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.8,
          },
          rotate: {
            type: "tween",
            duration: 1,
            ease: [0.12, 1, 0.2, 1], // custom ease - dramatic deceleration at end
            delay: 0.25,
          },
        }}
      >
        <path d="M43.221,12.039c-5.292-1.195-6.035-1.938-7.23-7.229-.104-.456-.508-.779-.976-.779s-.872.323-.976.779c-1.195,5.291-1.938,6.034-7.229,7.229-.456.104-.779.508-.779.976s.323.872.779.976c5.291,1.195,6.034,1.938,7.229,7.23.104.455.508.779.976.779s.872-.324.976-.779c1.195-5.292,1.938-6.035,7.23-7.23.455-.104.779-.508.779-.976s-.324-.872-.779-.976Z" />
      </motion.svg>

      {/* Nav Items */}
      {navItems.map((item, index) => (
        <motion.button
          key={item.id}
          onClick={() => handleClick(item.id, index)}
          onMouseEnter={() => setHoveredIndex(index)}
          className={`text-left text-base cursor-pointer transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--foreground)] focus-visible:outline-offset-2 ${
            activeSection === item.id || hoveredIndex === index
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
