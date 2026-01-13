"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "forward" | "back";
}

export function PageTransition({ children, direction = "forward" }: PageTransitionProps) {
  const isForward = direction === "forward";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isForward ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
