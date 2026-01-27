"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { HoverCursor, useHoverCursor, RotateIcon } from "./HoverCursor";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  autoFlipHint?: boolean;
}

export function FlipCard({ 
  front, 
  back, 
  className = "",
  autoFlipHint = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [isHovered, setIsHovered] = useState(false);
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { cursorX, cursorY, handleMouseMove: updateCursor, handleMouseEnter: initCursor } = useHoverCursor({
    containerRef: cardRef,
  });

  // Auto-flip hint to show users cards are interactive
  useEffect(() => {
    if (!autoFlipHint || hasAutoFlipped) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            // Card is mostly visible - trigger auto-flip sequence
            setHasAutoFlipped(true);
            
            // Small delay before flipping
            setTimeout(() => {
              setIsFlipped(true);
              setFlipCount((prev) => prev + 1);
              
              // Flip back after a pause
              setTimeout(() => {
                setIsFlipped(false);
                setFlipCount((prev) => prev + 1);
              }, 1200);
            }, 500);
            
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: "-10% 0px -10% 0px", // Trigger when card is near center
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [autoFlipHint, hasAutoFlipped]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateCursor(e);

    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    initCursor(e);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFlipped) {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    setFlipCount((prev) => prev + 1);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flip-card-container cursor-pointer relative ${className}`}
      style={{
        perspective: "1000px",
        cursor: isHovered ? "none" : "pointer",
      }}
    >
      <div
        className="flip-card-inner relative w-full h-full"
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
          className="flip-card-front absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>
        
        {/* Back */}
        <div
          className="flip-card-back absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </div>

      <HoverCursor cursorX={cursorX} cursorY={cursorY} isVisible={isHovered}>
        <RotateIcon flipCount={flipCount} />
      </HoverCursor>
    </div>
  );
}

// Reusable card face component for consistent styling
interface CardFaceProps {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  children: ReactNode;
  bannerBg?: string;
}

export function CardFace({ 
  icon, 
  iconClassName = "bg-black/5", 
  title, 
  children,
  bannerBg,
}: CardFaceProps) {
  if (bannerBg) {
    return (
      <div className="card-spotlight h-full flex flex-col overflow-hidden">
        {/* Banner with background image */}
        <div 
          className="relative h-28 flex items-center justify-center -mx-6 -mt-6 mb-4 mx-[-24px] mt-[-24px]"
          style={{
            margin: "-24px -24px 16px -24px",
          }}
        >
          <div 
            className="absolute inset-1 overflow-hidden bg-black/20"
            style={{
              backgroundImage: `url('${bannerBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="rounded-lg bg-white/30 backdrop-blur-sm w-15 h-15 relative flex items-center justify-center">
            <div 
              className="relative rounded flex items-center justify-center w-12 h-12 min-w-12 min-h-12 bg-[var(--background)] text-[var(--foreground)]"
            >
              {icon}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">
          {title}
        </h3>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="card-spotlight h-full flex flex-col">
      <div 
        className={`rounded-lg flex items-center justify-center mb-4 shrink-0 text-[var(--foreground)] ${iconClassName}`}
        style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">
        {title}
      </h3>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
