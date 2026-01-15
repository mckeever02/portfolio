"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

interface CardProps {
  title: string;
  description: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  videoUrl?: string;
  externalLink?: boolean;
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
  details,
}: CardProps) {
  const CardWrapper = externalLink ? "a" : Link;
  const linkProps = externalLink
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Play/pause video based on visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isInView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ 
        rotate: -0.5,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <CardWrapper
        {...linkProps}
        className="group flex flex-col border border-[var(--border-darker)] overflow-hidden bg-white transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        {/* Visual Area */}
        <div
          className="h-[280px] sm:h-[400px] md:h-[480px] w-full overflow-hidden relative"
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
            <p className="text-lg text-[var(--foreground)]">
              {description}
            </p>
          </div>

          {/* Project Details */}
          {details}
        </div>
      </CardWrapper>
    </motion.div>
  );
}

export function CardDetailSeparator() {
  return (
    <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5" fill="currentColor" className="text-[var(--foreground-secondary)]" />
    </svg>
  );
}

export function CardDetailText({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
      {children}
    </span>
  );
}
