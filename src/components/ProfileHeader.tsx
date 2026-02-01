"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <motion.div 
      className="flex items-center origin-bottom"
      initial={{ rotate: 0 }}
      animate={{ rotate: -2 }}
      transition={{
        duration: 0.25,
        delay: 2.6,
        ease: "easeOut",
      }}
    >
      {/* Image - falls from above */}
      <motion.div
        className="w-[48px] h-[48px] relative flex-shrink-0"
        initial={{ y: -300 }}
        animate={{ y: [-300, 0, -12, 0, -4, 0] }}
        transition={{
          duration: 1,
          delay: 1,
          times: [0, 0.4, 0.55, 0.7, 0.85, 1],
          ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut"],
        }}
      >
        <Image
          src="/images/michael-mckeever.jpg"
          alt="Michael McKeever"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#f2ede6] mix-blend-multiply" />
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
