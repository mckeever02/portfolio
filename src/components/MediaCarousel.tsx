"use client";

import { useState, useRef, useEffect, ReactNode, isValidElement, cloneElement } from "react";
import { motion } from "framer-motion";
import { HoverCursor, useHoverCursor, ArrowIcon } from "./HoverCursor";
import { TiltButton, ArrowLeftIcon, ArrowRightIcon } from "./TiltButton";

interface MediaCarouselProps {
  children: ReactNode[];
  cardWidth?: number;
  gap?: number;
  className?: string;
}

// Export type for slide props that children can use
export interface MediaSlideProps {
  isActive?: boolean;
}

export function MediaCarousel({ 
  children,
  cardWidth: desktopCardWidth = 800,
  gap: desktopGap = 48,
  className = "",
}: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [responsiveWidth, setResponsiveWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track screen size for responsive layout
  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      // On mobile (< md), use viewport width minus padding
      setResponsiveWidth(width < 768 ? width - 32 : null);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  const { cursorX, cursorY, handleMouseMove } = useHoverCursor({
    containerRef,
  });

  // Responsive card width and gap
  const isMobile = responsiveWidth !== null;
  const cardWidth = responsiveWidth ?? desktopCardWidth;
  const gap = isMobile ? 16 : desktopGap;

  const navigateTo = (index: number) => {
    setActiveIndex(index);
    setIsHovered(false);
    setHoveredCardIndex(null);
  };

  const handleSlideClick = (clickedIndex: number) => {
    if (clickedIndex === activeIndex) {
      // Clicked on active slide - go to next
      const nextIndex = (activeIndex + 1) % children.length;
      navigateTo(nextIndex);
    } else {
      // Clicked on inactive slide - navigate to that slide
      navigateTo(clickedIndex);
    }
  };

  const slideOffset = cardWidth + gap;

  // Determine arrow direction based on navigation direction
  const getArrowDirection = () => {
    if (hoveredCardIndex === null) return "right";
    if (hoveredCardIndex === activeIndex) return "right"; // Active slide goes forward
    // Next slide (right) = right arrow
    // Previous slide (left) = left arrow
    return hoveredCardIndex > activeIndex ? "right" : "left";
  };

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < children.length - 1;

  return (
    <div className={`w-full mt-0 -my-8 ${className}`}>
      <div ref={containerRef} className="relative py-8 overflow-x-clip overflow-y-visible">
        <motion.div 
          className="grid"
          style={{ 
            gridTemplateColumns: children.map(() => `${cardWidth}px`).join(" "),
            gap: `${gap}px`,
            paddingLeft: `calc((100vw - ${cardWidth}px) / 2)`,
            paddingRight: `calc((100vw - ${cardWidth}px) / 2)`,
          }}
          animate={{ x: activeIndex === 0 ? 0 : -activeIndex * slideOffset }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          {children.map((child, index) => {
            // Clone element to pass isActive prop if it's a valid React element
            const enhancedChild = isValidElement(child) 
              ? cloneElement(child, { isActive: index === activeIndex } as MediaSlideProps)
              : child;
            
            return (
              <motion.div
                key={index}
                onClick={() => handleSlideClick(index)}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredCardIndex(index);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredCardIndex(null);
                }}
                onMouseMove={handleMouseMove}
                className="cursor-pointer"
                style={{ 
                  cursor: isHovered && !isMobile ? "none" : "pointer",
                }}
                animate={{ 
                  scale: index === activeIndex ? 1 : 0.9
                }}
                transition={{ duration: 0.4 }}
              >
                {enhancedChild}
              </motion.div>
            );
          })}
        </motion.div>

        {!isMobile && (
          <HoverCursor cursorX={cursorX} cursorY={cursorY} isVisible={isHovered}>
            <ArrowIcon direction={getArrowDirection()} />
          </HoverCursor>
        )}
      </div>

      {/* Navigation arrows - only shown on mobile/tablet */}
      <div className="flex md:hidden justify-center items-center gap-6 mt-6">
        <TiltButton
          onClick={() => canGoPrev && navigateTo(activeIndex - 1)}
          disabled={!canGoPrev}
          aria-label="Previous slide"
          iconOnly
        >
          <ArrowLeftIcon />
        </TiltButton>
        
        <TiltButton
          onClick={() => canGoNext && navigateTo(activeIndex + 1)}
          disabled={!canGoNext}
          aria-label="Next slide"
          iconOnly
        >
          <ArrowRightIcon />
        </TiltButton>
      </div>
    </div>
  );
}
