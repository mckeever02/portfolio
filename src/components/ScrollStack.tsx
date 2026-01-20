"use client";

import { useRef, useState, useEffect, ReactNode, Children, cloneElement, isValidElement } from "react";

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  /** Position from top where cards stack (in vh) */
  stackTop?: number;
  /** Scale reduction per card in the stack */
  scaleStep?: number;
  /** Minimum scale for deeply stacked cards */
  minScale?: number;
  /** Vertical offset per stacked card (px) */
  offsetStep?: number;
  /** Animation duration (seconds) */
  duration?: number;
}

export function ScrollStack({
  children,
  className = "",
  stackTop = 12,
  scaleStep = 0.03,
  minScale = 0.85,
  offsetStep = 20,
  duration = 0.2,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardScales, setCardScales] = useState<number[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);

  const childArray = Children.toArray(children);
  const totalItems = childArray.length;

  // Measure card positions on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;

    const measureCards = () => {
      if (!containerRef.current) return;
      const children = containerRef.current.children;
      const offsets: number[] = [];
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        // Get the card's top position relative to the document
        offsets.push(child.offsetTop);
      }
      
      cardOffsetsRef.current = offsets;
    };

    measureCards();
    window.addEventListener("resize", measureCards);
    return () => window.removeEventListener("resize", measureCards);
  }, [totalItems]);

  // Update scales on scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScales = () => {
      if (!containerRef.current || cardOffsetsRef.current.length === 0) return;

      const stackPositionPx = (stackTop / 100) * window.innerHeight;
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerScrollTop = -containerRect.top; // How much the container has scrolled past viewport top
      
      const scales: number[] = [];
      const children = containerRef.current.children;

      for (let i = 0; i < totalItems; i++) {
        const cardOffset = cardOffsetsRef.current[i] || 0;
        const cardHeight = (children[i] as HTMLElement)?.offsetHeight || 400;
        
        // Calculate how much to scale down this card
        // A card scales down when the NEXT card scrolls over it
        let scaleReduction = 0;

        // Check each card that comes AFTER this one
        for (let j = i + 1; j < totalItems; j++) {
          const nextCardOffset = cardOffsetsRef.current[j] || 0;
          
          // The next card starts overlapping when it reaches the stack position
          // This happens when: containerScrollTop + stackPositionPx >= nextCardOffset
          // Or: scrollProgress = (containerScrollTop + stackPositionPx - nextCardOffset) / transitionDistance
          
          const scrollNeededForNextCard = nextCardOffset - stackPositionPx;
          const currentScroll = containerScrollTop;
          
          // How much has the next card scrolled into the stack?
          // 0 = not yet at stack position, 1 = fully at stack position
          const transitionDistance = cardHeight * 0.6; // Transition happens over 60% of card height
          const overlap = currentScroll - scrollNeededForNextCard;
          const progress = Math.max(0, Math.min(1, overlap / transitionDistance));
          
          scaleReduction += progress * scaleStep;
        }

        const scale = Math.max(minScale, 1 - scaleReduction);
        scales.push(scale);
      }

      setCardScales(scales);
    };

    updateScales();
    window.addEventListener("scroll", updateScales, { passive: true });
    return () => window.removeEventListener("scroll", updateScales);
  }, [totalItems, stackTop, scaleStep, minScale]);

  const childrenWithProps = childArray.map((child, index) => {
    if (isValidElement(child)) {
      const scale = cardScales[index] ?? 1;
      const cardsAbove = cardScales.slice(index + 1).filter(s => s < 1).length;
      
      return cloneElement(child as React.ReactElement<ScrollStackItemProps>, {
        index,
        totalItems,
        scale,
        cardsAbove,
        stackTop,
        offsetStep,
        duration,
        minScale,
      });
    }
    return child;
  });

  return (
    <div ref={containerRef} className={`scroll-stack ${className}`}>
      {childrenWithProps}
    </div>
  );
}

interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
  totalItems?: number;
  scale?: number;
  cardsAbove?: number;
  stackTop?: number;
  offsetStep?: number;
  duration?: number;
  minScale?: number;
}

export function ScrollStackItem({
  children,
  className = "",
  index = 0,
  totalItems = 1,
  scale = 1,
  cardsAbove = 0,
  stackTop = 12,
  offsetStep = 20,
  duration = 0.2,
  minScale = 0.85,
}: ScrollStackItemProps) {
  // Y offset based on how many cards are stacked above
  // Calculate offset based on how much this card has scaled
  const scaleProgress = (1 - scale) / (1 - minScale); // 0 when full size, 1 when at min scale
  const yOffset = scaleProgress * offsetStep * Math.max(1, cardsAbove);

  // Subtle rotation
  const rotation = scaleProgress * 0.5 * (index % 2 === 0 ? -1 : 1);

  // Z-index: higher index = on top
  const zIndex = index + 1;

  return (
    <div
      className={`scroll-stack-item ${className}`}
      style={{
        position: "sticky",
        top: `${stackTop}vh`,
        zIndex,
        transform: `translateY(-${yOffset}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: "center top",
        transition: `transform ${duration}s cubic-bezier(0.33, 1, 0.68, 1)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
