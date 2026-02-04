"use client";

import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./tooltip.css";
import { TeamMember } from "@/data/case-studies";

interface TeamAvatarsProps {
  team: TeamMember[];
}

export function TeamAvatars({ team }: TeamAvatarsProps) {
  const MAX_VISIBLE = 4;
  const visibleTeam = team.slice(0, MAX_VISIBLE);
  const remainingTeam = team.slice(MAX_VISIBLE);
  const hasOverflow = remainingTeam.length > 0;

  // Extract filename from path for alt text
  const getFilename = (path: string) => {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace(/\.[^/.]+$/, ''); // Remove extension
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="flex items-start pl-0 pr-[3px]">
        {visibleTeam.map((member, index) => (
          <Tooltip.Root key={member.name}>
            <Tooltip.Trigger asChild>
              <div
                className="relative w-[28px] h-[28px] rounded-full border-2 border-[var(--background)] bg-[rgba(0,0,0,0.1)] overflow-hidden -mr-[6px] cursor-pointer transition-transform duration-150 hover:scale-125 hover:z-50"
                style={{ zIndex: team.length - index }}
              >
                <Image
                  src={member.avatar}
                  alt={getFilename(member.avatar)}
                  fill
                  className="object-cover"
                />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="TooltipContent"
                sideOffset={5}
              >
                <div className="flex flex-col">
                  <span className="font-bold">{member.name}</span>
                  <span className="opacity-70">{member.role}</span>
                </div>
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
        
        {hasOverflow && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                className="relative w-[28px] h-[28px] rounded-full border-2 border-[var(--background)] bg-[var(--foreground)] overflow-hidden -mr-[6px] cursor-pointer transition-transform duration-150 hover:scale-125 hover:z-50 flex items-center justify-center"
                style={{ zIndex: 0 }}
              >
                <span className="text-[10px] font-bold text-[var(--background)]">
                  +{remainingTeam.length}
                </span>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="TooltipContent"
                sideOffset={5}
              >
                <div className="flex flex-col gap-2">
                  {remainingTeam.map((member) => (
                    <div key={member.name} className="flex items-center gap-2">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={member.avatar}
                          alt={getFilename(member.avatar)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold leading-tight">{member.name}</span>
                        <span className="opacity-70 text-xs leading-tight">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        )}
      </div>
    </Tooltip.Provider>
  );
}
