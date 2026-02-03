"use client";

import { useState, useEffect, useRef } from "react";

export function useActiveSection(sections: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sections[0]);
  // Track which sections are currently in the viewport
  const visibleSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Reset visible sections when sections change
    visibleSectionsRef.current = new Set();

    // Use a single observer for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        // Update the set of visible sections
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting) {
            visibleSectionsRef.current.add(sectionId);
          } else {
            visibleSectionsRef.current.delete(sectionId);
          }
        });

        // Find the first visible section in DOM order (topmost on page)
        // This ensures consistent behavior regardless of callback order
        const firstVisible = sections.find((id) =>
          visibleSectionsRef.current.has(id)
        );

        if (firstVisible) {
          setActiveSection(firstVisible);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    // Observe all section elements
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  return activeSection;
}
