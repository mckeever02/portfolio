"use client";

import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./tooltip.css";
import { TeamMember } from "@/data/case-studies";

interface TeamAvatarsProps {
  team: TeamMember[];
}

export function TeamAvatars({ team }: TeamAvatarsProps) {
  // Extract filename from path for alt text
  const getFilename = (path: string) => {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace(/\.[^/.]+$/, ''); // Remove extension
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="flex items-start pl-0 pr-[3px]">
        {team.map((member, index) => (
          <Tooltip.Root key={member.name}>
            <Tooltip.Trigger asChild>
              <div
                className="relative w-[25px] h-[25px] rounded-full border-2 border-white bg-[rgba(0,0,0,0.1)] overflow-hidden -mr-[6px] cursor-pointer transition-transform duration-150 hover:scale-125 hover:z-50"
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
      </div>
    </Tooltip.Provider>
  );
}
