"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="w-[48px] h-[48px] overflow-hidden relative"
        initial={{ rotate: 0 }}
        animate={{ rotate: -5 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.3,
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
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          Michael McKeever
        </h1>
        <p className="text-base text-[var(--foreground)]">
          Software Designer
        </p>
      </div>
    </div>
  );
}
