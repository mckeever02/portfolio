"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { RotateCw } from "lucide-react";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard({ 
  front, 
  back, 
  className = "",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const lastClientPos = useRef({ x: 0, y: 0 });

  const updateCursorPosition = (clientX: number, clientY: number) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      cursorX.set(clientX - rect.left);
      cursorY.set(clientY - rect.top);
    }
  };

  useEffect(() => {
    if (!isHovered) return;

    const handleScroll = () => {
      updateCursorPosition(lastClientPos.current.x, lastClientPos.current.y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    updateCursorPosition(e.clientX, e.clientY);

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
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    updateCursorPosition(e.clientX, e.clientY);
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

      {/* Cursor-following circle */}
      <motion.div
        className="cursor-circle absolute top-0 left-0 w-14 h-14 rounded-full bg-[var(--foreground)] flex items-center justify-center pointer-events-none z-10"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <RotateCw size={20} className="text-[var(--background)]" />
      </motion.div>
    </div>
  );
}

// Reusable card face component for consistent styling
interface CardFaceProps {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  children: ReactNode;
}

export function CardFace({ 
  icon, 
  iconClassName = "bg-black/5", 
  title, 
  children,
}: CardFaceProps) {
  return (
    <div className="card-spotlight h-full flex flex-col">
      <div 
        className={`rounded-lg flex items-center justify-center mb-4 shrink-0 ${iconClassName}`}
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
