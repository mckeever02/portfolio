"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";
import { HoverCursor, useHoverCursor, ArrowIcon, ExternalArrowIcon, ComingSoonText } from "./HoverCursor";

interface CardProps {
  title: string;
  description: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  externalLink?: boolean;
  comingSoon?: boolean;
  details: ReactNode;
  hoverLabel?: string;
}

export function Card({
  title,
  description,
  bgColor,
  href,
  imageUrl,
  videoUrl,
  videoPoster,
  externalLink = false,
  comingSoon = false,
  details,
  hoverLabel,
}: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  const { cursorX, cursorY, handleMouseMove, handleMouseEnter: initCursor } = useHoverCursor({
    containerRef,
  });

  // Play/pause video based on visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isInView) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Ignore AbortError when play is interrupted by pause
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    initCursor(e);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
            poster={videoPoster}
            aria-label={`Video preview for ${title}`}
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
      <div className="bg-[var(--card-background)] border-t border-[var(--border-darker)] group-hover:border-black dark:group-hover:border-[var(--foreground)] flex flex-col gap-6 px-6 pt-6 pb-3 transition-colors duration-150">
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

  const cardFaceClassName = "tilt-card-face group flex flex-col border border-[var(--border-darker)] overflow-hidden bg-[var(--card-background)]";
  const cardStyle = { cursor: isHovered ? "none" : comingSoon ? "default" : "pointer" } as const;

  return (
    <div
      ref={containerRef}
      className={`relative ${comingSoon ? "" : "tilt-card cursor-pointer"}`}
      style={{ cursor: isHovered ? "none" : comingSoon ? "default" : "auto" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Solid shadow - appears on hover */}
      {!comingSoon && (
        <div className="tilt-card-shadow absolute inset-0" />
      )}
      
      {/* Main card face */}
      {(() => {
        if (comingSoon) {
          return (
            <div className={cardFaceClassName} style={cardStyle}>
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
              className={cardFaceClassName}
              style={cardStyle}
            >
              {cardContent}
            </a>
          );
        }
        
        return (
          <Link href={href} className={cardFaceClassName} style={cardStyle}>
            {cardContent}
          </Link>
        );
      })()}

      <HoverCursor 
        cursorX={cursorX} 
        cursorY={cursorY} 
        isVisible={isHovered}
        size={comingSoon ? "lg" : "md"}
        label={comingSoon ? undefined : hoverLabel ?? (externalLink ? "View launch" : "View case study")}
      >
        {comingSoon ? (
          <ComingSoonText />
        ) : externalLink ? (
          <ExternalArrowIcon />
        ) : (
          <ArrowIcon />
        )}
      </HoverCursor>
    </div>
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
