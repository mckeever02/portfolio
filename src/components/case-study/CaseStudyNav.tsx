"use client";

import { motion } from "framer-motion";

interface CaseStudyNavProps {
  sections: { id: string; title: string }[];
  activeSection: string;
}

export function CaseStudyNav({ sections, activeSection }: CaseStudyNavProps) {
  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col gap-8 w-full max-w-[384px]">
      {/* Vertical Track */}
      <div className="absolute left-[-12px] top-0 bottom-0 w-[2px] bg-[rgba(33,32,28,0.1)] rounded-[1px]">
        {/* Active Indicator */}
        <motion.div
          className="absolute left-0 w-[2px] h-[18px] bg-[var(--foreground)] rounded-full"
          initial={false}
          animate={{
            top: activeIndex * (19.2 + 32), // line height + gap
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>

      {/* Nav Items */}
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className={`text-left text-base leading-[1.2] transition-colors duration-200 ${
            activeSection === section.id
              ? "text-[var(--foreground)]"
              : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          {section.title}
        </button>
      ))}
    </div>
  );
}
