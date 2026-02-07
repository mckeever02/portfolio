"use client";

import { useRef, useCallback } from "react";
import { HoverImageText, type HoverImage } from "./HoverImageText";

interface StatusInfoProps {
  onLinkHover?: (centerY: number | null) => void;
}

interface StatusItem {
  label: string;
  value: string;
  images: HoverImage[];
}

const items: StatusItem[] = [
  {
    label: "Status",
    value: "AI at 1Password",
    images: [
      {
        src: "/images/1password-2.jpg",
        alt: "1Password booth at RSA Conference",
        width: 180,
        height: 107,
        offset: { x: 20, y: -60 },
        rotation: -6,
        className: "shadow-sm border-4 border-white",
      },
      {
        src: "/images/1password-app-icon.png",
        alt: "1Password app icon",
        width: 65,
        height: 65,
        offset: { x: -15, y: -40 },
        rotation: 8,
        className: "rounded-2xl shadow-2xl",
      },
    ],
  },
  {
    label: "Location",
    value: "Belfast, N.Ireland",
    images: [
      {
        src: "/images/belfast-1.jpg",
        alt: "Belfast cityscape",
        width: 160,
        height: 107,
        offset: { x: -90, y: -60 },
        rotation: -8,
        className: "shadow-2xl border-4 border-white",
        cycleSrcs: [
          "/images/belfast-3.jpg",
          "/images/belfast-5.jpg",
          "/images/belfast-7.jpg",
          "/images/belfast-9.jpg",
        ],
        cycleInterval: 1800,
      },
      {
        src: "/images/belfast-2.jpg",
        alt: "Belfast scenery",
        width: 160,
        height: 107,
        offset: { x: 50, y: -50 },
        rotation: 6,
        className: "shadow-2xl border-4 border-white",
        cycleSrcs: [
          "/images/belfast-4.jpg",
          "/images/belfast-6.jpg",
          "/images/belfast-8.jpg",
          "/images/belfast-10.jpg",
        ],
        cycleInterval: 1800,
      },
    ],
  },
];

export function StatusInfo({ onLinkHover }: StatusInfoProps) {
  const refs = [
    useRef<HTMLHeadingElement>(null),
    useRef<HTMLHeadingElement>(null),
  ];

  const emitCenter = useCallback(
    (ref: React.RefObject<HTMLHeadingElement | null>) => {
      if (!onLinkHover || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      onLinkHover(rect.top + rect.height / 2);
    },
    [onLinkHover],
  );

  return (
    <div className="flex flex-row md:flex-col gap-8">
      {items.map((item, i) => (
        <div key={item.label} className="flex flex-col gap-1">
          <h4 className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
            {item.label}
          </h4>
          <h4
            ref={refs[i]}
            className="text-base text-[var(--foreground)] w-fit underline decoration-dotted decoration-1 underline-offset-4 decoration-[var(--foreground)]/30 hover:decoration-[var(--foreground)]/60 transition-colors"
            onMouseEnter={() => emitCenter(refs[i])}
            onMouseLeave={() => onLinkHover?.(null)}
          >
            <HoverImageText noHighlight images={item.images}>
              {item.value}
            </HoverImageText>
          </h4>
        </div>
      ))}
    </div>
  );
}
