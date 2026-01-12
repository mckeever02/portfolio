"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface WorkCardProps {
  title: string;
  description: string;
  year: string;
  role: string;
  company: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  externalLink?: boolean;
}

export function WorkCard({
  title,
  description,
  year,
  role,
  company,
  bgColor,
  href,
  imageUrl,
  externalLink = false,
}: WorkCardProps) {
  const CardWrapper = externalLink ? "a" : Link;
  const linkProps = externalLink
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <motion.div
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
          className="h-[250px] sm:h-[350px] md:h-[408px] w-full overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {imageUrl && (
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
              {year}
            </span>
            <Separator />
            <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
              {role}
            </span>
            <Separator />
            <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
              {company}
            </span>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
}

function Separator() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5" fill="currentColor" className="text-[var(--foreground-secondary)]" />
    </svg>
  );
}
