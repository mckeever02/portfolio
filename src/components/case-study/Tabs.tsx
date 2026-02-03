'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  options: TabOption[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ options, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || options[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="flex justify-center">
      <div className="relative inline-flex p-1.5  bg-white backdrop-blur-sm border border-var(--foreground)">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleTabClick(option.id)}
            className={`
              relative z-10 px-5 py-2 rtext-base font-medium transition-colors duration-200
              ${activeTab === option.id
                ? 'text-white'
              : 'text-[var(--foreground)] hover:text-[var(--foreground)]/80'
              }
            `}
          >
            {/* Sliding active indicator */}
            {activeTab === option.id && (
              <motion.div
                layoutId="tabs-indicator"
                className="absolute inset-0 bg-[var(--foreground)] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
