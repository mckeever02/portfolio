"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

interface StickyNote {
  src: string;
  alt: string;
}

interface StickyNotesGridProps {
  notes: StickyNote[];
}

// Predefined rotations for each sticky note
const rotations = [3.149, -3.892, -3.95, 3.892];

export function StickyNotesGrid({ notes }: StickyNotesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Generate randomized delays for sticky notes
  const noteDelays = useMemo(() => {
    const delays = notes.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = delays.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [delays[i], delays[j]] = [delays[j], delays[i]];
    }
    return delays.map(order => 0.1 + order * 0.15);
  }, [notes.length]);

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12 md:py-24"
    >
      {notes.map((note, index) => (
        <motion.div
          key={index}
          className="relative aspect-square flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
          animate={isInView ? { 
            opacity: 1, 
            scale: 1, 
            rotate: rotations[index % rotations.length] 
          } : { 
            opacity: 0, 
            scale: 0.7, 
            rotate: -5 
          }}
          transition={{
            duration: 0.4,
            delay: noteDelays[index],
            ease: [0.175, 0.885, 0.32, 1.275], // Back ease for pop effect
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={note.src}
              alt={note.alt}
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
