"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["👋", "✨", "🎨", "💻", "🚀", "⚡", "🎯", "💡", "🔥", "👀", "🤙", "💜", "🇮🇪", "☕", "🏔️", "🎾", "🎮", "🥾", "🎧", "🤘", "😎", "🙌", "💪", "🧠", "🤖", "🤔", "🇮🇪", "🇵🇸", "🇵🇸", "🇵🇸"];

export function ProfileHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(() => 
    EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  );

  const handleMouseEnter = () => {
    setCurrentEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setIsHovered(true);
  };

  return (
    <motion.div 
      className="flex items-center origin-bottom cursor-pointer"
      initial={{ rotate: 0 }}
      animate={{ rotate: -2 }}
      transition={{
        duration: 0.25,
        delay: 2.6,
        ease: "easeOut",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - falls from above */}
      <motion.div
        className="w-[48px] h-[48px] relative flex-shrink-0"
        initial={{ y: -300, rotate: 0, scale: 1 }}
        animate={{ 
          y: [-300, 0, -12, 0, -4, 0],
          rotate: isHovered ? -6 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{
          y: {
            duration: 1,
            delay: 1,
            times: [0, 0.4, 0.55, 0.7, 0.85, 1],
            ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut"],
          },
          rotate: { duration: 0.15 },
          scale: { duration: 0.15 },
        }}
      >
        <Image
          src="/images/michael-mckeever-pixel-portrait-4.png"
          alt="Michael McKeever"
          width={48}
          height={48}
          className="w-full h-full object-cover rotate-[-1deg]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#f2ede6] mix-blend-multiply" />
        
        {/* Emoji badge */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-[var(--background)] rounded-full flex items-center justify-center border border-[var(--foreground)]/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <span className="text-sm">{currentEmoji}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Name and Title - animates to get pushed by image */}
      <motion.div 
        className="flex flex-col ml-3"
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 15,
          mass: 0.5,
          delay: 1.3,
        }}
      >
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          Michael McKeever
        </h1>
        <h2 className="text-base text-[var(--foreground)]">
          Software Designer
        </h2>
      </motion.div>
    </motion.div>
  );
}
