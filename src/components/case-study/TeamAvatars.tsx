"use client";

import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./tooltip.css";

interface TeamMember {
  name: string;
  avatar: string;
}

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
                className="relative w-[25px] h-[25px] rounded-full border border-white bg-[rgba(0,0,0,0.1)] overflow-hidden -mr-[5px] cursor-pointer"
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
                {member.name}
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
