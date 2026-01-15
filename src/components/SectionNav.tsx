"use client";

import { motion } from "framer-motion";

interface SectionNavProps {
  activeSection: string;
}

const navItems = [
  { id: "works", label: "Selected Works" },
  { id: "projects", label: "Side Projects" },
  { id: "about", label: "About" },
];

export function SectionNav({ activeSection }: SectionNavProps) {
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative hidden lg:flex flex-col gap-8 w-[384px]">
      {/* Vertical Track */}
      <div className="absolute left-[-12px] top-0 bottom-0 w-[2px] bg-[rgba(33,32,28,0.1)] rounded-[1px]">
        {/* Active Indicator */}
        <motion.div
          className="absolute left-0 w-[2px] h-[18px] bg-[var(--foreground)] rounded-full"
          initial={false}
          animate={{
            top: activeIndex * (18 + 32) + (18 - 18) / 2, // item height + gap
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>

      {/* Nav Items */}
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`text-left text-base transition-colors duration-200 ${
            activeSection === item.id
              ? "text-[var(--foreground)]"
              : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
