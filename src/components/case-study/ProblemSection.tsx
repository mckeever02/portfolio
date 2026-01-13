"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

interface ProblemSectionProps {
  id: string;
  title: string;
  imageSrc?: string;
  phoneFrame?: string;
  phoneContent?: string;
  bubbleOverlay?: string;
  stat?: string;
  headline: string;
  body: string;
}

// Emoji configuration with positions
const emojiConfig = [
  { position: "left-[18%] top-[42%]", size: "text-lg" },
  { position: "right-[24%] top-[39%]", size: "text-xs" },
  { position: "left-[40%] top-[48%]", size: "text-[28px]" },
  { position: "left-[22%] top-[58%]", size: "text-2xl" },
  { position: "right-[22%] top-[62%]", size: "text-[42px]" },
];

export function ProblemSection({
  id,
  title,
  imageSrc,
  phoneFrame,
  phoneContent,
  bubbleOverlay,
  headline,
  body,
}: ProblemSectionProps) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(phoneRef, { once: true, amount: 0.5 });

  // Generate randomized delays for emojis (consistent per render)
  const emojiDelays = useMemo(() => {
    const delays = emojiConfig.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = delays.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [delays[i], delays[j]] = [delays[j], delays[i]];
    }
    return delays.map(order => 1.2 + order * 0.15); // Start after bubble, 150ms apart
  }, []);

  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-8">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
      
      <div className="flex flex-col md:flex-row gap-8 py-6">
        {/* Image with emoji overlays or Phone mockup */}
        <div className="relative w-full md:w-[270px] h-[400px] md:h-[511px] shrink-0 flex items-center justify-center overflow-visible">
          {phoneFrame && phoneContent ? (
            /* iPhone mockup with screen content */
            <div ref={phoneRef} className="relative h-full w-auto aspect-[421/852] overflow-visible">
              {/* Screen content - positioned inside the frame */}
              <div 
                className="absolute overflow-hidden rounded-[40px]"
                style={{
                  top: '2.35%',
                  left: '5.46%',
                  right: '5.46%',
                  bottom: '2.35%',
                }}
              >
                <Image
                  src={phoneContent}
                  alt="iMessage conversation"
                  fill
                  className="object-cover object-top"
                />
              </div>
              {/* iPhone frame overlay */}
              <Image
                src={phoneFrame}
                alt=""
                fill
                className="object-contain relative z-10 pointer-events-none"
              />
              {/* Bubble overlay - fades and slides in from left */}
              {bubbleOverlay && (
                <motion.div 
                  className="absolute left-[8%] top-[18%] w-[70%] z-20"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={bubbleOverlay}
                    alt="Message bubble"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </motion.div>
              )}
              {/* Thinking emoji overlays - pop in randomly */}
              {emojiConfig.map((emoji, index) => (
                <motion.span
                  key={index}
                  className={`absolute z-30 ${emoji.position} ${emoji.size}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: emojiDelays[index],
                    ease: [0.175, 0.885, 0.32, 1.275], // Back ease for pop effect
                  }}
                >
                  🤔
                </motion.span>
              ))}
            </div>
          ) : imageSrc ? (
            <>
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover"
              />
              {/* Thinking emoji overlays */}
              <span className="absolute left-[51px] top-[225px] text-lg">🤔</span>
              <span className="absolute left-[197px] top-[219px] text-xs">🤔</span>
              <span className="absolute left-[138px] top-[262px] text-[28px]">🤔</span>
              <span className="absolute left-[70px] top-[318px] text-2xl">🤔</span>
              <span className="absolute left-[173px] top-[340px] text-[42px]">🤔</span>
            </>
          ) : null}
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col gap-4 justify-center py-8">
          <p className="text-[28px] leading-[1.4] tracking-[-0.28px] text-[var(--foreground)]">
            {headline}
          </p>
          <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)]">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
