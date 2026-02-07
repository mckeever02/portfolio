"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface HoverImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  offset?: { x: number; y: number };
  rotation?: number;
  className?: string;
  cycleSrcs?: string[]; // Optional array of sources to cycle through
  cycleInterval?: number; // Interval in ms (default 1500)
  cycleRotations?: number[]; // Optional rotations for each cycle (including initial)
}

interface HoverImageTextProps {
  children: ReactNode;
  images: HoverImage[];
  highlightColor?: "blue" | "purple" | "brown" | "orange" | "neutral";
  className?: string;
  /** When true, skips the highlight-expand underline classes (use when parent handles styling). */
  noHighlight?: boolean;
}

const colorClasses = {
  blue: "highlight-expand-blue",
  purple: "highlight-expand-purple",
  brown: "highlight-expand-brown",
  orange: "highlight-expand-orange",
  neutral: "highlight-expand-neutral",
};

export function HoverImageText({
  children,
  images,
  highlightColor = "neutral",
  className = "",
  noHighlight = false,
}: HoverImageTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [cycleIndices, setCycleIndices] = useState<number[]>(images.map(() => 0));

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Cycle through images while hovered
  useEffect(() => {
    if (!isHovered) {
      // Reset to first image when not hovered
      setCycleIndices(images.map(() => 0));
      return;
    }
    
    const intervals: NodeJS.Timeout[] = [];
    
    images.forEach((image, imageIndex) => {
      if (image.cycleSrcs && image.cycleSrcs.length > 0) {
        const allSrcs = [image.src, ...image.cycleSrcs];
        const interval = setInterval(() => {
          setCycleIndices(prev => {
            const newIndices = [...prev];
            newIndices[imageIndex] = (newIndices[imageIndex] + 1) % allSrcs.length;
            return newIndices;
          });
        }, image.cycleInterval || 1500);
        intervals.push(interval);
      }
    });
    
    return () => intervals.forEach(clearInterval);
  }, [isHovered, images]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
  };

  return (
    <>
      <span
        className={`${noHighlight ? "" : `highlight-expand ${colorClasses[highlightColor]}`} ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "help" }}
      >
        {children}
      </span>
      
      {mounted && createPortal(
        <>
          {images.map((image, index) => {
            // Get rotation based on cycle index if cycleRotations is provided
            const currentRotation = image.cycleRotations && image.cycleRotations.length > 0
              ? image.cycleRotations[cycleIndices[index] % image.cycleRotations.length]
              : (image.rotation || 0);
            
            return (
            <motion.div
              key={index}
              className="fixed pointer-events-none z-[9999]"
              style={{
                left: mousePos.x + (image.offset?.x || 0),
                top: mousePos.y + (image.offset?.y || 0),
              }}
              initial={{ scale: 0.8, opacity: 0, rotate: 0, y: -image.height - 40 }}
              animate={{ 
                scale: isHovered ? 1 : 0.8, 
                opacity: isHovered ? 1 : 0,
                rotate: isHovered ? currentRotation : 0,
                y: -image.height,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.12,
              }}
            >
              {image.cycleSrcs && image.cycleSrcs.length > 0 ? (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={cycleIndices[index]}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <Image
                      src={[image.src, ...image.cycleSrcs][cycleIndices[index]]}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className={image.className || "rounded-lg shadow-2xl"}
                      sizes={`${image.width}px`}
                      quality={85}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className={image.className || "rounded-lg shadow-2xl"}
                  sizes={`${image.width}px`}
                  quality={85}
                />
              )}
            </motion.div>
          );
          })}
        </>,
        document.body
      )}
    </>
  );
}
