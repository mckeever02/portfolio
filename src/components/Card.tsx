"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useMotionValue } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";

interface CardProps {
  title: string;
  description: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  videoUrl?: string;
  externalLink?: boolean;
  comingSoon?: boolean;
  details: ReactNode;
}

export function Card({
  title,
  description,
  bgColor,
  href,
  imageUrl,
  videoUrl,
  externalLink = false,
  comingSoon = false,
  details,
}: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Cursor-following circle state
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const lastClientPos = useRef({ x: 0, y: 0 });

  // Update cursor position relative to card
  const updateCursorPosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorX.set(clientX - rect.left);
      cursorY.set(clientY - rect.top);
    }
  };

  // Update cursor position on scroll while hovered
  useEffect(() => {
    if (!isHovered) return;

    const handleScroll = () => {
      updateCursorPosition(lastClientPos.current.x, lastClientPos.current.y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHovered]);

  // Play/pause video based on visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isInView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  // Cursor tracking handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    updateCursorPosition(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    lastClientPos.current = { x: e.clientX, y: e.clientY };
    updateCursorPosition(e.clientX, e.clientY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      style={{ cursor: isHovered ? "none" : comingSoon ? "default" : "auto" }}
      whileHover={{ 
        rotate: -0.5,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {(() => {
        const cardClassName = "group flex flex-col border border-[var(--border-darker)] overflow-hidden bg-white transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]";
        const cardStyle = { cursor: isHovered ? "none" : comingSoon ? "default" : "pointer" } as const;
        
        const cardContent = (
          <>
            {/* Visual Area */}
            <div
              className="aspect-video w-full overflow-hidden relative"
              style={{ backgroundColor: bgColor }}
            >
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover"
                />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            {/* Info Area */}
            <div className="bg-white border-t border-[var(--border-darker)] flex flex-col gap-6 px-6 pt-6 pb-3">
              {/* Project Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="text-base sm:text-lg text-[var(--foreground)]">
                  {description}
                </p>
              </div>

              {/* Project Details */}
              {details}
            </div>
          </>
        );

        if (comingSoon) {
          return (
            <div className={cardClassName} style={cardStyle}>
              {cardContent}
            </div>
          );
        }
        
        if (externalLink) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
              style={cardStyle}
            >
              {cardContent}
            </a>
          );
        }
        
        return (
          <Link href={href} className={cardClassName} style={cardStyle}>
            {cardContent}
          </Link>
        );
      })()}

      {/* Cursor-following circle */}
      <motion.div
        className={`absolute top-0 left-0 rounded-full bg-[var(--foreground)] flex items-center justify-center pointer-events-none z-10 ${
          comingSoon ? "w-24 h-24" : "w-14 h-14"
        }`}
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
        {comingSoon ? (
          // Coming soon text
          <span className="text-[var(--background)] text-xs font-bold tracking-wide uppercase text-center leading-tight">
            Coming<br />soon
          </span>
        ) : externalLink ? (
          // External link arrow (diagonal)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--background)]"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        ) : (
          // Internal link arrow (right)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--background)]"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        )}
      </motion.div>
    </motion.div>
  );
}

export function CardDetailSeparator() {
  return (
    <svg className="shrink-0" width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5" fill="currentColor" className="text-[var(--foreground-secondary)]" />
    </svg>
  );
}

export function CardDetailText({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
      {children}
    </span>
  );
}
