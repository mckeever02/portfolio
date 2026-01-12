"use client";

import Image from "next/image";

interface TeamMember {
  name: string;
  avatar: string;
}

interface TeamAvatarsProps {
  team: TeamMember[];
}

export function TeamAvatars({ team }: TeamAvatarsProps) {
  return (
    <div className="flex items-start pl-0 pr-[3px]">
      {team.map((member, index) => (
        <div
          key={member.name}
          className="relative w-[15px] h-[15px] rounded-full border border-white bg-[rgba(0,0,0,0.1)] overflow-hidden -mr-[3px]"
          style={{ zIndex: team.length - index }}
        >
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
