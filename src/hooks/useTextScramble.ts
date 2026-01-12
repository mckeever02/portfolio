"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTextScrambleOptions {
  text: string;
  duration?: number;
  delay?: number;
  characters?: string;
}

export function useTextScramble({
  text,
  duration = 1000,
  delay = 0,
  characters = "0123456789",
}: UseTextScrambleOptions) {
  const [displayText, setDisplayText] = useState(text);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const scramble = useCallback(() => {
    const finalText = text;
    const length = finalText.length;
    const scrambleIterations = 10; // How many random chars before settling
    const intervalPerChar = duration / (length * scrambleIterations);
    
    let iteration = 0;
    const maxIterations = length * scrambleIterations;

    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split("")
          .map((char, index) => {
            // Preserve spaces and punctuation to maintain word boundaries and width
            if (char === " " || char === "." || char === "," || char === "'" || char === "-") {
              return char;
            }
            
            // Calculate how many iterations this character needs before resolving
            const charResolveAt = (index + 1) * scrambleIterations;
            
            if (iteration >= charResolveAt) {
              return char; // Resolved
            }
            
            // Still scrambling - return random character
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      iteration++;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(finalText);
      }
    }, intervalPerChar);

    return () => clearInterval(interval);
  }, [text, duration, characters]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      scramble();
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, delay, scramble]);

  return { displayText, elementRef };
}
