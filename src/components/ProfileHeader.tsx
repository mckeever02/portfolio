"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="w-[48px] h-[48px] overflow-hidden relative origin-bottom"
        initial={{ y: -300, rotate: 0 }}
        animate={{ 
          y: [-300, 0, -12, 0, -4, 0],
          rotate: -5,
        }}
        transition={{
          y: {
            duration: 1,
            delay: 1,
            times: [0, 0.4, 0.55, 0.7, 0.85, 1],
            ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut"],
          },
          rotate: {
            duration: 0.25,
            delay: 2.6,
            ease: "easeOut",
          },
        }}
      >
        <Image
          src="/images/michael-mckeever.jpg"
          alt="Michael McKeever"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f2ede6] mix-blend-multiply" />
      </motion.div>

      {/* Name and Title */}
      <motion.div 
        className="flex flex-col"
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 20,
          mass: 0.5,
          delay: 1.3,
        }}
      >
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          Michael McKeever
        </h1>
        <p className="text-base text-[var(--foreground)]">
          Software Designer
        </p>
      </motion.div>
    </div>
  );
}
