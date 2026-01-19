"use client";

import { useState, useEffect } from "react";
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
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);
  
  // Clear clickedIndex once scroll reaches the target section
  useEffect(() => {
    if (clickedIndex !== null && activeIndex === clickedIndex) {
      setClickedIndex(null);
    }
  }, [activeIndex, clickedIndex]);

  // Use clicked index while scrolling to target, otherwise use active index
  const indicatorIndex = clickedIndex !== null ? clickedIndex : activeIndex;

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
        className="absolute left-[-12px] w-[2.5px] h-[14px] bg-[var(--nav-indicator)] rounded-full"
        initial={false}
        animate={{
          top: indicatorIndex * (24 + 32) + 5, // line-height (24px) + gap-8 (32px) + offset to center 14px line
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.8,
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
