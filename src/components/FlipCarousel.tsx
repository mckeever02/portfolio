"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { HoverCursor, useHoverCursor, RotateIcon, ArrowIcon } from "./HoverCursor";
import { SkewedTag } from "./SkewedTag";

interface FlipCarouselItem {
  tag: string;
  tagBg: string;
  content: ReactNode;
  quote?: {
    text: ReactNode;
    attribution: string;
  };
  backContent?: ReactNode;
}

interface FlipCarouselProps<T extends FlipCarouselItem> {
  items: T[];
}

// Simple stacked card for mobile - each card manages its own flip state
function StackedCard<T extends FlipCarouselItem>({ 
  item,
  autoFlipHint = false,
}: { 
  item: T;
  autoFlipHint?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-flip hint
  useEffect(() => {
    if (!autoFlipHint || hasAutoFlipped) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            setHasAutoFlipped(true);
            setTimeout(() => {
              setIsFlipped(true);
              setTimeout(() => setIsFlipped(false), 1200);
            }, 500);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.7, rootMargin: "-10% 0px -10% 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [autoFlipHint, hasAutoFlipped]);

  return (
    <div
      ref={cardRef}
      onClick={() => setIsFlipped(!isFlipped)}
      className="cursor-pointer relative h-[320px]"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full bg-[var(--background)] p-6 border border-[var(--foreground)]/20 flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <SkewedTag variant="colored" bgColor={item.tagBg}>
            {item.tag}
          </SkewedTag>
          <p className="text-[var(--foreground)] text-xl mt-4 leading-normal">
            {item.content}
          </p>
        </div>
        
        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-[var(--background)] p-6 border border-[var(--foreground)]/20 flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {item.backContent ? (
            item.backContent
          ) : item.quote ? (
            <>
              <svg className="w-6 h-6 text-[var(--foreground)]/20 mb-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[var(--foreground)] text-lg leading-relaxed flex-1 not-italic">
                {item.quote.text}
              </p>
              <p className="text-[var(--foreground)]/60 uppercase font-bold tracking-wider text-xs mt-3 not-italic">
                {item.quote.attribution}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Desktop carousel card with hover effects
function CarouselCard<T extends FlipCarouselItem>({ 
  item, 
  onNavigate,
  isHovered,
  onHoverChange,
  onMouseMove,
  isActive,
  isFlipped,
  onFlip,
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
      style={{ perspective: "1000px", cursor: isHovered ? "none" : "pointer" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : transform,
        }}
      >
        {/* Front */}
        <div
          className="relative w-full h-full bg-[var(--background)] p-10 lg:p-12 border border-[var(--foreground)]/20 flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <SkewedTag variant="colored" bgColor={item.tagBg}>
            {item.tag}
          </SkewedTag>
          <p className="text-[var(--foreground)] text-2xl lg:text-3xl xl:text-4xl mt-6 leading-normal">
            {item.content}
          </p>
        </div>
        
        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-[var(--background)] p-10 lg:p-12 border border-[var(--foreground)]/20 flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {item.backContent ? (
            item.backContent
          ) : item.quote ? (
            <>
              <svg className="w-8 h-8 text-[var(--foreground)]/20 mb-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[var(--foreground)] text-xl lg:text-2xl leading-relaxed flex-1 not-italic">
                {item.quote.text}
              </p>
              <p className="text-[var(--foreground)]/60 uppercase font-bold tracking-wider text-sm mt-4">
                {item.quote.attribution}
              </p>
            </>
          ) : null}
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
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemCount = items.length;
  const cardWidth = 800;
  const gap = 48;
  const slideOffset = cardWidth + gap;

  // Track screen size - lg breakpoint is 1024px
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  
  const { cursorX, cursorY, handleMouseMove } = useHoverCursor({
    containerRef,
  });

  // Auto-flip hint for desktop carousel
  useEffect(() => {
    if (!isDesktop || hasAutoFlipped) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            setHasAutoFlipped(true);
            setTimeout(() => {
              setIsFlipped(true);
              setFlipCount((prev) => prev + 1);
              setTimeout(() => {
                setIsFlipped(false);
                setFlipCount((prev) => prev + 1);
              }, 1200);
            }, 500);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.7, rootMargin: "-10% 0px -10% 0px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAutoFlipped, isDesktop]);

  const navigateToCard = (index: number) => {
    setActiveIndex(index);
    setIsHovered(false);
    setHoveredCardIndex(null);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    setFlipCount((prev) => prev + 1);
  };

  const isHoveringActiveCard = hoveredCardIndex === activeIndex;

  // Mobile/Tablet: Stacked cards
  if (!isDesktop) {
    return (
      <div className="w-full px-4 md:px-8">
        <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
          {items.map((item, index) => (
            <StackedCard 
              key={index} 
              item={item} 
              autoFlipHint={index === 0}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Carousel
  return (
    <div className="w-full mt-0 -my-8">
      <div ref={containerRef} className="relative px-8 py-8 overflow-x-clip overflow-y-visible">
        <motion.div 
          className={`grid gap-12`}
          style={{ 
            gridTemplateColumns: `repeat(${itemCount}, ${cardWidth}px)`,
            paddingLeft: `max(1rem, calc((100vw - ${cardWidth}px) / 2))`,
            paddingRight: `max(1rem, calc((100vw - ${cardWidth}px) / 2))`,
          }}
          animate={{ x: -activeIndex * slideOffset }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          {items.map((item, index) => (
            <CarouselCard 
              key={index}
              item={item}
              onNavigate={() => navigateToCard(index)}
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
            <ArrowIcon direction={hoveredCardIndex !== null && hoveredCardIndex > activeIndex ? "right" : "left"} />
          )}
        </HoverCursor>
      </div>
    </div>
  );
}
