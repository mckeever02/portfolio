"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";

interface HoverImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  offset?: { x: number; y: number };
  rotation?: number;
}

interface HoverImageTextProps {
  children: ReactNode;
  images: HoverImage[];
  highlightColor?: "blue" | "purple" | "brown" | "orange" | "neutral";
  className?: string;
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
}: HoverImageTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className={`highlight-expand ${colorClasses[highlightColor]} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "help" }}
      >
        {children}
      </span>
      
      {mounted && createPortal(
        <>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="fixed pointer-events-none z-[9999]"
              style={{
                left: mousePos.x + (image.offset?.x || 0) - 90,
                top: mousePos.y - 20 + (image.offset?.y || 0),
              }}
              initial={{ scale: 0.8, opacity: 0, rotate: 0, y: -image.height - 120 }}
              animate={{ 
                scale: isHovered ? 1 : 0.8, 
                opacity: isHovered ? 1 : 0,
                rotate: image.rotation || 0,
                y: -image.height - 60,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.05,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          ))}
        </>,
        document.body
      )}
    </>
  );
}
