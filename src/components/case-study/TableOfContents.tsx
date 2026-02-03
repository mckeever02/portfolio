"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

// Collapsed bar dimensions
const COLLAPSED_WIDTH = 8;
const COLLAPSED_HEIGHT = 64;
const COLLAPSED_BORDER_RADIUS = 4;

export function TableOfContents({ sections }: TableOfContentsProps) {
  const sectionIds = sections.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);
  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const prevActiveIndexRef = useRef<number>(-1);
  const isFirstRender = useRef(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [shouldAnimateStar, setShouldAnimateStar] = useState(false); // Don't animate when menu first opens
  const [expandedSize, setExpandedSize] = useState({ width: 200, height: 150 });
  const measureRef = useRef<HTMLDivElement>(null);
  const measureButtonRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for hidden measurement buttons
  const buttonOffsetsRef = useRef<number[]>([]); // Cached button center positions
  const barRef = useRef<HTMLDivElement>(null);
  const [proximityScale, setProximityScale] = useState(1);
  
  // Measure expanded content size and button positions from hidden measurement div
  useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setExpandedSize({ width: rect.width, height: rect.height });
      }
      
      // Calculate and cache button center positions relative to the nav container
      // These positions are stable and don't change with scroll
      const offsets: number[] = [];
      measureButtonRefs.current.forEach((button, index) => {
        if (button) {
          // offsetTop is relative to the offsetParent, which is stable
          // Add half the height to get the center
          offsets[index] = button.offsetTop + button.offsetHeight / 2;
        }
      });
      buttonOffsetsRef.current = offsets;
    }
  }, [sections]);
  
  // Track mouse proximity to collapsed bar
  useEffect(() => {
    if (isHovered) {
      setProximityScale(1);
      return;
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current || isHovered) return;
      
      const rect = barRef.current.getBoundingClientRect();
      const barCenterX = rect.left + rect.width / 2;
      const barCenterY = rect.top + rect.height / 2;
      
      // Calculate distance from cursor to bar center
      const distance = Math.sqrt(
        Math.pow(e.clientX - barCenterX, 2) + 
        Math.pow(e.clientY - barCenterY, 2)
      );
      
      // Scale based on proximity (within 100px range)
      const maxDistance = 100;
      const minScale = 1;
      const maxScale = 1.3;
      
      if (distance < maxDistance) {
        const scale = maxScale - ((distance / maxDistance) * (maxScale - minScale));
        setProximityScale(scale);
      } else {
        setProximityScale(1);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered]);
  
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
  // Ensure we have a valid index (fallback to 0 if not found)
  const rawIndicatorIndex = targetIndex ?? activeIndex;
  const indicatorIndex = rawIndicatorIndex >= 0 ? rawIndicatorIndex : 0;
  
  // Get the indicator offset from cached values (calculated once from measurement div)
  // This is stable and doesn't depend on scroll position or container state
  const indicatorOffset = buttonOffsetsRef.current[indicatorIndex] ?? 0;
  
  // When menu closes, disable star animation for next open
  useEffect(() => {
    if (!isHovered) {
      setShouldAnimateStar(false);
    }
  }, [isHovered]);
  
  // Enable animation after menu opens (so initial position doesn't animate)
  useEffect(() => {
    if (!isHovered) return;
    // Enable animation after a brief delay (after initial position is shown)
    const enableAnimation = setTimeout(() => setShouldAnimateStar(true), 50);
    return () => clearTimeout(enableAnimation);
  }, [isHovered]);

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

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  };

  return (
    <>
      {/* Hidden measurement div - renders content off-screen to measure natural size and button positions */}
      <div
        ref={measureRef}
        className="fixed -left-[9999px] top-0 pl-2 pr-4 py-2 pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative flex">
          <div className="relative w-[13px] shrink-0" />
          <nav className="relative flex flex-col gap-1">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                ref={(el) => { measureButtonRefs.current[index] = el; }}
                className="px-3 py-1.5 text-base leading-normal whitespace-nowrap"
              >
                {section.title}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Shadow rectangle - offset behind main container */}
      <motion.div
        className="fixed left-4 top-1/2 z-40 hidden xl:block pointer-events-none"
        initial={false}
        animate={{
          width: isHovered ? expandedSize.width : COLLAPSED_WIDTH,
          height: isHovered ? expandedSize.height : COLLAPSED_HEIGHT,
          borderRadius: isHovered ? 0 : COLLAPSED_BORDER_RADIUS,
          opacity: isHovered ? 1 : 0,
          x: 4,
          y: "calc(-50% + 4px)",
        }}
        transition={springTransition}
        style={{ 
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "var(--foreground)",
          backgroundColor: "transparent",
        }}
      />

      <motion.div
        ref={barRef}
        className="fixed left-4 top-1/2 z-50 hidden xl:block cursor-pointer overflow-hidden origin-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{
          width: isHovered ? expandedSize.width : COLLAPSED_WIDTH,
          height: isHovered ? expandedSize.height : COLLAPSED_HEIGHT,
          borderRadius: isHovered ? 0 : COLLAPSED_BORDER_RADIUS,
          backgroundColor: isHovered ? "var(--background)" : "color-mix(in srgb, var(--foreground) 40%, transparent)",
          borderWidth: isHovered ? 1 : 0,
          borderColor: isHovered ? "var(--foreground)" : "transparent",
          y: "-50%",
          scale: isHovered ? 1 : proximityScale,
        }}
        transition={springTransition}
        style={{ borderStyle: "solid" }}
      >
      {/* Content wrapper - always rendered for measurement, fades in/out */}
      <motion.div
        ref={contentRef}
        className="pl-2 pr-4 py-2"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
      >
        {/* Container for indicator line and nav - shares same coordinate space */}
        <div ref={containerRef} className="relative flex">
          {/* Vertical line column */}
          <div className="relative w-[13px] shrink-0">
            {/* Vertical line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[var(--foreground)]/20 rounded-full" />
            
            {/* Star indicator with background padding */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
              style={{ width: 13, height: 18 }}
              initial={false}
              animate={{
                top: indicatorOffset - 9, // Center the 18px container
              }}
              transition={{
                type: "tween",
                duration: shouldAnimateStar ? 0.15 : 0, // Instant when menu opens, animated after
                ease: "easeOut",
              }}
            >
              {/* Background to create gap in line */}
              <div className="absolute inset-0 bg-[var(--background)]" />
              
              {/* Star */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="26 4 18 18"
                className="relative w-[10px] h-[10px] fill-[var(--nav-indicator)]"
                initial={false}
                animate={{
                  rotate: spinCount * 720, // 2 full rotations per arrival
                }}
                transition={{
                  rotate: {
                    type: "tween",
                    duration: 1,
                    ease: [0.12, 1, 0.2, 1],
                    delay: 0.25,
                  },
                }}
              >
                <path d="M43.221,12.039c-5.292-1.195-6.035-1.938-7.23-7.229-.104-.456-.508-.779-.976-.779s-.872.323-.976.779c-1.195,5.291-1.938,6.034-7.229,7.229-.456.104-.779.508-.779.976s.323.872.779.976c5.291,1.195,6.034,1.938,7.229,7.23.104.455.508.779.976.779s.872-.324.976-.779c1.195-5.292,1.938-6.035,7.23-7.23.455-.104.779-.508.779-.976s-.324-.872-.779-.976Z" />
              </motion.svg>
            </motion.div>
          </div>

          {/* Sections Container */}
          <nav 
            className="flex flex-col gap-1"
            onMouseLeave={() => setHoveredItemIndex(null)}
          >
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => handleClick(section.id, index)}
                onMouseEnter={() => setHoveredItemIndex(index)}
                className={`px-3 py-1.5 text-left text-base leading-normal whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                  activeSection === section.id || hoveredItemIndex === index
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground)]/60"
                }`}
                initial={false}
                animate={{
                  x: hoveredItemIndex === index ? 4 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 28,
                  mass: 0.8,
                }}
              >
                {section.title}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
