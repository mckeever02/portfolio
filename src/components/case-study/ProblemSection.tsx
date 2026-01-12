"use client";

import Image from "next/image";

interface ProblemSectionProps {
  id: string;
  title: string;
  imageSrc: string;
  stat?: string;
  headline: string;
  body: string;
}

export function ProblemSection({
  id,
  title,
  imageSrc,
  headline,
  body,
}: ProblemSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-8">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
      
      <div className="flex flex-col md:flex-row gap-8 py-6">
        {/* Image with emoji overlays */}
        <div className="relative w-full md:w-[270px] h-[400px] md:h-[511px] shrink-0">
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
