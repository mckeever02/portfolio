"use client";

import { useState, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { HoverCursor, useHoverCursor, RotateIcon, ArrowIcon } from "./HoverCursor";

interface FlipCarouselItem {
  tag: string;
  tagBg: string;
  content: ReactNode;
  quote: {
    text: ReactNode;
    attribution: string;
  };
}

interface FlipCarouselProps<T extends FlipCarouselItem> {
  items: T[];
}

function CarouselCard<T extends FlipCarouselItem>({ 
  item, 
  onNavigate,
  isHovered,
  onHoverChange,
  onMouseMove,
  isActive,
  isFlipped,
  onFlip,
  contentLineHeight = "leading-relaxed",
}: { 
  item: T;
  onNavigate: () => void;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(e);

    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    onHoverChange(false);
    if (!isFlipped) {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    }
  };

  const handleClick = () => {
    if (isActive) {
      onFlip();
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    } else {
      onNavigate();
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer relative h-full"
      style={{
        perspective: "1000px",
        cursor: isHovered ? "none" : "pointer",
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFlipped 
            ? "rotateY(180deg)" 
            : transform,
        }}
      >
        {/* Front */}
        <div
          className="relative w-full h-full bg-[var(--background)] p-10 md:p-12 border border-[var(--foreground)]/20 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <span 
            className="text-white font-bold tracking-wide py-1 px-2 uppercase -skew-x-8 transform relative inline-block w-fit"
            style={{ backgroundColor: item.tagBg }}
          >
            {item.tag}
          </span>
          <p className="text-[var(--foreground)] text-2xl md:text-3xl lg:text-4xl mt-6 leading-normal">
            {item.content}
          </p>
        </div>
        
        {/* Back - Quote */}
        <div
          className="absolute inset-0 w-full h-full bg-[var(--background)] p-10 md:p-12 border border-[var(--foreground)]/20 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <svg className="w-8 h-8 text-[var(--foreground)]/20 mb-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-[var(--foreground)] text-xl md:text-2xl leading-relaxed flex-1">
            {item.quote.text}
          </p>
          <p className="text-[var(--foreground)]/60 uppercase font-bold tracking-wider text-sm mt-4">
            {item.quote.attribution}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FlipCarousel<T extends FlipCarouselItem>({ 
  items,
}: FlipCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { cursorX, cursorY, handleMouseMove } = useHoverCursor({
    containerRef,
  });

  const toggleSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    setIsHovered(false);
    setHoveredCardIndex(null);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    setFlipCount((prev) => prev + 1);
  };

  // Card width (800px) + gap (48px for gap-12)
  const slideOffset = 848;
  const isHoveringActiveCard = hoveredCardIndex === activeIndex;

  return (
    <div className="w-full mt-0 -my-8">
      <div ref={containerRef} className="relative px-4 md:px-8 py-8 overflow-x-clip overflow-y-visible">
        <motion.div 
          className="grid grid-cols-[800px_800px] gap-12"
          animate={{ x: activeIndex === 0 ? 0 : -slideOffset }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          style={{ 
            paddingLeft: "max(1rem, calc((100vw - 800px) / 2))",
            paddingRight: "max(1rem, calc((100vw - 800px) / 2))",
          }}
        >
          {items.map((item, index) => (
            <CarouselCard 
              key={index}
              item={item}
              onNavigate={toggleSlide}
              isHovered={isHovered && hoveredCardIndex === index}
              onHoverChange={(hovered) => {
                setIsHovered(hovered);
                setHoveredCardIndex(hovered ? index : null);
              }}
              onMouseMove={handleMouseMove}
              isActive={index === activeIndex}
              isFlipped={index === activeIndex ? isFlipped : false}
              onFlip={handleFlip}
            />
          ))}
        </motion.div>

        <HoverCursor cursorX={cursorX} cursorY={cursorY} isVisible={isHovered}>
          {isHoveringActiveCard ? (
            <RotateIcon flipCount={flipCount} />
          ) : (
            <ArrowIcon direction={hoveredCardIndex === 1 ? "right" : "left"} />
          )}
        </HoverCursor>
      </div>
    </div>
  );
}
