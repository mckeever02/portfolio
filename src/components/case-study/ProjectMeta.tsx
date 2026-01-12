"use client";

import { useTextScramble } from "@/hooks/useTextScramble";
import { TeamAvatars } from "./TeamAvatars";

interface TeamMember {
  name: string;
  avatar: string;
}

interface ProjectMetaProps {
  subtitle: string;
  timeline: string;
  role: string;
  team: TeamMember[];
}

export function ProjectMeta({ subtitle, timeline, role, team }: ProjectMetaProps) {
  const { displayText, elementRef } = useTextScramble({
    text: subtitle,
    duration: 1200,
    delay: 300,
    characters: "▄▀■□▪▫",
  });

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.2)] flex flex-col gap-6 p-6">
      {/* Subtitle with scramble animation */}
      <p
        ref={elementRef}
        className="text-[28px] sm:text-[32px] leading-[1.4] tracking-[-0.32px] text-[var(--foreground)]"
      >
        {displayText}
      </p>

      {/* Squiggly Divider */}
      <svg
        className="w-full h-[3px]"
        viewBox="0 0 784 3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 1.5C10 0.5 20 2.5 30 1.5C40 0.5 50 2.5 60 1.5C70 0.5 80 2.5 90 1.5C100 0.5 110 2.5 120 1.5C130 0.5 140 2.5 150 1.5C160 0.5 170 2.5 180 1.5C190 0.5 200 2.5 210 1.5C220 0.5 230 2.5 240 1.5C250 0.5 260 2.5 270 1.5C280 0.5 290 2.5 300 1.5C310 0.5 320 2.5 330 1.5C340 0.5 350 2.5 360 1.5C370 0.5 380 2.5 390 1.5C400 0.5 410 2.5 420 1.5C430 0.5 440 2.5 450 1.5C460 0.5 470 2.5 480 1.5C490 0.5 500 2.5 510 1.5C520 0.5 530 2.5 540 1.5C550 0.5 560 2.5 570 1.5C580 0.5 590 2.5 600 1.5C610 0.5 620 2.5 630 1.5C640 0.5 650 2.5 660 1.5C670 0.5 680 2.5 690 1.5C700 0.5 710 2.5 720 1.5C730 0.5 740 2.5 750 1.5C760 0.5 770 2.5 784 1.5"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Stats Row */}
      <div className="flex gap-8">
        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 overflow-hidden">
          <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
            Timeline
          </span>
          <span className="text-base text-black">{timeline}</span>
        </div>

        {/* Team */}
        <div className="flex-1 flex flex-col gap-[10px] min-w-0">
          <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
            Team
          </span>
          <TeamAvatars team={team} />
        </div>

        {/* Role */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 overflow-hidden">
          <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
            Role
          </span>
          <span className="text-base text-black">{role}</span>
        </div>
      </div>
    </div>
  );
}
